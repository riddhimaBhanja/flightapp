import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { Register } from './register';
import { Auth } from '../../services/auth';

describe('Register Component', () => {
  let component: Register;
  let fixture: ComponentFixture<Register>;
  let mockAuthService: any;
  let mockRouter: any;

  beforeEach(async () => {
    mockAuthService = {
      isAuthenticated: vi.fn().mockReturnValue(false),
      register: vi.fn()
    };

    mockRouter = {
      navigate: vi.fn()
    };

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [Register],
      providers: [
        { provide: Auth, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Register);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize register form with empty values', () => {
    component.ngOnInit();

    expect(component.registerForm).toBeDefined();
    expect(component.registerForm.get('username')?.value).toBe('');
    expect(component.registerForm.get('email')?.value).toBe('');
    expect(component.registerForm.get('password')?.value).toBe('');
    expect(component.registerForm.get('confirmPassword')?.value).toBe('');
    expect(component.registerForm.get('firstName')?.value).toBe('');
    expect(component.registerForm.get('lastName')?.value).toBe('');
  });

  it('should redirect to flights if already authenticated', () => {
    mockAuthService.isAuthenticated.mockReturnValue(true);

    component.ngOnInit();

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/flights']);
  });

  it('should have invalid form when fields are empty', () => {
    component.ngOnInit();

    expect(component.registerForm.valid).toBe(false);
  });

  it('should mark username as required', () => {
    component.ngOnInit();

    const usernameControl = component.registerForm.get('username');
    expect(usernameControl?.hasError('required')).toBe(true);

    usernameControl?.setValue('testuser');
    expect(usernameControl?.hasError('required')).toBe(false);
  });

  it('should validate username minimum length', () => {
    component.ngOnInit();

    const usernameControl = component.registerForm.get('username');
    usernameControl?.setValue('ab');
    expect(usernameControl?.hasError('minlength')).toBe(true);

    usernameControl?.setValue('abc');
    expect(usernameControl?.hasError('minlength')).toBe(false);
  });

  it('should validate username maximum length', () => {
    component.ngOnInit();

    const usernameControl = component.registerForm.get('username');
    usernameControl?.setValue('a'.repeat(51));
    expect(usernameControl?.hasError('maxlength')).toBe(true);

    usernameControl?.setValue('a'.repeat(50));
    expect(usernameControl?.hasError('maxlength')).toBe(false);
  });

  it('should mark email as required', () => {
    component.ngOnInit();

    const emailControl = component.registerForm.get('email');
    expect(emailControl?.hasError('required')).toBe(true);

    emailControl?.setValue('test@test.com');
    expect(emailControl?.hasError('required')).toBe(false);
  });

  it('should validate email format', () => {
    component.ngOnInit();

    const emailControl = component.registerForm.get('email');
    emailControl?.setValue('invalid-email');
    expect(emailControl?.hasError('email')).toBe(true);

    emailControl?.setValue('valid@email.com');
    expect(emailControl?.hasError('email')).toBe(false);
  });

  it('should mark password as required', () => {
    component.ngOnInit();

    const passwordControl = component.registerForm.get('password');
    expect(passwordControl?.hasError('required')).toBe(true);

    passwordControl?.setValue('password123');
    expect(passwordControl?.hasError('required')).toBe(false);
  });

  it('should validate password minimum length', () => {
    component.ngOnInit();

    const passwordControl = component.registerForm.get('password');
    passwordControl?.setValue('12345');
    expect(passwordControl?.hasError('minlength')).toBe(true);

    passwordControl?.setValue('123456');
    expect(passwordControl?.hasError('minlength')).toBe(false);
  });

  it('should mark confirmPassword as required', () => {
    component.ngOnInit();

    const confirmPasswordControl = component.registerForm.get('confirmPassword');
    expect(confirmPasswordControl?.hasError('required')).toBe(true);

    confirmPasswordControl?.setValue('password123');
    expect(confirmPasswordControl?.hasError('required')).toBe(false);
  });

  it('should validate password match', () => {
    component.ngOnInit();

    component.registerForm.patchValue({
      password: 'password123',
      confirmPassword: 'different'
    });

    expect(component.registerForm.hasError('passwordMismatch')).toBe(true);

    component.registerForm.patchValue({
      confirmPassword: 'password123'
    });

    expect(component.registerForm.hasError('passwordMismatch')).toBe(false);
  });

  it('should have valid form when all required fields are filled correctly', () => {
    component.ngOnInit();

    component.registerForm.setValue({
      username: 'testuser',
      email: 'test@test.com',
      password: 'password123',
      confirmPassword: 'password123',
      firstName: 'Test',
      lastName: 'User'
    });

    expect(component.registerForm.valid).toBe(true);
  });

  it('should not submit if form is invalid', () => {
    component.ngOnInit();
    component.onSubmit();

    expect(component.submitted).toBe(true);
    expect(mockAuthService.register).not.toHaveBeenCalled();
  });

  it('should call auth service on valid form submit', () => {
    component.ngOnInit();
    mockAuthService.register.mockReturnValue(of({ token: 'token', username: 'test', email: 'test@test.com', role: 'USER' }));

    component.registerForm.setValue({
      username: 'testuser',
      email: 'test@test.com',
      password: 'password123',
      confirmPassword: 'password123',
      firstName: 'Test',
      lastName: 'User'
    });

    component.onSubmit();

    expect(mockAuthService.register).toHaveBeenCalledWith({
      username: 'testuser',
      email: 'test@test.com',
      password: 'password123',
      firstName: 'Test',
      lastName: 'User'
    });
  });

  it('should navigate to flights on successful registration', () => {
    component.ngOnInit();
    mockAuthService.register.mockReturnValue(of({ token: 'token', username: 'test', email: 'test@test.com', role: 'USER' }));

    component.registerForm.setValue({
      username: 'testuser',
      email: 'test@test.com',
      password: 'password123',
      confirmPassword: 'password123',
      firstName: 'Test',
      lastName: 'User'
    });

    component.onSubmit();

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/flights']);
  });

  it('should show error message on registration failure', () => {
    component.ngOnInit();
    const error = { error: { message: 'Username already exists' } };
    mockAuthService.register.mockReturnValue(throwError(() => error));

    component.registerForm.setValue({
      username: 'testuser',
      email: 'test@test.com',
      password: 'password123',
      confirmPassword: 'password123',
      firstName: 'Test',
      lastName: 'User'
    });

    component.onSubmit();

    expect(component.error).toBe('Username already exists');
    expect(component.loading).toBe(false);
  });

  it('should show default error message when no error message provided', () => {
    component.ngOnInit();
    mockAuthService.register.mockReturnValue(throwError(() => ({})));

    component.registerForm.setValue({
      username: 'testuser',
      email: 'test@test.com',
      password: 'password123',
      confirmPassword: 'password123',
      firstName: 'Test',
      lastName: 'User'
    });

    component.onSubmit();

    expect(component.error).toBe('Registration failed. Please try again.');
    expect(component.loading).toBe(false);
  });

  it('should set loading to true during registration', () => {
    component.ngOnInit();
    mockAuthService.register.mockReturnValue(of({ token: 'token', username: 'test', email: 'test@test.com', role: 'USER' }));

    component.registerForm.setValue({
      username: 'testuser',
      email: 'test@test.com',
      password: 'password123',
      confirmPassword: 'password123',
      firstName: 'Test',
      lastName: 'User'
    });

    component.loading = false;
    component.onSubmit();

    expect(component.loading).toBe(true);
  });

  it('should clear error on form submit', () => {
    component.ngOnInit();
    component.error = 'Previous error';
    mockAuthService.register.mockReturnValue(of({ token: 'token', username: 'test', email: 'test@test.com', role: 'USER' }));

    component.registerForm.setValue({
      username: 'testuser',
      email: 'test@test.com',
      password: 'password123',
      confirmPassword: 'password123',
      firstName: 'Test',
      lastName: 'User'
    });

    component.onSubmit();

    expect(component.error).toBe('');
  });

  it('should expose form controls via f getter', () => {
    component.ngOnInit();

    const controls = component.f;

    expect(controls['username']).toBe(component.registerForm.get('username'));
    expect(controls['email']).toBe(component.registerForm.get('email'));
    expect(controls['password']).toBe(component.registerForm.get('password'));
    expect(controls['confirmPassword']).toBe(component.registerForm.get('confirmPassword'));
  });

  it('should not include confirmPassword in register data', () => {
    component.ngOnInit();
    mockAuthService.register.mockReturnValue(of({ token: 'token', username: 'test', email: 'test@test.com', role: 'USER' }));

    component.registerForm.setValue({
      username: 'testuser',
      email: 'test@test.com',
      password: 'password123',
      confirmPassword: 'password123',
      firstName: 'Test',
      lastName: 'User'
    });

    component.onSubmit();

    const registerCall = mockAuthService.register.mock.calls[0][0];
    expect(registerCall).not.toHaveProperty('confirmPassword');
    expect(registerCall).toHaveProperty('username');
    expect(registerCall).toHaveProperty('email');
    expect(registerCall).toHaveProperty('password');
  });
});
