const { executeQuery, executeTransaction } = require('../config/database');

class Route {
  constructor(data) {
    this.id = data.id;
    this.route_code = data.route_code;
    this.name = data.name;
    this.origin_id = data.origin_id;
    this.destination_id = data.destination_id;
    this.distance_km = data.distance_km;
    this.estimated_duration_minutes = data.estimated_duration_minutes;
    this.base_price = data.base_price;
    this.route_type = data.route_type;
    this.toll_charges = data.toll_charges;
    this.fuel_cost_estimate = data.fuel_cost_estimate;
    this.average_speed_kmh = data.average_speed_kmh;
    this.difficulty_level = data.difficulty_level;
    this.scenic_rating = data.scenic_rating;
    this.is_active = data.is_active;
    this.created_at = data.created_at;
  }

  static async findAll(filters = {}) {
    try {
      let query = `
        SELECT 
          r.*,
          origin.id as origin_id,
          origin.name as origin_name,
          origin.city as origin_city,
          origin.state as origin_state,
          origin.address as origin_address,
          dest.id as destination_id,
          dest.name as destination_name,
          dest.city as destination_city,
          dest.state as destination_state,
          dest.address as destination_address
        FROM routes r
        LEFT JOIN locations origin ON r.origin_id = origin.id
        LEFT JOIN locations dest ON r.destination_id = dest.id
        WHERE r.is_active = TRUE
      `;
      
      const params = [];
      
      if (filters.origin_id) {
        query += ' AND r.origin_id = ?';
        params.push(filters.origin_id);
      }
      
      if (filters.destination_id) {
        query += ' AND r.destination_id = ?';
        params.push(filters.destination_id);
      }
      
      if (filters.route_type) {
        query += ' AND r.route_type = ?';
        params.push(filters.route_type);
      }
      
      query += ' ORDER BY r.name';
      
      const results = await executeQuery(query, params);
      return results.map(row => ({
        id: row.id,
        routeCode: row.route_code,
        name: row.name,
        distanceKm: parseFloat(row.distance_km),
        estimatedDurationMinutes: row.estimated_duration_minutes,
        basePrice: parseFloat(row.base_price),
        routeType: row.route_type,
        isActive: row.is_active,
        originLocation: {
          id: row.origin_id,
          name: row.origin_name,
          city: row.origin_city,
          state: row.origin_state,
          address: row.origin_address
        },
        destinationLocation: {
          id: row.destination_id,
          name: row.destination_name,
          city: row.destination_city,
          state: row.destination_state,
          address: row.destination_address
        }
      }));
    } catch (error) {
      console.error('Error fetching routes:', error);
      throw error;
    }
  }

  static async findById(id) {
    try {
      const query = `
        SELECT 
          r.*,
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
          dest.longitude as destination_longitude
        FROM routes r
        LEFT JOIN locations origin ON r.origin_id = origin.id
        LEFT JOIN locations dest ON r.destination_id = dest.id
        WHERE r.id = ?
      `;
      
      const results = await executeQuery(query, [id]);
      if (results.length === 0) return null;
      
      const row = results[0];
      const route = {
        id: row.id,
        routeCode: row.route_code,
        name: row.name,
        distanceKm: parseFloat(row.distance_km),
        estimatedDurationMinutes: row.estimated_duration_minutes,
        basePrice: parseFloat(row.base_price),
        routeType: row.route_type,
        tollCharges: parseFloat(row.toll_charges),
        fuelCostEstimate: parseFloat(row.fuel_cost_estimate),
        averageSpeedKmh: parseFloat(row.average_speed_kmh),
        isActive: row.is_active,
        originLocation: {
          id: row.origin_id,
          name: row.origin_name,
          city: row.origin_city,
          state: row.origin_state,
          address: row.origin_address,
          latitude: row.origin_latitude,
          longitude: row.origin_longitude
        },
        destinationLocation: {
          id: row.destination_id,
          name: row.destination_name,
          city: row.destination_city,
          state: row.destination_state,
          address: row.destination_address,
          latitude: row.destination_latitude,
          longitude: row.destination_longitude
        }
      };

      // Fetch route stops
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
      
      const stopsResults = await executeQuery(stopsQuery, [id]);
      route.intermediateStops = stopsResults.map(stop => ({
        id: stop.id,
        locationId: stop.location_id,
        stopOrder: stop.stop_order,
        arrivalOffsetMinutes: stop.arrival_offset_minutes,
        departureOffsetMinutes: stop.departure_offset_minutes,
        priceFromOrigin: parseFloat(stop.price_from_origin),
        distanceFromOriginKm: parseFloat(stop.distance_from_origin_km),
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
      
      return route;
    } catch (error) {
      console.error('Error fetching route by ID:', error);
      throw error;
    }
  }

  static async getPopularRoutes(limit = 5) {
    try {
      const query = `
        SELECT 
          r.*,
          origin.name as origin_name,
          origin.city as origin_city,
          origin.state as origin_state,
          dest.name as destination_name,
          dest.city as destination_city,
          dest.state as destination_state,
          COUNT(t.id) as trip_count,
          AVG(t.base_price) as avg_price,
          MIN(t.departure_datetime) as next_departure
        FROM routes r
        LEFT JOIN locations origin ON r.origin_id = origin.id
        LEFT JOIN locations dest ON r.destination_id = dest.id
        LEFT JOIN trips t ON r.id = t.route_id AND t.status = 'scheduled' AND t.departure_datetime >= NOW()
        WHERE r.is_active = 1
        GROUP BY r.id
        ORDER BY trip_count DESC, r.name
        LIMIT ?
      `;
      
      const results = await executeQuery(query, [limit]);
      return results.map(row => ({
        id: row.id,
        route_code: row.route_code,
        name: row.name,
        distance_km: parseFloat(row.distance_km),
        estimated_duration_minutes: row.estimated_duration_minutes,
        base_price: parseFloat(row.base_price),
        route_type: row.route_type,
        toll_charges: parseFloat(row.toll_charges || 0),
        fuel_cost_estimate: parseFloat(row.fuel_cost_estimate || 0),
        average_speed_kmh: parseFloat(row.average_speed_kmh || 0),
        difficulty_level: row.difficulty_level,
        scenic_rating: row.scenic_rating,
        trip_count: row.trip_count,
        avg_price: parseFloat(row.avg_price || row.base_price),
        next_departure: row.next_departure,
        origin: {
          id: row.origin_id,
          name: row.origin_name,
          city: row.origin_city,
          state: row.origin_state
        },
        destination: {
          id: row.destination_id,
          name: row.destination_name,
          city: row.destination_city,
          state: row.destination_state
        }
      }));
    } catch (error) {
      console.error('Error fetching popular routes:', error);
      throw error;
    }
  }

  static async searchRoutes(searchParams) {
    try {
      const { origin, destination, routeName } = searchParams;
      let query = `
        SELECT 
          r.*,
          origin.name as origin_name,
          origin.city as origin_city,
          origin.state as origin_state,
          dest.name as destination_name,
          dest.city as destination_city,
          dest.state as destination_state
        FROM routes r
        LEFT JOIN locations origin ON r.origin_id = origin.id
        LEFT JOIN locations dest ON r.destination_id = dest.id
        WHERE r.is_active = 1
      `;
      
      const params = [];
      
      if (origin) {
        query += ` AND (origin.name LIKE ? OR origin.city LIKE ?)`;
        params.push(`%${origin}%`, `%${origin}%`);
      }
      
      if (destination) {
        query += ` AND (dest.name LIKE ? OR dest.city LIKE ?)`;
        params.push(`%${destination}%`, `%${destination}%`);
      }
      
      if (routeName) {
        query += ` AND r.name LIKE ?`;
        params.push(`%${routeName}%`);
      }
      
      query += ` ORDER BY r.name`;
      
      const results = await executeQuery(query, params);
      return results.map(row => ({
        id: row.id,
        route_code: row.route_code,
        name: row.name,
        distance_km: parseFloat(row.distance_km),
        estimated_duration_minutes: row.estimated_duration_minutes,
        base_price: parseFloat(row.base_price),
        route_type: row.route_type,
        toll_charges: parseFloat(row.toll_charges || 0),
        fuel_cost_estimate: parseFloat(row.fuel_cost_estimate || 0),
        average_speed_kmh: parseFloat(row.average_speed_kmh || 0),
        difficulty_level: row.difficulty_level,
        scenic_rating: row.scenic_rating,
        origin: {
          id: row.origin_id,
          name: row.origin_name,
          city: row.origin_city,
          state: row.origin_state
        },
        destination: {
          id: row.destination_id,
          name: row.destination_name,
          city: row.destination_city,
          state: row.destination_state
        }
      }));
    } catch (error) {
      console.error('Error searching routes:', error);
      throw error;
    }
  }

  static async getAllLocations() {
    try {
      const query = `
        SELECT 
          id,
          name,
          city,
          state,
          address,
          latitude,
          longitude,
          is_active
        FROM locations
        WHERE is_active = 1
        ORDER BY state, city, name
      `;
      
      return await executeQuery(query);
    } catch (error) {
      console.error('Error fetching locations:', error);
      throw error;
    }
  }

  static async searchLocations(searchTerm) {
    try {
      const query = `
        SELECT 
          id,
          name,
          city,
          state,
          address,
          latitude,
          longitude
        FROM locations
        WHERE is_active = 1
          AND (name LIKE ? OR city LIKE ?)
        ORDER BY 
          CASE 
            WHEN name LIKE ? THEN 1
            WHEN city LIKE ? THEN 2
            ELSE 3
          END,
          name
        LIMIT 20
      `;
      
      const searchPattern = `%${searchTerm}%`;
      const exactPattern = `${searchTerm}%`;
      
      return await executeQuery(query, [
        searchPattern, searchPattern,
        exactPattern, exactPattern
      ]);
    } catch (error) {
      console.error('Error searching locations:', error);
      throw error;
    }
  }

  // Create a new route with stops
  static async createRoute(routeData) {
    try {
      // Start a transaction
      await executeTransaction('START TRANSACTION');

      // Generate a unique route code
      const routeCodePrefix = 'RT';
      const routeCodeSuffix = Math.floor(10000 + Math.random() * 90000);
      const route_code = `${routeCodePrefix}${routeCodeSuffix}`;

      // Find origin and destination from stops
      let originId = null;
      let destinationId = null;

      if (routeData.stops && routeData.stops.length > 0) {
        // Find origin (first stop marked as origin or first stop)
        const originStop = routeData.stops.find(stop => stop.isOrigin) || routeData.stops[0];
        originId = originStop.locationId;

        // Find destination (first stop marked as destination or last stop)
        const destinationStop = routeData.stops.find(stop => stop.isDestination) || routeData.stops[routeData.stops.length - 1];
        destinationId = destinationStop.locationId;
      } else {
        // Fallback to direct origin/destination if no stops
        originId = routeData.originId;
        destinationId = routeData.destinationId;
      }

      if (!originId || !destinationId) {
        throw new Error('Origin and destination locations are required');
      }

      // Calculate distance and duration if not provided
      let distanceKm = routeData.distanceKm;
      let estimatedDurationMinutes = routeData.estimatedDurationMinutes;

      if (!distanceKm || !estimatedDurationMinutes) {
        // In a real application, we might use a mapping API here
        // For now, we'll just use a placeholder calculation
        distanceKm = distanceKm || 100; // Default distance
        estimatedDurationMinutes = estimatedDurationMinutes || Math.round(distanceKm * 0.8); // Approx 75km/h
      }

      // Insert the route
      const routeQuery = `
        INSERT INTO routes (
          route_code, 
          name, 
          origin_id, 
          destination_id, 
          distance_km, 
          estimated_duration_minutes, 
          base_price, 
          route_type, 
          toll_charges,
          fuel_cost_estimate,
          average_speed_kmh,
          is_active
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const routeResult = await executeQuery(routeQuery, [
        route_code,
        routeData.name,
        originId,
        destinationId,
        distanceKm,
        estimatedDurationMinutes,
        routeData.basePrice || 0,
        routeData.routeType || 'regular',
        routeData.tollCharges || 0,
        routeData.fuelCostEstimate || 0,
        routeData.averageSpeedKmh || 70,
        routeData.isActive !== undefined ? routeData.isActive : true
      ]);

      // Get the created route ID since we use UUID
      const createdRoute = await executeQuery(
        'SELECT id FROM routes WHERE route_code = ? ORDER BY created_at DESC LIMIT 1',
        [route_code]
      );
      
      const routeId = createdRoute.length > 0 ? createdRoute[0].id : null;
      
      if (!routeId) {
        throw new Error('Failed to create route - could not get route ID');
      }

      // Add stops if provided
      if (routeData.stops && routeData.stops.length > 0) {
        for (let i = 0; i < routeData.stops.length; i++) {
          const stop = routeData.stops[i];
          
          // Calculate stop order if not provided
          const stopOrder = stop.stopOrder || (i + 1);
          
          // Default arrival and departure offsets based on position in route
          const arrivalOffset = stop.arrivalOffsetMinutes !== undefined ? 
            stop.arrivalOffsetMinutes : 
            (i === 0 ? 0 : Math.round((i / routeData.stops.length) * estimatedDurationMinutes));
            
          const departureOffset = stop.departureOffsetMinutes !== undefined ? 
            stop.departureOffsetMinutes : 
            (i === routeData.stops.length - 1 ? estimatedDurationMinutes : arrivalOffset + 5);

          // Insert the stop
          const stopQuery = `
            INSERT INTO route_stops (
              route_id, 
              location_id, 
              stop_order, 
              arrival_offset_minutes, 
              departure_offset_minutes, 
              price_from_origin,
              distance_from_origin_km,
              boarding_allowed,
              alighting_allowed
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
          `;

          await executeQuery(stopQuery, [
            routeId,
            stop.locationId,
            stopOrder,
            arrivalOffset,
            departureOffset,
            stop.priceFromOrigin || 0,
            stop.distanceFromOriginKm || (i / routeData.stops.length) * distanceKm,
            stop.boardingAllowed !== undefined ? stop.boardingAllowed : true,
            stop.alightingAllowed !== undefined ? stop.alightingAllowed : true
          ]);
        }
      }

      // Commit the transaction
      await executeTransaction('COMMIT');

      // Return the created route
      return await this.findById(routeId);
    } catch (error) {
      // Rollback the transaction on error
      await executeTransaction('ROLLBACK');
      console.error('Error creating route:', error);
      throw error;
    }
  }

  // Update an existing route
  static async updateRoute(routeId, routeData) {
    try {
      // Start a transaction
      await executeTransaction('START TRANSACTION');

      // Check if route exists
      const existingRoute = await this.findById(routeId);
      if (!existingRoute) {
        throw new Error('Route not found');
      }

      // Update route basic information
      if (Object.keys(routeData).some(key => key !== 'stops')) {
        const updateFields = [];
        const updateValues = [];

        // Map camelCase properties to snake_case database fields
        const fieldMapping = {
          name: 'name',
          originId: 'origin_id',
          destinationId: 'destination_id',
          distanceKm: 'distance_km',
          estimatedDurationMinutes: 'estimated_duration_minutes',
          basePrice: 'base_price',
          routeType: 'route_type',
          tollCharges: 'toll_charges',
          fuelCostEstimate: 'fuel_cost_estimate',
          averageSpeedKmh: 'average_speed_kmh',
          isActive: 'is_active'
        };

        // Build update parts
        for (const [key, value] of Object.entries(routeData)) {
          if (fieldMapping[key]) {
            updateFields.push(`${fieldMapping[key]} = ?`);
            updateValues.push(value);
          }
        }

        if (updateFields.length > 0) {
          // Add routeId to values array
          updateValues.push(routeId);

          const updateQuery = `
            UPDATE routes 
            SET ${updateFields.join(', ')} 
            WHERE id = ?
          `;

          await executeQuery(updateQuery, updateValues);
        }
      }

      // Update stops if provided
      if (routeData.stops && Array.isArray(routeData.stops)) {
        // Delete existing stops
        await executeQuery('DELETE FROM route_stops WHERE route_id = ?', [routeId]);

        // Add new stops
        for (let i = 0; i < routeData.stops.length; i++) {
          const stop = routeData.stops[i];
          
          // Calculate stop order if not provided
          const stopOrder = stop.stopOrder || (i + 1);
          
          // Insert the stop
          const stopQuery = `
            INSERT INTO route_stops (
              route_id, 
              location_id, 
              stop_order, 
              arrival_offset_minutes, 
              departure_offset_minutes, 
              price_from_origin,
              distance_from_origin_km,
              boarding_allowed,
              alighting_allowed
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
          `;

          await executeQuery(stopQuery, [
            routeId,
            stop.locationId,
            stopOrder,
            stop.arrivalOffsetMinutes || 0,
            stop.departureOffsetMinutes || 0,
            stop.priceFromOrigin || 0,
            stop.distanceFromOriginKm || 0,
            stop.boardingAllowed !== undefined ? stop.boardingAllowed : true,
            stop.alightingAllowed !== undefined ? stop.alightingAllowed : true
          ]);
        }

        // Update origin and destination based on stops if not explicitly provided
        if (!routeData.originId || !routeData.destinationId) {
          const originStop = routeData.stops.find(stop => stop.isOrigin) || routeData.stops[0];
          const destinationStop = routeData.stops.find(stop => stop.isDestination) || routeData.stops[routeData.stops.length - 1];

          await executeQuery(`
            UPDATE routes 
            SET origin_id = ?, destination_id = ? 
            WHERE id = ?
          `, [originStop.locationId, destinationStop.locationId, routeId]);
        }
      }

      // Commit the transaction
      await executeTransaction('COMMIT');

      // Return the updated route
      return await this.findById(routeId);
    } catch (error) {
      // Rollback the transaction on error
      await executeTransaction('ROLLBACK');
      console.error('Error updating route:', error);
      throw error;
    }
  }

  // Delete a route
  static async deleteRoute(routeId) {
    try {
      // Start a transaction
      await executeTransaction('START TRANSACTION');

      // Check if route exists
      const existingRoute = await this.findById(routeId);
      if (!existingRoute) {
        throw new Error('Route not found');
      }

      // Check if route is used in any trips
      const tripCheckQuery = `
        SELECT COUNT(*) as count 
        FROM trips 
        WHERE route_id = ?
      `;

      const tripResults = await executeQuery(tripCheckQuery, [routeId]);
      if (tripResults[0].count > 0) {
        throw new Error('Cannot delete route as it is used in trips');
      }

      // Delete route stops
      await executeQuery('DELETE FROM route_stops WHERE route_id = ?', [routeId]);

      // Delete route
      await executeQuery('DELETE FROM routes WHERE id = ?', [routeId]);

      // Commit the transaction
      await executeTransaction('COMMIT');
      
      return true;
    } catch (error) {
      // Rollback the transaction on error
      await executeTransaction('ROLLBACK');
      console.error('Error deleting route:', error);
      throw error;
    }
  }
}

module.exports = Route; 