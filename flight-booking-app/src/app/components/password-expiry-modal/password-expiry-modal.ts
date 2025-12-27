import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-password-expiry-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="modal-overlay">
      <div class="modal-container">
        <div class="modal-header">
          <h2>🔒 Password Change Required</h2>
          <p class="modal-subtitle">
            {{ expiryMessage }}
          </p>
        </div>

        <div class="modal-body">
          <div class="alert alert-warning">
            <strong>⚠️ Important:</strong> You must change your password to continue using the application.
          </div>

          <form (ngSubmit)="onSubmit()">
            <div class="form-group">
              <label for="currentPassword">Current Password</label>
              <input
                type="password"
                id="currentPassword"
                name="currentPassword"
                [(ngModel)]="currentPassword"
                placeholder="Enter your current password"
                required
                autocomplete="current-password"
              />
            </div>

            <div class="form-group">
              <label for="newPassword">New Password</label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                [(ngModel)]="newPassword"
                (input)="onPasswordInput()"
                placeholder="Enter your new password"
                required
                autocomplete="new-password"
              />
              <div class="password-strength" *ngIf="newPassword.length > 0">
                <div class="strength-bar">
                  <div
                    class="strength-fill"
                    [style.width.%]="passwordStrength"
                    [class.weak]="passwordStrength < 40"
                    [class.medium]="passwordStrength >= 40 && passwordStrength < 80"
                    [class.strong]="passwordStrength >= 80"
                  ></div>
                </div>
              </div>
              <ul class="password-requirements" *ngIf="newPassword.length > 0">
                <li [class.valid]="hasMinLength">✓ At least 8 characters</li>
                <li [class.valid]="hasUpperCase">✓ One uppercase letter</li>
                <li [class.valid]="hasLowerCase">✓ One lowercase letter</li>
                <li [class.valid]="hasNumber">✓ One number</li>
                <li [class.valid]="hasSpecialChar">✓ One special character (@$!%*?&)</li>
              </ul>
            </div>

            <div class="form-group">
              <label for="confirmPassword">Confirm New Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                [(ngModel)]="confirmPassword"
                (input)="checkPasswordsMatch()"
                placeholder="Re-enter your new password"
                required
                autocomplete="new-password"
              />
              <div class="error-message" *ngIf="!passwordsMatch && confirmPassword.length > 0">
                Passwords do not match
              </div>
            </div>

            <div class="error-message" *ngIf="errorMessage">
              {{ errorMessage }}
            </div>

            <div class="modal-actions">
              <button
                type="submit"
                class="btn-primary"
                [disabled]="!isFormValid() || isSubmitting"
              >
                {{ isSubmitting ? 'Changing Password...' : 'Change Password' }}
              </button>
              <button
                type="button"
                class="btn-secondary"
                (click)="logout()"
                [disabled]="isSubmitting"
              >
                Logout
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.7);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
    }

    .modal-container {
      background: white;
      border-radius: 12px;
      max-width: 500px;
      width: 90%;
      max-height: 90vh;
      overflow-y: auto;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    }

    .modal-header {
      padding: 2rem;
      border-bottom: 2px solid #e5e7eb;
      text-align: center;

      h2 {
        margin: 0 0 0.5rem 0;
        color: #111827;
        font-size: 1.5rem;
      }

      .modal-subtitle {
        margin: 0;
        color: #6b7280;
        font-size: 0.95rem;
      }
    }

    .modal-body {
      padding: 2rem;
    }

    .alert {
      padding: 1rem;
      background: #fef3c7;
      border-left: 4px solid #f59e0b;
      border-radius: 8px;
      margin-bottom: 1.5rem;
      color: #92400e;
      font-size: 0.9rem;
    }

    .form-group {
      margin-bottom: 1.5rem;

      label {
        display: block;
        font-weight: 600;
        color: #374151;
        margin-bottom: 0.5rem;
        font-size: 0.95rem;
      }

      input {
        width: 100%;
        padding: 0.75rem;
        border: 2px solid #e5e7eb;
        border-radius: 8px;
        font-size: 1rem;

        &:focus {
          outline: none;
          border-color: #667eea;
        }
      }
    }

    .password-strength {
      margin-top: 0.5rem;

      .strength-bar {
        height: 6px;
        background: #e5e7eb;
        border-radius: 3px;
        overflow: hidden;

        .strength-fill {
          height: 100%;
          transition: width 0.3s, background-color 0.3s;

          &.weak { background: #ef4444; }
          &.medium { background: #f59e0b; }
          &.strong { background: #22c55e; }
        }
      }
    }

    .password-requirements {
      list-style: none;
      padding: 0.5rem 0 0 0;
      margin: 0;
      font-size: 0.85rem;
      color: #6b7280;

      li {
        margin-bottom: 0.25rem;

        &.valid {
          color: #22c55e;
        }
      }
    }

    .error-message {
      color: #ef4444;
      font-size: 0.85rem;
      margin-top: 0.5rem;
    }

    .modal-actions {
      display: flex;
      gap: 1rem;
      margin-top: 1.5rem;

      button {
        flex: 1;
        padding: 0.75rem;
        border: none;
        border-radius: 8px;
        font-size: 1rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s;

        &:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      }

      .btn-primary {
        background: #667eea;
        color: white;

        &:hover:not(:disabled) {
          background: #5568d3;
        }
      }

      .btn-secondary {
        background: #e5e7eb;
        color: #374151;

        &:hover:not(:disabled) {
          background: #d1d5db;
        }
      }
    }
  `]
})
export class PasswordExpiryModalComponent implements OnInit {
  currentPassword: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  passwordsMatch: boolean = true;
  errorMessage: string = '';
  isSubmitting: boolean = false;
  expiryMessage: string = '';

  // Password validation
  hasMinLength: boolean = false;
  hasUpperCase: boolean = false;
  hasLowerCase: boolean = false;
  hasNumber: boolean = false;
  hasSpecialChar: boolean = false;
  passwordStrength: number = 0;

  constructor(
    private auth: Auth,
    private router: Router
  ) {}

  ngOnInit() {
    const user = this.auth.currentUserValue;
    if (user) {
      this.auth.checkPasswordExpiry(user.username).subscribe({
        next: (status) => {
          this.expiryMessage = status.message;
        }
      });
    }
  }

  onPasswordInput() {
    const password = this.newPassword;

    this.hasMinLength = password.length >= 8;
    this.hasUpperCase = /[A-Z]/.test(password);
    this.hasLowerCase = /[a-z]/.test(password);
    this.hasNumber = /\d/.test(password);
    this.hasSpecialChar = /[@$!%*?&]/.test(password);

    let score = 0;
    if (this.hasMinLength) score += 20;
    if (this.hasUpperCase) score += 20;
    if (this.hasLowerCase) score += 20;
    if (this.hasNumber) score += 20;
    if (this.hasSpecialChar) score += 20;

    this.passwordStrength = score;
  }

  checkPasswordsMatch() {
    this.passwordsMatch = this.newPassword === this.confirmPassword || this.confirmPassword.length === 0;
  }

  isFormValid(): boolean {
    return (
      this.currentPassword.length > 0 &&
      this.hasMinLength &&
      this.hasUpperCase &&
      this.hasLowerCase &&
      this.hasNumber &&
      this.hasSpecialChar &&
      this.passwordsMatch
    );
  }

  onSubmit() {
    if (!this.isFormValid()) {
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    const user = this.auth.currentUserValue;
    if (!user) {
      this.errorMessage = 'User not found';
      this.isSubmitting = false;
      return;
    }

    this.auth.changePassword(
      user.username,
      this.currentPassword,
      this.newPassword,
      this.confirmPassword
    ).subscribe({
      next: (response) => {
        if (response.success) {
          alert('Password changed successfully! Please log in again.');
          this.auth.logout();
        } else {
          this.errorMessage = response.message;
        }
        this.isSubmitting = false;
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Failed to change password. Please try again.';
        this.isSubmitting = false;
      }
    });
  }

  logout() {
    this.auth.logout();
  }
}
