import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { authGuard } from './auth-guard';
import { Auth } from '../services/auth';

describe('authGuard', () => {
  let mockAuthService: any;
  let mockRouter: any;
  let mockRoute: ActivatedRouteSnapshot;
  let mockState: RouterStateSnapshot;

  beforeEach(() => {
    mockAuthService = {
      isAuthenticated: vi.fn()
    };

    mockRouter = {
      navigate: vi.fn()
    };

    mockRoute = {} as ActivatedRouteSnapshot;
    mockState = { url: '/flights' } as RouterStateSnapshot;

    TestBed.configureTestingModule({
      providers: [
        { provide: Auth, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter }
      ]
    });
  });

  it('should allow access when user is authenticated', () => {
    mockAuthService.isAuthenticated.mockReturnValue(true);

    const result = TestBed.runInInjectionContext(() =>
      authGuard(mockRoute, mockState)
    );

    expect(result).toBe(true);
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });

  it('should deny access and redirect to login when user is not authenticated', () => {
    mockAuthService.isAuthenticated.mockReturnValue(false);

    const result = TestBed.runInInjectionContext(() =>
      authGuard(mockRoute, mockState)
    );

    expect(result).toBe(false);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/login'], {
      queryParams: { returnUrl: '/flights' }
    });
  });

  it('should preserve return URL in query params', () => {
    mockAuthService.isAuthenticated.mockReturnValue(false);
    mockState.url = '/flights/search';

    TestBed.runInInjectionContext(() =>
      authGuard(mockRoute, mockState)
    );

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/login'], {
      queryParams: { returnUrl: '/flights/search' }
    });
  });

  it('should handle empty state URL', () => {
    mockAuthService.isAuthenticated.mockReturnValue(false);
    mockState.url = '';

    TestBed.runInInjectionContext(() =>
      authGuard(mockRoute, mockState)
    );

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/login'], {
      queryParams: { returnUrl: '' }
    });
  });
});
