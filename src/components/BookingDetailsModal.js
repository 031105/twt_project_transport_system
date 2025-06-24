import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { 
  X,
  MapPin, 
  Calendar, 
  Clock, 
  Users, 
  CreditCard,
  Bus,
  Phone,
  Mail,
  CheckCircle,
  Download,
  Navigation,
  ArrowRight,
  Info
} from 'lucide-react';
import BookingReceipt from './BookingReceipt';

const BookingDetailsModal = ({ booking, onClose }) => {
  const [showReceipt, setShowReceipt] = useState(false);
  const [tripDetails, setTripDetails] = useState(null);
  const [routeStops, setRouteStops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [seatDetails, setSeatDetails] = useState([]);

  useEffect(() => {
    if (booking) {
      loadTripDetails();
    }
  }, [booking]);

  const loadTripDetails = async () => {
    try {
      setLoading(true);
      
      // Load trip details with route stops from database
      const tripResponse = await fetch(`http://localhost:5001/api/trips/${booking.trip.id}`);
      if (tripResponse.ok) {
        const tripData = await tripResponse.json();
        setTripDetails(tripData.data);
        
        // Build route stops from database data
        const routeStops = [];
        
        // Add origin
        routeStops.push({
          id: 'origin',
          name: booking.originLocation.name,
          city: booking.originLocation.city,
          address: booking.originLocation.address,
          arrivalTime: null,
          departureTime: booking.trip.departureDatetime,
          isOrigin: true,
          isDestination: false
        });

        // Add intermediate stops from database
        if (tripData.data.routeStops && tripData.data.routeStops.length > 0) {
          tripData.data.routeStops.forEach((stop, index) => {
            const arrivalTime = addMinutes(booking.trip.departureDatetime, stop.arrivalOffsetMinutes);
            const departureTime = addMinutes(booking.trip.departureDatetime, stop.departureOffsetMinutes);
            
            routeStops.push({
              id: stop.id,
              name: stop.location.name,
              city: stop.location.city,
              address: stop.location.address,
              arrivalTime: arrivalTime,
              departureTime: departureTime,
              isOrigin: false,
              isDestination: false,
              stopOrder: stop.stopOrder,
              priceFromOrigin: stop.priceFromOrigin,
              boardingAllowed: stop.boardingAllowed,
              alightingAllowed: stop.alightingAllowed
            });
          });
        }

        // Add destination
        routeStops.push({
          id: 'destination',
          name: booking.destinationLocation.name,
          city: booking.destinationLocation.city,
          address: booking.destinationLocation.address,
          arrivalTime: booking.trip.arrivalDatetime,
          departureTime: null,
          isOrigin: false,
          isDestination: true
        });
        
        setRouteStops(routeStops);
        
        // Fetch seat details for this trip
        const seatsResponse = await fetch(`http://localhost:5001/api/seats/trip/${booking.trip.id}`);
        if (seatsResponse.ok) {
          const seatsData = await seatsResponse.json();
          // Filter only seats that aren't available (meaning they might be booked)
          // This is a workaround since we don't have a direct booking-seat relationship
          // In a real system, we would query a booking_seats table instead
          const bookedSeats = seatsData.data.filter(seat => !seat.isAvailable)
            .slice(0, booking.passengerCount); // Limit to passenger count
          setSeatDetails(bookedSeats);
        }
      }
    } catch (error) {
      console.error('Error loading trip details:', error);
    } finally {
      setLoading(false);
    }
  };

  const addMinutes = (dateString, minutes) => {
    const date = new Date(dateString);
    date.setMinutes(date.getMinutes() + minutes);
    return date.toISOString();
  };

  const handleDownloadReceipt = () => {
    setShowReceipt(true);
  };

  if (!booking) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40 p-4">
        <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex justify-between items-center p-6 border-b">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Booking Details</h2>
              <p className="text-gray-600">Reference: {booking.bookingReference}</p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={handleDownloadReceipt}
                className="btn-primary flex items-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>Download Receipt</span>
              </button>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {loading ? (
            <div className="p-8 text-center">
              <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Loading trip details...</p>
            </div>
          ) : (
            <div className="p-6">
              {/* Status Banner */}
              <div className={`p-4 rounded-lg mb-6 ${
                booking.bookingStatus === 'confirmed' 
                  ? 'bg-green-50 border border-green-200' 
                  : booking.bookingStatus === 'pending'
                  ? 'bg-yellow-50 border border-yellow-200'
                  : 'bg-red-50 border border-red-200'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className={`w-6 h-6 ${
                      booking.bookingStatus === 'confirmed' ? 'text-green-600' : 'text-yellow-600'
                    }`} />
                    <div>
                      <div className="font-semibold text-gray-900">
                        Booking {booking.bookingStatus.charAt(0).toUpperCase() + booking.bookingStatus.slice(1)}
                      </div>
                      <div className="text-sm text-gray-600">
                        Payment {booking.paymentStatus || 'Completed'} • 
                        Booked on {format(new Date(booking.bookingDate), 'MMM dd, yyyy')}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary-600">RM {booking.totalAmount}</div>
                    <div className="text-sm text-gray-600">{booking.passengerCount} passenger(s)</div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column - Trip Information */}
                <div className="space-y-6">
                  {/* Route Overview */}
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <MapPin className="w-5 h-5 mr-2 text-primary-600" />
                      Route Information
                    </h3>
                    
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-center flex-1">
                        <div className="text-xl font-bold">{booking.originLocation.city}</div>
                        <div className="text-gray-600 text-sm font-medium">{booking.originLocation.name}</div>
                        <div className="text-xs text-gray-500 mt-1">{booking.originLocation.address}</div>
                        <div className="text-primary-600 font-medium mt-2">
                          {format(new Date(booking.trip.departureDatetime), 'HH:mm')}
                        </div>
                      </div>
                      
                      <div className="mx-6">
                        <ArrowRight className="w-8 h-8 text-primary-600" />
                      </div>
                      
                      <div className="text-center flex-1">
                        <div className="text-xl font-bold">{booking.destinationLocation.city}</div>
                        <div className="text-gray-600 text-sm font-medium">{booking.destinationLocation.name}</div>
                        <div className="text-xs text-gray-500 mt-1">{booking.destinationLocation.address}</div>
                        <div className="text-primary-600 font-medium mt-2">
                          {format(new Date(booking.trip.arrivalDatetime), 'HH:mm')}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                        <span>{format(new Date(booking.travelDate), 'EEEE, MMM dd, yyyy')}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-2 text-gray-500" />
                        <span>Duration: ~4h 30m</span>
                      </div>
                    </div>
                  </div>

                  {/* Vehicle Information */}
                  <div className="bg-white border border-gray-200 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <Bus className="w-5 h-5 mr-2 text-primary-600" />
                      Vehicle Details
                    </h3>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Vehicle Type:</span>
                        <span className="font-medium">{booking.vehicleType.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Trip Number:</span>
                        <span className="font-medium">{booking.trip.tripNumber}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Features:</span>
                        <span className="font-medium">AC, WiFi, Reclining Seats</span>
                      </div>
                    </div>
                  </div>

                  {/* Seat Information */}
                  <div className="bg-blue-50 border border-blue-100 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <Users className="w-5 h-5 mr-2 text-primary-600" />
                      Seat Information
                    </h3>
                    
                    <div className="space-y-3">
                      {seatDetails.length > 0 ? (
                        <div>
                          <div className="flex flex-wrap gap-2 mb-2">
                            {seatDetails.map((seat) => (
                              <div key={seat.id} className="bg-primary-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                                Seat {seat.seatNumber}
                              </div>
                            ))}
                          </div>
                          <div className="text-sm text-gray-600 mt-1">
                            Total: {seatDetails.length} seat(s)
                          </div>
                        </div>
                      ) : (
                        <div className="text-sm text-gray-600">
                          No seat information available
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Passenger Information */}
                  <div className="bg-white border border-gray-200 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <Users className="w-5 h-5 mr-2 text-primary-600" />
                      Passenger Information
                    </h3>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Contact Email:</span>
                        <span className="font-medium">{booking.contactEmail}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Contact Phone:</span>
                        <span className="font-medium">{booking.contactPhone}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Passengers:</span>
                        <span className="font-medium">{booking.passengerCount}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column - Route Map & Stops */}
                <div className="space-y-6">
                  <div className="bg-white border border-gray-200 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <Navigation className="w-5 h-5 mr-2 text-primary-600" />
                      Route Map
                    </h3>
                    
                    <div className="bg-gray-100 rounded-lg p-4 text-center">
                      <div className="flex flex-col items-center">
                        {routeStops.map((stop, index) => (
                          <React.Fragment key={stop.id || index}>
                            {/* Connection line */}
                            {index > 0 && (
                              <div className="w-0.5 h-10 bg-gray-300"></div>
                            )}
                            
                            {/* Location marker */}
                            <div className="flex items-center mb-1">
                              <div className={`w-4 h-4 rounded-full flex-shrink-0 ${
                                stop.isOrigin ? 'bg-green-500' : stop.isDestination ? 'bg-red-500' : 'bg-blue-500'
                              }`}></div>
                              <div className="ml-3 text-left">
                                <div className="text-gray-900 font-medium">{stop.name}</div>
                                <div className="text-gray-600 text-sm">{stop.city}</div>
                                {(stop.departureTime || stop.arrivalTime) && (
                                  <div className="text-sm">
                                    {stop.departureTime && !stop.isDestination && (
                                      <span className="text-green-600 mr-2">
                                        Dep: {format(new Date(stop.departureTime), 'HH:mm')}
                                      </span>
                                    )}
                                    {stop.arrivalTime && !stop.isOrigin && (
                                      <span className="text-blue-600">
                                        Arr: {format(new Date(stop.arrivalTime), 'HH:mm')}
                                      </span>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="bg-white border border-gray-200 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <Info className="w-5 h-5 mr-2 text-primary-600" />
                      Boarding Instructions
                    </h3>
                    
                    <div className="space-y-4 text-sm">
                      <div className="flex items-start">
                        <div className="w-6 h-6 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center mr-3 flex-shrink-0">1</div>
                        <p>Please arrive at the bus terminal at least <strong>15 minutes</strong> before departure time.</p>
                      </div>
                      
                      <div className="flex items-start">
                        <div className="w-6 h-6 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center mr-3 flex-shrink-0">2</div>
                        <p>Have your booking reference and ID ready for verification.</p>
                      </div>
                      
                      <div className="flex items-start">
                        <div className="w-6 h-6 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center mr-3 flex-shrink-0">3</div>
                        <p>Proceed to the designated boarding area for your trip.</p>
                      </div>
                      
                      <div className="flex items-start">
                        <div className="w-6 h-6 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center mr-3 flex-shrink-0">4</div>
                        <p>Luggage allowance: 1 check-in item (max 20kg) and 1 carry-on item per passenger.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {showReceipt && (
        <BookingReceipt
          booking={booking}
          trip={tripDetails || booking.trip}
          seats={seatDetails}
          passengerInfo={{
            name: 'Passenger Name', // You might want to load actual passenger data
            email: booking.contactEmail,
            phone: booking.contactPhone
          }}
          totalAmount={booking.totalAmount}
          onClose={() => setShowReceipt(false)}
        />
      )}
    </>
  );
};

export default BookingDetailsModal; 