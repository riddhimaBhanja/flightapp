export interface FlightSearchRequest {
  origin: string;
  destination: string;
  travelDate: string;
}

export interface FlightInventoryRequest {
  flightNumber: string;
  airline: string;
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  availableSeats: number;
  price: number;
}

export interface Flight {
  id: number;
  flightNumber: string;
  airline: string;
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  availableSeats: number;
  price: number;
  status: string;
  createdAt?: string;
  updatedAt?: string;
}
