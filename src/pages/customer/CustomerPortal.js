import React, { useState, useEffect } from 'react';
import { Calendar, User, CreditCard, Search, Star, ChevronRight, MapPin } from 'lucide-react';
import { format } from 'date-fns';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { getLocations, searchTrips } from '../../services/api';

const CustomerPortal = () => {
  const [step, setStep] = useState(1);
  const [locations, setLocations] = useState([]);
  const [fromLocation, setFromLocation] = useState('');
  const [toLocation, setToLocation] = useState('');
  const [departureDate, setDepartureDate] = useState(new Date());
  const [passengers, setPassengers] = useState(1);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [popularTrips, setPopularTrips] = useState([
    {
      id: '1',
      route: { name: 'KL - Johor Bahru Express' },
      origin: 'Kuala Lumpur',
      destination: 'Johor Bahru',
      departureTime: '08:00 AM',
      price: 'RM 45.00'
    },
    {
      id: '2',
      route: { name: 'KL - Penang Highway' },
      origin: 'Kuala Lumpur',
      destination: 'Penang',
      departureTime: '09:30 AM',
      price: 'RM 55.00'
    },
    {
      id: '3',
      route: { name: 'KL - Malacca Direct' },
      origin: 'Kuala Lumpur',
      destination: 'Malacca',
      departureTime: '10:15 AM',
      price: 'RM 35.00'
    }
  ]);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await getLocations();
        if (response.success) {
          setLocations(response.data);
        }
      } catch (error) {
        console.error('Error fetching locations:', error);
      }
    };

    fetchLocations();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await searchTrips({
        fromLocationId: fromLocation,
        toLocationId: toLocation,
        departureDate: format(departureDate, 'yyyy-MM-dd'),
        passengers
      });

      if (response.success) {
        setSearchResults(response.data);
        // Proceed to next step if results are found
        if (response.data.length > 0) {
          setStep(2);
        }
      }
    } catch (error) {
      console.error('Error searching trips:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePopularTripSelect = (trip) => {
    // 根据热门行程设置表单值
    const fromLoc = locations.find(loc => loc.city === trip.origin);
    const toLoc = locations.find(loc => loc.city === trip.destination);
    
    if (fromLoc) setFromLocation(fromLoc.id);
    if (toLoc) setToLocation(toLoc.id);
    
    // 自动搜索
    handleSearch({ preventDefault: () => {} });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Customer Service Portal</h1>
      <p className="text-gray-600 mb-8">Help walk-in customers purchase tickets quickly and efficiently</p>

      <div className="flex items-center mb-8">
        <div className={`step-item ${step >= 1 ? 'active' : ''}`}>
          <div className="step-number">1</div>
          <div className="step-label">Search Trips</div>
        </div>
        <div className="step-connector"></div>
        <div className={`step-item ${step >= 2 ? 'active' : ''}`}>
          <div className="step-number">2</div>
          <div className="step-label">Select Trip</div>
        </div>
        <div className="step-connector"></div>
        <div className={`step-item ${step >= 3 ? 'active' : ''}`}>
          <div className="step-number">3</div>
          <div className="step-label">Customer Info</div>
        </div>
        <div className="step-connector"></div>
        <div className={`step-item ${step >= 4 ? 'active' : ''}`}>
          <div className="step-number">4</div>
          <div className="step-label">Payment</div>
        </div>
      </div>

      {step === 1 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="card">
              <h2 className="text-xl font-semibold mb-4">Search Available Trips</h2>
              
              <form onSubmit={handleSearch}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">From</label>
                    <select
                      value={fromLocation}
                      onChange={(e) => setFromLocation(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      required
                    >
                      <option value="">Select departure location</option>
                      {locations.map(location => (
                        <option key={location.id} value={location.id}>
                          {location.name}, {location.city}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
                    <select
                      value={toLocation}
                      onChange={(e) => setToLocation(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      required
                    >
                      <option value="">Select arrival location</option>
                      {locations.map(location => (
                        <option key={location.id} value={location.id}>
                          {location.name}, {location.city}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Departure Date</label>
                    <div className="relative">
                      <DatePicker
                        selected={departureDate}
                        onChange={date => setDepartureDate(date)}
                        dateFormat="dd/MM/yyyy"
                        minDate={new Date()}
                        className="w-full p-2 border border-gray-300 rounded-md"
                      />
                      <Calendar className="absolute right-3 top-2.5 text-gray-400 pointer-events-none" size={20} />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Passengers</label>
                    <select
                      value={passengers}
                      onChange={(e) => setPassengers(parseInt(e.target.value))}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                        <option key={num} value={num}>
                          {num} {num === 1 ? 'passenger' : 'passengers'}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <button
                  type="submit"
                  className="btn-primary w-full flex items-center justify-center"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="loader"></span>
                  ) : (
                    <>
                      <Search size={18} className="mr-2" />
                      Search Trips
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
          
          <div>
            <div className="card">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Star className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold ml-3">Popular Trips</h3>
              </div>
              
              <div className="space-y-3">
                {popularTrips.map((trip, index) => (
                  <div 
                    key={index} 
                    className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer"
                    onClick={() => handlePopularTripSelect(trip)}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-medium">{trip.route.name}</div>
                        <div className="text-sm text-gray-500 flex items-center mt-1">
                          <MapPin className="w-3 h-3 mr-1" />
                          {trip.origin} → {trip.destination}
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </div>
                    <div className="flex justify-between mt-2 text-sm">
                      <span className="text-gray-500">{trip.departureTime}</span>
                      <span className="font-medium">{trip.price}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Other steps remain unchanged */}
    </div>
  );
};

export default CustomerPortal; 