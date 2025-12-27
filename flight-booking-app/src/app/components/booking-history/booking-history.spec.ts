import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { BookingHistoryComponent } from './booking-history';
import { FlightService } from '../../services/flight';
import { AuthService } from '../../services/auth';
import { BookingResponse } from '../../models/booking.model';

describe('BookingHistoryComponent', () => {
  let component: BookingHistoryComponent;
  let fixture: ComponentFixture<BookingHistoryComponent>;
  let mockFlightService: any;
  let mockAuthService: any;
  let mockRouter: any;

  const mockUser = {
    username: 'testuser',
    email: 'test@example.com',
    token: 'test-token',
  };

  const mockBookings: BookingResponse[] = [
    {
      pnr: 'PNR123',
      flightNumber: 'AI101',
      passengerName: 'John Doe',
      numberOfSeats: 2,
      totalAmount: 10000,
      status: 'CONFIRMED',
      bookingDate: '2025-12-19T10:00:00',
      message: 'Booking confirmed',
    },
    {
      pnr: 'PNR124',
      flightNumber: 'AI102',
      passengerName: 'John Doe',
      numberOfSeats: 1,
      totalAmount: 5000,
      status: 'PENDING',
      bookingDate: '2025-12-18T10:00:00',
      message: 'Booking pending',
    },
  ];

  beforeEach(async () => {
    mockFlightService = {
      getBookingHistory: vi.fn(),
    };

    mockAuthService = {
      currentUser: of(mockUser),
      logout: vi.fn(),
    };

    mockRouter = {
      navigate: vi.fn(),
    };

    await TestBed.configureTestingModule({
      declarations: [BookingHistoryComponent],
      providers: [
        { provide: FlightService, useValue: mockFlightService },
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BookingHistoryComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load booking history on init', () => {
    mockFlightService.getBookingHistory.mockReturnValue(of(mockBookings));

    fixture.detectChanges();

    expect(mockFlightService.getBookingHistory).toHaveBeenCalledWith(
      mockUser.email
    );
    expect(component.bookings).toEqual(mockBookings);
    expect(component.loading).toBe(false);
  });

  it('should handle error when loading booking history', () => {
    mockFlightService.getBookingHistory.mockReturnValue(
      throwError(() => new Error('Failed to load'))
    );

    fixture.detectChanges();

    expect(component.error).toBe(
      'Failed to load booking history. Please try again.'
    );
    expect(component.loading).toBe(false);
  });

  it('should logout and navigate to login', () => {
    component.logout();

    expect(mockAuthService.logout).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should navigate to flights page', () => {
    component.goToFlights();

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/flights']);
  });

  it('should return correct status class', () => {
    expect(component.getStatusClass('CONFIRMED')).toBe('confirmed');
    expect(component.getStatusClass('Pending')).toBe('pending');
  });

  it('should format date correctly', () => {
    const dateString = '2025-12-19T10:00:00';
    const formatted = component.formatDate(dateString);

    expect(formatted).toContain('2025');
    expect(formatted).toContain('December');
  });
});
