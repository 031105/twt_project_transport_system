import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { format, addDays } from 'date-fns';
import { 
  MapPin, 
  Calendar, 
  Search, 
  ArrowRight, 
  Clock, 
  Shield, 
  CreditCard, 
  Star,
  Users,
  Zap,
  CheckCircle,
  ArrowUpDown,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { validateLocationsDifferent, validateDateRange } from '../utils/validation';

const HomePage = () => {
  const { searchTrips, addNotification, locations, locationsLoading, searchResults, loadAllTrips, systemDate } = useApp();
  const navigate = useNavigate();
  
  const [searchForm, setSearchForm] = useState({
    origin: '',
    destination: '',
    date: systemDate,
    returnDate: format(addDays(new Date(systemDate), 1), 'yyyy-MM-dd'),
    isRoundTrip: false
  });
  const [isSearching, setIsSearching] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  
  // Helper function to get location name by ID
  const getLocationName = (locationId) => {
    if (!locationId) return '';
    const location = locations.find(loc => loc.id === locationId);
    return location ? location.city : '';
  };
  
  const handleSearchChange = (field, value) => {
    setSearchForm(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear errors when user makes changes
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }

    // Real-time validation for touched fields
    if (touched[field]) {
      validateSingleField(field, value);
    }
  };

  const validateSingleField = (field, value) => {
    let error = null;

    switch (field) {
      case 'origin':
      case 'destination':
        if (!value) {
          error = 'Please select a location';
        } else if (field === 'destination' && searchForm.origin === value) {
          error = 'Destination must be different from origin';
        } else if (field === 'origin' && searchForm.destination === value) {
          error = 'Origin must be different from destination';
        }
        break;
      case 'date':
        if (!value) {
          error = 'Please select a departure date';
        } else {
          const selectedDate = new Date(value);
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          if (selectedDate < today) {
            error = 'Departure date must be today or later';
          }
        }
        break;
      case 'returnDate':
        if (searchForm.isRoundTrip) {
          if (!value) {
            error = 'Please select a return date';
          } else if (searchForm.date && value <= searchForm.date) {
            error = 'Return date must be after departure date';
          }
        }
        break;
    }

    setErrors(prev => ({
      ...prev,
      [field]: error
    }));

    return error;
  };

  const handleFieldBlur = (field) => {
    setTouched(prev => ({
      ...prev,
      [field]: true
    }));
    validateSingleField(field, searchForm[field]);
  };
  
  const handleSwapLocations = () => {
    setSearchForm(prev => ({
      ...prev,
      origin: prev.destination,
      destination: prev.origin
    }));
  };
  
  const handleSearch = async (e) => {
    e.preventDefault();
    
    // Validate all fields
    const fieldsToValidate = ['origin', 'destination', 'date'];
    if (searchForm.isRoundTrip) {
      fieldsToValidate.push('returnDate');
    }

    let hasErrors = false;
    const newErrors = {};

    fieldsToValidate.forEach(field => {
      const error = validateSingleField(field, searchForm[field]);
      if (error) {
        newErrors[field] = error;
        hasErrors = true;
      }
    });

    // Mark all fields as touched
    setTouched(fieldsToValidate.reduce((acc, field) => {
      acc[field] = true;
      return acc;
    }, {}));

    if (hasErrors) {
      addNotification({
        type: 'warning',
        message: 'Please fix the errors below before searching'
      });
      return;
    }
    
    setIsSearching(true);
    
    try {
      await searchTrips(searchForm);
      navigate('/search');
    } catch (error) {
      addNotification({
        type: 'error',
        message: 'Search failed. Please try again.'
      });
    } finally {
      setIsSearching(false);
    }
  };
  
  // Load popular routes from database on component mount
  React.useEffect(() => {
    const loadPopularRoutes = async () => {
      try {
        await loadAllTrips();
      } catch (error) {
        console.error('Failed to load popular routes:', error);
      }
    };
    
    loadPopularRoutes();
  }, []);
  
  // Extract unique routes from search results for popular routes
  const uniqueRoutes = React.useMemo(() => {
    const routeMap = new Map();
    searchResults.forEach(trip => {
      if (trip.route && !routeMap.has(trip.route.id)) {
        routeMap.set(trip.route.id, {
          id: trip.route.id,
          name: trip.route.name,
          origin: trip.originLocation.city,
          destination: trip.destinationLocation.city,
          price: trip.price,
          duration: `${trip.route.durationHours}h`,
          distance: `${trip.route.distanceKm}km`,
          next_departure: trip.next_departure
        });
      }
    });
    return Array.from(routeMap.values()).slice(0, 3); // Show top 3 routes
  }, [searchResults]);
  
  const features = [
    {
      icon: <Search className="w-6 h-6" />,
      title: 'Easy Search',
      description: 'Find and compare bus routes across Malaysia with our intelligent search system'
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: 'Secure Booking',
      description: 'Your personal information and payments are protected with industry-standard security'
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: '24/7 Support',
      description: 'Get help anytime with our round-the-clock customer support team'
    },
    {
      icon: <CreditCard className="w-6 h-6" />,
      title: 'Flexible Payment',
      description: 'Multiple payment options including credit cards, debit cards, and e-wallets'
    }
  ];
  
  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Travel Malaysia with
              <span className="block text-primary-200">Confidence</span>
            </h1>
            <p className="text-xl sm:text-2xl text-primary-100 max-w-3xl mx-auto leading-relaxed">
              Book your bus tickets online in seconds. Comfortable, reliable, and affordable transportation across Malaysia.
            </p>
          </div>
          
          {/* Search Form */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-2xl p-6 lg:p-8">
              <form onSubmit={handleSearch} className="space-y-6">
                {/* Trip Type Toggle */}
                <div className="flex items-center justify-center">
                  <div className="bg-gray-100 rounded-lg p-1 flex">
                    <button
                      type="button"
                      onClick={() => handleSearchChange('isRoundTrip', false)}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                        !searchForm.isRoundTrip
                          ? 'bg-white text-primary-600 shadow-sm'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      One Way
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSearchChange('isRoundTrip', true)}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                        searchForm.isRoundTrip
                          ? 'bg-white text-primary-600 shadow-sm'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      Round Trip
                    </button>
                  </div>
                </div>

                <div className={`grid ${searchForm.isRoundTrip ? 'grid-cols-1 md:grid-cols-5' : 'grid-cols-1 md:grid-cols-4'} gap-4 lg:gap-6 items-end`}>
                  {/* Origin */}
                  <div className="space-y-2">
                    <label className="label text-gray-700">
                      <MapPin className="w-4 h-4 inline mr-2" />
                      From
                    </label>
                    <div className="relative">
                      <select
                        value={searchForm.origin}
                        onChange={(e) => handleSearchChange('origin', e.target.value)}
                        onBlur={() => handleFieldBlur('origin')}
                        className={`input w-full bg-white text-gray-900 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 ${
                          errors.origin 
                            ? 'border-red-500 focus:ring-red-500' 
                            : touched.origin && searchForm.origin 
                              ? 'border-green-500 focus:ring-green-500' 
                              : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500'
                        }`}
                        required
                      >
                        <option value="" disabled>Select origin</option>
                        {locations.map(location => (
                          <option key={location.id} value={location.id}>
                            {location.city}
                          </option>
                        ))}
                      </select>
                      {touched.origin && searchForm.origin && !errors.origin && (
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        </div>
                      )}
                    </div>
                    {errors.origin && (
                      <div className="flex items-center text-sm text-red-600">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.origin}
                      </div>
                    )}
                  </div>
                  
                  {/* Swap Button - Dedicated Column */}
                  <div className="hidden md:flex justify-center items-center pb-1">
                    <button
                      type="button"
                      onClick={handleSwapLocations}
                      className="w-10 h-10 bg-white border-2 border-gray-200 rounded-full flex items-center justify-center text-gray-600 hover:text-primary-600 hover:border-primary-300 transition-colors shadow-sm"
                      title="Swap origin and destination"
                      disabled={!searchForm.origin || !searchForm.destination}
                    >
                      <ArrowUpDown className="w-4 h-4" />
                    </button>
                  </div>
                  
                  {/* Destination */}
                  <div className="space-y-2">
                    <label className="label text-gray-700 flex items-center justify-between">
                      <span>
                        <MapPin className="w-4 h-4 inline mr-2" />
                        To
                      </span>
                      {/* Mobile Swap Button */}
                      <button
                        type="button"
                        onClick={handleSwapLocations}
                        className="md:hidden text-sm text-primary-600 hover:text-primary-700 flex items-center"
                        disabled={!searchForm.origin || !searchForm.destination}
                      >
                        <ArrowUpDown className="w-3 h-3 mr-1" />
                        Swap
                      </button>
                    </label>
                    <div className="relative">
                      <select
                        value={searchForm.destination}
                        onChange={(e) => handleSearchChange('destination', e.target.value)}
                        onBlur={() => handleFieldBlur('destination')}
                        className={`input w-full bg-white text-gray-900 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 ${
                          errors.destination 
                            ? 'border-red-500 focus:ring-red-500' 
                            : touched.destination && searchForm.destination 
                              ? 'border-green-500 focus:ring-green-500' 
                              : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500'
                        }`}
                        required
                      >
                        <option value="" disabled>Select destination</option>
                        {locations.map(location => (
                          <option key={location.id} value={location.id}>
                            {location.city}
                          </option>
                        ))}
                      </select>
                      {touched.destination && searchForm.destination && !errors.destination && (
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        </div>
                      )}
                    </div>
                    {errors.destination && (
                      <div className="flex items-center text-sm text-red-600">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.destination}
                      </div>
                    )}
                  </div>
                  
                  {/* Departure Date */}
                  <div className="space-y-2">
                    <label className="label text-gray-700">
                      <Calendar className="w-4 h-4 inline mr-2" />
                      Departure Date
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        value={searchForm.date}
                        onChange={(e) => handleSearchChange('date', e.target.value)}
                        onBlur={() => handleFieldBlur('date')}
                        min={systemDate}
                        max={format(addDays(new Date(systemDate), 90), 'yyyy-MM-dd')}
                        className={`input w-full ${
                          errors.date 
                            ? 'border-red-500 focus:ring-red-500' 
                            : touched.date && searchForm.date 
                              ? 'border-green-500 focus:ring-green-500' 
                              : ''
                        }`}
                        required
                      />
                      {touched.date && searchForm.date && !errors.date && (
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        </div>
                      )}
                    </div>
                    {errors.date && (
                      <div className="flex items-center text-sm text-red-600">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.date}
                      </div>
                    )}
                  </div>

                  {/* Return Date - Only show for round trip */}
                  {searchForm.isRoundTrip && (
                    <div className="space-y-2">
                      <label className="label text-gray-700">
                        <Calendar className="w-4 h-4 inline mr-2" />
                        Return Date
                      </label>
                      <div className="relative">
                        <input
                          type="date"
                          value={searchForm.returnDate}
                          onChange={(e) => handleSearchChange('returnDate', e.target.value)}
                          onBlur={() => handleFieldBlur('returnDate')}
                          min={searchForm.date || format(addDays(new Date(systemDate), 1), 'yyyy-MM-dd')}
                          max={format(addDays(new Date(systemDate), 90), 'yyyy-MM-dd')}
                          className={`input w-full ${
                            errors.returnDate 
                              ? 'border-red-500 focus:ring-red-500' 
                              : touched.returnDate && searchForm.returnDate 
                                ? 'border-green-500 focus:ring-green-500' 
                                : ''
                          }`}
                          required={searchForm.isRoundTrip}
                        />
                        {touched.returnDate && searchForm.returnDate && !errors.returnDate && (
                          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          </div>
                        )}
                      </div>
                      {errors.returnDate && (
                        <div className="flex items-center text-sm text-red-600">
                          <AlertCircle className="h-4 w-4 mr-1" />
                          {errors.returnDate}
                        </div>
                      )}
                    </div>
                  )}
                </div>
                
                <button
                  type="submit"
                  disabled={isSearching}
                  className="w-full btn-primary text-lg py-4 relative flex items-center justify-center"
                >
                  {isSearching ? (
                    <>
                      <div className="spinner mr-3" />
                      Searching...
                    </>
                  ) : (
                    <>
                      <Search className="w-5 h-5 mr-3" />
                      Search Buses
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">
            <div className="text-center">
              <div className="text-3xl lg:text-4xl font-bold text-primary-200 mb-2">1000+</div>
              <div className="text-primary-100">Happy Customers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl lg:text-4xl font-bold text-primary-200 mb-2">50+</div>
              <div className="text-primary-100">Routes Available</div>
            </div>
            <div className="text-center">
              <div className="text-3xl lg:text-4xl font-bold text-primary-200 mb-2">24/7</div>
              <div className="text-primary-100">Customer Support</div>
            </div>
            <div className="text-center">
              <div className="text-3xl lg:text-4xl font-bold text-primary-200 mb-2">99%</div>
              <div className="text-primary-100">On-Time Departure</div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Popular Routes Section */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Popular Routes
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover our most traveled routes with frequent departures and competitive prices
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {uniqueRoutes.map((route, index) => (
              <div 
                key={route.id}
                className="card hover:shadow-lg transition-shadow duration-300 cursor-pointer group"
                onClick={() => {
                  // Auto-fill search form with popular route and perform search
                  const originLocation = locations.find(l => l.city === route.origin);
                  const destinationLocation = locations.find(l => l.city === route.destination);
                  
                  if (originLocation && destinationLocation) {
                    // Use the route's next departure date or fall back to system date
                    const searchDate = route.next_departure 
                      ? new Date(route.next_departure).toISOString().split('T')[0] 
                      : systemDate;
                    
                    const searchParams = {
                      origin: originLocation.id,
                      destination: destinationLocation.id,
                      date: searchDate,
                      isRoundTrip: false
                    };
                    
                    // Perform search and navigate
                    searchTrips(searchParams).then(() => {
                      navigate('/search');
                    }).catch(error => {
                      addNotification({
                        type: 'error',
                        message: 'Search failed. Please try again.'
                      });
                    });
                  }
                }}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900 group-hover:text-primary-600 transition-colors">
                      {route.name}
                    </h3>
                    <p className="text-gray-600 text-sm mt-1">
                      {route.origin} → {route.destination}
                    </p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-primary-600 transition-colors" />
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-primary-600">
                      RM {route.price}
                    </span>
                    <span className="text-sm text-gray-500">per person</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {route.duration}
                    </div>
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-1" />
                      {route.distance}
                    </div>
                  </div>
                  
                  {/* Display next departure date and time */}
                  {route.next_departure && (
                    <div className="mt-2 text-sm bg-green-50 text-green-700 p-2 rounded flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      Next trip: {format(new Date(route.next_departure), 'dd MMM yyyy, HH:mm')}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Why Choose TransportBook?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We make bus travel simple, safe, and convenient for everyone
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6 text-primary-600">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 lg:py-24 bg-primary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers who trust us for their travel needs
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => document.querySelector('form').scrollIntoView({ behavior: 'smooth' })}
              className="bg-white text-primary-600 hover:bg-primary-50 font-semibold px-8 py-4 rounded-lg transition-colors duration-200"
            >
              Book Your Trip Now
            </button>
            <button className="border-2 border-white text-white hover:bg-white hover:text-primary-600 font-semibold px-8 py-4 rounded-lg transition-colors duration-200">
              Learn More
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage; 