import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { Auth } from './auth';

describe('Auth Service', () => {
  let service: Auth;
  let httpMock: HttpTestingController;
  let mockRouter: any;

  beforeEach(() => {
    localStorage.clear();
    mockRouter = { navigate: () => {} };

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [Auth, { provide: Router, useValue: mockRouter }]
    });

    service = TestBed.inject(Auth);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call login API', () => {
    service.login({ username: 'test', password: 'pass' }).subscribe();
    const req = httpMock.expectOne('http://localhost:8080/api/auth/login');
    expect(req.request.method).toBe('POST');
    req.flush({ token: 'token', username: 'test', email: 'test@test.com', role: 'USER' });
  });

  it('should call register API', () => {
    service.register({ username: 'test', email: 'test@test.com', password: 'pass' }).subscribe();
    const req = httpMock.expectOne('http://localhost:8080/api/auth/register');
    expect(req.request.method).toBe('POST');
    req.flush({ token: 'token', username: 'test', email: 'test@test.com', role: 'USER' });
  });

  it('should logout and clear storage', () => {
    localStorage.setItem('currentUser', 'test');
    service.logout();
    expect(localStorage.getItem('currentUser')).toBeNull();
  });

  it('should return false when not authenticated', () => {
    localStorage.clear();

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [Auth, { provide: Router, useValue: mockRouter }]
    });

    const newService = TestBed.inject(Auth);
    expect(newService.isAuthenticated()).toBe(false);
  });

  it('should return true when authenticated', () => {
    localStorage.setItem('currentUser', JSON.stringify({ username: 'test', token: 'token', email: 'test@test.com', role: 'USER' }));

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [Auth, { provide: Router, useValue: mockRouter }]
    });

    const newService = TestBed.inject(Auth);
    expect(newService.isAuthenticated()).toBe(true);
  });

  it('should return token', () => {
    localStorage.setItem('currentUser', JSON.stringify({ username: 'test', token: 'my-token', email: 'test@test.com', role: 'USER' }));

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [Auth, { provide: Router, useValue: mockRouter }]
    });

    const newService = TestBed.inject(Auth);
    expect(newService.getToken()).toBe('my-token');
  });

  it('should return null token when not logged in', () => {
    localStorage.clear();

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [Auth, { provide: Router, useValue: mockRouter }]
    });

    const newService = TestBed.inject(Auth);
    expect(newService.getToken()).toBeNull();
  });

  it('should have currentUserValue', () => {
    expect(service.currentUserValue).toBeDefined();
  });

  it('should have currentUser observable', () => {
    expect(service.currentUser).toBeDefined();
  });

  it('should store user in localStorage on login', () => {
    service.login({ username: 'testuser', password: 'pass' }).subscribe();
    const req = httpMock.expectOne('http://localhost:8080/api/auth/login');
    req.flush({ token: 'token', username: 'testuser', email: 'test@test.com', role: 'USER' });

    const stored = localStorage.getItem('currentUser');
    expect(stored).toBeTruthy();
  });

  it('should store user in localStorage on register', () => {
    service.register({ username: 'newuser', email: 'new@test.com', password: 'pass' }).subscribe();
    const req = httpMock.expectOne('http://localhost:8080/api/auth/register');
    req.flush({ token: 'token', username: 'newuser', email: 'new@test.com', role: 'USER' });

    const stored = localStorage.getItem('currentUser');
    expect(stored).toBeTruthy();
  });

  it('should update currentUserValue on login', () => {
    service.login({ username: 'user', password: 'pass' }).subscribe();
    const req = httpMock.expectOne('http://localhost:8080/api/auth/login');
    req.flush({ token: 'token', username: 'user', email: 'user@test.com', role: 'USER' });

    expect(service.currentUserValue).toBeTruthy();
  });

  it('should set currentUserValue to null on logout', () => {
    localStorage.setItem('currentUser', JSON.stringify({ username: 'test', token: 'token' }));
    service.logout();
    expect(service.currentUserValue).toBeNull();
  });
});
