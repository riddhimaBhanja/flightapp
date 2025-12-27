import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { FlightService } from '../../services/flight';
import { Auth } from '../../services/auth';
import { BookingResponse } from '../../models/booking.model';

@Component({
  selector: 'app-booking-history',
  standalone: false,
  templateUrl: './booking-history.html',
  styleUrl: './booking-history.scss',
})
export class BookingHistoryComponent implements OnInit {
  bookings: BookingResponse[] = [];
  loading = false;
  error = '';
  currentUser: any;
  showCancelModal = false;
  bookingToCancel: BookingResponse | null = null;

  constructor(
    private flightService: FlightService,
    private authService: Auth,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.authService.currentUser.subscribe((user: any) => {
      this.currentUser = user;
      console.log('Current user in booking history:', user);

      if (user?.email) {
        this.loadBookingHistory(user.email);
      } else {
        // Fallback: try to get user from localStorage directly
        const storedUser = localStorage.getItem('currentUser');
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          console.log('User loaded from localStorage:', parsedUser);
          this.currentUser = parsedUser;
          if (parsedUser.email) {
            this.loadBookingHistory(parsedUser.email);
          } else {
            this.error = 'User email not found. Please login again.';
            this.loading = false;
          }
        } else {
          this.error = 'User not logged in. Please login.';
          this.loading = false;
        }
      }
    });
  }

  loadBookingHistory(email: string): void {
    this.loading = true;
    this.error = '';
    console.log('Loading booking history for email:', email);

    this.flightService.getBookingHistory(email).subscribe({
      next: (bookings) => {
        console.log('Bookings received:', bookings);
        this.bookings = bookings || [];
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading booking history:', err);
        this.error = err.error?.message || 'Failed to load booking history. Please try again.';
        this.loading = false;
        this.cdr.detectChanges();
      },
      complete: () => {
        console.log('Booking history loading completed');
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  goToFlights(): void {
    this.router.navigate(['/flights']);
  }

  getStatusClass(status: string): string {
    return status.toLowerCase();
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  openCancelModal(booking: BookingResponse): void {
    if (booking.status === 'CANCELLED') {
      return;
    }
    this.bookingToCancel = booking;
    this.showCancelModal = true;
  }

  closeCancelModal(): void {
    this.showCancelModal = false;
    this.bookingToCancel = null;
  }

  confirmCancellation(): void {
    if (!this.bookingToCancel) {
      return;
    }

    this.loading = true;
    this.flightService.cancelBooking(this.bookingToCancel.pnr).subscribe({
      next: (response) => {
        console.log('Booking cancelled successfully:', response);
        // Update the booking status in the list
        const index = this.bookings.findIndex(b => b.pnr === this.bookingToCancel?.pnr);
        if (index !== -1) {
          this.bookings[index] = { ...this.bookings[index], status: 'CANCELLED', message: response.message };
        }
        this.loading = false;
        this.closeCancelModal();
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error cancelling booking:', err);
        this.loading = false;
        this.error = err.error?.message || 'Failed to cancel booking. Please try again.';
        this.closeCancelModal();
        this.cdr.detectChanges();
      }
    });
  }

  canCancelBooking(status: string): boolean {
    return status !== 'CANCELLED';
  }
}
