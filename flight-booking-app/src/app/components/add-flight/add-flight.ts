import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FlightService } from '../../services/flight';
import { FlightInventoryRequest } from '../../models/flight.model';

@Component({
  selector: 'app-add-flight',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="add-flight-container">
      <div class="header">
        <button class="back-btn" (click)="goBack()">← Back to Dashboard</button>
        <h1>✈️ Add New Flight</h1>
        <p>Create a new flight inventory entry</p>
      </div>

      <div class="form-container">
        <form [formGroup]="flightForm" (ngSubmit)="onSubmit()">
          <div class="form-grid">
            <!-- Flight Number -->
            <div class="form-group">
              <label for="flightNumber">Flight Number *</label>
              <input
                type="text"
                id="flightNumber"
                formControlName="flightNumber"
                placeholder="e.g., AI101"
                [class.error]="isFieldInvalid('flightNumber')"
              />
              <span class="error-message" *ngIf="isFieldInvalid('flightNumber')">
                Flight number is required
              </span>
            </div>

            <!-- Airline -->
            <div class="form-group">
              <label for="airline">Airline *</label>
              <input
                type="text"
                id="airline"
                formControlName="airline"
                placeholder="e.g., Air India"
                [class.error]="isFieldInvalid('airline')"
              />
              <span class="error-message" *ngIf="isFieldInvalid('airline')">
                Airline name is required
              </span>
            </div>

            <!-- Origin -->
            <div class="form-group">
              <label for="origin">Origin *</label>
              <input
                type="text"
                id="origin"
                formControlName="origin"
                placeholder="e.g., DEL, BOM, BLR"
                [class.error]="isFieldInvalid('origin')"
              />
              <span class="error-message" *ngIf="isFieldInvalid('origin')">
                Origin is required
              </span>
            </div>

            <!-- Destination -->
            <div class="form-group">
              <label for="destination">Destination *</label>
              <input
                type="text"
                id="destination"
                formControlName="destination"
                placeholder="e.g., DEL, BOM, BLR"
                [class.error]="isFieldInvalid('destination')"
              />
              <span class="error-message" *ngIf="isFieldInvalid('destination')">
                Destination is required
              </span>
            </div>

            <!-- Departure Time -->
            <div class="form-group">
              <label for="departureTime">Departure Time *</label>
              <input
                type="datetime-local"
                id="departureTime"
                formControlName="departureTime"
                [class.error]="isFieldInvalid('departureTime')"
              />
              <span class="error-message" *ngIf="isFieldInvalid('departureTime')">
                Departure time is required
              </span>
            </div>

            <!-- Arrival Time -->
            <div class="form-group">
              <label for="arrivalTime">Arrival Time *</label>
              <input
                type="datetime-local"
                id="arrivalTime"
                formControlName="arrivalTime"
                [class.error]="isFieldInvalid('arrivalTime')"
              />
              <span class="error-message" *ngIf="isFieldInvalid('arrivalTime')">
                Arrival time is required
              </span>
            </div>

            <!-- Available Seats -->
            <div class="form-group">
              <label for="availableSeats">Available Seats *</label>
              <input
                type="number"
                id="availableSeats"
                formControlName="availableSeats"
                placeholder="e.g., 180"
                min="1"
                [class.error]="isFieldInvalid('availableSeats')"
              />
              <span class="error-message" *ngIf="isFieldInvalid('availableSeats')">
                <span *ngIf="flightForm.get('availableSeats')?.errors?.['required']">
                  Number of seats is required
                </span>
                <span *ngIf="flightForm.get('availableSeats')?.errors?.['min']">
                  Must be at least 1 seat
                </span>
              </span>
            </div>

            <!-- Price -->
            <div class="form-group">
              <label for="price">Price (₹) *</label>
              <input
                type="number"
                id="price"
                formControlName="price"
                placeholder="e.g., 5000"
                min="0"
                step="0.01"
                [class.error]="isFieldInvalid('price')"
              />
              <span class="error-message" *ngIf="isFieldInvalid('price')">
                <span *ngIf="flightForm.get('price')?.errors?.['required']">
                  Price is required
                </span>
                <span *ngIf="flightForm.get('price')?.errors?.['min']">
                  Price must be positive
                </span>
              </span>
            </div>
          </div>

          <!-- Success/Error Messages -->
          <div class="message success" *ngIf="successMessage">
            ✓ {{ successMessage }}
          </div>
          <div class="message error" *ngIf="errorMessage">
            ✗ {{ errorMessage }}
          </div>

          <!-- Submit Buttons -->
          <div class="form-actions">
            <button type="button" class="btn-cancel" (click)="goBack()">Cancel</button>
            <button type="submit" class="btn-submit" [disabled]="loading">
              <span *ngIf="!loading">Add Flight</span>
              <span *ngIf="loading">Adding...</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .add-flight-container {
      min-height: 100vh;
      background:
        linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)),
        url('https://images.unsplash.com/photo-1464037866556-6812c9d1c72e?w=1920&q=80') center/cover fixed;
      padding: 2rem;
      position: relative;
      animation: fadeIn 0.6s ease-in-out;
    }

    .add-flight-container::before {
      content: '';
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(135deg, rgba(102, 126, 234, 0.15) 0%, rgba(118, 75, 162, 0.15) 100%);
      pointer-events: none;
      z-index: 1;
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }

    .header {
      text-align: center;
      color: white;
      margin-bottom: 3rem;
      position: relative;
      z-index: 10;
    }

    .back-btn {
      background: rgba(255, 255, 255, 0.25);
      backdrop-filter: blur(10px);
      color: white;
      border: 2px solid rgba(255, 255, 255, 0.3);
      padding: 0.9rem 2rem;
      border-radius: 12px;
      cursor: pointer;
      font-size: 1.05rem;
      font-weight: 600;
      transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      margin-bottom: 1.5rem;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
    }

    .back-btn:hover {
      background: rgba(255, 255, 255, 0.35);
      transform: translateY(-3px);
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
      border-color: rgba(255, 255, 255, 0.5);
    }

    .back-btn:active {
      transform: translateY(-1px);
    }

    .header h1 {
      margin: 0.5rem 0;
      font-size: 3rem;
      font-weight: 800;
      text-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
      letter-spacing: 1px;
    }

    .header p {
      margin: 0.5rem 0 0 0;
      font-size: 1.3rem;
      opacity: 0.95;
      text-shadow: 0 2px 10px rgba(0, 0, 0, 0.4);
      font-weight: 500;
    }

    .form-container {
      max-width: 1000px;
      margin: 0 auto;
      background: rgba(255, 255, 255, 0.98);
      backdrop-filter: blur(20px);
      border-radius: 24px;
      padding: 3.5rem;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      border: 1px solid rgba(255, 255, 255, 0.4);
      position: relative;
      z-index: 10;
      animation: slideUp 0.7s ease-out;
    }

    @keyframes slideUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .form-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      gap: 2rem;
      margin-bottom: 2.5rem;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      animation: fadeInUp 0.5s ease-out backwards;
    }

    .form-group:nth-child(1) { animation-delay: 0.1s; }
    .form-group:nth-child(2) { animation-delay: 0.15s; }
    .form-group:nth-child(3) { animation-delay: 0.2s; }
    .form-group:nth-child(4) { animation-delay: 0.25s; }
    .form-group:nth-child(5) { animation-delay: 0.3s; }
    .form-group:nth-child(6) { animation-delay: 0.35s; }
    .form-group:nth-child(7) { animation-delay: 0.4s; }
    .form-group:nth-child(8) { animation-delay: 0.45s; }

    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    label {
      margin-bottom: 0.7rem;
      color: #1e3c72;
      font-weight: 700;
      font-size: 1rem;
      letter-spacing: 0.3px;
    }

    input {
      padding: 1rem 1.2rem;
      border: 2px solid rgba(102, 126, 234, 0.2);
      border-radius: 12px;
      font-size: 1.05rem;
      background: rgba(255, 255, 255, 0.9);
      transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    }

    input:hover {
      border-color: rgba(102, 126, 234, 0.4);
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.15);
    }

    input:focus {
      outline: none;
      border-color: #667eea;
      background: white;
      box-shadow: 0 6px 20px rgba(102, 126, 234, 0.25);
      transform: translateY(-2px);
    }

    input.error {
      border-color: #ef4444;
      background: rgba(239, 68, 68, 0.05);
    }

    input.error:focus {
      border-color: #ef4444;
      box-shadow: 0 6px 20px rgba(239, 68, 68, 0.25);
    }

    .error-message {
      color: #ef4444;
      font-size: 0.9rem;
      margin-top: 0.5rem;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 0.3rem;
    }

    .error-message::before {
      content: '⚠';
      font-size: 1rem;
    }

    .message {
      padding: 1.3rem 1.8rem;
      border-radius: 14px;
      margin-bottom: 2rem;
      font-weight: 600;
      font-size: 1.05rem;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
      animation: messageSlide 0.4s ease-out;
      border: 2px solid transparent;
    }

    @keyframes messageSlide {
      from {
        opacity: 0;
        transform: translateY(-10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .message.success {
      background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
      color: #065f46;
      border-color: #10b981;
    }

    .message.error {
      background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
      color: #991b1b;
      border-color: #ef4444;
    }

    .form-actions {
      display: flex;
      gap: 1.5rem;
      justify-content: flex-end;
      margin-top: 3rem;
      padding-top: 2rem;
      border-top: 2px solid rgba(102, 126, 234, 0.1);
    }

    .btn-cancel {
      background: rgba(255, 255, 255, 0.9);
      color: #374151;
      border: 2px solid rgba(102, 126, 234, 0.3);
      padding: 1.2rem 2.5rem;
      border-radius: 14px;
      font-size: 1.1rem;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
      position: relative;
      overflow: hidden;
    }

    .btn-cancel:hover {
      background: white;
      border-color: rgba(102, 126, 234, 0.5);
      transform: translateY(-3px);
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
    }

    .btn-cancel:active {
      transform: translateY(-1px);
    }

    .btn-submit {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      padding: 1.2rem 3rem;
      border-radius: 14px;
      font-size: 1.1rem;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      box-shadow: 0 6px 25px rgba(102, 126, 234, 0.4);
      position: relative;
      overflow: hidden;
    }

    .btn-submit::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
      transition: left 0.5s;
    }

    .btn-submit:hover:not(:disabled)::before {
      left: 100%;
    }

    .btn-submit:hover:not(:disabled) {
      transform: translateY(-4px) scale(1.02);
      box-shadow: 0 12px 40px rgba(102, 126, 234, 0.6);
    }

    .btn-submit:active:not(:disabled) {
      transform: translateY(-2px) scale(1.01);
    }

    .btn-submit:disabled {
      opacity: 0.65;
      cursor: not-allowed;
      transform: none;
      box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
    }
  `]
})
export class AddFlightComponent {
  flightForm: FormGroup;
  loading = false;
  successMessage = '';
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private flightService: FlightService,
    private router: Router
  ) {
    this.flightForm = this.fb.group({
      flightNumber: ['', Validators.required],
      airline: ['', Validators.required],
      origin: ['', Validators.required],
      destination: ['', Validators.required],
      departureTime: ['', Validators.required],
      arrivalTime: ['', Validators.required],
      availableSeats: ['', [Validators.required, Validators.min(1)]],
      price: ['', [Validators.required, Validators.min(0)]]
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.flightForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  onSubmit() {
    if (this.flightForm.invalid) {
      Object.keys(this.flightForm.controls).forEach(key => {
        this.flightForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const formValue = this.flightForm.value;
    const flightRequest: FlightInventoryRequest = {
      flightNumber: formValue.flightNumber,
      airline: formValue.airline,
      origin: formValue.origin,
      destination: formValue.destination,
      departureTime: this.formatDateTime(formValue.departureTime),
      arrivalTime: this.formatDateTime(formValue.arrivalTime),
      availableSeats: Number(formValue.availableSeats),
      price: Number(formValue.price)
    };

    this.flightService.addFlight(flightRequest).subscribe({
      next: (response) => {
        this.loading = false;
        this.successMessage = `Flight ${response.flightNumber} added successfully!`;
        this.flightForm.reset();

        // Navigate back to admin dashboard after 2 seconds
        setTimeout(() => {
          this.router.navigate(['/admin-dashboard']);
        }, 2000);
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = error.error?.message || 'Failed to add flight. Please try again.';
        console.error('Error adding flight:', error);
      }
    });
  }

  formatDateTime(dateTimeLocal: string): string {
    // Convert from datetime-local format to ISO 8601
    return new Date(dateTimeLocal).toISOString();
  }

  goBack() {
    this.router.navigate(['/admin-dashboard']);
  }
}
