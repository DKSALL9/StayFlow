import { useState } from 'react';
import { Property, Reservation } from '../types';
import { useAuth } from '../context/AuthContext';
import { Calendar, Users } from 'lucide-react';

interface ReservationFormProps {
  property: Property;
  onSubmit: (reservation: Reservation) => void;
}

export default function ReservationForm({ property, onSubmit }: ReservationFormProps) {
  const { user } = useAuth();
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const calculateTotalPrice = () => {
    if (!checkIn || !checkOut) return 0;
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const nights = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    return property.price * nights;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSubmitting(true);
    const totalPrice = calculateTotalPrice();

    const newReservation: Reservation = {
      id: Date.now().toString(),
      propertyId: property.id,
      userId: user.id,
      userName: user.name,
      checkIn,
      checkOut,
      guests,
      totalPrice,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    onSubmit(newReservation);
    setIsSubmitting(false);
  };

  if (!user) {
    return (
      <div className="text-center p-6 bg-gray-50 rounded-lg">
        <p className="text-gray-600 mb-4">Please log in to make a reservation</p>
        <a href="/login" className="text-rose-600 hover:text-rose-700 font-medium">
          Go to login
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Check-in
              </label>
              <div className="relative">
                <input
                  type="date"
                  required
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                />
                <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Check-out
              </label>
              <div className="relative">
                <input
                  type="date"
                  required
                  min={checkIn || new Date().toISOString().split('T')[0]}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                />
                <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Guests
            </label>
            <div className="relative">
              <input
                type="number"
                min="1"
                max="10"
                required
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                value={guests}
                onChange={(e) => setGuests(Number(e.target.value))}
              />
              <Users className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>

          <div className="border-t border-gray-200 pt-4 mt-4">
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">${property.price} × {calculateTotalPrice() / property.price} nights</span>
              <span className="font-medium">${calculateTotalPrice()}</span>
            </div>
            <div className="flex justify-between font-semibold text-lg">
              <span>Total</span>
              <span>${calculateTotalPrice()}</span>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 px-4 bg-rose-600 text-white font-medium rounded-lg hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? 'Reserving...' : 'Reserve'}
          </button>
        </div>
      </div>
    </form>
  );
}