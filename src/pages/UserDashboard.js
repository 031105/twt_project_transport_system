import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  CreditCard, 
  Download,
  Eye,
  CheckCircle,
  AlertCircle,
  XCircle
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import BookingDetailsModal from '../components/BookingDetailsModal';
import BookingReceipt from '../components/BookingReceipt';

const UserDashboard = () => {
  const { currentUser } = useApp();
  const [userBookings, setUserBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  
  useEffect(() => {
    const loadBookings = async () => {
      if (!currentUser) return;
      
      setIsLoading(true);
      try {
        const token = localStorage.getItem('accessToken');
        
        if (!token) {
          console.log('No access token found');
          setUserBookings([]);
          setIsLoading(false);
          return;
        }
        
        const response = await fetch('http://localhost:5001/api/bookings', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (response.status === 401) {
          console.log('Token expired or invalid, user needs to login again');
          // Clear invalid token
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          setUserBookings([]);
          setIsLoading(false);
          return;
        }
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || `HTTP ${response.status}: Failed to load bookings`);
        }
        
        const data = await response.json();
        setUserBookings(data.data || []);
      } catch (error) {
        console.error('Failed to load bookings:', error);
        setUserBookings([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadBookings();
  }, [currentUser]);
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'text-success-600 bg-success-100';
      case 'pending':
        return 'text-warning-600 bg-warning-100';
      case 'cancelled':
        return 'text-danger-600 bg-danger-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };
  
  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="w-4 h-4" />;
      case 'pending':
        return <AlertCircle className="w-4 h-4" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const handleViewDetails = (booking) => {
    setSelectedBooking(booking);
    setShowDetailsModal(true);
  };

  const handleDownloadReceipt = (booking) => {
    setSelectedBooking(booking);
    setShowReceiptModal(true);
  };

  const closeModals = () => {
    setShowDetailsModal(false);
    setShowReceiptModal(false);
    setSelectedBooking(null);
  };
  

  
  const renderBookings = () => {
    if (isLoading) {
      return (
        <div className="text-center py-12">
          <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your bookings...</p>
        </div>
      );
    }
    
    if (userBookings.length === 0) {
      return (
        <div className="text-center py-12">
          <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings yet</h3>
          <p className="text-gray-600 mb-6">
            Start your journey by booking your first trip with us.
          </p>
          <Link to="/" className="btn-primary">
            Search Trips
          </Link>
        </div>
      );
    }
    
    return (
      <div className="space-y-4">
        {userBookings.map((booking) => (
          <div key={booking.id} className="card hover:shadow-lg transition-shadow duration-200">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {booking.route.name}
                    </h3>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(booking.bookingStatus)}`}>
                      {getStatusIcon(booking.bookingStatus)}
                      <span className="ml-1">{booking.bookingStatus.charAt(0).toUpperCase() + booking.bookingStatus.slice(1)}</span>
                    </span>
                  </div>
                  <div className="text-sm text-gray-500">
                    Ref: {booking.bookingReference}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center text-gray-600">
                    <MapPin className="w-4 h-4 mr-2 text-primary-500" />
                    <div>
                      <div className="font-medium text-gray-900">Route</div>
                      <div>{booking.route.origin} → {booking.route.destination}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center text-gray-600">
                    <Calendar className="w-4 h-4 mr-2 text-primary-500" />
                    <div>
                      <div className="font-medium text-gray-900">Travel Date</div>
                      <div>
                        {(() => {
                          try {
                            return booking.travelDate ? format(new Date(booking.travelDate), 'MMM dd, yyyy') : 'N/A';
                          } catch (error) {
                            return 'Invalid date';
                          }
                        })()}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center text-gray-600">
                    <CreditCard className="w-4 h-4 mr-2 text-primary-500" />
                    <div>
                      <div className="font-medium text-gray-900">Amount</div>
                      <div className="text-primary-600 font-semibold">RM {booking.totalAmount}</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 lg:mt-0 lg:ml-6 flex space-x-2">
                <button 
                  onClick={() => handleViewDetails(booking)}
                  className="btn-outline flex items-center space-x-2 text-sm px-3 py-2"
                >
                  <Eye className="w-4 h-4" />
                  <span>View Details</span>
                </button>
                <button 
                  onClick={() => handleDownloadReceipt(booking)}
                  className="btn-outline flex items-center space-x-2 text-sm px-3 py-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Download</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };
  
  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
        <p className="text-gray-600 mt-2">View and manage your travel bookings</p>
      </div>

      {/* Bookings Content */}
      <div>
        {renderBookings()}
      </div>

      {/* Modals */}
      {showDetailsModal && selectedBooking && (
        <BookingDetailsModal
          booking={selectedBooking}
          onClose={closeModals}
        />
      )}

      {showReceiptModal && selectedBooking && (
        <BookingReceipt
          booking={selectedBooking}
          trip={selectedBooking.trip}
          seats={[]} // You might want to load actual seat data
          passengerInfo={{
            name: 'Passenger Name', // You might want to load actual passenger data
            email: selectedBooking.contactEmail,
            phone: selectedBooking.contactPhone
          }}
          totalAmount={selectedBooking.totalAmount}
          onClose={closeModals}
        />
      )}
    </div>
  );
};

export default UserDashboard; 