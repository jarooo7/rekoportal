import { TestBed, async, inject } from '@angular/core/testing';
import { IsVerificationGuard } from './is-verification.guard';



describe('IsVerificationGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [IsVerificationGuard]
    });
  });

  it('should ...', inject([IsVerificationGuard], (guard: IsVerificationGuard) => {
    expect(guard).toBeTruthy();
  }));
});
