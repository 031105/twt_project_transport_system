import React, { useState, useEffect } from 'react';
import { Star, ChevronRight, MapPin, Clock, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { getPopularTrips } from '../../services/adminApi';

const PopularTrips = ({ onTripSelect }) => {
  const [loading, setLoading] = useState(true);
  const [trips, setTrips] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPopularTrips = async () => {
      setLoading(true);
      try {
        // 使用真实API获取热门行程数据
        const response = await getPopularTrips();
        if (response.success) {
          setTrips(response.data);
        } else {
          setError(response.error || 'Failed to fetch popular trips');
        }
        setLoading(false);
      } catch (err) {
        console.error('Error fetching popular trips:', err);
        setError('An error occurred while fetching popular trips');
        setLoading(false);
      }
    };

    fetchPopularTrips();
  }, []);

  const handleTripClick = (trip) => {
    if (onTripSelect) {
      onTripSelect(trip);
    }
  };

  if (loading) {
    return (
      <div className="p-4 text-center">
        <div className="spinner"></div>
        <p className="mt-2 text-gray-600">Loading popular trips...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center">
        <div className="text-red-500 mb-2">Error: {error}</div>
        <button 
          className="text-blue-500 underline"
          onClick={() => window.location.reload()}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Popular Trips</h2>
        <div className="text-sm text-gray-500">
          Showing most booked trips
        </div>
      </div>

      <div className="space-y-4">
        {trips.length > 0 ? trips.map((trip) => (
          <div 
            key={trip.id}
            className="card hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => handleTripClick(trip)}
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-lg text-gray-900">{trip.route.name}</h3>
                <div className="flex items-center mt-1 text-sm text-gray-600">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span>{trip.origin} → {trip.destination}</span>
                </div>
              </div>
              <div className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full flex items-center">
                <Star className="w-3 h-3 mr-1" />
                {trip.bookingCount || 0} bookings
              </div>
            </div>
            
            <div className="flex justify-between mt-4 text-sm">
              <div className="flex items-center text-gray-500">
                <Clock className="w-4 h-4 mr-1" />
                {trip.departureTime}
              </div>
              <div className="flex items-center text-gray-500">
                <Calendar className="w-4 h-4 mr-1" />
                {trip.date ? format(new Date(trip.date), 'dd MMM yyyy') : 'N/A'}
              </div>
              <div className="font-medium">{typeof trip.price === 'number' ? `RM ${trip.price.toFixed(2)}` : trip.price}</div>
            </div>
            
            <div className="mt-3 flex justify-end">
              <button className="text-blue-600 text-sm flex items-center hover:text-blue-800">
                View Details
                <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            </div>
          </div>
        )) : (
          <div className="text-center py-6">
            <p className="text-gray-500">No popular trips found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PopularTrips; 