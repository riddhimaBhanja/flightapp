import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Auth } from '../../services/auth';
import { finalize, timeout, catchError, throwError } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login implements OnInit {
  loginForm!: FormGroup;
  loading = false;
  submitted = false;
  error = '';
  returnUrl = '/flights';

  constructor(
    private formBuilder: FormBuilder,
    private authService: Auth,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    if (this.authService.isAuthenticated()) {
      // Redirect based on role if already authenticated
      this.redirectBasedOnRole();
      return;
    }

    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });

    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '';
  }

  get f() {
    return this.loginForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;
    this.error = '';

    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    console.log('Attempting login with:', this.loginForm.value);

    this.authService.login(this.loginForm.value)
      .pipe(
        timeout(30000), // 30 second timeout
        finalize(() => {
          // Always set loading to false, even if there's an error
          this.loading = false;
        }),
        catchError((error) => {
          console.error('Login error caught in catchError:', error);
          if (error.name === 'TimeoutError') {
            this.error = 'Login request timed out. Please check your connection and try again.';
          }
          return throwError(() => error);
        })
      )
      .subscribe({
        next: (response) => {
          console.log('Login successful:', response);
          console.log("Password expired flag:", response.passwordExpired);
          console.log("Force password change flag:", response.forcePasswordChange);

          // Check if password has expired
          if (response.passwordExpired) {
            console.warn('Password has expired, redirecting to change password');
            localStorage.setItem('expiredPasswordUsername', this.loginForm.value.username);
            this.router.navigate(['/change-password'], {
              queryParams: { forced: 'true', reason: 'expired' }
            });
            return;
          }

          // Normal login flow - redirect based on role
          if (this.returnUrl) {
            this.router.navigate([this.returnUrl]);
          } else {
            this.redirectBasedOnRole();
          }
        },
        error: (error) => {
          console.error('Login error in subscribe:', error);
          this.error = error.error?.message || error.message || 'Invalid username or password';
        }
      });
  }

  private redirectBasedOnRole(): void {
    if (this.authService.isAdmin()) {
      this.router.navigate(['/admin-dashboard']);
    } else {
      this.router.navigate(['/user-dashboard']);
    }
  }
}
