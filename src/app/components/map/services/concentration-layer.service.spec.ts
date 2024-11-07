import { TestBed } from '@angular/core/testing';

import { ConcentrationLayerService } from './concentration-layer.service';

describe('ConcentrationLayerService', () => {
  let service: ConcentrationLayerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConcentrationLayerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
