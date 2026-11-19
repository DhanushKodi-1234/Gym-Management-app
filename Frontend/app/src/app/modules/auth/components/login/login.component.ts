import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ThemeService } from '../../../../services/theme.service';
import { AuthserviceService } from '../../../../services/authservice.service';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements AfterViewInit {
  @ViewChild('loginBgVideo') loginBgVideo!: ElementRef<HTMLVideoElement>;

  loginForm: FormGroup;
  showPassword = false;
  isSubmitting = false;
  errorMessage = '';
  successMessage = '';
  isVideoPlaying = true;

  // Card View Modes: 'login' | 'verify-email' | 'forgot-email' | 'forgot-reset'
  authMode: 'login' | 'verify-email' | 'forgot-email' | 'forgot-reset' = 'login';

  // Unverified Account OTP State
  pendingEmail = '';
  verifyOtpCode = '';
  isVerifyingEmail = false;
  isResendingOtp = false;

  // Forgot Password OTP State
  resetEmail = '';
  resetOtp = '';
  newPassword = '';
  confirmNewPassword = '';
  showNewPassword = false;
  isSendingResetOtp = false;
  isResettingPassword = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    public themeService: ThemeService,
    private authService: AuthserviceService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [true]
    });
  }

  get isDarkMode(): boolean {
    return this.themeService.isDark();
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  ngAfterViewInit(): void {
    const video = this.loginBgVideo?.nativeElement;
    if (video) {
      video.muted = true;
      video.play().then(() => {
        this.isVideoPlaying = true;
      }).catch(() => {
        this.isVideoPlaying = false;
      });
    }
  }

  toggleVideoPlay(): void {
    const video = this.loginBgVideo?.nativeElement;
    if (video) {
      if (video.paused) {
        video.play();
        this.isVideoPlaying = true;
      } else {
        video.pause();
        this.isVideoPlaying = false;
      }
    }
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  switchToLogin(): void {
    this.errorMessage = '';
    this.successMessage = '';
    this.authMode = 'login';
  }

  // ==================== 1. STANDARD LOGIN ====================
  onSubmit(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    const email = this.loginForm.value.email.trim().toLowerCase();
    const password = this.loginForm.value.password;

    this.authService.login({ email, password }).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.router.navigate(['/app/dash']);
      },
      error: (err) => {
        this.isSubmitting = false;

        // If user signed up earlier but hasn't verified OTP yet
        if (err.status === 403 && err.error?.requiresVerification) {
          this.pendingEmail = err.error.email || email;
          this.verifyOtpCode = '';
          this.authMode = 'verify-email';
          this.successMessage = `Verification OTP sent to ${this.pendingEmail}. Please enter it below.`;
          this.authService.resendOtp(this.pendingEmail).subscribe();
          return;
        }

        this.errorMessage = err.error?.message || 'Invalid email or password.';
      }
    });
  }

  // ==================== 2. UNVERIFIED ACCOUNT OTP ====================
  onVerifyAccountOtp(): void {
    const cleanOtp = (this.verifyOtpCode || '').trim();
    if (cleanOtp.length !== 6) {
      this.errorMessage = 'Please enter the 6-digit verification code.';
      return;
    }

    this.errorMessage = '';
    this.successMessage = '';
    this.isVerifyingEmail = true;

    this.authService.verifyEmail(this.pendingEmail, cleanOtp).subscribe({
      next: () => {
        this.isVerifyingEmail = false;
        this.router.navigate(['/app/dash']);
      },
      error: (err) => {
        this.isVerifyingEmail = false;
        this.errorMessage = err.error?.message || 'Invalid or expired OTP code.';
      }
    });
  }

  onResendAccountOtp(): void {
    if (!this.pendingEmail || this.isResendingOtp) return;

    this.errorMessage = '';
    this.successMessage = '';
    this.isResendingOtp = true;

    this.authService.resendOtp(this.pendingEmail).subscribe({
      next: (res) => {
        this.isResendingOtp = false;
        this.successMessage = res.message || `New OTP sent to ${this.pendingEmail}`;
      },
      error: (err) => {
        this.isResendingOtp = false;
        this.errorMessage = err.error?.message || 'Unable to resend OTP.';
      }
    });
  }

  // ==================== 3. FORGOT PASSWORD FLOW ====================
  openForgotPassword(): void {
    this.errorMessage = '';
    this.successMessage = '';
    this.resetEmail = (this.loginForm.get('email')?.value || '').trim();
    this.authMode = 'forgot-email';
  }

  onSendResetOtp(): void {
    const email = (this.resetEmail || '').trim().toLowerCase();
    if (!email) {
      this.errorMessage = 'Please enter your registered email address.';
      return;
    }

    this.errorMessage = '';
    this.successMessage = '';
    this.isSendingResetOtp = true;

    this.authService.forgotPassword({ email }).subscribe({
      next: (res) => {
        this.isSendingResetOtp = false;
        this.resetEmail = email;
        this.resetOtp = '';
        this.newPassword = '';
        this.confirmNewPassword = '';
        this.successMessage = res.message || `Password reset OTP sent to ${email}`;
        this.authMode = 'forgot-reset';
      },
      error: (err) => {
        this.isSendingResetOtp = false;
        this.errorMessage = err.error?.message || 'No account found with that email.';
      }
    });
  }

  onResetPasswordSubmit(): void {
    this.errorMessage = '';
    this.successMessage = '';

    const cleanOtp = (this.resetOtp || '').trim();
    if (cleanOtp.length !== 6) {
      this.errorMessage = 'Please enter the 6-digit OTP code from your email.';
      return;
    }

    if (!this.newPassword || this.newPassword.length < 6) {
      this.errorMessage = 'New password must be at least 6 characters.';
      return;
    }

    if (this.newPassword !== this.confirmNewPassword) {
      this.errorMessage = 'New password and confirm password do not match.';
      return;
    }

    this.isResettingPassword = true;

    this.authService.forgotPassword({
      email: this.resetEmail,
      otp: cleanOtp,
      newPassword: this.newPassword
    }).subscribe({
      next: (res) => {
        this.isResettingPassword = false;
        this.authMode = 'login';
        this.loginForm.patchValue({ email: this.resetEmail, password: '' });
        this.successMessage = res.message || 'Password updated! Please sign in with your new password.';
      },
      error: (err) => {
        this.isResettingPassword = false;
        this.errorMessage = err.error?.message || 'Invalid or expired OTP code.';
      }
    });
  }

  signInWithGoogle(): void {
    this.errorMessage = '';
    this.isSubmitting = true;

    setTimeout(() => {
      this.isSubmitting = false;
      this.router.navigate(['/app/dash']);
    }, 800);
  }
}