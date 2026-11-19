import { Component, EventEmitter, Input, Output, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthserviceService } from '../../../../services/authservice.service';
@Component({
  selector: 'app-verifyotp',
  standalone: false,
  styleUrl: './verifyotp.component.scss',
  template: `
    <div class="w-full max-w-md mx-auto bg-slate-900/90 border border-slate-800 rounded-2xl p-8 shadow-2xl text-slate-100">
      <div class="text-center mb-6">
        <div class="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto mb-3 text-lg font-bold">
          OTP
        </div>
        <h2 class="text-2xl font-bold text-white">Verify Your Email</h2>
        <p class="text-sm text-slate-400 mt-1">
          We sent a 6-digit code to <span class="text-emerald-400 font-medium">{{ email }}</span>
        </p>
      </div>

      @if (errorMessage()) {
        <div class="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm text-center">
          {{ errorMessage() }}
        </div>
      }

      @if (successMessage()) {
        <div class="mb-4 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm text-center">
          {{ successMessage() }}
        </div>
      }

      <form (ngSubmit)="onVerify()" class="space-y-5">
        <div>
          <label class="block text-xs uppercase tracking-wider text-slate-400 mb-2 text-center">
            Enter 6-Digit Verification Code
          </label>
          <input
            type="text"
            maxlength="6"
            inputmode="numeric"
            [(ngModel)]="otp"
            name="otp"
            placeholder="••••••"
            required
            class="w-full text-center text-3xl font-mono tracking-[0.6em] py-3.5 px-4 bg-slate-950 border border-slate-700 rounded-xl text-emerald-400 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <button
          type="submit"
          [disabled]="loading() || otp.length !== 6"
          class="w-full py-3 rounded-xl font-semibold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ loading() ? 'Verifying...' : 'Verify & Continue' }}
        </button>
      </form>

      <div class="mt-6 flex items-center justify-between text-xs text-slate-400">
        <button
          type="button"
          (click)="back.emit()"
          class="hover:text-slate-200 transition"
        >
          ← Change email
        </button>

        <button
          type="button"
          [disabled]="resending()"
          (click)="onResend()"
          class="text-emerald-400 hover:text-emerald-300 font-medium disabled:opacity-50"
        >
          {{ resending() ? 'Sending...' : 'Resend Code' }}
        </button>
      </div>
    </div>
  `

})
export class VerifyOtpComponent {
  @Input({ required: true }) email = '';
  @Output() back = new EventEmitter<void>();

  private authService = inject(AuthserviceService);
  private router = inject(Router);

  otp = '';
  loading = signal(false);
  resending = signal(false);
  errorMessage = signal('');
  successMessage = signal('');

  onVerify(): void {
    if (this.otp.trim().length !== 6) return;
    this.loading.set(true);
    this.errorMessage.set('');

    this.authService.verifyEmail(this.email, this.otp.trim()).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigate(['/app']);
      },
      error: (err) => {
        this.loading.set(false);
        this.errorMessage.set(err.error?.message || 'Invalid or expired OTP code.');
      }
    });
  }

  onResend(): void {
    this.resending.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    this.authService.resendOtp(this.email).subscribe({
      next: (res) => {
        this.resending.set(false);
        this.successMessage.set(res.message || 'A new 6-digit code has been sent.');
      },
      error: (err) => {
        this.resending.set(false);
        this.errorMessage.set(err.error?.message || 'Could not resend OTP.');
      }
    });
  }
}
