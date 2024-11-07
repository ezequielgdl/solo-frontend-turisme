import { TestBed } from '@angular/core/testing';

import { NoiseLayerService } from './noise-layer.service';

describe('NoiseLayerService', () => {
  let service: NoiseLayerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NoiseLayerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
