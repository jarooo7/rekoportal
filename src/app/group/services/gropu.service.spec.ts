import { TestBed } from '@angular/core/testing';

import { GropuService } from './gropu.service';

describe('GropuService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GropuService = TestBed.get(GropuService);
    expect(service).toBeTruthy();
  });
});
