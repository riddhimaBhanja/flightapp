import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';
import { Login } from './login';
import { Auth } from '../../services/auth';

describe('Login Component', () => {
  let component: Login;
  let fixture: ComponentFixture<Login>;
  let mockAuthService: any;
  let mockRouter: any;
  let mockActivatedRoute: any;

  beforeEach(async () => {
    mockAuthService = {
      isAuthenticated: vi.fn().mockReturnValue(false),
      login: vi.fn()
    };

    mockRouter = {
      navigate: vi.fn()
    };

    mockActivatedRoute = {
      snapshot: {
        queryParams: {}
      }
    };

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [Login],
      providers: [
        { provide: Auth, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Login);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize login form with empty values', () => {
    component.ngOnInit();

    expect(component.loginForm).toBeDefined();
    expect(component.loginForm.get('username')?.value).toBe('');
    expect(component.loginForm.get('password')?.value).toBe('');
  });

  it('should redirect to flights if already authenticated', () => {
    mockAuthService.isAuthenticated.mockReturnValue(true);

    component.ngOnInit();

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/flights']);
  });

  it('should set returnUrl from query params', () => {
    mockActivatedRoute.snapshot.queryParams = { returnUrl: '/dashboard' };

    component.ngOnInit();

    expect(component.returnUrl).toBe('/dashboard');
  });

  it('should have invalid form when fields are empty', () => {
    component.ngOnInit();

    expect(component.loginForm.valid).toBe(false);
  });

  it('should have valid form when all fields are filled', () => {
    component.ngOnInit();

    component.loginForm.setValue({
      username: 'testuser',
      password: 'password123'
    });

    expect(component.loginForm.valid).toBe(true);
  });

  it('should mark username as required', () => {
    component.ngOnInit();

    const usernameControl = component.loginForm.get('username');
    expect(usernameControl?.hasError('required')).toBe(true);

    usernameControl?.setValue('user');
    expect(usernameControl?.hasError('required')).toBe(false);
  });

  it('should mark password as required', () => {
    component.ngOnInit();

    const passwordControl = component.loginForm.get('password');
    expect(passwordControl?.hasError('required')).toBe(true);

    passwordControl?.setValue('pass');
    expect(passwordControl?.hasError('required')).toBe(false);
  });

  it('should not submit if form is invalid', () => {
    component.ngOnInit();
    component.onSubmit();

    expect(component.submitted).toBe(true);
    expect(mockAuthService.login).not.toHaveBeenCalled();
  });

  it('should call auth service on valid form submit', () => {
    component.ngOnInit();
    mockAuthService.login.mockReturnValue(of({ token: 'token' }));

    component.loginForm.setValue({
      username: 'testuser',
      password: 'password123'
    });

    component.onSubmit();

    expect(mockAuthService.login).toHaveBeenCalledWith({
      username: 'testuser',
      password: 'password123'
    });
  });

  it('should navigate to flights on successful login', () => {
    component.ngOnInit();
    mockAuthService.login.mockReturnValue(of({ token: 'token', username: 'test' }));

    component.loginForm.setValue({
      username: 'testuser',
      password: 'password123'
    });

    component.onSubmit();

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/flights']);
  });

  it('should navigate to returnUrl on successful login if provided', () => {
    mockActivatedRoute.snapshot.queryParams = { returnUrl: '/dashboard' };
    component.ngOnInit();
    mockAuthService.login.mockReturnValue(of({ token: 'token' }));

    component.loginForm.setValue({
      username: 'testuser',
      password: 'password123'
    });

    component.onSubmit();

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/dashboard']);
  });

  it('should show error message on login failure', () => {
    component.ngOnInit();
    const error = { error: { message: 'Invalid credentials' } };
    mockAuthService.login.mockReturnValue(throwError(() => error));

    component.loginForm.setValue({
      username: 'testuser',
      password: 'wrongpassword'
    });

    component.onSubmit();

    expect(component.error).toBe('Invalid credentials');
    expect(component.loading).toBe(false);
  });

  it('should show default error message when no error message provided', () => {
    component.ngOnInit();
    mockAuthService.login.mockReturnValue(throwError(() => ({})));

    component.loginForm.setValue({
      username: 'testuser',
      password: 'wrongpassword'
    });

    component.onSubmit();

    expect(component.error).toBe('Invalid username or password');
    expect(component.loading).toBe(false);
  });

  it('should set loading to true during login', () => {
    component.ngOnInit();
    mockAuthService.login.mockReturnValue(of({ token: 'token' }));

    component.loginForm.setValue({
      username: 'testuser',
      password: 'password123'
    });

    component.loading = false;
    component.onSubmit();

    // Loading is set to true before async call
    expect(component.loading).toBe(true);
  });

  it('should clear error on form submit', () => {
    component.ngOnInit();
    component.error = 'Previous error';
    mockAuthService.login.mockReturnValue(of({ token: 'token' }));

    component.loginForm.setValue({
      username: 'testuser',
      password: 'password123'
    });

    component.onSubmit();

    expect(component.error).toBe('');
  });

  it('should expose form controls via f getter', () => {
    component.ngOnInit();

    const controls = component.f;

    expect(controls['username']).toBe(component.loginForm.get('username'));
    expect(controls['password']).toBe(component.loginForm.get('password'));
  });
});
