import { TestBed } from '@angular/core/testing';


import { TourismDataService } from './tourism-data.service';
import { TourismPoint } from '../interfaces/tourism.interface';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing'

describe('DataFilterService', () => {
  let service: TourismDataService;
  let httpMock: HttpTestingController;

  const mockTurismPoint: TourismPoint[] = [
    {
    name: "place 1",
    category: "Restaurant",
    address: "calle 1",
    lat: 43.00000,
    lon: 2.00000
    }
  ];

  const multipleTurismPoints: TourismPoint[] = [
    {
        name: "place 1",
        category: "Restaurant",
        address: "calle 1",
        lat: 43.00000,
        lon: 2.00000
    },
    {
        name: "place 2",
        category: "Restaurant",
        address: "calle 2",
        lat: 43.00000,
        lon: 2.00000
    }
  ]

  beforeEach(() => {
    TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      providers: [TourismDataService]
    });
    service = TestBed.inject(TourismDataService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  })

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch tourism point', (done) => {
    service.getTourismData().subscribe((data) => {
        expect(data).toEqual(mockTurismPoint);
        done();
    });

    const req = httpMock.expectOne('assets/puntos-interes.json');
    expect(req.request.method).toBe('GET');

    req.flush(mockTurismPoint);
  });

  it('should fetch multiple tourismo points', (done) => {
    service.getTourismData().subscribe((data) => {
        expect(data.length).toBe(2);
        expect(data).toEqual(multipleTurismPoints);
        done();
    });

    const req = httpMock.expectOne('assets/puntos-interes.json');
    expect(req.request.method).toBe('GET');

    req.flush(multipleTurismPoints);
  });

  it('should handle HTTP errors', (done) => {
    service.getTourismData().subscribe({
      next: () => {
        fail('Expected an error, but got a successful response.');
      },
      error: (error) => {
        expect(error.status).toBe(500);
        expect(error.statusText).toBe('Server Error');
        done();
      }
    });

    const req = httpMock.expectOne('assets/puntos-interes.json');
    expect(req.request.method).toBe('GET');

    // Simulate a server error
    req.flush('Internal Server Error', { status: 500, statusText: 'Server Error' });
  });

  it('should handle an empty response', (done) => {
    service.getTourismData().subscribe((data) => {
      expect(data.length).toBe(0); 
      done();
    });

    const req = httpMock.expectOne('assets/puntos-interes.json');
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });
});