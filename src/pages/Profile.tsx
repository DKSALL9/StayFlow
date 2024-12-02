import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Property, Reservation } from '../types';
import { User, MapPin, Calendar, LogOut, Building, Clock } from 'lucide-react';

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [savedProperties, setSavedProperties] = useState<Property[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [activeTab, setActiveTab] = useState<'properties' | 'reservations'>('properties');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    // Load saved properties
    const savedPropertiesData = localStorage.getItem('savedProperties');
    if (savedPropertiesData) {
      const allProperties = JSON.parse(savedPropertiesData);
      const userProperties = allProperties.filter((p: Property) => 
        user.savedProperties?.includes(p.id)
      );
      setSavedProperties(userProperties);
    }

    // Load reservations
    const reservationsData = localStorage.getItem('reservations');
    if (reservationsData) {
      const allReservations = JSON.parse(reservationsData);
      const userReservations = allReservations.filter((r: Reservation) => 
        r.userId === user.id
      );
      setReservations(userReservations);
    }
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Profile Header */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-rose-500 to-rose-600 h-32"></div>
          <div className="px-8 pb-8">
            <div className="relative flex items-end">
              <div className="absolute -top-16">
                <div className="bg-white p-2 rounded-full shadow-lg">
                  <div className="bg-gray-100 rounded-full p-4">
                    <User className="w-16 h-16 text-gray-600" />
                  </div>
                </div>
              </div>
              <div className="ml-32 flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
                    <p className="text-gray-600">{user.email}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center px-4 py-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                  >
                    <LogOut className="w-5 h-5 mr-2" />
                    Sign out
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => setActiveTab('properties')}
            className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'properties'
                ? 'bg-rose-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Building className="w-5 h-5 mr-2" />
            Saved Properties
          </button>
          <button
            onClick={() => setActiveTab('reservations')}
            className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'reservations'
                ? 'bg-rose-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Calendar className="w-5 h-5 mr-2" />
            Reservations
          </button>
        </div>

        {/* Content */}
        {activeTab === 'properties' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedProperties.map((property) => (
              <div key={property.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <img
                  src={property.image}
                  alt={property.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {property.title}
                  </h3>
                  <p className="text-gray-600 flex items-center mb-4">
                    <MapPin className="w-4 h-4 mr-1" />
                    {property.location}
                  </p>
                  <p className="text-rose-600 font-medium">
                    ${property.price}/night
                  </p>
                </div>
              </div>
            ))}
            {savedProperties.length === 0 && (
              <div className="col-span-3 text-center py-12">
                <Building className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No saved properties yet</p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {reservations.map((reservation) => (
              <div key={reservation.id} className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Reservation #{reservation.id.slice(0, 8)}
                    </h3>
                    <div className="space-y-2 text-gray-600">
                      <p className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2" />
                        {new Date(reservation.checkIn).toLocaleDateString()} - {new Date(reservation.checkOut).toLocaleDateString()}
                      </p>
                      <p className="flex items-center">
                        <User className="w-4 h-4 mr-2" />
                        {reservation.guests} guests
                      </p>
                      <p className="flex items-center">
                        <Clock className="w-4 h-4 mr-2" />
                        Status: <span className="capitalize ml-1">{reservation.status}</span>
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-rose-600">
                      ${reservation.totalPrice}
                    </p>
                    <p className="text-sm text-gray-500">
                      Total price
                    </p>
                  </div>
                </div>
              </div>
            ))}
            {reservations.length === 0 && (
              <div className="text-center py-12">
                <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No reservations yet</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}