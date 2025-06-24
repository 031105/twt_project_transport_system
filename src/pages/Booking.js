import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { 
  ArrowLeft,
  CreditCard,
  User,
  Mail,
  Phone,
  MapPin,
  Clock,
  Users,
  Shield,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../context/AppContext';

const Booking = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, addNotification, isAuthenticated } = useApp();
  
  const [bookingData, setBookingData] = useState({
    trip: null,
    seats: [],
    passengerInfo: {
      name: '',
      email: '',
      phone: ''
    }
  });
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    paymentMethod: 'credit_card',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: ''
  });
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState({});
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    // Get booking data from navigation state
    const state = location.state;
    if (!state || !state.trip || !state.seats) {
      addNotification({
        type: 'error',
        message: 'Invalid booking data. Please select a trip first.'
      });
      navigate('/search');
      return;
    }
    
    setBookingData(state);
    
    // Pre-fill form with user data
    if (currentUser) {
      setFormData(prev => ({
        ...prev,
        name: `${currentUser.firstName} ${currentUser.lastName}`,
        email: currentUser.email,
        phone: currentUser.phone || ''
      }));
    }
  }, [location.state, currentUser, navigate, isAuthenticated, addNotification]);
  
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }
    
    if (formData.paymentMethod === 'credit_card') {
      if (!formData.cardNumber.trim()) {
        newErrors.cardNumber = 'Card number is required';
      }
      
      if (!formData.expiryDate.trim()) {
        newErrors.expiryDate = 'Expiry date is required';
      }
      
      if (!formData.cvv.trim()) {
        newErrors.cvv = 'CVV is required';
      }
      
      if (!formData.cardName.trim()) {
        newErrors.cardName = 'Cardholder name is required';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      addNotification({
        type: 'error',
        message: 'Please correct the errors in the form'
      });
      return;
    }
    
    setIsProcessing(true);
    
    try {
      // Simulate payment processing first
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulate payment processing based on card number
      const cardNumber = formData.cardNumber.replace(/\s/g, '');
      const paymentSuccess = cardNumber !== '4000000000000002'; // Decline test card
      
      if (!paymentSuccess) {
        throw new Error('Payment declined. Please check your card details and try again.');
      }
      
      // Create booking in database
      const bookingPayload = {
        tripId: bookingData.trip.id,
        totalAmount: calculateTotal(),
        travelDate: new Date(bookingData.trip.departureDatetime).toISOString().split('T')[0], // Convert to YYYY-MM-DD format
        passengerCount: bookingData.seats.length,
        contactEmail: formData.email,
        contactPhone: formData.phone,
        specialRequests: null
      };
      
      const token = localStorage.getItem('accessToken');
      
      if (!token) {
        throw new Error('Authentication required. Please log in again.');
      }
      
      console.log('Creating booking with payload:', bookingPayload);
      
      const response = await fetch('http://localhost:5001/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(bookingPayload)
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          // Token expired or invalid
          localStorage.removeItem('accessToken');
          localStorage.removeItem('currentUser');
          addNotification({
            type: 'error',
            message: 'Your session has expired. Please log in again.'
          });
          navigate('/login');
          return;
        }
        
        const errorData = await response.json();
        console.error('Booking creation failed:', errorData);
        throw new Error(errorData.error || errorData.message || 'Failed to create booking');
      }
      
      const bookingResult = await response.json();
      const { id: bookingId, bookingReference } = bookingResult.data;
      
      // Prepare booking confirmation email data
      const emailBookingData = {
        passenger_email: formData.email,
        passenger_name: formData.name,
        passenger_phone: formData.phone,
        booking_reference: bookingReference,
        trip: bookingData.trip,
        total_amount: calculateTotal(),
        travel_date: new Date(bookingData.trip.departureDatetime).toISOString().split('T')[0],
        seat_numbers: bookingData.seats.map(seat => seat.seatNumber),
        passenger_count: bookingData.seats.length
      };
      
      // Send booking confirmation email
      try {
        const emailService = (await import('../services/emailService')).default;
        const emailResult = await emailService.sendBookingConfirmation(emailBookingData);
        
        if (emailResult.success) {
          console.log('Booking confirmation email sent successfully');
        } else {
          console.error('Failed to send booking confirmation email:', emailResult.error);
        }
      } catch (emailError) {
        console.error('Error sending booking confirmation email:', emailError);
        // Don't fail the booking if email fails
      }
      
      addNotification({
        type: 'success',
        message: `Booking confirmed! Reference: ${bookingReference}`
      });
      
      // Navigate to booking confirmation with complete data
      navigate('/booking-confirmation', {
        state: {
          bookingData: {
            booking: {
              id: bookingId,
              bookingReference: bookingReference,
              status: 'confirmed',
              paymentStatus: 'paid'
            },
            trip: bookingData.trip,
            seats: bookingData.seats,
            totalAmount: calculateTotal(),
            passengerInfo: formData
          }
        }
      });
      
    } catch (error) {
      console.error('Booking error:', error);
      addNotification({
        type: 'error',
        message: error.message || 'Booking failed. Please try again.'
      });
    } finally {
      setIsProcessing(false);
    }
  };
  
  const calculateTotal = () => {
    if (!bookingData.seats) return 0;
    return bookingData.seats.reduce((total, seat) => total + seat.price, 0);
  };
  
  const formatCardNumber = (value) => {
    return value.replace(/\D/g, '').replace(/(\d{4})(?=\d)/g, '$1 ');
  };
  
  const formatExpiryDate = (value) => {
    return value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1/$2');
  };
  
  if (!bookingData.trip) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading booking details...</p>
        </div>
      </div>
    );
  }
  
  const total = calculateTotal();
  
  return (
    <div className="max-w-6xl mx-auto">
      {/* Back Button */}
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to trip details</span>
        </button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Complete Your Booking</h1>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Passenger Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Passenger Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="label">Full Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className={`input ${errors.name ? 'border-red-500' : ''}`}
                      placeholder="Enter your full name"
                    />
                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                  </div>
                  
                  <div>
                    <label className="label">Phone Number</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className={`input ${errors.phone ? 'border-red-500' : ''}`}
                      placeholder="+60123456789"
                    />
                    {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="label">Email Address</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className={`input ${errors.email ? 'border-red-500' : ''}`}
                      placeholder="your.email@example.com"
                    />
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                  </div>
                </div>
              </div>
              
              {/* Payment Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <CreditCard className="w-5 h-5 mr-2" />
                  Payment Information
                </h3>
                
                <div className="space-y-4">
                  {/* Payment Method */}
                  <div>
                    <label className="label">Payment Method</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <label className="flex items-center space-x-3 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="credit_card"
                          checked={formData.paymentMethod === 'credit_card'}
                          onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
                          className="text-primary-600 focus:ring-primary-500"
                        />
                        <CreditCard className="w-5 h-5 text-gray-600" />
                        <span>Credit/Debit Card</span>
                      </label>
                      
                      <label className="flex items-center space-x-3 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 opacity-50">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="fpx"
                          disabled
                          className="text-primary-600 focus:ring-primary-500"
                        />
                        <span>Online Banking (FPX)</span>
                        <span className="text-xs bg-gray-200 px-2 py-1 rounded">Soon</span>
                      </label>
                    </div>
                  </div>
                  
                  {/* Credit Card Details */}
                  {formData.paymentMethod === 'credit_card' && (
                    <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                      <div className="text-sm text-gray-600 mb-3">
                        <strong>Test Card Numbers:</strong><br/>
                        Success: 4111 1111 1111 1111<br/>
                        Decline: 4000 0000 0000 0002
                      </div>
                      
                      <div>
                        <label className="label">Card Number</label>
                        <input
                          type="text"
                          value={formData.cardNumber}
                          onChange={(e) => handleInputChange('cardNumber', formatCardNumber(e.target.value))}
                          className={`input ${errors.cardNumber ? 'border-red-500' : ''}`}
                          placeholder="1234 5678 9012 3456"
                          maxLength="19"
                        />
                        {errors.cardNumber && <p className="text-red-500 text-sm mt-1">{errors.cardNumber}</p>}
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="label">Expiry Date</label>
                          <input
                            type="text"
                            value={formData.expiryDate}
                            onChange={(e) => handleInputChange('expiryDate', formatExpiryDate(e.target.value))}
                            className={`input ${errors.expiryDate ? 'border-red-500' : ''}`}
                            placeholder="MM/YY"
                            maxLength="5"
                          />
                          {errors.expiryDate && <p className="text-red-500 text-sm mt-1">{errors.expiryDate}</p>}
                        </div>
                        
                        <div>
                          <label className="label">CVV</label>
                          <input
                            type="text"
                            value={formData.cvv}
                            onChange={(e) => handleInputChange('cvv', e.target.value.replace(/\D/g, ''))}
                            className={`input ${errors.cvv ? 'border-red-500' : ''}`}
                            placeholder="123"
                            maxLength="4"
                          />
                          {errors.cvv && <p className="text-red-500 text-sm mt-1">{errors.cvv}</p>}
                        </div>
                      </div>
                      
                      <div>
                        <label className="label">Cardholder Name</label>
                        <input
                          type="text"
                          value={formData.cardName}
                          onChange={(e) => handleInputChange('cardName', e.target.value)}
                          className={`input ${errors.cardName ? 'border-red-500' : ''}`}
                          placeholder="Name as on card"
                        />
                        {errors.cardName && <p className="text-red-500 text-sm mt-1">{errors.cardName}</p>}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Submit Button */}
              <button
                type="submit"
                disabled={isProcessing}
                className={`w-full py-4 px-6 rounded-lg font-medium text-lg transition-colors ${
                  isProcessing 
                    ? 'bg-gray-400 text-gray-600 cursor-not-allowed' 
                    : 'btn-primary'
                }`}
              >
                {isProcessing ? (
                  <>
                    <div className="spinner mr-3" />
                    Processing Payment...
                  </>
                ) : (
                  `Pay RM ${total.toFixed(2)} - Complete Booking`
                )}
              </button>
            </form>
          </div>
        </div>
        
        {/* Booking Summary */}
        <div className="lg:col-span-1">
          <div className="card sticky top-24">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Booking Summary</h3>
            
            {/* Trip Details */}
            <div className="space-y-4 mb-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">{bookingData.trip.route?.name}</h4>
                <div className="flex items-center text-gray-600 text-sm">
                  <MapPin className="w-4 h-4 mr-1" />
                  {bookingData.trip.originLocation?.city} → {bookingData.trip.destinationLocation?.city}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-gray-600 mb-1">Departure</div>
                  <div className="font-medium">
                    {(() => {
                      try {
                        return bookingData.trip.departureDatetime ? format(new Date(bookingData.trip.departureDatetime), 'MMM dd, HH:mm') : 'N/A';
                      } catch (error) {
                        return 'Invalid date';
                      }
                    })()}
                  </div>
                </div>
                <div>
                  <div className="text-gray-600 mb-1">Arrival</div>
                  <div className="font-medium">
                    {(() => {
                      try {
                        const arrivalTime = bookingData.trip.estimatedArrivalDatetime || bookingData.trip.arrivalDatetime;
                        return arrivalTime ? format(new Date(arrivalTime), 'MMM dd, HH:mm') : 'N/A';
                      } catch (error) {
                        return 'Invalid date';
                      }
                    })()}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Selected Seats */}
            <div className="mb-6">
              <h4 className="font-medium text-gray-900 mb-2">Selected Seats</h4>
              <div className="space-y-2">
                {bookingData.seats.map((seat) => (
                  <div key={seat.id} className="flex justify-between items-center text-sm">
                    <span>Seat {seat.seatNumber}</span>
                    <span className="font-medium">RM {seat.price.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Total */}
            <div className="border-t border-gray-200 pt-4 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-gray-900">Total</span>
                <span className="text-2xl font-bold text-primary-600">
                  RM {total.toFixed(2)}
                </span>
              </div>
              <div className="text-sm text-gray-500 mt-1">
                {bookingData.seats.length} seat{bookingData.seats.length !== 1 ? 's' : ''}
              </div>
            </div>
            
            {/* Security Note */}
            <div className="flex items-start space-x-2 text-xs text-gray-500 p-3 bg-gray-50 rounded-lg">
              <Shield className="w-4 h-4 text-success-500 mt-0.5 flex-shrink-0" />
              <span>Your payment is secured with 256-bit SSL encryption</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking; 