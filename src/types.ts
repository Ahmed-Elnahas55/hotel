export type Language = "ar" | "en";

export interface User {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

export interface Hotel {
  id: string;
  name: string;
  city: string;
  country: string;
  description: string;
  amenities: string[];
  pricePerNight: number;
  rating: number;
  reviewCount: number;
  image: string;
  rooms: Room[];
}

export interface Room {
  id: string;
  type: string;
  capacity: number;
  pricePerNight: number;
  description: string;
}

export interface HotelBooking {
  id: string;
  hotelId: string;
  hotelName: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  roomType: string;
  totalPrice: number;
  status: "confirmed" | "pending";
}

export interface Flight {
  id: string;
  airline: string;
  flightNumber: string;
  origin: string;
  destination: string;
  departTime: string;
  arriveTime: string;
  duration: string;
  price: number;
  stops: number;
  image: string;
}

export interface FlightBooking {
  id: string;
  flightId: string;
  flightNumber: string;
  origin: string;
  destination: string;
  departTime: string;
  arriveTime: string;
  passengers: number;
  totalPrice: number;
  status: "confirmed" | "pending";
}

export interface AppContextValue {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (user: Omit<User, "id">) => Promise<boolean>;
  logout: () => void;
  updateUser: (user: User) => Promise<void>;
  hotelBookings: HotelBooking[];
  flightBookings: FlightBooking[];
  addHotelBooking: (booking: Omit<HotelBooking, "id" | "status">) => void;
  addFlightBooking: (booking: Omit<FlightBooking, "id" | "status">) => void;
  removeHotelBooking: (id: string) => void;
  removeFlightBooking: (id: string) => void;
  updateHotelBooking: (
    id: string,
    updatedBooking: Partial<HotelBooking>,
  ) => void;
  updateFlightBooking: (
    id: string,
    updatedBooking: Partial<FlightBooking>,
  ) => void;
}
