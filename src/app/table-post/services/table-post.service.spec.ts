import { TestBed } from '@angular/core/testing';

import { TablePostService } from './table-post.service';

describe('TablePostService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TablePostService = TestBed.get(TablePostService);
    expect(service).toBeTruthy();
  });
});
