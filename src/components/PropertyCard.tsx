import { useState } from 'react';
import { Star, Share2, Heart, MessageCircle, MapPin, X } from 'lucide-react';
import { Property, Reservation, Review } from '../types';
import { useAuth } from '../context/AuthContext';
import ReservationForm from './ReservationForm';

interface PropertyCardProps {
  property: Property;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const { user } = useAuth();
  const [isSaved, setIsSaved] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState('');

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: property.title,
        text: `Check out ${property.title} in ${property.location}`,
        url: window.location.href,
      }).catch((error) => console.log('Error sharing', error));
    }
  };

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      alert('Please login to save properties');
      return;
    }
    setIsSaved(!isSaved);
  };

  const handleReservation = (reservation: Reservation) => {
    const savedReservations = localStorage.getItem('reservations');
    const reservations = savedReservations ? JSON.parse(savedReservations) : [];
    const updatedReservations = [...reservations, reservation];
    localStorage.setItem('reservations', JSON.stringify(updatedReservations));
    setShowModal(false);
    alert('Reservation submitted successfully!');
  };

  const handleAddReview = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      alert('Please login to add a review');
      return;
    }
    setShowReviewModal(true);
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || rating === 0) return;

    const newReview: Review = {
      id: Date.now().toString(),
      userId: user.id,
      userName: user.name,
      rating,
      comment,
      date: new Date().toISOString(),
    };

    // Update property reviews in localStorage
    const savedProperties = localStorage.getItem('properties');
    const properties = savedProperties ? JSON.parse(savedProperties) : [];
    const updatedProperties = properties.map((p: Property) => {
      if (p.id === property.id) {
        return {
          ...p,
          reviews: [...p.reviews, newReview],
          rating: ((p.rating * p.reviews.length) + rating) / (p.reviews.length + 1)
        };
      }
      return p;
    });
    localStorage.setItem('properties', JSON.stringify(updatedProperties));

    setShowReviewModal(false);
    setRating(0);
    setComment('');
    window.location.reload(); // Refresh to show new review
  };

  return (
    <>
      <div 
        onClick={() => setShowModal(true)}
        className="rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-white cursor-pointer group"
      >
        <div className="relative">
          <img 
            src={property.image} 
            alt={property.title}
            className="w-full h-48 object-cover group-hover:brightness-95 transition-all duration-300"
          />
          <div className="absolute top-2 right-2 flex gap-2">
            <button 
              onClick={handleShare}
              className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors transform hover:scale-105"
              title="Share property"
            >
              <Share2 className="w-5 h-5 text-gray-600" />
            </button>
            <button 
              onClick={handleSave}
              className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors transform hover:scale-105"
              title={isSaved ? "Remove from saved" : "Save property"}
            >
              <Heart className={`w-5 h-5 ${isSaved ? 'text-rose-500 fill-current' : 'text-gray-600'}`} />
            </button>
          </div>
          <div className="absolute bottom-2 left-2 bg-white px-2 py-1 rounded-full text-sm font-medium text-gray-800 shadow-md">
            ${property.price}/night
          </div>
        </div>
        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold text-lg group-hover:text-rose-600 transition-colors">
              {property.title}
            </h3>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                handleAddReview(e);
              }}
              className="flex items-center gap-1 hover:bg-rose-50 rounded-full px-2 py-1 transition-colors"
            >
              <Star className={`w-5 h-5 ${property.rating >= 4.5 ? 'text-yellow-400 fill-current' : 'text-yellow-400'}`} />
              <span className="font-medium text-gray-700">{property.rating.toFixed(1)}</span>
            </button>
          </div>
          <p className="text-gray-500 text-sm flex items-center mb-3">
            <MapPin className="w-4 h-4 mr-1" />
            {property.location}
          </p>
          <div className="flex justify-between items-center pt-2 border-t border-gray-100">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleAddReview(e);
              }}
              className="flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors"
            >
              <Star className="w-4 h-4" />
              <span>Rate now</span>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleAddReview(e);
              }}
              className="flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              <MessageCircle className="w-4 h-4 text-gray-600" />
              <span className="text-gray-600">{property.reviews.length} reviews</span>
            </button>
          </div>
        </div>
      </div>

      {showReviewModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">Rate & Review</h3>
              <button
                onClick={() => setShowReviewModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitReview} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Rating
                </label>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setRating(value)}
                      onMouseEnter={() => setHoveredRating(value)}
                      onMouseLeave={() => setHoveredRating(0)}
                      className="p-1 transition-colors focus:outline-none"
                    >
                      <Star 
                        className={`w-8 h-8 ${
                          value <= (hoveredRating || rating)
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        } transition-colors`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
                  Your Review
                </label>
                <textarea
                  id="comment"
                  required
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent resize-none"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share your experience..."
                />
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowReviewModal(false)}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={rating === 0}
                  className="px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Submit Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex">
              <div className="w-2/3 p-6 border-r border-gray-200">
                <div className="relative">
                  <button
                    onClick={() => setShowModal(false)}
                    className="absolute top-0 right-0 p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>

                  <img 
                    src={property.image} 
                    alt={property.title}
                    className="w-full h-64 object-cover rounded-xl mb-6"
                  />

                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">{property.title}</h2>
                    <div className="flex items-center text-gray-600 mb-4">
                      <MapPin className="w-5 h-5 mr-2" />
                      <span>{property.location}</span>
                    </div>
                    <div className="flex items-center">
                      <Star className="w-5 h-5 fill-current text-yellow-400 mr-1" />
                      <span className="font-medium mr-1">{property.rating.toFixed(1)}</span>
                      <span className="text-gray-600">({property.reviews.length} reviews)</span>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold">Reviews</h3>
                      <button
                        onClick={handleAddReview}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors"
                      >
                        <Star className="w-4 h-4" />
                        <span>Add Review</span>
                      </button>
                    </div>
                    <div className="space-y-4">
                      {property.reviews.map((review) => (
                        <div key={review.id} className="bg-gray-50 p-4 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <p className="font-medium">{review.userName}</p>
                            <div className="flex items-center">
                              <Star className="w-4 h-4 fill-current text-yellow-400 mr-1" />
                              <span>{review.rating}</span>
                            </div>
                          </div>
                          <p className="text-gray-600">{review.comment}</p>
                          <p className="text-sm text-gray-500 mt-1">
                            {new Date(review.date).toLocaleDateString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="w-1/3 p-6">
                <h3 className="text-xl font-semibold mb-4">Make a Reservation</h3>
                <ReservationForm 
                  property={property}
                  onSubmit={handleReservation}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}