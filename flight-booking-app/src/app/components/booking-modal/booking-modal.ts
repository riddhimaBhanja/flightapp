import { Component, EventEmitter, Input, OnInit, OnChanges, SimpleChanges, Output, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { Flight } from '../../models/flight.model';
import { FlightService } from '../../services/flight';
import { BookingRequest } from '../../models/booking.model';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-booking-modal',
  standalone: false,
  templateUrl: './booking-modal.html',
  styleUrl: './booking-modal.scss',
})
export class BookingModal implements OnInit, OnChanges {
  @Input() flight!: Flight;
  @Input() show = false;
  @Output() close = new EventEmitter<void>();
  @Output() bookingSuccess = new EventEmitter<any>();

  bookingForm!: FormGroup;
  loading = false;
  submitted = false;
  showSuccessAnimation = false;
  bookingResponse: any = null;
  bookingError = '';

  constructor(
    private formBuilder: FormBuilder,
    private flightService: FlightService,
    private cdr: ChangeDetectorRef,
    private authService: Auth
  ) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['show'] && changes['show'].currentValue && this.flight) {
      this.initializeForm();
    }
  }

  initializeForm(): void {
    if (!this.bookingForm) {
      this.bookingForm = this.formBuilder.group({
        numberOfPassengers: [1, [Validators.required, Validators.min(1)]],
        passengers: this.formBuilder.array([])
      });

      this.addPassenger();

      this.bookingForm.get('numberOfPassengers')?.valueChanges.subscribe(count => {
        this.updatePassengerForms(count);
      });
    } else {
      // Reset form if it already exists
      this.bookingForm.reset({
        numberOfPassengers: 1
      });
      const passengersArray = this.passengers;
      while (passengersArray.length > 0) {
        passengersArray.removeAt(0);
      }
      this.addPassenger();
    }
  }

  get passengers(): FormArray {
    return this.bookingForm.get('passengers') as FormArray;
  }

  get f() {
    return this.bookingForm.controls;
  }

  createPassengerForm(): FormGroup {
    return this.formBuilder.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      phoneNumber: ['']
    });
  }

  addPassenger(): void {
    this.passengers.push(this.createPassengerForm());
  }

  removePassenger(index: number): void {
    this.passengers.removeAt(index);
  }

  updatePassengerForms(count: number): void {
    const currentCount = this.passengers.length;

    if (count > currentCount) {
      for (let i = currentCount; i < count; i++) {
        this.addPassenger();
      }
    } else if (count < currentCount) {
      for (let i = currentCount - 1; i >= count; i--) {
        this.removePassenger(i);
      }
    }
  }

  onSubmit(): void {
    this.submitted = true;
    this.bookingError = '';

    if (this.bookingForm.invalid) {
      this.bookingError = 'Please fill in all required fields correctly.';
      return;
    }

    const numberOfPassengers = this.bookingForm.value.numberOfPassengers;

    if (numberOfPassengers > this.flight.availableSeats) {
      this.bookingError = `Only ${this.flight.availableSeats} seats available! Please reduce the number of passengers.`;
      return;
    }

    this.loading = true;

    // Get the first passenger's details
    const firstPassenger = this.bookingForm.value.passengers[0];
    const fullName = `${firstPassenger.firstName} ${firstPassenger.lastName}`;

    // Use logged-in user's email
    const currentUser = this.authService.currentUserValue;
    const userEmail = currentUser?.email;

    if (!userEmail) {
      this.loading = false;
      this.bookingError = 'User email not found. Please login again.';
      return;
    }

    const bookingRequest: BookingRequest = {
      flightId: this.flight.id,
      passengerName: fullName,
      passengerEmail: userEmail,
      passengerPhone: firstPassenger.phoneNumber || 'N/A',
      numberOfSeats: numberOfPassengers
    };

    console.log('Booking request:', bookingRequest);

    this.flightService.bookFlight(bookingRequest).subscribe({
      next: (response) => {
        console.log('Booking SUCCESS response:', response);
        this.loading = false;
        this.bookingResponse = response;
        this.showSuccessAnimation = true;
        console.log('showSuccessAnimation set to:', this.showSuccessAnimation);
        console.log('bookingResponse:', this.bookingResponse);

        // Force change detection to update the UI
        this.cdr.detectChanges();

        setTimeout(() => {
          this.bookingSuccess.emit(response);
          this.closeModal();
        }, 4000);
      },
      error: (error) => {
        console.error('Booking ERROR:', error);
        this.loading = false;
        this.bookingError = error.error?.message || 'Booking failed. Please try again.';
        this.cdr.detectChanges();
      }
    });
  }

  closeModal(): void {
    this.show = false;
    this.showSuccessAnimation = false;
    this.bookingResponse = null;
    this.submitted = false;
    this.bookingError = '';
    this.initializeForm();
    this.close.emit();
  }

  getTotalAmount(): number {
    if (!this.flight || !this.bookingForm) {
      return 0;
    }
    return this.flight.price * (this.bookingForm.value.numberOfPassengers || 1);
  }
}
