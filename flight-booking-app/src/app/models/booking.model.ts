export interface BookingRequest {
  flightId: number;
  passengerName: string;
  passengerEmail: string;
  passengerPhone: string;
  numberOfSeats: number;
}

export interface PassengerDetail {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
}

export interface BookingResponse {
  pnr: string;
  flightNumber: string;
  passengerName: string;
  numberOfSeats: number;
  totalAmount: number;
  status: string;
  bookingDate: string;
  message: string;
}
