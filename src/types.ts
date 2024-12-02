export interface User {
  id: string;
  email: string;
  name: string;
  savedProperties?: string[];
}

export interface Property {
  id: string;
  title: string;
  location: string;
  price: number;
  image: string;
  rating: number;
  reviews: Review[];
  reservations?: Reservation[];
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Reservation {
  id: string;
  propertyId: string;
  userId: string;
  userName: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: string;
}