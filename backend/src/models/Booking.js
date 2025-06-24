const { executeQuery } = require('../config/database');
const { v4: uuidv4 } = require('uuid');

class Booking {
  // Get user bookings
  static async getUserBookings(userId) {
    try {
      const query = `
        SELECT 
          b.*,
          t.trip_number,
          t.departure_datetime,
          t.estimated_arrival_datetime,
          r.name as route_name,
          orig.name as origin_name,
          orig.city as origin_city,
          orig.state as origin_state,
          orig.address as origin_address,
          dest.name as destination_name,
          dest.city as destination_city,
          dest.state as destination_state,
          dest.address as destination_address,
          vt.name as vehicle_type_name
        FROM bookings b
        LEFT JOIN trips t ON b.trip_id = t.id
        LEFT JOIN routes r ON t.route_id = r.id
        LEFT JOIN locations orig ON r.origin_id = orig.id
        LEFT JOIN locations dest ON r.destination_id = dest.id
        LEFT JOIN vehicles v ON t.vehicle_id = v.id
        LEFT JOIN vehicle_types vt ON v.vehicle_type_id = vt.id
        WHERE b.user_id = ?
        ORDER BY b.created_at DESC
      `;
      
      const results = await executeQuery(query, [userId]);
      return results.map(row => this.transformBookingData(row));
      
    } catch (error) {
      console.error('Error getting user bookings:', error);
      return [];
    }
  }

  // Transform booking data to match frontend format
  static transformBookingData(row) {
    return {
      id: row.id,
      bookingReference: row.booking_reference,
      bookingStatus: row.booking_status,
      paymentStatus: row.payment_status,
      totalAmount: parseFloat(row.total_amount),
      travelDate: row.travel_date,
      bookingDate: row.booking_date || row.created_at,
      passengerCount: row.passenger_count,
      contactEmail: row.contact_email,
      contactPhone: row.contact_phone,
      route: {
        id: row.route_id,
        name: row.route_name,
        origin: row.origin_city,
        destination: row.destination_city
      },
      trip: {
        id: row.trip_id,
        tripNumber: row.trip_number,
        departureDatetime: row.departure_datetime,
        arrivalDatetime: row.estimated_arrival_datetime
      },
      originLocation: {
        name: row.origin_name,
        city: row.origin_city,
        state: row.origin_state,
        address: row.origin_address
      },
      destinationLocation: {
        name: row.destination_name,
        city: row.destination_city,
        state: row.destination_state,
        address: row.destination_address
      },
      vehicleType: {
        name: row.vehicle_type_name || 'Luxury Coach'
      }
    };
  }

  // Create new booking
  static async createBooking(bookingData) {
    const {
      userId,
      tripId,
      totalAmount,
      travelDate,
      passengerCount,
      contactEmail,
      contactPhone,
      specialRequests
    } = bookingData;

    const bookingId = uuidv4();
    // Use system date 2025-06-24 for demo consistency
    const systemDate = new Date('2025-06-24');
    const bookingReference = `TBS${systemDate.getFullYear()}${String(systemDate.getMonth() + 1).padStart(2, '0')}${String(systemDate.getDate()).padStart(2, '0')}${Math.floor(Math.random() * 9000) + 1000}`;

    const query = `
      INSERT INTO bookings (
        id, booking_reference, user_id, trip_id, booking_status, payment_status,
        total_amount, travel_date, passenger_count, contact_email, contact_phone,
        special_requests, source_platform
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    await executeQuery(query, [
      bookingId,
      bookingReference,
      userId,
      tripId,
      'confirmed',
      'paid',
      totalAmount,
      travelDate,
      passengerCount,
      contactEmail,
      contactPhone,
      specialRequests || null,
      'web'
    ]);

    return {
      id: bookingId,
      bookingReference
    };
  }

  // Get booking by ID
  static async getBookingById(bookingId) {
    const query = `
      SELECT 
        b.*,
        t.trip_number,
        t.departure_datetime,
        t.estimated_arrival_datetime,
        r.name as route_name,
        orig.name as origin_name,
        orig.city as origin_city,
        orig.state as origin_state,
        orig.address as origin_address,
        dest.name as destination_name,
        dest.city as destination_city,
        dest.state as destination_state,
        dest.address as destination_address,
        vt.name as vehicle_type_name
      FROM bookings b
      LEFT JOIN trips t ON b.trip_id = t.id
      LEFT JOIN routes r ON t.route_id = r.id
      LEFT JOIN locations orig ON r.origin_id = orig.id
      LEFT JOIN locations dest ON r.destination_id = dest.id
      LEFT JOIN vehicles v ON t.vehicle_id = v.id
      LEFT JOIN vehicle_types vt ON v.vehicle_type_id = vt.id
      WHERE b.id = ?
    `;
    
    const results = await executeQuery(query, [bookingId]);
    return results.length > 0 ? this.transformBookingData(results[0]) : null;
  }

  // Update booking status
  static async updateBookingStatus(bookingId, status) {
    const query = `
      UPDATE bookings 
      SET booking_status = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;
    
    await executeQuery(query, [status, bookingId]);
  }

  // Get booking statistics
  static async getBookingStats() {
    const query = `
      SELECT 
        COUNT(*) as total_bookings,
        SUM(CASE WHEN booking_status = 'confirmed' THEN 1 ELSE 0 END) as confirmed_bookings,
        SUM(CASE WHEN booking_status = 'pending' THEN 1 ELSE 0 END) as pending_bookings,
        SUM(CASE WHEN booking_status = 'cancelled' THEN 1 ELSE 0 END) as cancelled_bookings,
        SUM(total_amount) as total_revenue,
        AVG(total_amount) as avg_booking_value
      FROM bookings
      WHERE booking_date >= DATE_SUB(NOW(), INTERVAL 30 DAY)
    `;
    
    const results = await executeQuery(query);
    return results[0];
  }
}

module.exports = Booking; 