import React, { useState, useEffect, Fragment } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { 
  MapPin, 
  Clock, 
  Users, 
  ArrowRight, 
  Bus,
  CreditCard,
  ArrowLeft,
  Info,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../context/AppContext';

const TripDetails = () => {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const { 
    selectedTrip, 
    selectedSeat, 
    selectSeat, 
    isAuthenticated, 
    currentUser,
    addNotification 
  } = useApp();
  
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [seatsLoaded, setSeatsLoaded] = useState(false);
  const [routeStops, setRouteStops] = useState([]);
  const [passengerInfo, setPassengerInfo] = useState({
    name: currentUser?.firstName + ' ' + currentUser?.lastName || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || ''
  });
  
  useEffect(() => {
    if (!selectedTrip) {
      navigate('/search');
      return;
    }
    
    // Load real seats from database if not already present
    if (!selectedTrip.seats) {
      loadTripSeats();
    }
    
    // Load route stops
    loadRouteStops();
    
    // Update passenger info when user changes
    if (currentUser) {
      setPassengerInfo({
        name: currentUser.firstName + ' ' + currentUser.lastName,
        email: currentUser.email,
        phone: currentUser.phone || ''
      });
    }
  }, [selectedTrip, navigate, currentUser]);

  const loadTripSeats = async () => {
    try {
      console.log('🪑 Loading seats for trip:', selectedTrip.id);
      const response = await fetch(`http://localhost:5001/api/seats/trip/${selectedTrip.id}`);
      
      if (!response.ok) {
        console.error('Failed to load seats:', response.status, response.statusText);
        generateFallbackSeats();
        return;
      }
      
      const data = await response.json();
      const seats = data.data || [];
      
      console.log('✅ Loaded seats:', seats.length);
      
      // Add seats to selectedTrip object
      selectedTrip.seats = seats;
      
      // Force re-render by updating state
      setSelectedSeats([]);
      setSeatsLoaded(true);
      
    } catch (error) {
      console.error('Error loading trip seats:', error);
      // Fallback: generate basic seats if API fails
      generateFallbackSeats();
    }
  };

  const loadRouteStops = async () => {
    try {
      console.log('🛣️ Loading route stops for trip:', selectedTrip.id);
      const response = await fetch(`http://localhost:5001/api/trips/${selectedTrip.id}`);
      
      if (!response.ok) {
        console.error('Failed to load trip details:', response.status);
        return;
      }
      
      const data = await response.json();
      const tripData = data.data;
      
      if (tripData.routeStops && tripData.routeStops.length > 0) {
        console.log('✅ Found route stops:', tripData.routeStops.length);
        setRouteStops(tripData.routeStops);
      } else {
        console.log('ℹ️ No intermediate stops for this route');
        setRouteStops([]);
      }
      
    } catch (error) {
      console.error('Error loading route stops:', error);
      setRouteStops([]);
    }
  };

  const generateFallbackSeats = () => {
    const capacity = selectedTrip.total_seats || selectedTrip.totalSeats || 30;
    const basePrice = selectedTrip.base_price || selectedTrip.price || 45;
    const availableSeats = selectedTrip.available_seats || selectedTrip.availableSeats || capacity;
    
    const seats = [];
    const seatsPerRow = 4;
    const rows = Math.ceil(capacity / seatsPerRow);
    
    // Generate consistent occupied seats based on trip ID
    const occupiedCount = capacity - availableSeats;
    const occupiedSeats = new Set();
    
    const tripIdHash = selectedTrip.id.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    
    for (let i = 0; i < occupiedCount; i++) {
      let seatIndex = (Math.abs(tripIdHash) + i * 7) % capacity + 1;
      while (occupiedSeats.has(seatIndex)) {
        seatIndex = (seatIndex % capacity) + 1;
      }
      occupiedSeats.add(seatIndex);
    }
    
    for (let row = 1; row <= rows; row++) {
      for (const col of ['A', 'B', 'C', 'D']) {
        if (seats.length >= capacity) break;
        
        const seatNumber = `${row}${col}`;
        const seatIndex = seats.length + 1;
        const isOccupied = occupiedSeats.has(seatIndex);
        
        seats.push({
          id: `seat-${selectedTrip.id}-${seatNumber}`,
          seatNumber: seatNumber,
          isAvailable: !isOccupied,
          price: basePrice,
          seatType: {
            name: 'Standard',
            features: ['Air Conditioning', 'Reclining Seat']
          }
        });
      }
    }
    
    selectedTrip.seats = seats;
    setSeatsLoaded(true);
  };
  
  if (!selectedTrip) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading trip details...</p>
        </div>
      </div>
    );
  }
  
  const handleSeatSelect = (seat) => {
    if (!seat.isAvailable) return;
    
    if (selectedSeats.find(s => s.id === seat.id)) {
      // Deselect seat
      setSelectedSeats(prev => prev.filter(s => s.id !== seat.id));
    } else {
      // Select seat (limit to 4 seats)
      if (selectedSeats.length < 4) {
        setSelectedSeats(prev => [...prev, seat]);
      } else {
        addNotification({
          type: 'warning',
          message: 'Maximum 4 seats can be selected at once'
        });
      }
    }
  };
  
  const handleProceedToBooking = () => {
    if (selectedSeats.length === 0) {
      addNotification({
        type: 'warning',
        message: 'Please select at least one seat'
      });
      return;
    }
    
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    // Store selected seats and proceed to booking
    navigate('/booking', { 
      state: { 
        trip: selectedTrip, 
        seats: selectedSeats,
        passengerInfo 
      } 
    });
  };
  
  const renderSeatLayout = () => {
    if (!selectedTrip.seats || selectedTrip.seats.length === 0) return null;
    
    // Group seats by row number for real database seats
    const seatsByRow = {};
    selectedTrip.seats.forEach(seat => {
      const rowNum = seat.rowNumber || parseInt(seat.seatNumber);
      if (!seatsByRow[rowNum]) {
        seatsByRow[rowNum] = {};
      }
      seatsByRow[rowNum][seat.position || seat.seatNumber.slice(-1)] = seat;
    });
    
    const rowNumbers = Object.keys(seatsByRow).sort((a, b) => parseInt(a) - parseInt(b));
    
    // Use the actual database layout - respect the row structure from database
    const seatRows = rowNumbers.map(rowNum => {
      const row = seatsByRow[rowNum];
      // Return seats in order: A, B, C, D (filter out undefined)
      return [row.A, row.B, row.C, row.D].filter(Boolean);
    });
    
    return (
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Your Seats</h3>
        
        {/* Bus Layout */}
        <div className="max-w-md mx-auto">
          {/* Driver Area */}
          <div className="flex justify-end mb-4">
            <div className="w-12 h-8 bg-gray-300 rounded flex items-center justify-center text-xs text-gray-600">
              Driver
            </div>
          </div>
          
          {/* Seats */}
                          <div className="space-y-2">
          {seatRows.map((rowSeats, rowIndex) => {
            const currentSeatsPerRow = rowSeats.length;
            const isLuxuryCoach = currentSeatsPerRow === 3; // 3 seats = luxury coach (1|2 layout)
            
            return (
              <div key={rowIndex} className="flex justify-center items-center">
                <div className="flex items-center space-x-1">
                  {rowSeats.map((seat, seatIndex) => {
                    if (!seat) return <div key={`empty-${rowIndex}-${seatIndex}`} className="w-8 h-8"></div>;
                    
                    const isSelected = selectedSeats.find(s => s.id === seat.id);
                    
                    // Determine aisle position based on layout
                    let showAisleAfter = false;
                    if (isLuxuryCoach && seatIndex === 0) {
                      // 1|2 layout: aisle after first seat (A | B-C)
                      showAisleAfter = true;
                    } else if (currentSeatsPerRow === 4 && seatIndex === 1) {
                      // 2|2 layout: aisle after second seat (A-B | C-D)
                      showAisleAfter = true;
                    }
                    // Mini van (3 seats): no aisle separation - A B C layout
                    
                    // Enhanced tooltip with seat features
                    const features = seat.features || {};
                    let featureText = '';
                    if (features.single) featureText += ' (Single, Privacy)';
                    else if (features.window) featureText += ' (Window)';
                    else if (features.aisle) featureText += ' (Aisle)';
                    if (features.pair) featureText += features.window ? ', Paired' : ' (Paired)';
                    
                    return (
                      <Fragment key={seat.id}>
                        <button
                          onClick={() => handleSeatSelect(seat)}
                          className={`w-8 h-8 rounded text-xs font-medium transition-colors ${
                            !seat.isAvailable
                              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                              : isSelected
                              ? seat.seatType?.name === 'Business' ? 'bg-yellow-600 text-white' : 'bg-primary-600 text-white'
                              : seat.seatType?.name === 'Business' 
                              ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200 border border-yellow-300'
                              : 'bg-gray-100 text-gray-700 hover:bg-primary-100 border border-gray-300'
                          }`}
                          disabled={!seat.isAvailable}
                          title={`Seat ${seat.seatNumber} - ${seat.seatType?.name || 'Standard'} - RM ${seat.price}${featureText}`}
                        >
                          {seat.seatNumber}
                        </button>
                        {/* Add aisle space */}
                        {showAisleAfter && <div className="w-6 flex items-center justify-center text-xs text-gray-400">|</div>}
                      </Fragment>
                    );
                  })}
                </div>
              </div>
            );
          })}
          </div>
          
          {/* Legend */}
          <div className="mt-6 flex justify-center flex-wrap gap-4 text-xs">
            <div className="flex items-center space-x-1">
              <div className="w-4 h-4 bg-gray-100 border border-gray-300 rounded"></div>
              <span>Economy Available</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-4 h-4 bg-yellow-100 border border-yellow-300 rounded"></div>
              <span>Business Available</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-4 h-4 bg-primary-600 rounded"></div>
              <span>Selected</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-4 h-4 bg-gray-300 rounded"></div>
              <span>Occupied</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderRouteStops = () => {
    // Always show route information, even for direct routes

    const addMinutes = (dateString, minutes) => {
      const date = new Date(dateString);
      date.setMinutes(date.getMinutes() + minutes);
      return date;
    };

    return (
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Route Information</h3>
        <div className="space-y-4">
          {/* Origin */}
          <div className="flex items-center space-x-4">
            <div className="flex flex-col items-center">
              <div className="w-4 h-4 bg-green-500 rounded-full"></div>
              <div className="w-px h-8 bg-gray-300"></div>
            </div>
            <div className="flex-1">
              <div className="font-medium text-gray-900">{selectedTrip.originLocation?.name}</div>
              <div className="text-sm text-gray-600">{selectedTrip.originLocation?.city}</div>
              <div className="text-sm text-primary-600 font-medium">
                Departure: {(() => {
                  try {
                    return selectedTrip.departureDatetime ? format(new Date(selectedTrip.departureDatetime), 'HH:mm') : 'N/A';
                  } catch (error) {
                    return 'Invalid time';
                  }
                })()}
              </div>
            </div>
          </div>

          {/* Intermediate Stops */}
          {routeStops && routeStops.length > 0 && routeStops.map((stop, index) => {
            const arrivalTime = addMinutes(selectedTrip.departureDatetime, stop.arrivalOffsetMinutes);
            const departureTime = addMinutes(selectedTrip.departureDatetime, stop.departureOffsetMinutes);
            
            return (
              <div key={stop.id} className="flex items-center space-x-4">
                <div className="flex flex-col items-center">
                  <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-xs text-white font-bold">{stop.stopOrder}</span>
                  </div>
                  <div className="w-px h-8 bg-gray-300"></div>
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{stop.location.name}</div>
                  <div className="text-sm text-gray-600">{stop.location.city}</div>
                  <div className="text-sm text-blue-600">
                    Arrival: {format(arrivalTime, 'HH:mm')} • Departure: {format(departureTime, 'HH:mm')}
                    <span className="text-gray-500 ml-2">({stop.departureOffsetMinutes - stop.arrivalOffsetMinutes} min stop)</span>
                  </div>
                  {stop.priceFromOrigin > 0 && (
                    <div className="text-xs text-gray-500">
                      From origin: +RM {stop.priceFromOrigin}
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Direct route indicator */}
          {(!routeStops || routeStops.length === 0) && (
            <div className="flex items-center space-x-4">
              <div className="flex flex-col items-center">
                <div className="w-px h-8 bg-gray-300"></div>
              </div>
              <div className="flex-1">
                <div className="text-sm text-gray-500 italic">Direct route - no intermediate stops</div>
              </div>
            </div>
          )}

          {/* Destination */}
          <div className="flex items-center space-x-4">
            <div className="flex flex-col items-center">
              <div className="w-px h-8 bg-gray-300"></div>
              <div className="w-4 h-4 bg-red-500 rounded-full"></div>
            </div>
            <div className="flex-1">
              <div className="font-medium text-gray-900">{selectedTrip.destinationLocation?.name}</div>
              <div className="text-sm text-gray-600">{selectedTrip.destinationLocation?.city}</div>
              <div className="text-sm text-red-600 font-medium">
                Arrival: {(() => {
                  try {
                    // Calculate logical arrival time
                    let calculatedArrival;
                    
                    // If we have route stops, calculate from the last stop + remaining travel time
                    if (routeStops && routeStops.length > 0) {
                      const lastStop = routeStops[routeStops.length - 1];
                      const totalRouteDuration = selectedTrip.route?.estimatedDurationMinutes || 300;
                      // Calculate remaining travel time after last stop
                      const remainingTravelTime = totalRouteDuration - lastStop.departureOffsetMinutes;
                      calculatedArrival = addMinutes(selectedTrip.departureDatetime, lastStop.departureOffsetMinutes + remainingTravelTime);
                    } else {
                      // For direct routes, use database arrival time or calculate from route duration
                      const estimatedArrival = selectedTrip.estimatedArrivalDatetime || selectedTrip.arrivalDatetime;
                      if (estimatedArrival) {
                        calculatedArrival = new Date(estimatedArrival);
                      } else {
                        // Fallback: add route duration to departure time
                        const routeDuration = selectedTrip.route?.estimatedDurationMinutes || 300;
                        calculatedArrival = addMinutes(selectedTrip.departureDatetime, routeDuration);
                      }
                    }
                    
                    return format(calculatedArrival, 'HH:mm');
                  } catch (error) {
                    return 'Invalid time';
                  }
                })()}
              </div>
            </div>
          </div>


        </div>
      </div>
    );
  };
  
  const totalPrice = selectedSeats.reduce((total, seat) => total + seat.price, 0);
  
  return (
    <div className="max-w-6xl mx-auto">
      {/* Back Button */}
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to search results</span>
        </button>
      </div>
      
      {/* Trip Information */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Trip Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Trip Header */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold text-gray-900">
                {selectedTrip.route?.name}
              </h1>
              <div className="text-right">
                <div className="text-2xl font-bold text-primary-600">
                  RM {selectedTrip.base_price || selectedTrip.price || selectedTrip.route?.basePrice || selectedTrip.route?.base_price || 0}
                </div>
                <div className="text-sm text-gray-500">per person</div>
              </div>
            </div>
            
            <div className="mb-4">
              <div className="flex items-center text-gray-600 mb-2">
                <span className="font-medium text-lg">{selectedTrip.originLocation?.city}</span>
                <ArrowRight className="w-5 h-5 mx-3 text-primary-500" />
                <span className="font-medium text-lg">{selectedTrip.destinationLocation?.city}</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                <div className="flex items-start space-x-2">
                  <MapPin className="w-4 h-4 text-primary-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-medium">{selectedTrip.originLocation?.name}</div>
                    <div className="text-xs">{selectedTrip.originLocation?.address}</div>
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <MapPin className="w-4 h-4 text-primary-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-medium">{selectedTrip.destinationLocation?.name}</div>
                    <div className="text-xs">{selectedTrip.destinationLocation?.address}</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-primary-500" />
                <div>
                  <div className="font-medium text-gray-900">Departure</div>
                  <div>
                    {(() => {
                      try {
                        return selectedTrip.departureDatetime ? format(new Date(selectedTrip.departureDatetime), 'HH:mm') : 'N/A';
                      } catch (error) {
                        return 'Invalid time';
                      }
                    })()}
                  </div>
                  <div className="text-xs text-gray-500">
                    {(() => {
                      try {
                        return selectedTrip.departureDatetime ? format(new Date(selectedTrip.departureDatetime), 'MMM dd, yyyy') : 'N/A';
                      } catch (error) {
                        return 'Invalid date';
                      }
                    })()}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-primary-500" />
                <div>
                  <div className="font-medium text-gray-900">Arrival</div>
                  <div>
                    {(() => {
                      try {
                        const arrivalTime = selectedTrip.estimatedArrivalDatetime || selectedTrip.arrivalDatetime;
                        return arrivalTime ? format(new Date(arrivalTime), 'HH:mm') : 'N/A';
                      } catch (error) {
                        return 'Invalid time';
                      }
                    })()}
                  </div>
                  <div className="text-xs text-gray-500">
                    {(() => {
                      try {
                        const arrivalTime = selectedTrip.estimatedArrivalDatetime || selectedTrip.arrivalDatetime;
                        return arrivalTime ? format(new Date(arrivalTime), 'MMM dd, yyyy') : 'N/A';
                      } catch (error) {
                        return 'Invalid date';
                      }
                    })()}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-primary-500" />
                <div>
                  <div className="font-medium text-gray-900">Available</div>
                  <div className="text-success-600">{selectedTrip.availableSeats} seats</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Bus className="w-4 h-4 text-primary-500" />
                <div>
                  <div className="font-medium text-gray-900">Vehicle</div>
                  <div>{selectedTrip.vehicleType?.name}</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Route Information with Stops */}
          {renderRouteStops()}
          
          {/* Seat Selection */}
          {renderSeatLayout()}
          
          {/* Trip Policies */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Booking Policies</h3>
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex items-start space-x-2">
                <Info className="w-4 h-4 text-primary-500 mt-0.5" />
                <span>Free cancellation up to 24 hours before departure</span>
              </div>
              <div className="flex items-start space-x-2">
                <Info className="w-4 h-4 text-primary-500 mt-0.5" />
                <span>Please arrive at the terminal 15 minutes before departure</span>
              </div>
              <div className="flex items-start space-x-2">
                <Info className="w-4 h-4 text-primary-500 mt-0.5" />
                <span>Valid ID required for boarding</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Booking Summary */}
        <div className="lg:col-span-1">
          <div className="card sticky top-24">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Booking Summary</h3>
            
            {/* Selected Seats */}
            {selectedSeats.length > 0 && (
              <div className="mb-4">
                <h4 className="font-medium text-gray-900 mb-2">Selected Seats</h4>
                <div className="space-y-2">
                  {selectedSeats.map((seat) => (
                    <div key={seat.id} className="flex justify-between items-center text-sm">
                      <span>Seat {seat.seatNumber}</span>
                      <span className="font-medium">RM {seat.price}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Total */}
            <div className="border-t border-gray-200 pt-4 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-gray-900">Total</span>
                <span className="text-2xl font-bold text-primary-600">
                  RM {totalPrice.toFixed(2)}
                </span>
              </div>
              <div className="text-sm text-gray-500 mt-1">
                {selectedSeats.length} seat{selectedSeats.length !== 1 ? 's' : ''} selected
              </div>
            </div>
            
            {/* Proceed Button */}
            <button
              onClick={handleProceedToBooking}
              disabled={selectedSeats.length === 0}
              className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                selectedSeats.length === 0
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'btn-primary'
              }`}
            >
              {!isAuthenticated ? 'Sign In to Book' : 'Proceed to Booking'}
            </button>
            
            {/* Security Note */}
            <div className="mt-4 flex items-start space-x-2 text-xs text-gray-500">
              <CheckCircle className="w-4 h-4 text-success-500 mt-0.5" />
              <span>Your booking is secured with 256-bit SSL encryption</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TripDetails; 