import { TestBed } from '@angular/core/testing';

import { NoiseServiceService } from './noise-service.service';

describe('NoiseServiceService', () => {
  let service: NoiseServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NoiseServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
