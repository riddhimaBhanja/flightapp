import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FlightService } from '../../services/flight';
import { Auth } from '../../services/auth';
import { Flight } from '../../models/flight.model';

@Component({
  selector: 'app-flight-search',
  standalone: false,
  templateUrl: './flight-search.html',
  styleUrl: './flight-search.scss',
})
export class FlightSearch implements OnInit {
  searchForm!: FormGroup;
  flights: Flight[] = [];
  loading = false;
  searched = false;
  error = '';
  currentUser: any;
  showBookingModal = false;
  selectedFlight: Flight | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private flightService: FlightService,
    private authService: Auth,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.currentUser.subscribe(user => {
      this.currentUser = user;
      console.log('Current user loaded:', user);
    });

    // Also try to get user from localStorage directly as backup
    if (!this.currentUser) {
      const storedUser = localStorage.getItem('currentUser');
      if (storedUser) {
        this.currentUser = JSON.parse(storedUser);
        console.log('User loaded from localStorage:', this.currentUser);
      }
    }

    const today = new Date().toISOString().split('T')[0];

    this.searchForm = this.formBuilder.group({
      origin: ['', Validators.required],
      destination: ['', Validators.required],
      travelDate: [today, Validators.required]
    });
  }

  get f() {
    return this.searchForm.controls;
  }

  onSearch(): void {
    this.error = '';
    this.searched = true;

    if (this.searchForm.invalid) {
      return;
    }

    this.loading = true;
    this.flights = [];

    this.flightService.searchFlights(this.searchForm.value).subscribe({
      next: (flights) => {
        this.flights = flights;
        this.loading = false;
      },
      error: (error) => {
        this.error = error.error?.message || 'Failed to search flights. Please try again.';
        this.loading = false;
      }
    });
  }

  formatDateTime(dateTime: string): string {
    const date = new Date(dateTime);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  calculateDuration(departure: string, arrival: string): string {
    const dept = new Date(departure);
    const arr = new Date(arrival);
    const diff = arr.getTime() - dept.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  }

  logout(): void {
    this.authService.logout();
  }

  goToBookingHistory(): void {
    this.router.navigate(['/booking-history']);
  }

  onBook(flight: Flight): void {
    this.selectedFlight = flight;
    this.showBookingModal = true;
  }

  closeBookingModal(): void {
    this.showBookingModal = false;
    this.selectedFlight = null;
  }

  onBookingSuccess(response: any): void {
    this.onSearch();
  }

  quickSearch(origin: string, destination: string): void {
    this.searchForm.patchValue({
      origin,
      destination
    });
    this.onSearch();
  }
}
