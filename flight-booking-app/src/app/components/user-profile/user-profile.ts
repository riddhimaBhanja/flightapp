import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Auth } from '../../services/auth';

interface PasswordStrength {
  score: number;
  label: string;
  color: string;
}

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-profile.html',
  styleUrls: ['./user-profile.scss']
})
export class UserProfileComponent implements OnInit {
  // User info
  user: any = {};

  // Password change form
  currentPassword: string = '';
  newPassword: string = '';
  confirmPassword: string = '';

  // Password validation
  passwordStrength: PasswordStrength = { score: 0, label: '', color: '' };
  passwordErrors: string[] = [];
  passwordsMatch: boolean = true;

  // Form states
  isChangingPassword: boolean = false;
  changePasswordMessage: string = '';
  changePasswordError: string = '';
  showChangePasswordSuccess: boolean = false;

  // Password expiry status
  passwordExpiryStatus: any = null;
  showPasswordExpiryWarning: boolean = false;

  constructor(
    private auth: Auth,
    private router: Router
  ) {}

  ngOnInit() {
    this.user = this.auth.currentUserValue;
    if (!this.user) {
      this.router.navigate(['/login']);
      return;
    }

    this.checkPasswordExpiry();
  }

  checkPasswordExpiry() {
    this.auth.checkPasswordExpiry(this.user.username).subscribe({
      next: (status) => {
        this.passwordExpiryStatus = status;
        if (status.passwordExpired || status.daysUntilExpiry <= 7) {
          this.showPasswordExpiryWarning = true;
        }
      },
      error: (err) => {
        console.error('Error checking password expiry:', err);
      }
    });
  }

  onPasswordInput() {
    this.validatePassword();
    this.checkPasswordsMatch();
  }

  validatePassword() {
    this.passwordErrors = [];
    const password = this.newPassword;

    if (password.length === 0) {
      this.passwordStrength = { score: 0, label: '', color: '' };
      return;
    }

    let score = 0;
    const errors: string[] = [];

    // Length check
    if (password.length < 8) {
      errors.push('At least 8 characters');
    } else {
      score++;
    }

    // Uppercase check
    if (!/[A-Z]/.test(password)) {
      errors.push('One uppercase letter');
    } else {
      score++;
    }

    // Lowercase check
    if (!/[a-z]/.test(password)) {
      errors.push('One lowercase letter');
    } else {
      score++;
    }

    // Number check
    if (!/\d/.test(password)) {
      errors.push('One number');
    } else {
      score++;
    }

    // Special character check
    if (!/[@$!%*?&]/.test(password)) {
      errors.push('One special character (@$!%*?&)');
    } else {
      score++;
    }

    this.passwordErrors = errors;

    // Calculate strength
    if (score === 5) {
      this.passwordStrength = { score: 100, label: 'Strong', color: '#22c55e' };
    } else if (score >= 3) {
      this.passwordStrength = { score: 60, label: 'Medium', color: '#f59e0b' };
    } else {
      this.passwordStrength = { score: 30, label: 'Weak', color: '#ef4444' };
    }
  }

  checkPasswordsMatch() {
    if (this.confirmPassword.length > 0) {
      this.passwordsMatch = this.newPassword === this.confirmPassword;
    } else {
      this.passwordsMatch = true;
    }
  }

  isFormValid(): boolean {
    return (
      this.currentPassword.length > 0 &&
      this.newPassword.length >= 8 &&
      this.confirmPassword.length > 0 &&
      this.passwordErrors.length === 0 &&
      this.passwordsMatch
    );
  }

  onChangePassword() {
    if (!this.isFormValid()) {
      return;
    }

    this.isChangingPassword = true;
    this.changePasswordError = '';
    this.changePasswordMessage = '';

    this.auth.changePassword(
      this.user.username,
      this.currentPassword,
      this.newPassword,
      this.confirmPassword
    ).subscribe({
      next: (response) => {
        if (response.success) {
          this.changePasswordMessage = response.message;
          this.showChangePasswordSuccess = true;
          this.resetPasswordForm();

          // Optionally log out user after password change for security
          setTimeout(() => {
            alert('Password changed successfully! Please log in again with your new password.');
            this.auth.logout();
          }, 2000);
        } else {
          this.changePasswordError = response.message;
        }
        this.isChangingPassword = false;
      },
      error: (err) => {
        this.changePasswordError = err.error?.message || 'Failed to change password. Please try again.';
        this.isChangingPassword = false;
      }
    });
  }

  resetPasswordForm() {
    this.currentPassword = '';
    this.newPassword = '';
    this.confirmPassword = '';
    this.passwordErrors = [];
    this.passwordsMatch = true;
    this.passwordStrength = { score: 0, label: '', color: '' };
  }

  navigateToDashboard() {
    this.router.navigate(['/user-dashboard']);
  }

  logout() {
    this.auth.logout();
  }
}
