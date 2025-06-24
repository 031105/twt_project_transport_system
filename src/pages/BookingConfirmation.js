import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { 
  CheckCircle, 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  CreditCard,
  Download,
  ArrowRight,
  Bus
} from 'lucide-react';
import BookingReceipt from '../components/BookingReceipt';

const BookingConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [bookingData, setBookingData] = useState(null);
  const [showReceipt, setShowReceipt] = useState(false);

  useEffect(() => {
    // Get booking data from navigation state or URL params
    if (location.state?.bookingData) {
      setBookingData(location.state.bookingData);
    } else {
      // If no booking data, redirect to bookings page
      navigate('/bookings');
    }
  }, [location.state, navigate]);

  if (!bookingData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading booking confirmation...</p>
        </div>
      </div>
    );
  }

  const { booking, trip, seats, totalAmount } = bookingData;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Success Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Booking Confirmed!</h1>
        <p className="text-lg text-gray-600">
          Your booking has been successfully processed
        </p>
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg inline-block">
          <p className="text-sm text-green-800">
            <strong>Booking Reference:</strong> {booking.bookingReference || booking.id}
          </p>
        </div>
      </div>

      {/* Booking Details Card */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Trip Details</h2>
        
        {/* Route Information */}
        <div className="flex items-center justify-between mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-4">
            <div className="text-center">
              <div className="font-semibold text-gray-900">{trip.originLocation?.city || 'Origin'}</div>
              <div className="text-sm text-gray-500">
                {(() => {
                  try {
                    return trip.departureDatetime ? format(new Date(trip.departureDatetime), 'HH:mm') : 'N/A';
                  } catch (error) {
                    return 'N/A';
                  }
                })()}
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-primary-500" />
            <div className="text-center">
              <div className="font-semibold text-gray-900">{trip.destinationLocation?.city || 'Destination'}</div>
              <div className="text-sm text-gray-500">
                {(() => {
                  try {
                    const arrivalTime = trip.estimatedArrivalDatetime || trip.arrivalDatetime;
                    return arrivalTime ? format(new Date(arrivalTime), 'HH:mm') : 'N/A';
                  } catch (error) {
                    return 'N/A';
                  }
                })()}
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-primary-600">
              RM {totalAmount || trip.base_price || trip.price || 0}
            </div>
            <div className="text-sm text-gray-500">Total Amount</div>
          </div>
        </div>

        {/* Trip Information Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Calendar className="w-5 h-5 text-primary-500" />
              <div>
                <div className="font-medium text-gray-900">Travel Date</div>
                <div className="text-gray-600">
                  {(() => {
                    try {
                      return trip.departureDatetime ? format(new Date(trip.departureDatetime), 'EEEE, MMMM dd, yyyy') : 'N/A';
                    } catch (error) {
                      return 'N/A';
                    }
                  })()}
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Clock className="w-5 h-5 text-primary-500" />
              <div>
                <div className="font-medium text-gray-900">Departure Time</div>
                <div className="text-gray-600">
                  {(() => {
                    try {
                      return trip.departureDatetime ? format(new Date(trip.departureDatetime), 'HH:mm') : 'N/A';
                    } catch (error) {
                      return 'N/A';
                    }
                  })()}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Bus className="w-5 h-5 text-primary-500" />
              <div>
                <div className="font-medium text-gray-900">Vehicle</div>
                <div className="text-gray-600">{trip.vehicleType?.name || 'Luxury Coach'}</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Users className="w-5 h-5 text-primary-500" />
              <div>
                <div className="font-medium text-gray-900">Passengers</div>
                <div className="text-gray-600">{seats?.length || 1} passenger(s)</div>
              </div>
            </div>
          </div>
        </div>

        {/* Selected Seats */}
        {seats && seats.length > 0 && (
          <div className="mb-6">
            <h3 className="font-medium text-gray-900 mb-2">Selected Seats</h3>
            <div className="flex flex-wrap gap-2">
              {seats.map((seat, index) => (
                <div key={index} className="px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm font-medium">
                  Seat {seat.seatNumber}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Payment Information */}
        <div className="border-t pt-4">
          <div className="flex items-center space-x-3 mb-2">
            <CreditCard className="w-5 h-5 text-primary-500" />
            <div className="font-medium text-gray-900">Payment Status</div>
          </div>
          <div className="ml-8">
            <div className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
              <CheckCircle className="w-4 h-4 mr-1" />
              Payment Confirmed
            </div>
          </div>
        </div>
      </div>

      {/* Important Information */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
        <h3 className="font-semibold text-blue-900 mb-3">Important Information</h3>
        <ul className="space-y-2 text-blue-800">
          <li className="flex items-start space-x-2">
            <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
            <span>Please arrive at the terminal at least 15 minutes before departure</span>
          </li>
          <li className="flex items-start space-x-2">
            <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
            <span>Bring a valid ID for boarding verification</span>
          </li>
          <li className="flex items-start space-x-2">
            <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
            <span>Free cancellation up to 24 hours before departure</span>
          </li>
          <li className="flex items-start space-x-2">
            <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
            <span>Keep this booking reference for your records</span>
          </li>
        </ul>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={() => navigate('/bookings')}
          className="btn-primary flex items-center justify-center space-x-2"
        >
          <span>View My Bookings</span>
        </button>
        
        <button
          onClick={() => navigate('/')}
          className="btn-secondary flex items-center justify-center space-x-2"
        >
          <span>Book Another Trip</span>
        </button>
        
        <button
          onClick={() => setShowReceipt(true)}
          className="btn-outline flex items-center justify-center space-x-2"
        >
          <Download className="w-4 h-4" />
          <span>Print Ticket</span>
        </button>
      </div>

      {/* Receipt Modal */}
      {showReceipt && (
        <BookingReceipt
          booking={booking}
          trip={trip}
          seats={seats}
          passengerInfo={bookingData.passengerInfo}
          totalAmount={totalAmount}
          onClose={() => setShowReceipt(false)}
        />
      )}
    </div>
  );
};

export default BookingConfirmation; 