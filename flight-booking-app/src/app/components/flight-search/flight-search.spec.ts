import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { FlightSearch } from './flight-search';
import { FlightService } from '../../services/flight';
import { Auth } from '../../services/auth';

describe('FlightSearch Component', () => {
  let component: FlightSearch;
  let fixture: ComponentFixture<FlightSearch>;
  let mockFlightService: any;
  let mockAuthService: any;

  beforeEach(async () => {
    mockFlightService = {
      searchFlights: vi.fn()
    };

    mockAuthService = {
      currentUser: of({ username: 'testuser', email: 'test@test.com', token: 'token', role: 'USER' }),
      logout: vi.fn()
    };

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [FlightSearch],
      providers: [
        { provide: FlightService, useValue: mockFlightService },
        { provide: Auth, useValue: mockAuthService }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FlightSearch);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize search form with default values', () => {
    component.ngOnInit();

    expect(component.searchForm).toBeDefined();
    expect(component.searchForm.get('origin')?.value).toBe('');
    expect(component.searchForm.get('destination')?.value).toBe('');
    expect(component.searchForm.get('travelDate')?.value).toBeTruthy();
  });

  it('should set travelDate to today by default', () => {
    component.ngOnInit();

    const today = new Date().toISOString().split('T')[0];
    expect(component.searchForm.get('travelDate')?.value).toBe(today);
  });

  it('should subscribe to currentUser on init', () => {
    component.ngOnInit();

    expect(component.currentUser).toBeDefined();
    expect(component.currentUser.username).toBe('testuser');
  });

  it('should have invalid form when required fields are empty', () => {
    component.ngOnInit();

    component.searchForm.patchValue({
      origin: '',
      destination: ''
    });

    expect(component.searchForm.valid).toBe(false);
  });

  it('should mark origin as required', () => {
    component.ngOnInit();

    const originControl = component.searchForm.get('origin');
    expect(originControl?.hasError('required')).toBe(true);

    originControl?.setValue('DEL');
    expect(originControl?.hasError('required')).toBe(false);
  });

  it('should mark destination as required', () => {
    component.ngOnInit();

    const destinationControl = component.searchForm.get('destination');
    expect(destinationControl?.hasError('required')).toBe(true);

    destinationControl?.setValue('BOM');
    expect(destinationControl?.hasError('required')).toBe(false);
  });

  it('should mark travelDate as required', () => {
    component.ngOnInit();

    const travelDateControl = component.searchForm.get('travelDate');
    travelDateControl?.setValue('');
    expect(travelDateControl?.hasError('required')).toBe(true);

    travelDateControl?.setValue('2025-12-15');
    expect(travelDateControl?.hasError('required')).toBe(false);
  });

  it('should have valid form when all fields are filled', () => {
    component.ngOnInit();

    component.searchForm.setValue({
      origin: 'DEL',
      destination: 'BOM',
      travelDate: '2025-12-15'
    });

    expect(component.searchForm.valid).toBe(true);
  });

  it('should not search if form is invalid', () => {
    component.ngOnInit();
    component.onSearch();

    expect(component.searched).toBe(true);
    expect(mockFlightService.searchFlights).not.toHaveBeenCalled();
  });

  it('should call flightService on valid search', () => {
    component.ngOnInit();
    mockFlightService.searchFlights.mockReturnValue(of([]));

    component.searchForm.setValue({
      origin: 'DEL',
      destination: 'BOM',
      travelDate: '2025-12-15'
    });

    component.onSearch();

    expect(mockFlightService.searchFlights).toHaveBeenCalledWith({
      origin: 'DEL',
      destination: 'BOM',
      travelDate: '2025-12-15'
    });
  });

  it('should set loading to true and then false on search completion', () => {
    component.ngOnInit();
    let loadingDuringSearch = false;

    mockFlightService.searchFlights.mockImplementation(() => {
      loadingDuringSearch = component.loading;
      return of([]);
    });

    component.searchForm.setValue({
      origin: 'DEL',
      destination: 'BOM',
      travelDate: '2025-12-15'
    });

    component.loading = false;
    component.onSearch();

    expect(loadingDuringSearch).toBe(true);
    expect(component.loading).toBe(false);
  });

  it('should clear flights array on new search', () => {
    component.ngOnInit();
    component.flights = [{ id: 1, flightNumber: 'AI101' } as any];
    mockFlightService.searchFlights.mockReturnValue(of([]));

    component.searchForm.setValue({
      origin: 'DEL',
      destination: 'BOM',
      travelDate: '2025-12-15'
    });

    component.onSearch();

    expect(component.flights).toEqual([]);
  });

  it('should display flights on successful search', () => {
    component.ngOnInit();
    const mockFlights = [
      { id: 1, flightNumber: 'AI101', airline: 'Air India', origin: 'DEL', destination: 'BOM' },
      { id: 2, flightNumber: 'UK202', airline: 'Vistara', origin: 'DEL', destination: 'BOM' }
    ];
    mockFlightService.searchFlights.mockReturnValue(of(mockFlights));

    component.searchForm.setValue({
      origin: 'DEL',
      destination: 'BOM',
      travelDate: '2025-12-15'
    });

    component.onSearch();

    expect(component.flights).toEqual(mockFlights);
    expect(component.loading).toBe(false);
  });

  it('should handle empty flight results', () => {
    component.ngOnInit();
    mockFlightService.searchFlights.mockReturnValue(of([]));

    component.searchForm.setValue({
      origin: 'DEL',
      destination: 'GOI',
      travelDate: '2025-12-20'
    });

    component.onSearch();

    expect(component.flights).toEqual([]);
    expect(component.loading).toBe(false);
  });

  it('should show error message on search failure', () => {
    component.ngOnInit();
    const error = { error: { message: 'Server error' } };
    mockFlightService.searchFlights.mockReturnValue(throwError(() => error));

    component.searchForm.setValue({
      origin: 'DEL',
      destination: 'BOM',
      travelDate: '2025-12-15'
    });

    component.onSearch();

    expect(component.error).toBe('Server error');
    expect(component.loading).toBe(false);
  });

  it('should show default error message when no error message provided', () => {
    component.ngOnInit();
    mockFlightService.searchFlights.mockReturnValue(throwError(() => ({})));

    component.searchForm.setValue({
      origin: 'DEL',
      destination: 'BOM',
      travelDate: '2025-12-15'
    });

    component.onSearch();

    expect(component.error).toBe('Failed to search flights. Please try again.');
    expect(component.loading).toBe(false);
  });

  it('should clear error on new search', () => {
    component.ngOnInit();
    component.error = 'Previous error';
    mockFlightService.searchFlights.mockReturnValue(of([]));

    component.searchForm.setValue({
      origin: 'DEL',
      destination: 'BOM',
      travelDate: '2025-12-15'
    });

    component.onSearch();

    expect(component.error).toBe('');
  });

  it('should expose form controls via f getter', () => {
    component.ngOnInit();

    const controls = component.f;

    expect(controls['origin']).toBe(component.searchForm.get('origin'));
    expect(controls['destination']).toBe(component.searchForm.get('destination'));
    expect(controls['travelDate']).toBe(component.searchForm.get('travelDate'));
  });

  it('should format date time correctly', () => {
    const dateTime = '2025-12-15T08:00:00';
    const formatted = component.formatDateTime(dateTime);

    expect(formatted).toContain('Dec');
    expect(formatted).toContain('15');
  });

  it('should calculate duration correctly', () => {
    const departure = '2025-12-15T08:00:00';
    const arrival = '2025-12-15T10:30:00';
    const duration = component.calculateDuration(departure, arrival);

    expect(duration).toBe('2h 30m');
  });

  it('should calculate duration for longer flights', () => {
    const departure = '2025-12-15T08:00:00';
    const arrival = '2025-12-15T14:45:00';
    const duration = component.calculateDuration(departure, arrival);

    expect(duration).toBe('6h 45m');
  });

  it('should calculate duration for flights under an hour', () => {
    const departure = '2025-12-15T08:00:00';
    const arrival = '2025-12-15T08:45:00';
    const duration = component.calculateDuration(departure, arrival);

    expect(duration).toBe('0h 45m');
  });

  it('should call authService logout when logout is called', () => {
    component.logout();

    expect(mockAuthService.logout).toHaveBeenCalled();
  });

  it('should set searched flag to true after search', () => {
    component.ngOnInit();
    component.searched = false;
    mockFlightService.searchFlights.mockReturnValue(of([]));

    component.searchForm.setValue({
      origin: 'DEL',
      destination: 'BOM',
      travelDate: '2025-12-15'
    });

    component.onSearch();

    expect(component.searched).toBe(true);
  });
});
