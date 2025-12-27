import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { Home } from './home';
import { Auth } from '../../services/auth';

describe('Home Component', () => {
  let component: Home;
  let fixture: ComponentFixture<Home>;
  let mockAuthService: any;
  let mockRouter: any;

  beforeEach(async () => {
    mockAuthService = {
      currentUser: of(null)
    };

    mockRouter = {
      navigate: vi.fn()
    };

    await TestBed.configureTestingModule({
      declarations: [Home],
      providers: [
        { provide: Auth, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Home);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize isAuthenticated to false', () => {
    expect(component.isAuthenticated).toBe(false);
  });

  it('should set isAuthenticated to false when currentUser is null', () => {
    mockAuthService.currentUser = of(null);

    const newFixture = TestBed.createComponent(Home);
    const newComponent = newFixture.componentInstance;
    newComponent.ngOnInit();

    expect(newComponent.isAuthenticated).toBe(false);
  });

  it('should set isAuthenticated to true when currentUser is present', () => {
    mockAuthService.currentUser = of({ username: 'testuser', email: 'test@test.com', token: 'token', role: 'USER' });

    const newFixture = TestBed.createComponent(Home);
    const newComponent = newFixture.componentInstance;
    newComponent.ngOnInit();

    expect(newComponent.isAuthenticated).toBe(true);
  });

  it('should navigate to flights when authenticated and navigateToFlights is called', () => {
    component.isAuthenticated = true;
    component.navigateToFlights();

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/flights']);
  });

  it('should navigate to login when not authenticated and navigateToFlights is called', () => {
    component.isAuthenticated = false;
    component.navigateToFlights();

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should subscribe to currentUser on init', () => {
    const subscribeSpy = vi.spyOn(mockAuthService.currentUser, 'subscribe');

    component.ngOnInit();

    expect(subscribeSpy).toHaveBeenCalled();
  });
});
