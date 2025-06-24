const { executeQuery } = require('../config/database');
const { v4: uuidv4 } = require('uuid');

class Trip {
  constructor(data) {
    this.id = data.id;
    this.trip_number = data.trip_number;
    this.schedule_id = data.schedule_id;
    this.vehicle_id = data.vehicle_id;
    this.route_id = data.route_id;
    this.departure_datetime = data.departure_datetime;
    this.estimated_arrival_datetime = data.estimated_arrival_datetime;
    this.actual_departure_datetime = data.actual_departure_datetime;
    this.actual_arrival_datetime = data.actual_arrival_datetime;
    this.status = data.status;
    this.cancellation_reason = data.cancellation_reason;
    this.delay_minutes = data.delay_minutes;
    this.available_seats = data.available_seats;
    this.total_seats = data.total_seats;
    this.base_price = data.base_price;
    this.dynamic_pricing_enabled = data.dynamic_pricing_enabled;
    this.weather_conditions = data.weather_conditions;
    this.traffic_conditions = data.traffic_conditions;
    this.driver_primary_id = data.driver_primary_id;
    this.driver_secondary_id = data.driver_secondary_id;
    this.conductor_id = data.conductor_id;
    this.special_notes = data.special_notes;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }

  static async findAll(filters = {}) {
    try {
      let query = `
        SELECT 
          t.*,
          r.name as route_name,
          r.route_code,
          r.distance_km,
          r.estimated_duration_minutes,
          r.route_type,
          origin.id as origin_id,
          origin.name as origin_name,
          origin.city as origin_city,
          origin.state as origin_state,
          origin.address as origin_address,
          origin.latitude as origin_latitude,
          origin.longitude as origin_longitude,
          dest.id as destination_id,
          dest.name as destination_name,
          dest.city as destination_city,
          dest.state as destination_state,
          dest.address as destination_address,
          dest.latitude as destination_latitude,
          dest.longitude as destination_longitude,
          v.license_plate,
          vt.name as vehicle_type_name,
          vt.capacity as vehicle_capacity
        FROM trips t
        LEFT JOIN routes r ON t.route_id = r.id
        LEFT JOIN locations origin ON r.origin_id = origin.id
        LEFT JOIN locations dest ON r.destination_id = dest.id
        LEFT JOIN vehicles v ON t.vehicle_id = v.id
        LEFT JOIN vehicle_types vt ON v.vehicle_type_id = vt.id
        WHERE 1=1
      `;
      
      const params = [];
      
      if (filters.status) {
        query += ' AND t.status = ?';
        params.push(filters.status);
      }
      
      if (filters.route_id) {
        query += ' AND t.route_id = ?';
        params.push(filters.route_id);
      }
      
      if (filters.departure_date) {
        query += ' AND DATE(t.departure_datetime) = ?';
        params.push(filters.departure_date);
      }
      
      if (filters.origin_id) {
        query += ' AND r.origin_id = ?';
        params.push(filters.origin_id);
      }
      
      if (filters.destination_id) {
        query += ' AND r.destination_id = ?';
        params.push(filters.destination_id);
      }
      
      query += ' ORDER BY t.departure_datetime ASC';
      
      if (filters.limit) {
        query += ' LIMIT ?';
        params.push(parseInt(filters.limit));
      }
      
      const results = await executeQuery(query, params);
      return results.map(row => ({
        id: row.id,
        tripNumber: row.trip_number,
        departureDatetime: row.departure_datetime,
        estimatedArrivalDatetime: row.estimated_arrival_datetime,
        actualDepartureDatetime: row.actual_departure_datetime,
        actualArrivalDatetime: row.actual_arrival_datetime,
        status: row.status,
        cancellationReason: row.cancellation_reason,
        delayMinutes: row.delay_minutes,
        availableSeats: row.available_seats || 0,
        totalSeats: row.total_seats || 0,
        price: parseFloat(row.base_price || 0),
        dynamicPricingEnabled: row.dynamic_pricing_enabled,
        weatherConditions: row.weather_conditions,
        trafficConditions: row.traffic_conditions,
        specialNotes: row.special_notes,
        route: {
          id: row.route_id,
          name: row.route_name || 'Unknown Route',
          code: row.route_code,
          distanceKm: parseFloat(row.distance_km || 0),
          estimatedDurationMinutes: row.estimated_duration_minutes || 120,
          routeType: row.route_type || 'standard'
        },
        originLocation: {
          id: row.origin_id,
          name: row.origin_name || 'Unknown',
          city: row.origin_city || 'Unknown',
          state: row.origin_state,
          address: row.origin_address,
          latitude: row.origin_latitude,
          longitude: row.origin_longitude
        },
        destinationLocation: {
          id: row.destination_id,
          name: row.destination_name || 'Unknown',
          city: row.destination_city || 'Unknown',
          state: row.destination_state,
          address: row.destination_address,
          latitude: row.destination_latitude,
          longitude: row.destination_longitude
        },
        vehicle: {
          id: row.vehicle_id,
          licensePlate: row.license_plate || 'Unknown'
        },
        vehicleType: {
          name: row.vehicle_type_name || 'Standard Bus',
          capacity: row.vehicle_capacity || 40
        }
      }));
    } catch (error) {
      console.error('Error fetching trips:', error);
      throw error;
    }
  }

  static async findById(id) {
    try {
      const query = `
        SELECT 
          t.*,
          r.name as route_name,
          r.route_code,
          r.distance_km,
          r.estimated_duration_minutes,
          r.route_type,
          origin.id as origin_id,
          origin.name as origin_name,
          origin.city as origin_city,
          origin.state as origin_state,
          origin.address as origin_address,
          origin.latitude as origin_latitude,
          origin.longitude as origin_longitude,
          dest.id as destination_id,
          dest.name as destination_name,
          dest.city as destination_city,
          dest.state as destination_state,
          dest.address as destination_address,
          dest.latitude as destination_latitude,
          dest.longitude as destination_longitude,
          v.license_plate,
          vt.name as vehicle_type_name,
          vt.capacity as vehicle_capacity
        FROM trips t
        LEFT JOIN routes r ON t.route_id = r.id
        LEFT JOIN locations origin ON r.origin_id = origin.id
        LEFT JOIN locations dest ON r.destination_id = dest.id
        LEFT JOIN vehicles v ON t.vehicle_id = v.id
        LEFT JOIN vehicle_types vt ON v.vehicle_type_id = vt.id
        WHERE t.id = ?
      `;
      
      const results = await executeQuery(query, [id]);
      if (results.length === 0) return null;
      
      const row = results[0];
      const trip = {
        id: row.id,
        tripNumber: row.trip_number,
        departureDatetime: row.departure_datetime,
        estimatedArrivalDatetime: row.estimated_arrival_datetime,
        actualDepartureDatetime: row.actual_departure_datetime,
        actualArrivalDatetime: row.actual_arrival_datetime,
        status: row.status,
        cancellationReason: row.cancellation_reason,
        delayMinutes: row.delay_minutes,
        availableSeats: row.available_seats || 0,
        totalSeats: row.total_seats || 0,
        basePrice: parseFloat(row.base_price || 0),
        dynamicPricingEnabled: row.dynamic_pricing_enabled || false,
        weatherConditions: row.weather_conditions,
        trafficConditions: row.traffic_conditions,
        specialNotes: row.special_notes,
        route: {
          id: row.route_id,
          name: row.route_name || 'Unknown Route',
          code: row.route_code,
          distanceKm: parseFloat(row.distance_km || 0),
          estimatedDurationMinutes: row.estimated_duration_minutes || 120,
          routeType: row.route_type || 'standard'
        },
        originLocation: {
          id: row.origin_id,
          name: row.origin_name || 'Unknown',
          city: row.origin_city || 'Unknown',
          state: row.origin_state,
          address: row.origin_address,
          latitude: row.origin_latitude,
          longitude: row.origin_longitude
        },
        destinationLocation: {
          id: row.destination_id,
          name: row.destination_name || 'Unknown',
          city: row.destination_city || 'Unknown',
          state: row.destination_state,
          address: row.destination_address,
          latitude: row.destination_latitude,
          longitude: row.destination_longitude
        },
        vehicle: {
          id: row.vehicle_id,
          licensePlate: row.license_plate || 'Unknown'
        },
        vehicleType: {
          name: row.vehicle_type_name || 'Standard Bus',
          capacity: row.vehicle_capacity || 40
        }
      };

      // Fetch route stops for this trip
      const stopsQuery = `
        SELECT 
          rs.*,
          l.name as location_name,
          l.city as location_city,
          l.state as location_state,
          l.address as location_address,
          l.latitude as location_latitude,
          l.longitude as location_longitude
        FROM route_stops rs
        LEFT JOIN locations l ON rs.location_id = l.id
        WHERE rs.route_id = ?
        ORDER BY rs.stop_order
      `;
      
      const stopsResults = await executeQuery(stopsQuery, [row.route_id]);
      trip.routeStops = stopsResults.map(stop => ({
        id: stop.id,
        locationId: stop.location_id,
        stopOrder: stop.stop_order,
        arrivalOffsetMinutes: stop.arrival_offset_minutes,
        departureOffsetMinutes: stop.departure_offset_minutes,
        priceFromOrigin: parseFloat(stop.price_from_origin || 0),
        distanceFromOriginKm: parseFloat(stop.distance_from_origin_km || 0),
        boardingAllowed: stop.boarding_allowed,
        alightingAllowed: stop.alighting_allowed,
        location: {
          id: stop.location_id,
          name: stop.location_name,
          city: stop.location_city,
          state: stop.location_state,
          address: stop.location_address,
          latitude: stop.location_latitude,
          longitude: stop.location_longitude
        }
      }));
      
      return trip;
    } catch (error) {
      console.error('Error fetching trip by ID:', error);
      throw error;
    }
  }

  static async searchTrips(searchParams) {
    try {
      let query = `
        SELECT 
          t.*,
          r.name as route_name,
          r.route_code,
          r.distance_km,
          r.estimated_duration_minutes,
          r.route_type,
          origin.id as origin_id,
          origin.name as origin_name,
          origin.city as origin_city,
          origin.state as origin_state,
          origin.address as origin_address,
          origin.latitude as origin_latitude,
          origin.longitude as origin_longitude,
          dest.id as destination_id,
          dest.name as destination_name,
          dest.city as destination_city,
          dest.state as destination_state,
          dest.address as destination_address,
          dest.latitude as destination_latitude,
          dest.longitude as destination_longitude,
          v.license_plate,
          v.id as vehicle_id,
          vt.name as vehicle_type_name,
          vt.capacity as vehicle_capacity
        FROM trips t
        LEFT JOIN routes r ON t.route_id = r.id
        LEFT JOIN locations origin ON r.origin_id = origin.id
        LEFT JOIN locations dest ON r.destination_id = dest.id
        LEFT JOIN vehicles v ON t.vehicle_id = v.id
        LEFT JOIN vehicle_types vt ON v.vehicle_type_id = vt.id
        WHERE t.status = 'scheduled'
      `;
      
      const params = [];
      
      if (searchParams.origin) {
        query += ' AND r.origin_id = ?';
        params.push(searchParams.origin);
      }
      
      if (searchParams.destination) {
        query += ' AND r.destination_id = ?';
        params.push(searchParams.destination);
      }
      
      if (searchParams.departureDate) {
        // Use a date range to cover the entire day, avoiding timezone issues
        const startDate = new Date(searchParams.departureDate);
        startDate.setHours(0, 0, 0, 0);
        
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + 1);

        query += ' AND t.departure_datetime >= ? AND t.departure_datetime < ?';
        params.push(startDate, endDate);
      }
      
      if (searchParams.passengers) {
        query += ' AND t.available_seats >= ?';
        params.push(parseInt(searchParams.passengers));
      }
      
      query += ' ORDER BY t.departure_datetime ASC';
      
      const results = await executeQuery(query, params);
      return results.map(row => ({
        id: row.id,
        tripNumber: row.trip_number,
        departureDatetime: row.departure_datetime,
        estimatedArrivalDatetime: row.estimated_arrival_datetime,
        status: row.status,
        availableSeats: row.available_seats || 0,
        totalSeats: row.total_seats || 0,
        price: parseFloat(row.base_price || 0),
        next_departure: row.departure_datetime,
        route: {
          id: row.route_id,
          name: row.route_name || 'Unknown Route',
          code: row.route_code,
          distanceKm: parseFloat(row.distance_km || 0),
          estimatedDurationMinutes: row.estimated_duration_minutes || 120,
          routeType: row.route_type || 'standard',
          next_departure: row.departure_datetime
        },
        originLocation: {
          id: row.origin_id,
          name: row.origin_name || 'Unknown',
          city: row.origin_city || 'Unknown',
          state: row.origin_state,
          address: row.origin_address,
          latitude: row.origin_latitude,
          longitude: row.origin_longitude
        },
        destinationLocation: {
          id: row.destination_id,
          name: row.destination_name || 'Unknown',
          city: row.destination_city || 'Unknown',
          state: row.destination_state,
          address: row.destination_address,
          latitude: row.destination_latitude,
          longitude: row.destination_longitude
        },
        vehicle: {
          id: row.vehicle_id,
          licensePlate: row.license_plate || 'Unknown'
        },
        vehicleType: {
          name: row.vehicle_type_name || 'Standard Bus',
          capacity: row.vehicle_capacity || 40
        }
      }));
    } catch (error) {
      console.error('Error searching trips:', error);
      throw error;
    }
  }

  // Get trips statistics
  static async getTripStats() {
    const query = `
      SELECT 
        COUNT(*) as total_trips,
        SUM(CASE WHEN status = 'scheduled' THEN 1 ELSE 0 END) as scheduled_trips,
        SUM(CASE WHEN status = 'departed' THEN 1 ELSE 0 END) as active_trips,
        SUM(CASE WHEN status = 'arrived' THEN 1 ELSE 0 END) as completed_trips,
        AVG(available_seats) as avg_available_seats,
        AVG(total_seats) as avg_total_seats,
        AVG(price) as avg_price
      FROM trips
      WHERE departure_datetime >= DATE_SUB(NOW(), INTERVAL 30 DAY)
    `;
    
    const results = await executeQuery(query);
    return results[0];
  }

  // Create new trip (admin only)
  static async createTrip(tripData) {
    const {
      tripNumber,
      routeId,
      vehicleId,
      departureDatetime,
      estimatedArrivalDatetime,
      basePrice,
      totalSeats,
      availableSeats
    } = tripData;

    const tripId = uuidv4();
    
    const query = `
      INSERT INTO trips (
        id, trip_number, route_id, vehicle_id, departure_datetime,
        estimated_arrival_datetime, base_price, total_seats, available_seats
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    await executeQuery(query, [
      tripId, tripNumber, routeId, vehicleId, departureDatetime,
      estimatedArrivalDatetime, basePrice, totalSeats, availableSeats || totalSeats
    ]);
    
    return tripId;
  }

  // Update trip
  static async updateTrip(tripId, updateData) {
    const allowedFields = [
      'departure_datetime', 'estimated_arrival_datetime', 'actual_departure_datetime',
      'actual_arrival_datetime', 'status', 'available_seats', 'base_price',
      'delay_minutes', 'special_notes'
    ];

    const fieldsToUpdate = [];
    const values = [];

    Object.keys(updateData).forEach(key => {
      if (allowedFields.includes(key) && updateData[key] !== undefined) {
        fieldsToUpdate.push(`${key} = ?`);
        values.push(updateData[key]);
      }
    });

    if (fieldsToUpdate.length === 0) {
      throw new Error('No valid fields to update');
    }

    values.push(tripId);

    const query = `
      UPDATE trips 
      SET ${fieldsToUpdate.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;

    await executeQuery(query, values);
  }
}

module.exports = Trip; 