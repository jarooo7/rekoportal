import { TestBed, async, inject } from '@angular/core/testing';

import { IsNotVerificationGuard } from './is-not-verification.guard';

describe('IsNotVerificationGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [IsNotVerificationGuard]
    });
  });

  it('should ...', inject([IsNotVerificationGuard], (guard: IsNotVerificationGuard) => {
    expect(guard).toBeTruthy();
  }));
});
