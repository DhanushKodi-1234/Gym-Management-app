import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ThemeService } from '../../../../services/theme.service';
import { AuthserviceService } from '../../../../services/authservice.service';

@Component({
  selector: 'app-signup',
  standalone: false,
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss',
})
export class SignupComponent implements AfterViewInit {
  @ViewChild('signupBgVideo') signupBgVideo!: ElementRef<HTMLVideoElement>;

  signupForm: FormGroup;
  currentStep = 1;
  isVideoPlaying = true;
  showPassword = false;
  showConfirmPassword = false;
  isSubmitting = false;
  errorMessage = '';

  // Email OTP Verification State
  showOtpStep = false;
  pendingEmail = '';
  otpCode = '';
  isVerifyingOtp = false;
  isResendingOtp = false;
  otpSuccessMessage = '';

  goals = [
    {
      id: 'lose-fat',
      title: 'Lose Fat',
      icon: '🔥',
      desc: 'Burn calories & lean down',
    },
    {
      id: 'gain-stamina',
      title: 'Gain Stamina',
      icon: '⚡',
      desc: 'Boost cardio & endurance',
    },
    {
      id: 'gain-weight',
      title: 'Gain Weight',
      icon: '💪',
      desc: 'Build muscle & strength',
    },
  ];

  experienceLevels = ['Beginner', 'Intermediate', 'Advanced'];
  genders = ['Male', 'Female', 'Non-binary', 'Prefer not to say'];

  // Date of Birth calendar config & picker trigger
  maxDobDate: string = new Date().toISOString().split('T')[0];
  minDobDate: string = '1920-01-01';

  openDatePicker(inputElement: HTMLInputElement): void {
    if (inputElement) {
      if (typeof inputElement.showPicker === 'function') {
        try {
          inputElement.showPicker();
        } catch {
          // Handled if already open or not permitted
        }
      } else {
        inputElement.focus();
      }
    }
  }

  constructor(
    private fb: FormBuilder,
    private router: Router,
    public themeService: ThemeService,
    private authService: AuthserviceService,
  ) {
    this.signupForm = this.fb.group(
      {
        // Step 1: Credentials
        firstName: ['', [Validators.required, Validators.minLength(2)]],
        lastName: ['', [Validators.required, Validators.minLength(1)]],
        email: ['', [Validators.required, Validators.email]],
        phone: [
          '',
          [Validators.required, Validators.pattern(/^[0-9+\-\s]{8,15}$/)],
        ],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required]],

        // Step 2: Goal & Experience
        goal: ['lose-fat', [Validators.required]],
        experience: ['Beginner', [Validators.required]],

        // Step 3: Body Metrics
        dob: ['', [Validators.required]],
        gender: [''],
        height: [
          '',
          [Validators.required, Validators.min(100), Validators.max(250)],
        ],
        currentWeight: [
          '',
          [Validators.required, Validators.min(30), Validators.max(300)],
        ],
        targetWeight: [
          '',
          [Validators.required, Validators.min(30), Validators.max(300)],
        ],
        agreeTerms: [true, [Validators.requiredTrue]],
      },
      { validators: this.passwordMatchValidator },
    );
  }

  ngAfterViewInit(): void {
    const video = this.signupBgVideo?.nativeElement;
    if (video) {
      video.muted = true;
      video.play().catch(() => {
        this.isVideoPlaying = false;
      });
    }
  }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;
    if (password && confirmPassword && password !== confirmPassword) {
      return { passwordMismatch: true };
    }
    return null;
  }

  get estimatedBmi(): string | null {
    const h = Number(this.signupForm.get('height')?.value);
    const w = Number(this.signupForm.get('currentWeight')?.value);
    if (h >= 100 && w >= 30) {
      const meters = h / 100;
      const bmi = w / (meters * meters);
      return bmi.toFixed(1);
    }
    return null;
  }

  get isDarkMode(): boolean {
    return this.themeService.isDark();
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  goToStep(step: number): void {
    if (step < 1 || step > 3) return;
    this.errorMessage = '';
    this.currentStep = step;
  }

  toggleVideoPlay(): void {
    const video = this.signupBgVideo?.nativeElement;
    if (!video) return;

    if (video.paused) {
      video.play();
      this.isVideoPlaying = true;
    } else {
      video.pause();
      this.isVideoPlaying = false;
    }
  }

  selectGoal(goalId: string): void {
    this.signupForm.patchValue({ goal: goalId });
  }

  selectExperience(level: string): void {
    this.signupForm.patchValue({ experience: level });
  }

  nextStep(): void {
    this.errorMessage = '';

    if (this.currentStep === 1) {
      const step1Controls = [
        'firstName',
        'lastName',
        'email',
        'phone',
        'password',
        'confirmPassword',
      ];
      step1Controls.forEach((field) =>
        this.signupForm.get(field)?.markAsTouched(),
      );

      const step1Invalid =
        step1Controls.some((field) => this.signupForm.get(field)?.invalid) ||
        this.signupForm.hasError('passwordMismatch');

      if (step1Invalid) return;
      this.currentStep = 2;
    } else if (this.currentStep === 2) {
      this.signupForm.get('goal')?.markAsTouched();
      this.signupForm.get('experience')?.markAsTouched();
      if (
        this.signupForm.get('goal')?.invalid ||
        this.signupForm.get('experience')?.invalid
      )
        return;
      this.currentStep = 3;
    }
  }

  prevStep(): void {
    this.errorMessage = '';
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  onSubmit(): void {
    this.errorMessage = '';

    if (this.signupForm.invalid) {
      this.signupForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;

    const { confirmPassword, agreeTerms, ...rest } = this.signupForm.value;
    const payload = {
      ...rest,
      firstName: rest.firstName.trim(),
      lastName: rest.lastName.trim(),
      email: rest.email.trim().toLowerCase(),
      height: Number(rest.height),
      currentWeight: Number(rest.currentWeight),
      targetWeight: Number(rest.targetWeight),
    };

    this.authService.signup(payload).subscribe({
      next: (res) => {
        this.isSubmitting = false;
        if (res.requiresVerification) {
          this.pendingEmail = res.email || payload.email;
          this.otpCode = '';
          this.otpSuccessMessage =
            res.message || `6-digit verification code sent to ${this.pendingEmail}`;
          this.showOtpStep = true;
        } else {
          this.router.navigate(['/app/dash']);
        }
      },
      error: (err) => {
        this.isSubmitting = false;
        this.errorMessage =
          err.error?.message || 'Registration failed. Please try again.';
      },
    });
  }

  onVerifyOtp(): void {
    const cleanOtp = (this.otpCode || '').trim();
    if (cleanOtp.length !== 6) {
      this.errorMessage = 'Please enter the 6-digit verification code.';
      return;
    }

    this.errorMessage = '';
    this.otpSuccessMessage = '';
    this.isVerifyingOtp = true;

    this.authService.verifyEmail(this.pendingEmail, cleanOtp).subscribe({
      next: () => {
        this.isVerifyingOtp = false;
        this.router.navigate(['/app/dash']);
      },
      error: (err) => {
        this.isVerifyingOtp = false;
        this.errorMessage =
          err.error?.message || 'Invalid or expired OTP code. Please try again.';
      },
    });
  }

  onResendOtp(): void {
    if (!this.pendingEmail || this.isResendingOtp) return;

    this.errorMessage = '';
    this.otpSuccessMessage = '';
    this.isResendingOtp = true;

    this.authService.resendOtp(this.pendingEmail).subscribe({
      next: (res) => {
        this.isResendingOtp = false;
        this.otpSuccessMessage =
          res.message || `A new verification code was sent to ${this.pendingEmail}`;
      },
      error: (err) => {
        this.isResendingOtp = false;
        this.errorMessage =
          err.error?.message || 'Unable to resend OTP right now.';
      },
    });
  }

  backToSignupForm(): void {
    this.errorMessage = '';
    this.otpSuccessMessage = '';
    this.showOtpStep = false;
  }

  signUpWithGoogle(): void {
    this.errorMessage = '';
    this.isSubmitting = true;

    setTimeout(() => {
      this.isSubmitting = false;
      this.router.navigate(['/app/dash']);
    }, 800);
  }
}