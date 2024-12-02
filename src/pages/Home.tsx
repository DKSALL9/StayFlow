import { useState, useEffect } from 'react';
import PropertyCard from '../components/PropertyCard';
import SearchBar from '../components/SearchBar';
import { Property } from '../types';
import { Plus } from 'lucide-react';
import CreateProperty from '../components/CreateProperty';
import { useAuth } from '../context/AuthContext';

const MOCK_PROPERTIES: Property[] = [
  {
    id: '1',
    title: 'Luxury Beach House',
    location: 'Malibu, California',
    price: 350,
    image: 'https://images.unsplash.com/photo-1527030280862-64139fba04ca',
    rating: 4.8,
    reviews: [
      {
        id: '1',
        userId: '1',
        userName: 'John Doe',
        rating: 5,
        comment: 'Amazing beachfront property with stunning views!',
        date: '2024-02-15'
      }
    ]
  },
  {
    id: '2',
    title: 'Mountain Retreat',
    location: 'Aspen, Colorado',
    price: 250,
    image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4',
    rating: 4.9,
    reviews: [
      {
        id: '2',
        userId: '2',
        userName: 'Jane Smith',
        rating: 4,
        comment: 'Perfect for a winter getaway. Very cozy!',
        date: '2024-02-10'
      }
    ]
  },
  {
    id: '3',
    title: 'City Center Apartment',
    location: 'New York City, NY',
    price: 200,
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688',
    rating: 4.7,
    reviews: [
      {
        id: '3',
        userId: '3',
        userName: 'Mike Johnson',
        rating: 5,
        comment: 'Fantastic location, modern amenities!',
        date: '2024-02-05'
      }
    ]
  },
];

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [allProperties, setAllProperties] = useState<Property[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    // Initialize properties with MOCK_PROPERTIES and any user-added properties
    const savedProperties = localStorage.getItem('properties');
    const userProperties = savedProperties ? JSON.parse(savedProperties) : [];
    const combinedProperties = [...MOCK_PROPERTIES, ...userProperties];
    setAllProperties(combinedProperties);
    setProperties(combinedProperties);
  }, []);

  useEffect(() => {
    // Filter properties based on searchQuery
    const filtered = allProperties.filter(
      (property) =>
        property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        property.location.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setProperties(filtered);
  }, [searchQuery, allProperties]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleAddProperty = (newProperty: Property) => {
    const savedProperties = localStorage.getItem('properties');
    const existingProperties = savedProperties ? JSON.parse(savedProperties) : [];
    const updatedProperties = [...existingProperties, newProperty];
    localStorage.setItem('properties', JSON.stringify(updatedProperties));
    const combinedProperties = [...MOCK_PROPERTIES, ...updatedProperties];
    setAllProperties(combinedProperties);
    setIsCreateModalOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900">
          Find your perfect stay
        </h1>
        {user && (
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Property
          </button>
        )}
      </div>

      <div className="mb-12">
        <SearchBar onSearch={handleSearch} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>

      {properties.length === 0 && (
        <div className="text-center py-10">
          <p className="text-gray-500">No properties found matching your search.</p>
        </div>
      )}

      {isCreateModalOpen && (
        <CreateProperty
          onClose={() => setIsCreateModalOpen(false)}
          onSave={handleAddProperty}
        />
      )}
    </div>
  );
}
