import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { FlightService } from './flight';

describe('FlightService', () => {
  let service: FlightService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [FlightService]
    });
    service = TestBed.inject(FlightService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should search flights', () => {
    const mockFlights = [{ id: 1, flightNumber: 'AI101', airline: 'Air India', origin: 'DEL', destination: 'BOM', departureTime: '2025-12-15T08:00:00', arrivalTime: '2025-12-15T10:30:00', availableSeats: 150, price: 5500, status: 'ACTIVE' }];
    
    service.searchFlights({ origin: 'DEL', destination: 'BOM', travelDate: '2025-12-15' }).subscribe(flights => {
      expect(flights).toEqual(mockFlights);
    });

    const req = httpMock.expectOne('http://localhost:8080/api/flights/search');
    expect(req.request.method).toBe('POST');
    req.flush(mockFlights);
  });

  it('should return empty array when no flights', () => {
    service.searchFlights({ origin: 'DEL', destination: 'GOI', travelDate: '2025-12-20' }).subscribe(flights => {
      expect(flights).toEqual([]);
    });

    const req = httpMock.expectOne('http://localhost:8080/api/flights/search');
    req.flush([]);
  });

  it('should get flight by ID', () => {
    const mockFlight = { id: 1, flightNumber: 'AI101', airline: 'Air India', origin: 'DEL', destination: 'BOM', departureTime: '2025-12-15T08:00:00', arrivalTime: '2025-12-15T10:30:00', availableSeats: 150, price: 5500, status: 'ACTIVE' };

    service.getFlightById(1).subscribe(flight => {
      expect(flight).toEqual(mockFlight);
    });

    const req = httpMock.expectOne('http://localhost:8080/api/flights/inventory/1');
    expect(req.request.method).toBe('GET');
    req.flush(mockFlight);
  });

  it('should handle different flight IDs', () => {
    const mockFlight = { id: 999, flightNumber: 'UK999', airline: 'Vistara', origin: 'BLR', destination: 'CCU', departureTime: '2025-12-16T12:00:00', arrivalTime: '2025-12-16T14:30:00', availableSeats: 100, price: 7200, status: 'ACTIVE' };

    service.getFlightById(999).subscribe(flight => {
      expect(flight.id).toBe(999);
    });

    const req = httpMock.expectOne('http://localhost:8080/api/flights/inventory/999');
    req.flush(mockFlight);
  });

  it('should use correct API URL', () => {
    service.searchFlights({ origin: 'A', destination: 'B', travelDate: '2025-12-15' }).subscribe();
    const req = httpMock.expectOne('http://localhost:8080/api/flights/search');
    req.flush([]);
  });
});
