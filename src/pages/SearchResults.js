import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { format, addDays } from 'date-fns';
import { 
  MapPin, 
  Clock, 
  Users, 
  ArrowRight, 
  Filter,
  Calendar,
  Bus,
  Search
} from 'lucide-react';
import { useApp } from '../context/AppContext';

const SearchResults = () => {
  const { searchResults, searchParams, isLoading, selectTrip, loadAllTrips, searchTrips, addNotification, locations, systemDate } = useApp();
  const navigate = useNavigate();
  
  // Search form state
  const [searchForm, setSearchForm] = useState({
    origin: searchParams.origin || '',
    destination: searchParams.destination || '',
    date: searchParams.date || systemDate
  });
  
  // Load all trips when component mounts if no search has been performed
  useEffect(() => {
    if (searchResults.length === 0 && !searchParams.origin && !searchParams.destination && !isLoading) {
      loadAllTrips();
    }
  }, [searchResults.length, searchParams.origin, searchParams.destination, isLoading, loadAllTrips]);
  
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
    
    if (!searchForm.origin || !searchForm.destination) {
      addNotification({
        type: 'warning',
        message: 'Please select both origin and destination'
      });
      return;
    }
    
    if (searchForm.origin === searchForm.destination) {
      addNotification({
        type: 'warning',
        message: 'Origin and destination cannot be the same'
      });
      return;
    }
    
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
    <div className="max-w-6xl mx-auto">
      {/* Compact Search Form */}
      <div className="mb-6">
        <div className="card">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Origin */}
              <div>
                <label className="label text-gray-700 text-sm">
                  <MapPin className="w-4 h-4 inline mr-1" />
                  From
                </label>
                <select
                  value={searchForm.origin}
                  onChange={(e) => setSearchForm(prev => ({ ...prev, origin: e.target.value }))}
                  className="input w-full text-sm"
                >
                  <option value="">Select origin</option>
                  {locations.map(location => (
                    <option key={location.id} value={location.id}>
                      {location.city}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Destination */}
              <div>
                <label className="label text-gray-700 text-sm">
                  <MapPin className="w-4 h-4 inline mr-1" />
                  To
                </label>
                <select
                  value={searchForm.destination}
                  onChange={(e) => setSearchForm(prev => ({ ...prev, destination: e.target.value }))}
                  className="input w-full text-sm"
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
                <label className="label text-gray-700 text-sm">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  Date
                </label>
                <input
                  type="date"
                  value={searchForm.date}
                  onChange={(e) => setSearchForm(prev => ({ ...prev, date: e.target.value }))}
                  min={systemDate}
                  max={format(addDays(new Date(systemDate), 90), 'yyyy-MM-dd')}
                  className="input w-full text-sm"
                />
              </div>
              
              {/* Search Button */}
              <div className="flex items-end">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn-primary w-full py-2 text-sm flex items-center justify-center"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Searching...
                    </>
                  ) : (
                    <>
                      <Search className="w-4 h-4 mr-2" />
                      Search
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
      
      {/* Search Summary */}
      <div className="mb-8">
        <div className="card">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {searchParams.origin && searchParams.destination ? 'Search Results' : 'All Available Trips'}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                {searchParams.origin && searchParams.destination ? (
                  <>
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      {getLocationName(searchParams.origin)} → {getLocationName(searchParams.destination)}
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {searchParams.date && (() => {
                        try {
                          return format(new Date(searchParams.date), 'EEEE, MMM dd, yyyy');
                        } catch (error) {
                          return searchParams.date;
                        }
                      })()}
                    </div>
                  </>
                ) : (
                  <div className="flex items-center">
                    <Bus className="w-4 h-4 mr-1" />
                    Showing all available trips across Malaysia
                  </div>
                )}
              </div>
            </div>
            <div className="mt-4 md:mt-0">
              <div className="flex items-center space-x-4">
                <p className="text-sm text-gray-600">
                  Found <span className="font-semibold text-gray-900">{searchResults.length}</span> trip{searchResults.length !== 1 ? 's' : ''}
                </p>
                {(searchParams.origin || searchParams.destination) && (
                  <button
                    onClick={() => loadAllTrips()}
                    className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                  >
                    View All Trips
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Filters */}
      <div className="mb-6">
        <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
          <Filter className="w-4 h-4" />
          <span>Filters</span>
        </button>
      </div>
      
      {/* Results */}
      {searchResults.length === 0 ? (
        <div className="text-center py-12">
          <Bus className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchParams.origin && searchParams.destination ? 'No trips found' : 'No trips available'}
          </h3>
          <p className="text-gray-600 mb-6">
            {searchParams.origin && searchParams.destination 
              ? "We couldn't find any trips matching your search criteria."
              : "No trips are currently available. Please check back later."
            }
          </p>
          <button
            onClick={() => navigate('/')}
            className="btn-primary"
          >
            {searchParams.origin && searchParams.destination ? 'Search Again' : 'Go Home'}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {searchResults.map((trip) => (
            <div key={trip.id} className="card hover:shadow-lg transition-all duration-300 border-l-4 border-l-primary-500">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between">
                {/* Trip Info */}
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {trip.route?.name || 'Unknown Route'}
                      </h3>
                      <div className="flex items-center text-sm text-gray-600">
                        <span className="font-medium">{trip.originLocation?.city || 'Unknown'}</span>
                        <ArrowRight className="w-4 h-4 mx-2 text-primary-500" />
                        <span className="font-medium">{trip.destinationLocation?.city || 'Unknown'}</span>
                      </div>
                    </div>
                    <div className="mt-2 sm:mt-0 text-right">
                      <div className="text-2xl font-bold text-primary-600">
                        RM {trip.price || trip.route?.basePrice || trip.route?.base_price || 0}
                      </div>
                      <div className="text-sm text-gray-500">per person</div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="flex items-center text-gray-600">
                      <Clock className="w-4 h-4 mr-2 text-primary-500" />
                      <div>
                        <div className="font-medium text-gray-900">Departure</div>
                        <div>
                          {(() => {
                            try {
                              return trip.departureDatetime ? format(new Date(trip.departureDatetime), 'HH:mm') : '--:--';
                            } catch (error) {
                              return '--:--';
                            }
                          })()}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center text-gray-600">
                      <Clock className="w-4 h-4 mr-2 text-primary-500" />
                      <div>
                        <div className="font-medium text-gray-900">Arrival</div>
                        <div>
                          {(() => {
                            try {
                              const arrivalTime = trip.estimatedArrivalDatetime || trip.arrivalDatetime;
                              return arrivalTime ? format(new Date(arrivalTime), 'HH:mm') : '--:--';
                            } catch (error) {
                              return '--:--';
                            }
                          })()}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center text-gray-600">
                      <Users className="w-4 h-4 mr-2 text-primary-500" />
                      <div>
                        <div className="font-medium text-gray-900">Available</div>
                        <div className={trip.availableSeats > 5 ? 'text-success-600' : trip.availableSeats > 0 ? 'text-warning-600' : 'text-danger-600'}>
                          {trip.availableSeats} seats
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center text-gray-600">
                      <Bus className="w-4 h-4 mr-2 text-primary-500" />
                      <div>
                        <div className="font-medium text-gray-900">Vehicle</div>
                        <div>{trip.vehicleType?.name || 'Bus'}</div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Trip Duration */}
                  <div className="mt-4 text-sm text-gray-600">
                    <span className="font-medium">Duration:</span> {
                      trip.route?.estimatedDurationMinutes 
                        ? `${Math.floor(trip.route.estimatedDurationMinutes / 60)}h ${trip.route.estimatedDurationMinutes % 60}m`
                        : trip.route?.durationHours 
                          ? `${trip.route.durationHours}h`
                          : '--'
                    }
                    <span className="mx-2">•</span>
                    <span className="font-medium">Distance:</span> {trip.route?.distanceKm || trip.route?.distance_km || '--'} km
                  </div>
                </div>
                
                {/* Action Button */}
                <div className="mt-6 lg:mt-0 lg:ml-6">
                  <button
                    onClick={() => handleSelectTrip(trip)}
                    className={`w-full lg:w-auto px-8 py-3 rounded-lg font-medium transition-colors ${
                      trip.availableSeats === 0 
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                        : 'btn-primary'
                    }`}
                    disabled={trip.availableSeats === 0}
                  >
                    {trip.availableSeats === 0 ? 'Sold Out' : 'Select Seats'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchResults; 