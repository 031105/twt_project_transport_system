import React from 'react';
import { format } from 'date-fns';
import { 
  MapPin, 
  Calendar, 
  Clock, 
  Users, 
  CreditCard,
  Bus,
  Phone,
  Mail,
  CheckCircle,
  ArrowRight,
  Printer,
  Download,
  X,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../context/AppContext';

const BookingReceipt = ({ booking, trip, seats, passengerInfo, onClose, totalAmount }) => {
  const { systemDate } = useApp();
  const currentDate = new Date(systemDate);
  
  // Helper function to calculate total amount with fallback logic
  const calculateTotalAmount = () => {
    // Priority order for total amount calculation
    if (totalAmount && totalAmount > 0) return totalAmount;
    if (booking?.totalAmount && booking.totalAmount > 0) return booking.totalAmount;
    if (booking?.total_amount && booking.total_amount > 0) return booking.total_amount;
    if (trip?.basePrice && trip.basePrice > 0) return trip.basePrice;
    if (trip?.base_price && trip.base_price > 0) return trip.base_price;
    if (trip?.price && trip.price > 0) return trip.price;
    
    // Calculate from seats if available
    if (seats && seats.length > 0) {
      const seatsTotal = seats.reduce((total, seat) => {
        const seatPrice = seat.price || seat.amount || seat.cost || 0;
        return total + seatPrice;
      }, 0);
      if (seatsTotal > 0) return seatsTotal;
    }
    
    // Ultimate fallback
    return 45.00;
  };

  // Helper function to format price consistently
  const formatPrice = (amount) => {
    const price = parseFloat(amount || 0);
    return price.toFixed(2);
  };

  // Get the calculated total amount
  const calculatedTotal = calculateTotalAmount();
  
  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // Create a new window for PDF generation with enhanced styling
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Booking Receipt - ${booking.bookingReference}</title>
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              line-height: 1.6;
              color: #1f2937;
              background: #ffffff;
              font-size: 14px;
            }
            
            .receipt-container {
              max-width: 210mm;
              margin: 0 auto;
              padding: 15mm;
              background: white;
              box-shadow: 0 0 20px rgba(0,0,0,0.1);
            }
            
            .header {
              text-align: center;
              border-bottom: 3px solid #2563eb;
              padding-bottom: 20px;
              margin-bottom: 30px;
              background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
              padding: 25px;
              border-radius: 12px;
              margin-bottom: 25px;
            }
            
            .company-logo {
              font-size: 32px;
              font-weight: 800;
              color: #2563eb;
              margin-bottom: 8px;
              text-transform: uppercase;
              letter-spacing: 2px;
            }
            
            .receipt-title {
              font-size: 28px;
              font-weight: 700;
              margin-bottom: 8px;
              color: #1f2937;
              letter-spacing: 1px;
            }
            
            .receipt-subtitle {
              color: #6b7280;
              font-size: 16px;
              font-weight: 500;
            }
            
            .booking-reference {
              background: #2563eb;
              color: white;
              padding: 12px 24px;
              border-radius: 25px;
              font-size: 18px;
              font-weight: 700;
              margin-top: 20px;
              display: inline-block;
              letter-spacing: 1px;
            }
            
            .section {
              margin-bottom: 25px;
              background: #ffffff;
              border-radius: 12px;
              overflow: hidden;
            }
            
            .section-header {
              background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
              color: white;
              padding: 15px 20px;
              font-size: 18px;
              font-weight: 600;
              display: flex;
              align-items: center;
            }
            
            .section-header svg {
              margin-right: 10px;
            }
            
            .section-content {
              padding: 20px;
              background: #f9fafb;
              border: 1px solid #e5e7eb;
              border-top: none;
            }
            
            .route-visual {
              background: white;
              padding: 25px;
              border-radius: 12px;
              margin-bottom: 20px;
              box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            }
            
            .route-cities {
              display: flex;
              align-items: center;
              justify-content: space-between;
              margin-bottom: 25px;
            }
            
            .city {
              text-align: center;
              flex: 1;
              padding: 0 15px;
            }
            
            .city-name {
              font-size: 24px;
              font-weight: 700;
              color: #1f2937;
              margin-bottom: 8px;
            }
            
            .terminal-name {
              font-size: 16px;
              color: #4b5563;
              font-weight: 600;
              margin-bottom: 4px;
            }
            
            .terminal-address {
              font-size: 12px;
              color: #6b7280;
              margin-bottom: 12px;
            }
            
            .departure-time {
              font-size: 20px;
              font-weight: 700;
              color: #2563eb;
              background: #eff6ff;
              padding: 8px 16px;
              border-radius: 20px;
              display: inline-block;
            }
            
            .route-arrow {
              font-size: 32px;
              color: #2563eb;
              font-weight: bold;
              margin: 0 20px;
            }
            
            .total-amount {
              background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
              color: white;
              text-align: center;
              padding: 20px;
              border-radius: 12px;
              margin-top: 20px;
            }
            
            .amount-value {
              font-size: 32px;
              font-weight: 800;
              margin-bottom: 5px;
            }
            
            .amount-label {
              font-size: 14px;
              opacity: 0.9;
              text-transform: uppercase;
              letter-spacing: 1px;
            }
            
            .info-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 30px;
            }
            
            .info-item {
              display: flex;
              justify-content: space-between;
              align-items: center;
              padding: 10px 0;
              border-bottom: 1px solid #e5e7eb;
            }
            
            .info-item:last-child {
              border-bottom: none;
            }
            
            .info-label {
              font-weight: 600;
              color: #4b5563;
              flex: 1;
            }
            
            .info-value {
              font-weight: 700;
              color: #1f2937;
              text-align: right;
              flex: 1;
            }
            
            .seats-grid {
              display: flex;
              flex-wrap: wrap;
              gap: 8px;
              margin-top: 15px;
            }
            
            .seat-item {
              background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
              color: white;
              padding: 8px 16px;
              border-radius: 20px;
              font-size: 14px;
              font-weight: 600;
              box-shadow: 0 2px 4px rgba(37, 99, 235, 0.3);
            }
            
            .status-badge {
              display: inline-flex;
              align-items: center;
              background: #10b981;
              color: white;
              padding: 6px 12px;
              border-radius: 15px;
              font-size: 14px;
              font-weight: 600;
            }
            
            .status-badge svg {
              margin-right: 5px;
              width: 16px;
              height: 16px;
            }
            
            .important-notice {
              background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
              border: 2px solid #f59e0b;
              border-radius: 12px;
              padding: 20px;
              margin: 25px 0;
            }
            
            .notice-title {
              color: #92400e;
              font-size: 18px;
              font-weight: 700;
              margin-bottom: 15px;
              display: flex;
              align-items: center;
            }
            
            .notice-title svg {
              margin-right: 8px;
            }
            
            .notice-list {
              list-style: none;
              padding: 0;
            }
            
            .notice-item {
              color: #92400e;
              margin-bottom: 12px;
              padding-left: 20px;
              position: relative;
              font-weight: 500;
            }
            
            .notice-item:before {
              content: "⚠";
              position: absolute;
              left: 0;
              color: #f59e0b;
              font-weight: bold;
            }
            
            .footer {
              text-align: center;
              margin-top: 40px;
              padding-top: 25px;
              border-top: 2px solid #e5e7eb;
              color: #6b7280;
            }
            
            .company-info {
              font-weight: 600;
              color: #1f2937;
              margin-bottom: 10px;
              font-size: 16px;
            }
            
            .contact-info {
              font-size: 14px;
              margin-bottom: 8px;
            }
            
            .generated-info {
              font-size: 12px;
              color: #9ca3af;
              margin-top: 15px;
              font-style: italic;
            }
            
            .qr-placeholder {
              width: 100px;
              height: 100px;
              background: #f3f4f6;
              border: 2px dashed #d1d5db;
              border-radius: 8px;
              display: flex;
              align-items: center;
              justify-content: center;
              margin: 20px auto;
              font-size: 12px;
              color: #6b7280;
            }
            
            @media print {
              body {
                -webkit-print-color-adjust: exact;
                color-adjust: exact;
              }
              
              .receipt-container {
                max-width: none;
                margin: 0;
                padding: 10mm;
                box-shadow: none;
              }
              
              .section {
                page-break-inside: avoid;
              }
              
              .important-notice {
                page-break-inside: avoid;
              }
              
              .info-grid {
                grid-template-columns: 1fr;
                gap: 15px;
              }
            }
            
            @page {
              size: A4;
              margin: 10mm;
            }
          </style>
        </head>
        <body>
          <div class="receipt-container">
            ${document.getElementById('receipt-content').innerHTML}
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <>
      <style>
        {`
          .receipt-screen-styles .header {
            text-align: center;
            background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
            padding: 25px;
            border-radius: 12px;
            margin-bottom: 25px;
            border-bottom: 3px solid #2563eb;
          }
          
          .receipt-screen-styles .company-logo {
            font-size: 32px;
            font-weight: 800;
            color: #2563eb;
            margin-bottom: 8px;
            text-transform: uppercase;
            letter-spacing: 2px;
          }
          
          .receipt-screen-styles .receipt-title {
            font-size: 28px;
            font-weight: 700;
            margin-bottom: 8px;
            color: #1f2937;
            letter-spacing: 1px;
          }
          
          .receipt-screen-styles .receipt-subtitle {
            color: #6b7280;
            font-size: 16px;
            font-weight: 500;
          }
          
          .receipt-screen-styles .booking-reference {
            background: #2563eb;
            color: white;
            padding: 12px 24px;
            border-radius: 25px;
            font-size: 18px;
            font-weight: 700;
            margin-top: 20px;
            display: inline-block;
            letter-spacing: 1px;
          }
          
          .receipt-screen-styles .section {
            margin-bottom: 25px;
            background: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          }
          
          .receipt-screen-styles .section-header {
            background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
            color: white;
            padding: 15px 20px;
            font-size: 18px;
            font-weight: 600;
            display: flex;
            align-items: center;
          }
          
          .receipt-screen-styles .section-content {
            padding: 20px;
            background: #f9fafb;
            border: 1px solid #e5e7eb;
            border-top: none;
          }
          
          .receipt-screen-styles .route-visual {
            background: white;
            padding: 25px;
            border-radius: 12px;
            margin-bottom: 20px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          }
          
          .receipt-screen-styles .route-cities {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 25px;
          }
          
          .receipt-screen-styles .city {
            text-align: center;
            flex: 1;
            padding: 0 15px;
          }
          
          .receipt-screen-styles .city-name {
            font-size: 24px;
            font-weight: 700;
            color: #1f2937;
            margin-bottom: 8px;
          }
          
          .receipt-screen-styles .terminal-name {
            font-size: 16px;
            color: #4b5563;
            font-weight: 600;
            margin-bottom: 4px;
          }
          
          .receipt-screen-styles .terminal-address {
            font-size: 14px;
            color: #6b7280;
            margin-bottom: 15px;
          }
          
          .receipt-screen-styles .departure-time {
            font-size: 32px;
            font-weight: 700;
            color: #2563eb;
          }
          
          .receipt-screen-styles .route-arrow {
            font-size: 36px;
            color: #2563eb;
            font-weight: bold;
          }
          
          .receipt-screen-styles .total-amount {
            background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
            color: white;
            padding: 20px;
            border-radius: 15px;
            text-align: center;
          }
          
          .receipt-screen-styles .amount-value {
            font-size: 42px;
            font-weight: 800;
            margin-bottom: 5px;
          }
          
          .receipt-screen-styles .amount-label {
            font-size: 16px;
            font-weight: 500;
            opacity: 0.9;
          }
          
          .receipt-screen-styles .info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 25px;
          }
          
          .receipt-screen-styles .info-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 8px 0;
            border-bottom: 1px solid #e5e7eb;
          }
          
          .receipt-screen-styles .info-label {
            color: #6b7280;
            font-weight: 500;
          }
          
          .receipt-screen-styles .info-value {
            font-weight: 600;
            color: #1f2937;
          }
          
          .receipt-screen-styles .status-badge {
            display: flex;
            align-items: center;
            gap: 6px;
            background: #10b981;
            color: white;
            padding: 6px 12px;
            border-radius: 20px;
            font-size: 14px;
            font-weight: 600;
          }
          
          .receipt-screen-styles .seats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 10px;
          }
          
          .receipt-screen-styles .seat-item {
            background: #e0f2fe;
            color: #0369a1;
            padding: 10px 15px;
            border-radius: 8px;
            font-weight: 600;
            text-align: center;
          }
          
          .receipt-screen-styles .important-notice {
            background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
            border: 2px solid #f59e0b;
            border-radius: 12px;
            padding: 20px;
            margin: 25px 0;
          }
          
          .receipt-screen-styles .notice-title {
            display: flex;
            align-items: center;
            gap: 10px;
            font-size: 18px;
            font-weight: 700;
            color: #92400e;
            margin-bottom: 15px;
          }
          
          .receipt-screen-styles .notice-list {
            list-style: none;
            margin: 0;
            padding: 0;
          }
          
          .receipt-screen-styles .notice-item {
            padding: 8px 0;
            color: #92400e;
            font-weight: 500;
            position: relative;
            padding-left: 20px;
          }
          
          .receipt-screen-styles .notice-item:before {
            content: "•";
            color: #f59e0b;
            font-weight: bold;
            position: absolute;
            left: 0;
          }
          
          .receipt-screen-styles .qr-placeholder {
            width: 120px;
            height: 120px;
            background: #f3f4f6;
            border: 2px dashed #9ca3af;
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 20px auto;
            font-weight: 600;
            color: #6b7280;
          }
          
          .receipt-screen-styles .footer {
            background: #f8fafc;
            padding: 20px;
            border-radius: 12px;
            margin-top: 30px;
            text-align: center;
            border-top: 3px solid #2563eb;
          }
          
          .receipt-screen-styles .company-info {
            font-size: 18px;
            font-weight: 700;
            color: #1f2937;
            margin-bottom: 8px;
          }
          
          .receipt-screen-styles .contact-info {
            font-size: 14px;
            color: #6b7280;
            margin-bottom: 4px;
          }
          
          .receipt-screen-styles .generated-info {
            font-size: 12px;
            color: #9ca3af;
            margin-top: 15px;
            font-style: italic;
          }
          
          @media (max-width: 768px) {
            .receipt-screen-styles .info-grid {
              grid-template-columns: 1fr;
              gap: 15px;
            }
            
            .receipt-screen-styles .route-cities {
              flex-direction: column;
              gap: 20px;
            }
            
            .receipt-screen-styles .route-arrow {
              transform: rotate(90deg);
            }
          }
        `}
      </style>
      
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-5xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header Controls */}
          <div className="flex justify-between items-center p-6 border-b bg-gray-50 no-print">
            <h2 className="text-2xl font-bold text-gray-800">Booking Receipt</h2>
          <div className="flex space-x-3">
            <button
              onClick={handlePrint}
                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
                <Printer className="w-4 h-4" />
              <span>Print</span>
            </button>
            <button
              onClick={handleDownload}
                className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
                <Download className="w-4 h-4" />
              <span>Download PDF</span>
            </button>
            <button
              onClick={onClose}
                className="flex items-center space-x-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
                <X className="w-4 h-4" />
                <span>Close</span>
            </button>
          </div>
        </div>

        {/* Receipt Content */}
          <div id="receipt-content" className="p-6 receipt-screen-styles">
          {/* Header */}
            <div className="header">
              <div className="company-logo">🚌 TransportBook</div>
              <div className="receipt-title">BOOKING RECEIPT</div>
              <div className="receipt-subtitle">Official Travel Document</div>
              <div className="booking-reference">
                Booking Reference: {booking.bookingReference || booking.booking_reference || booking.id || 'TBS202506243812'}
            </div>
          </div>

          {/* Trip Route Section */}
            <div className="section">
              <div className="section-header">
                <MapPin className="w-5 h-5" />
              Trip Details
              </div>
              <div className="section-content">
                <div className="route-visual">
                  <div className="route-cities">
                    <div className="city">
                      <div className="city-name">{trip.originLocation?.city || trip.origin_city || 'Kuala Lumpur'}</div>
                      <div className="terminal-name">{trip.originLocation?.name || trip.origin_name || 'KL Sentral Terminal'}</div>
                      <div className="terminal-address">{trip.originLocation?.address || trip.origin_address || 'KL Sentral Station, 50470 Kuala Lumpur'}</div>
                      <div className="departure-time">
                  {(() => {
                    try {
                            const departureTime = trip.departureDatetime || trip.departure_datetime || trip.departure_time;
                            return departureTime ? format(new Date(departureTime), 'HH:mm') : '08:00';
                    } catch (error) {
                            return '08:00';
                    }
                  })()}
                </div>
              </div>
              
                    <div className="route-arrow">→</div>
                    
                    <div className="city">
                      <div className="city-name">{trip.destinationLocation?.city || trip.destination_city || 'Johor Bahru'}</div>
                      <div className="terminal-name">{trip.destinationLocation?.name || trip.destination_name || 'Terminal Bersepadu Selatan JB'}</div>
                      <div className="terminal-address">{trip.destinationLocation?.address || trip.destination_address || 'Jalan Tun Abdul Razak, 80000 Johor Bahru'}</div>
                      <div className="departure-time">
                  {(() => {
                    try {
                            const arrivalTime = trip.estimatedArrivalDatetime || trip.estimated_arrival_datetime || trip.arrivalDatetime || trip.arrival_datetime || trip.arrival_time;
                            return arrivalTime ? format(new Date(arrivalTime), 'HH:mm') : '12:30';
                    } catch (error) {
                            return '12:30';
                    }
                  })()}
                </div>
              </div>
            </div>

                  <div className="total-amount">
                    <div className="amount-value">RM {formatPrice(calculatedTotal)}</div>
                    <div className="amount-label">Total Amount</div>
                  </div>
                </div>
              </div>
          </div>

            {/* Information Grid */}
            <div className="info-grid">
              <div className="section">
                <div className="section-header">
                  <Calendar className="w-5 h-5" />
                Travel Information
                </div>
                <div className="section-content">
                  <div className="info-item">
                    <span className="info-label">Travel Date</span>
                    <span className="info-value">
                    {(() => {
                      try {
                          const travelDate = trip.departureDatetime || trip.departure_datetime || trip.travelDate || trip.travel_date;
                          return travelDate ? format(new Date(travelDate), 'EEEE, MMMM dd, yyyy') : 'Wednesday, June 25, 2025';
                      } catch (error) {
                          return 'Wednesday, June 25, 2025';
                      }
                    })()}
                  </span>
                </div>
                  <div className="info-item">
                    <span className="info-label">Departure Time</span>
                    <span className="info-value">
                    {(() => {
                      try {
                          const departureTime = trip.departureDatetime || trip.departure_datetime || trip.departure_time;
                          return departureTime ? format(new Date(departureTime), 'HH:mm') : '08:00';
                      } catch (error) {
                          return '08:00';
                      }
                    })()}
                  </span>
                </div>
                  <div className="info-item">
                    <span className="info-label">Trip Number</span>
                    <span className="info-value">{trip.tripNumber || trip.trip_number || 'TWT240101001'}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Vehicle Type</span>
                    <span className="info-value">{trip.vehicleType?.name || trip.vehicle_type || 'Luxury Coach'}</span>
                </div>
              </div>
            </div>

              <div className="section">
                <div className="section-header">
                  <Users className="w-5 h-5" />
                Passenger Information
                </div>
                <div className="section-content">
                  <div className="info-item">
                    <span className="info-label">Name</span>
                    <span className="info-value">{passengerInfo?.name || booking.passenger_name || 'Passenger Name'}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Email</span>
                    <span className="info-value">{passengerInfo?.email || booking.contactEmail || booking.contact_email || 'john.doe@email.com'}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Phone</span>
                    <span className="info-value">{passengerInfo?.phone || booking.contactPhone || booking.contact_phone || '0192823823'}</span>
                </div>
                  <div className="info-item">
                    <span className="info-label">Passengers</span>
                    <span className="info-value">{seats?.length || booking.passengerCount || booking.passenger_count || 1}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Selected Seats */}
          {seats && seats.length > 0 && (
              <div className="section">
                <div className="section-header">
                  <Bus className="w-5 h-5" />
                  Selected Seats
                </div>
                <div className="section-content">
                  <div className="seats-grid">
                {seats.map((seat, index) => (
                      <div key={index} className="seat-item">
                        Seat {seat.seatNumber || seat.seat_number || `${index + 1}B`} - RM {formatPrice(seat.price || seat.amount || seat.cost || calculatedTotal)}
                  </div>
                ))}
                  </div>
              </div>
            </div>
          )}

          {/* Payment Information */}
            <div className="section">
              <div className="section-header">
                <CreditCard className="w-5 h-5" />
              Payment Information
              </div>
              <div className="section-content">
                <div className="info-grid">
              <div>
                    <div className="info-item">
                      <span className="info-label">Booking Status</span>
                      <span className="status-badge">
                        <CheckCircle className="w-4 h-4" />
                        {booking.bookingStatus || booking.booking_status || 'Confirmed'}
                  </span>
                </div>
                    <div className="info-item">
                      <span className="info-label">Payment Status</span>
                      <span className="status-badge">
                        <CheckCircle className="w-4 h-4" />
                        {booking.paymentStatus || booking.payment_status || 'Paid'}
                  </span>
                </div>
              </div>
              <div>
                    <div className="info-item">
                      <span className="info-label">Booking Date</span>
                      <span className="info-value">{format(currentDate, 'MMM dd, yyyy HH:mm')}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Payment Method</span>
                      <span className="info-value">Credit/Debit Card</span>
                    </div>
                </div>
              </div>
            </div>
          </div>

          {/* Important Information */}
            <div className="important-notice">
              <div className="notice-title">
                <AlertCircle className="w-5 h-5" />
                Important Information
              </div>
              <ul className="notice-list">
                <li className="notice-item">Please arrive at the terminal at least 15 minutes before departure</li>
                <li className="notice-item">Bring a valid ID for boarding verification</li>
                <li className="notice-item">Free cancellation up to 24 hours before departure</li>
                <li className="notice-item">Keep this booking reference for your records</li>
                <li className="notice-item">For assistance, contact us at +60 3-1234 5678 or support@transportbook.com</li>
            </ul>
          </div>

            {/* QR Code Placeholder */}
            <div className="text-center">
              <div className="qr-placeholder">
                QR Code
              </div>
              <p className="text-sm text-gray-500">Scan for quick check-in</p>
            </div>

            {/* Footer */}
            <div className="footer">
              <div className="company-info">TransportBook Sdn Bhd</div>
              <div className="contact-info">
              Level 10, Menara TM, Jalan Pantai Baharu, 50672 Kuala Lumpur, Malaysia
            </div>
              <div className="contact-info">
              Tel: +60 3-1234 5678 | Email: support@transportbook.com | Web: www.transportbook.com
            </div>
              <div className="generated-info">
              Generated on {format(currentDate, 'EEEE, MMMM dd, yyyy \'at\' HH:mm')}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BookingReceipt; 