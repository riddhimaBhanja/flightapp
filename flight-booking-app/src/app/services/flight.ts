import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { timeout, catchError } from 'rxjs/operators';
import { Flight, FlightSearchRequest, FlightInventoryRequest } from '../models/flight.model';
import { BookingRequest, BookingResponse } from '../models/booking.model';

@Injectable({
  providedIn: 'root',
})
export class FlightService {
  private apiUrl = '/api/flights';

  constructor(private http: HttpClient) {}

  searchFlights(searchRequest: FlightSearchRequest): Observable<Flight[]> {
    return this.http.post<Flight[]>(`${this.apiUrl}/search`, searchRequest);
  }

  getAllFlights(): Observable<Flight[]> {
    // Try to get all flights from inventory endpoint
    return this.http.get<Flight[]>(`${this.apiUrl}/inventory`).pipe(
      timeout(10000),
      catchError((error) => {
        console.error('Error fetching all flights:', error);
        // If inventory endpoint fails, try with a broad search
        // This is a fallback - you may need to adjust based on your backend
        throw error;
      })
    );
  }

  addFlight(flightRequest: FlightInventoryRequest): Observable<Flight> {
    return this.http.post<Flight>(`${this.apiUrl}/add`, flightRequest);
  }

  getFlightById(id: number): Observable<Flight> {
    return this.http.get<Flight>(`${this.apiUrl}/inventory/${id}`);
  }

  bookFlight(bookingRequest: BookingRequest): Observable<BookingResponse> {
    return this.http.post<BookingResponse>('/api/bookings/book', bookingRequest);
  }

  getBookingHistory(email: string): Observable<BookingResponse[]> {
    const encodedEmail = encodeURIComponent(email);
    return this.http.get<BookingResponse[]>(`/api/bookings/history/${encodedEmail}`).pipe(
      timeout(10000) // 10 second timeout
    );
  }

  cancelBooking(pnr: string): Observable<BookingResponse> {
    return this.http.delete<BookingResponse>(`/api/bookings/cancel/${pnr}`);
  }
}

