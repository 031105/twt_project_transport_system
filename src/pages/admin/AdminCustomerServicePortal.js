import React, { useEffect, useState } from 'react';
import { format, addDays } from 'date-fns';
import { 
  MapPin, 
  Clock, 
  Search,
  Calendar,
  Bus
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';

const AdminCustomerServicePortal = () => {
  const { 
    searchTrips, 
    searchResults, 
    searchParams, 
    isLoading, 
    selectTrip, 
    loadAllTrips, 
    addNotification, 
    locations, 
    systemDate 
  } = useApp();
  
  const navigate = useNavigate();
  
  // Search form state
  const [searchForm, setSearchForm] = useState({
    origin: searchParams.origin || '',
    destination: searchParams.destination || '',
    date: searchParams.date || systemDate
  });
  
  // Load all trips when component mounts only once
  useEffect(() => {
    // Only load trips once when the component mounts
    loadAllTrips();
    // No dependencies array to ensure it only runs once
  }, []);
  
  // Update search form when searchParams change
  useEffect(() => {
    setSearchForm({
      origin: searchParams.origin || '',
      destination: searchParams.destination || '',
      date: searchParams.date || systemDate
    });
  }, [searchParams, systemDate]);
  
  const handleSearch = async (e) => {
    e.preventDefault();
    
    try {
      await searchTrips(searchForm);
    } catch (error) {
      addNotification({
        type: 'error',
        message: 'Search failed. Please try again.'
      });
    }
  };
  
  const handleSelectTrip = async (trip) => {
    try {
      await selectTrip(trip);
      navigate(`/trip/${trip.id}`);
    } catch (error) {
      console.error('Failed to select trip:', error);
    }
  };
  
  // Get location names for display
  const getLocationName = (locationId) => {
    const location = locations.find(loc => loc.id === locationId);
    return location ? location.city : 'Unknown';
  };

  // Duration formatting helper
  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };
  
  // Safe format function to handle invalid date values
  const safeFormatTime = (dateStr, timeStr) => {
    try {
      if (!dateStr || !timeStr) return '--:--';
      const dateTime = new Date(`${dateStr}T${timeStr}`);
      // Check if date is valid
      if (isNaN(dateTime.getTime())) return '--:--';
      return format(dateTime, 'HH:mm');
    } catch (error) {
      console.error('Error formatting time:', error);
      return '--:--';
    }
  };
  
  // Safe format for date strings
  const safeFormatDate = (date, formatStr) => {
    try {
      if (!date) return '';
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      if (isNaN(dateObj.getTime())) return '';
      return format(dateObj, formatStr);
    } catch (error) {
      console.error('Error formatting date:', error);
      return '';
    }
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Searching for trips...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Customer Service Portal</h1>
      
      {/* Search Form */}
      <div className="bg-white shadow rounded-lg mb-6 p-4">
        <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* From */}
          <div>
            <div className="flex items-center mb-2">
              <MapPin className="w-5 h-5 text-gray-500 mr-2" />
              <label className="text-gray-700 font-medium">From</label>
            </div>
            <select
              value={searchForm.origin}
              onChange={(e) => setSearchForm(prev => ({ ...prev, origin: e.target.value }))}
              className="w-full border border-gray-300 rounded-md p-2"
            >
              <option value="">Select origin</option>
              {locations.map(location => (
                <option key={location.id} value={location.id}>
                  {location.city}
                </option>
              ))}
            </select>
          </div>
          
          {/* To */}
          <div>
            <div className="flex items-center mb-2">
              <MapPin className="w-5 h-5 text-gray-500 mr-2" />
              <label className="text-gray-700 font-medium">To</label>
            </div>
            <select
              value={searchForm.destination}
              onChange={(e) => setSearchForm(prev => ({ ...prev, destination: e.target.value }))}
              className="w-full border border-gray-300 rounded-md p-2"
            >
              <option value="">Select destination</option>
              {locations.map(location => (
                <option key={location.id} value={location.id}>
                  {location.city}
                </option>
              ))}
            </select>
          </div>
          
          {/* Date */}
          <div>
            <div className="flex items-center mb-2">
              <Calendar className="w-5 h-5 text-gray-500 mr-2" />
              <label className="text-gray-700 font-medium">Date</label>
            </div>
            <input
              type="date"
              value={searchForm.date}
              onChange={(e) => setSearchForm(prev => ({ ...prev, date: e.target.value }))}
              min={systemDate}
              max={safeFormatDate(addDays(new Date(systemDate || new Date()), 90), 'yyyy-MM-dd')}
              className="w-full border border-gray-300 rounded-md p-2"
            />
          </div>
          
          {/* Search Button */}
          <div className="flex items-end">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md flex items-center justify-center"
            >
              <Search className="w-5 h-5 mr-2" />
              Search
            </button>
          </div>
        </form>
      </div>
      
      {/* Search Results */}
      <div className="bg-white shadow rounded-lg mb-6 p-4">
        <div className="flex flex-col md:flex-row justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold">{searchParams.origin && searchParams.destination ? 'Search Results' : 'All Available Trips'}</h2>
            <p className="text-gray-600">
              {searchParams.origin && searchParams.destination 
                ? `${getLocationName(searchParams.origin)} to ${getLocationName(searchParams.destination)}`
                : 'Showing all available trips across Malaysia'}
            </p>
          </div>
          <div className="mt-2 md:mt-0">
            <p className="text-gray-600">
              Found <span className="font-semibold">{searchResults.length}</span> trips
            </p>
          </div>
        </div>
        
        {/* Trip Cards */}
        <div className="space-y-4">
          {searchResults.map((trip) => (
            <div key={trip.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex flex-col md:flex-row justify-between">
                <div>
                  <h3 className="text-lg font-bold">{trip.route?.name || 'Unknown Route'}</h3>
                  <p className="text-gray-600">
                    {trip.originLocation?.city || 'Unknown'} → {trip.destinationLocation?.city || 'Unknown'}
                  </p>
                </div>
                <div className="text-right mt-2 md:mt-0">
                  <div className="text-2xl font-bold text-blue-600">
                    RM {trip.price ? trip.price.toFixed(2) : '0.00'}
                  </div>
                  <p className="text-gray-500">per person</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
                <div>
                  <p className="text-gray-600 text-sm">Departure</p>
                  <p className="font-semibold">
                    {(() => {
                      try {
                        return trip.departureDatetime ? format(new Date(trip.departureDatetime), 'HH:mm') : '--:--';
                      } catch (error) {
                        return '--:--';
                      }
                    })()}
                  </p>
                </div>
                
                <div>
                  <p className="text-gray-600 text-sm">Arrival</p>
                  <p className="font-semibold">
                    {(() => {
                      try {
                        const arrivalTime = trip.estimatedArrivalDatetime || trip.arrivalDatetime;
                        return arrivalTime ? format(new Date(arrivalTime), 'HH:mm') : '--:--';
                      } catch (error) {
                        return '--:--';
                      }
                    })()}
                  </p>
                </div>
                
                <div>
                  <p className="text-gray-600 text-sm">Available</p>
                  <p className="font-semibold">{trip.availableSeats} seats</p>
                </div>
                
                <div>
                  <p className="text-gray-600 text-sm">Vehicle</p>
                  <p className="font-semibold">
                    {trip.vehicleType?.name || 'Standard Bus'}
                  </p>
                </div>
              </div>
              
              <div className="border-t border-gray-200 mt-4 pt-4 flex justify-between items-center">
                <div className="text-sm text-gray-600">
                  <Clock className="w-4 h-4 inline-block mr-1" />
                  Duration: {
                    trip.route?.estimatedDurationMinutes 
                      ? `${Math.floor(trip.route.estimatedDurationMinutes / 60)}h ${trip.route.estimatedDurationMinutes % 60}m`
                      : trip.route?.durationHours 
                        ? `${trip.route.durationHours}h`
                        : '--'
                  } • 
                  Distance: {trip.route?.distanceKm || trip.route?.distance_km || '--'} km
                </div>
                
                {trip.availableSeats > 0 ? (
                  <button
                    onClick={() => handleSelectTrip(trip)}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md"
                  >
                    Select Seats
                  </button>
                ) : (
                  <button
                    disabled
                    className="bg-gray-300 text-gray-500 font-medium py-2 px-4 rounded-md cursor-not-allowed"
                  >
                    Sold Out
                  </button>
                )}
              </div>
            </div>
          ))}
          
          {searchResults.length === 0 && (
            <div className="text-center py-12">
              <Bus className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-700">No trips found</h3>
              <p className="text-gray-500 mt-2">Try adjusting your search criteria</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminCustomerServicePortal; 