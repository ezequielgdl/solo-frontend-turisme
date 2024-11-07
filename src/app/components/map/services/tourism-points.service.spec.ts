import { TestBed } from '@angular/core/testing';

import { TourismPointsService } from './tourism-points.service';

describe('TourismPointsService', () => {
  let service: TourismPointsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TourismPointsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
