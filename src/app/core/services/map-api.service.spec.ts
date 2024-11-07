import { TestBed } from '@angular/core/testing';

import { MapApiService } from './map-api.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing'
import { HttpClient } from '@angular/common/http';
import { ConcentrationData } from '../interfaces/tourism.interface'

describe('MapApiService', () => {
  let service: MapApiService;
  let httpMock: HttpTestingController;

  const mockConcentrationData: ConcentrationData[] = [{
    id: "1",
    date: "2019-04-01",
    lat: "41.44546843017112",
    lon: "2.177010916774266",
  }];

  const multipleConcentrationData: ConcentrationData[] = [{
    id: "1",
    date: "2019-04-01",
    lat: "41.44546843017112",
    lon: "2.177010916774266",
  },
  {
    id: "1",
    date: "2019-04-01",
    lat: "41.44546843017112",
    lon: "2.177010916774266"
  }
]

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [MapApiService]
    });
    service = TestBed.inject(MapApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch concentration data', (done) => {
    service.loadConcentrationData().subscribe((data) => {
      
      expect(data).toEqual(mockConcentrationData);
      done();
    });
      
    const req = httpMock.expectOne('/assets/csvjson.json');
    expect(req.request.method).toBe('GET');

    req.flush(mockConcentrationData);  
  });

  it('should fecth multiple concentration data', (done) => {
    service.loadConcentrationData().subscribe((data) => {
      expect(data.length).toBe(2);
      expect(data).toEqual(multipleConcentrationData);
      done();
    });

    const req = httpMock.expectOne('/assets/csvjson.json');
    expect(req.request.method).toBe('GET');

    req.flush(multipleConcentrationData);  
  })

  it('should handle HTTP errors', (done) => {
    service.loadConcentrationData().subscribe({
      next: () => {
        fail('Expected an error, but got a successful response.');
      },
      error: (error) => {
        expect(error.status).toBe(500);
        expect(error.statusText).toBe('Server Error');
        done();
      }
    });

    const req = httpMock.expectOne('/assets/csvjson.json');
    expect(req.request.method).toBe('GET');

    // Simulate a server error
    req.flush('Internal Server Error', { status: 500, statusText: 'Server Error' });
  });

  it('should handle an empty response', (done) => {
    service.loadConcentrationData().subscribe((data) => {
      expect(data.length).toBe(0); 
      done();
    });

    const req = httpMock.expectOne('/assets/csvjson.json');
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });
});
