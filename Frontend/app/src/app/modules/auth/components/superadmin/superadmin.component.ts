import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ThemeService } from '../../../../services/theme.service';

@Component({
  selector: 'app-superadmin',
  standalone: false,
  templateUrl: './superadmin.component.html',
  styleUrl: './superadmin.component.scss'
})
export class SuperadminComponent implements AfterViewInit {
  @ViewChild('adminBgVideo') adminBgVideo!: ElementRef<HTMLVideoElement>;

  mode: 'admin' | 'staff' = 'admin';
  showAdminPassword = false;
  showStaffPassword = false;
  isSubmitting = false;
  isVideoPlaying = true;
  errorMessage = '';
  successMessage = '';
  forgotPasswordSent = false;

  adminLoginForm: FormGroup;
  staffLoginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    public themeService: ThemeService
  ) {
    // Admin Login: Email and Password only
    this.adminLoginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [true]
    });

    // Staff Login: Email and Password only
    this.staffLoginForm = this.fb.group({
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
    const video = this.adminBgVideo?.nativeElement;
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
    const video = this.adminBgVideo?.nativeElement;
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

  switchMode(target: 'admin' | 'staff'): void {
    this.mode = target;
    this.errorMessage = '';
    this.successMessage = '';
    this.forgotPasswordSent = false;
  }

  fillDemoAdmin(): void {
    this.mode = 'admin';
    this.adminLoginForm.patchValue({
      email: 'superadmin@growwgym.in',
      password: 'Master@Admin2026'
    });
    this.errorMessage = '';
    this.successMessage = '';
  }

  fillDemoStaff(): void {
    this.mode = 'staff';
    this.staffLoginForm.patchValue({
      email: 'staff.trainer@growwgym.in',
      password: 'Staff@Groww2026'
    });
    this.errorMessage = '';
    this.successMessage = '';
  }

  onStaffForgotPassword(): void {
    const staffEmail = this.staffLoginForm.get('email')?.value;
    if (staffEmail && !this.staffLoginForm.get('email')?.invalid) {
      this.forgotPasswordSent = true;
      this.errorMessage = '';
      this.successMessage = `Password reset instructions have been dispatched to ${staffEmail}. You can also request a temporary PIN from the Super Admin.`;
    } else {
      this.forgotPasswordSent = true;
      this.errorMessage = '';
      this.successMessage = 'Please enter your registered staff email above, or contact your Super Admin to reset your credentials.';
    }
  }

  onAdminSubmit(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (this.adminLoginForm.invalid) {
      this.adminLoginForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;

    // Simulate Admin verification
    setTimeout(() => {
      this.isSubmitting = false;
      this.successMessage = 'Super Admin Verified. Entering Master Console...';
      setTimeout(() => {
        this.router.navigate(['/app/dash']);
      }, 700);
    }, 850);
  }

  onStaffSubmit(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (this.staffLoginForm.invalid) {
      this.staffLoginForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;

    // Simulate Staff verification
    setTimeout(() => {
      this.isSubmitting = false;
      this.successMessage = 'Staff Credentials Authenticated. Entering Portal...';
      setTimeout(() => {
        this.router.navigate(['/app/dash']);
      }, 700);
    }, 850);
  }

  signInWithGoogleEnterprise(): void {
    this.errorMessage = '';
    this.successMessage = '';
    this.isSubmitting = true;

    setTimeout(() => {
      this.isSubmitting = false;
      this.successMessage = `${this.mode === 'admin' ? 'Super Admin' : 'Staff'} Google Workspace verified. Entering Portal...`;
      setTimeout(() => {
        this.router.navigate(['/app/dash']);
      }, 650);
    }, 800);
  }
}
