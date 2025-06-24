const express = require('express');
const { executeQuery } = require('../config/database');
const { authenticateToken, requireRole, authenticateAdmin } = require('../middleware/auth');
const Location = require('../models/Location');
const Route = require('../models/Route');
const adminController = require('../controllers/admin');
const routeAnalysisController = require('../controllers/admin/index');

const router = express.Router();

// All admin routes require authentication and admin role
// TEMPORARILY DISABLED FOR TESTING - REMOVE IN PRODUCTION
// router.use(authenticateToken);
// router.use(requireRole('admin'));

// ==================== DASHBOARD STATISTICS ====================

// GET /api/admin/stats/overview - Dashboard overview statistics
router.get('/stats/overview', async (req, res, next) => {
  try {
    // Get active routes count
    const activeRoutesResult = await executeQuery(`
      SELECT COUNT(*) as count FROM routes WHERE is_active = true
    `);

    // Get active trips count (today's trips)
    const activeTripsResult = await executeQuery(`
      SELECT COUNT(*) as count FROM trips 
      WHERE DATE(departure_datetime) = CURDATE() 
      AND status IN ('scheduled', 'in_transit')
    `);

    // Get fleet size (active vehicles)
    const fleetSizeResult = await executeQuery(`
      SELECT COUNT(*) as count FROM vehicles WHERE status = 'active'
    `);

    // Get scheduled trips count (upcoming trips)
    const scheduledTripsResult = await executeQuery(`
      SELECT COUNT(*) as count FROM trips 
      WHERE departure_datetime > NOW() 
      AND status = 'scheduled'
    `);

    res.json({
      success: true,
      data: {
        activeRoutes: activeRoutesResult[0]?.count || 0,
        activeTrips: activeTripsResult[0]?.count || 0,
        fleetSize: fleetSizeResult[0]?.count || 0,
        scheduledTrips: scheduledTripsResult[0]?.count || 0
      }
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/admin/stats/analytics - Analytics data
router.get('/stats/analytics', async (req, res, next) => {
  try {
    // 使用系统的固定日期而不是CURDATE()
    const systemDate = '2025-06-24';

    // Get total revenue - consistent with route performance calculation
    const revenueResult = await executeQuery(`
      SELECT COALESCE(SUM((t.total_seats - t.available_seats) * t.base_price), 0) as totalRevenue 
      FROM trips t
      WHERE t.departure_datetime >= DATE_SUB('${systemDate}', INTERVAL 30 DAY)
      AND t.status != 'cancelled'
    `);

    // Get average occupancy
    const occupancyResult = await executeQuery(`
      SELECT 
        AVG((total_seats - available_seats) / total_seats * 100) as avgOccupancy
      FROM trips 
      WHERE departure_datetime >= DATE_SUB('${systemDate}', INTERVAL 30 DAY)
      AND total_seats > 0
    `);

    // Get total passengers
    const passengersResult = await executeQuery(`
      SELECT SUM(passenger_count) as totalPassengers 
      FROM bookings
      WHERE booking_status = 'confirmed'
      AND DATE(created_at) >= DATE_SUB('${systemDate}', INTERVAL 30 DAY)
    `);

    res.json({
      success: true,
      data: {
        totalRevenue: parseFloat(revenueResult[0]?.totalRevenue || 0),
        averageOccupancy: parseFloat(occupancyResult[0]?.avgOccupancy || 0),
        totalPassengers: parseInt(passengersResult[0]?.totalPassengers || 0)
      }
    });
  } catch (error) {
    next(error);
  }
});

// ==================== VEHICLE MANAGEMENT ====================

// GET /api/admin/vehicles - Get all vehicles
router.get('/vehicles', async (req, res, next) => {
  try {
    const vehicles = await executeQuery(`
      SELECT 
        v.*,
        vt.name as vehicle_type_name,
        vt.capacity as vehicle_capacity
      FROM vehicles v
      LEFT JOIN vehicle_types vt ON v.vehicle_type_id = vt.id
      ORDER BY v.vehicle_number
    `);

    res.json({
      success: true,
      data: vehicles
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/admin/vehicles - Add new vehicle
router.post('/vehicles', async (req, res, next) => {
  try {
    const {
      vehicle_number,
      license_plate,
      vehicle_type_id,
      model,
      manufacturer,
      year,
      current_mileage
    } = req.body;

    const result = await executeQuery(`
      INSERT INTO vehicles 
      (vehicle_number, license_plate, vehicle_type_id, model, manufacturer, year, current_mileage)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [vehicle_number, license_plate, vehicle_type_id, model, manufacturer, year, current_mileage]);

    res.json({
      success: true,
      message: 'Vehicle added successfully',
      vehicleId: result.insertId
    });
  } catch (error) {
    next(error);
  }
});

// PUT /api/admin/vehicles/:id - Update vehicle
router.put('/vehicles/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const setClause = Object.keys(updates).map(key => `${key} = ?`).join(', ');
    const values = [...Object.values(updates), id];

    await executeQuery(`
      UPDATE vehicles SET ${setClause} WHERE id = ?
    `, values);

    res.json({
      success: true,
      message: 'Vehicle updated successfully'
    });
  } catch (error) {
    next(error);
  }
});

// ==================== LOCATION MANAGEMENT ====================

// GET /api/admin/locations - Get all locations for route creation
router.get('/locations', async (req, res, next) => {
  try {
    const locations = await Location.getAllLocations();

    res.json({
      success: true,
      data: locations
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/admin/locations/:id - Get location details
router.get('/locations/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const location = await Location.getLocationById(id);
    
    if (!location) {
      return res.status(404).json({
        success: false,
        error: 'Location not found'
      });
    }
    
    res.json({
      success: true,
      data: location
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/admin/locations - Create a new location
router.post('/locations', async (req, res, next) => {
  try {
    const locationData = req.body;
    
    // Validate required fields
    if (!locationData.name || !locationData.city) {
      return res.status(400).json({
        success: false,
        error: 'Name and city are required fields'
      });
    }
    
    const newLocation = await Location.createLocation(locationData);
    
    res.status(201).json({
      success: true,
      message: 'Location created successfully',
      data: newLocation
    });
  } catch (error) {
    next(error);
  }
});

// PUT /api/admin/locations/:id - Update a location
router.put('/locations/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const locationData = req.body;
    
    const updatedLocation = await Location.updateLocation(id, locationData);
    
    res.json({
      success: true,
      message: 'Location updated successfully',
      data: updatedLocation
    });
  } catch (error) {
    if (error.message === 'Location not found') {
      return res.status(404).json({
        success: false,
        error: 'Location not found'
      });
    }
    next(error);
  }
});

// DELETE /api/admin/locations/:id - Delete a location
router.delete('/locations/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    
    await Location.deleteLocation(id);
    
    res.json({
      success: true,
      message: 'Location deleted successfully'
    });
  } catch (error) {
    if (error.message === 'Location not found') {
      return res.status(404).json({
        success: false,
        error: 'Location not found'
      });
    } else if (error.message === 'Cannot delete location as it is used in routes') {
      return res.status(400).json({
        success: false,
        error: 'Cannot delete location as it is used in routes'
      });
    }
    next(error);
  }
});

// ==================== ROUTE MANAGEMENT ====================

// GET /api/admin/routes - Get all routes with performance data
router.get('/routes', async (req, res, next) => {
  try {
    const routes = await executeQuery(`
      SELECT 
        r.*,
        lo.name as origin_name,
        ld.name as destination_name,
        lo.city as origin_city,
        ld.city as destination_city,
        lo.latitude as origin_latitude,
        lo.longitude as origin_longitude,
        ld.latitude as destination_latitude,
        ld.longitude as destination_longitude,
        r.distance_km,
        r.estimated_duration_minutes,
        r.base_price,
        COUNT(t.id) as total_trips,
        AVG((t.total_seats - t.available_seats) / t.total_seats * 100) as avg_occupancy,
        SUM(CASE WHEN t.departure_datetime >= DATE_SUB(NOW(), INTERVAL 30 DAY) 
                 THEN (t.total_seats - t.available_seats) * t.base_price 
                 ELSE 0 END) as revenue_30_days
      FROM routes r
      LEFT JOIN locations lo ON r.origin_id = lo.id
      LEFT JOIN locations ld ON r.destination_id = ld.id
      LEFT JOIN trips t ON r.id = t.route_id
      WHERE r.is_active = true
      GROUP BY r.id
      ORDER BY revenue_30_days DESC
    `);

    res.json({
      success: true,
      data: routes
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/admin/routes/:id - Get route details with stops
router.get('/routes/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const route = await Route.findById(id);
    
    if (!route) {
      return res.status(404).json({
        success: false,
        error: 'Route not found'
      });
    }
    
    res.json({
      success: true,
      data: route
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/admin/routes - Create a new route with stops
router.post('/routes', async (req, res, next) => {
  try {
    const routeData = req.body;
    
    // Validate required fields
    if (!routeData.name) {
      return res.status(400).json({
        success: false,
        error: 'Route name is required'
      });
    }
    
    // Create route using the model
    const newRoute = await Route.createRoute(routeData);
    
    res.status(201).json({
      success: true,
      message: 'Route created successfully',
      data: newRoute
    });
  } catch (error) {
    console.error('Error creating route:', error);
    if (error.message === 'Origin and destination locations are required') {
      return res.status(400).json({
        success: false,
        error: error.message
      });
    }
    next(error);
  }
});

// PUT /api/admin/routes/:id - Update a route
router.put('/routes/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const routeData = req.body;
    
    const updatedRoute = await Route.updateRoute(id, routeData);
    
    res.json({
      success: true,
      message: 'Route updated successfully',
      data: updatedRoute
    });
  } catch (error) {
    if (error.message === 'Route not found') {
      return res.status(404).json({
        success: false,
        error: 'Route not found'
      });
    }
    next(error);
  }
});

// DELETE /api/admin/routes/:id - Delete a route
router.delete('/routes/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    
    await Route.deleteRoute(id);
    
    res.json({
      success: true,
      message: 'Route deleted successfully'
    });
  } catch (error) {
    if (error.message === 'Route not found') {
      return res.status(404).json({
        success: false,
        error: 'Route not found'
      });
    } else if (error.message === 'Cannot delete route as it is used in trips') {
      return res.status(400).json({
        success: false,
        error: error.message
      });
    }
    next(error);
  }
});

// GET /api/admin/routes/:id/stops - Get stops for a specific route
router.get('/routes/:id/stops', async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const stops = await executeQuery(`
      SELECT 
        rs.id, 
        rs.stop_order, 
        rs.arrival_offset_minutes,
        rs.departure_offset_minutes,
        rs.price_from_origin,
        rs.boarding_allowed,
        rs.alighting_allowed,
        l.id as location_id,
        l.name as location_name,
        l.city as location_city
      FROM route_stops rs
      JOIN locations l ON rs.location_id = l.id
      WHERE rs.route_id = ?
      ORDER BY rs.stop_order
    `, [id]);

    res.json({
      success: true,
      data: stops
    });
  } catch (error) {
    next(error);
  }
});

// ==================== SCHEDULE MANAGEMENT ====================

// GET /api/admin/schedules/today - Get today's schedule
router.get('/schedules/today', async (req, res, next) => {
  try {
    // Use a fixed demo date that has data in the database (2025-06-26)
    const demoDate = '2025-06-26';
    
    const todaysSchedule = await executeQuery(`
      SELECT 
        t.*,
        r.name as route_name,
        lo.name as origin_name,
        ld.name as destination_name,
        v.vehicle_number,
        v.license_plate,
        v.model as vehicle_model,
        (t.total_seats - t.available_seats) as occupied_seats,
        ROUND((t.total_seats - t.available_seats) / t.total_seats * 100, 1) as occupancy_percentage
      FROM trips t
      JOIN routes r ON t.route_id = r.id
      JOIN locations lo ON r.origin_id = lo.id
      JOIN locations ld ON r.destination_id = ld.id
      JOIN vehicles v ON t.vehicle_id = v.id
      WHERE DATE(t.departure_datetime) = ?
      ORDER BY t.departure_datetime
    `, [demoDate]);

    res.json({
      success: true,
      data: todaysSchedule
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/admin/schedules - Get schedule for date range
router.get('/schedules', async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;
    
    const schedules = await executeQuery(`
      SELECT 
        t.*,
        r.name as route_name,
        lo.name as origin_name,
        ld.name as destination_name,
        v.vehicle_number,
        v.model as vehicle_model
      FROM trips t
      JOIN routes r ON t.route_id = r.id
      JOIN locations lo ON r.origin_id = lo.id
      JOIN locations ld ON r.destination_id = ld.id
      JOIN vehicles v ON t.vehicle_id = v.id
      WHERE DATE(t.departure_datetime) BETWEEN ? AND ?
      ORDER BY t.departure_datetime
    `, [startDate || '2025-06-24', 
        endDate || '2025-06-24']);

    res.json({
      success: true,
      data: schedules
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/admin/schedules - Create new schedule
router.post('/schedules', async (req, res, next) => {
  try {
    const {
      route_id,
      vehicle_id,
      departure_datetime,
      estimated_arrival_datetime,
      base_price,
      seat_type_pricing,
      pricing_rules
    } = req.body;

    console.log("Creating schedule with data:", JSON.stringify(req.body, null, 2));

    // Format datetime strings for MySQL TIMESTAMP
    const formatDateTimeForMySQL = (dateTimeString) => {
      if (!dateTimeString) return null;
      
      try {
        const date = new Date(dateTimeString);
        
        // Check if date is valid
        if (isNaN(date.getTime())) {
          console.error('Invalid date:', dateTimeString);
          return null;
        }
        
        // Format as MySQL TIMESTAMP: YYYY-MM-DD HH:MM:SS
        // MySQL TIMESTAMP expects UTC time, so convert to local time
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
      } catch (error) {
        console.error('Error formatting datetime:', error);
        return null;
      }
    };

    const formattedDepartureDatetime = formatDateTimeForMySQL(departure_datetime);
    const formattedEstimatedArrivalDatetime = formatDateTimeForMySQL(estimated_arrival_datetime);

    if (!formattedDepartureDatetime) {
      return res.status(400).json({
        success: false,
        message: 'Invalid departure datetime format'
      });
    }

    // Get vehicle capacity
    const vehicleResult = await executeQuery(`
      SELECT vt.capacity
      FROM vehicles v
      JOIN vehicle_types vt ON v.vehicle_type_id = vt.id
      WHERE v.id = ?
    `, [vehicle_id]);

    if (!vehicleResult || vehicleResult.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Vehicle not found or has no capacity information'
      });
    }

    const capacity = vehicleResult[0]?.capacity || 0;
    
    // Generate a unique trip number
    const tripPrefix = 'TWT';
    const currentYear = new Date().getFullYear().toString().substr(2);
    const randomNum = Math.floor(100000 + Math.random() * 900000);
    const tripNumber = `${tripPrefix}${currentYear}${randomNum}`;

    console.log("Formatted datetime values:", {
      original_departure: departure_datetime,
      formatted_departure: formattedDepartureDatetime,
      original_arrival: estimated_arrival_datetime,
      formatted_arrival: formattedEstimatedArrivalDatetime
    });

    // Create the trip
    const result = await executeQuery(`
      INSERT INTO trips 
      (trip_number, route_id, vehicle_id, departure_datetime, estimated_arrival_datetime, base_price, total_seats, available_seats, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'scheduled')
    `, [tripNumber, route_id, vehicle_id, formattedDepartureDatetime, formattedEstimatedArrivalDatetime, base_price, capacity, capacity]);

    const tripId = result.insertId;
    
    // TODO: Store seat type pricing if provided (tables not yet created)
    // Currently commenting out until trip_seat_pricing table is created
    /*
    if (seat_type_pricing && Object.keys(seat_type_pricing).length > 0) {
      for (const [seatTypeId, multiplier] of Object.entries(seat_type_pricing)) {
        await executeQuery(`
          INSERT INTO trip_seat_pricing (trip_id, seat_type_id, price_multiplier)
          VALUES (?, ?, ?)
        `, [tripId, String(seatTypeId), parseFloat(multiplier)]);
      }
    }
    */
    
    // TODO: Store pricing rules if provided (tables not yet created)
    // Currently commenting out until trip_pricing_rules table is created
    /*
    if (pricing_rules && Object.keys(pricing_rules).length > 0) {
      for (const [ruleId, rule] of Object.entries(pricing_rules)) {
        await executeQuery(`
          INSERT INTO trip_pricing_rules (trip_id, rule_type, rule_value, rule_name)
          VALUES (?, ?, ?, ?)
        `, [tripId, rule.type || 'surcharge', parseFloat(rule.value), String(ruleId)]);
      }
    }
    */

    res.json({
      success: true,
      message: 'Trip scheduled successfully',
      tripId: tripId,
      tripNumber: tripNumber
    });
  } catch (error) {
    console.error("Error creating schedule:", error);
    res.status(500).json({
      success: false,
      message: 'Failed to create schedule',
      error: error.message
    });
  }
});

// ==================== CUSTOMER SERVICE ====================

// POST /api/admin/search-trips - Search trips for customer service
router.post('/search-trips', async (req, res, next) => {
  try {
    const { origin, destination, departureDate, passengers } = req.body;

    let query = `
      SELECT 
        t.*,
        r.name as route_name,
        lo.name as origin_name,
        ld.name as destination_name,
        lo.city as origin_city,
        ld.city as destination_city,
        v.vehicle_number,
        v.model as vehicle_model
      FROM trips t
      JOIN routes r ON t.route_id = r.id
      JOIN locations lo ON r.origin_id = lo.id
      JOIN locations ld ON r.destination_id = ld.id
      JOIN vehicles v ON t.vehicle_id = v.id
      WHERE t.status = 'scheduled'
      AND t.available_seats >= ?
    `;

    const params = [passengers || 1];

    if (origin) {
      query += ` AND (lo.name LIKE ? OR lo.city LIKE ?)`;
      params.push(`%${origin}%`, `%${origin}%`);
    }

    if (destination) {
      query += ` AND (ld.name LIKE ? OR ld.city LIKE ?)`;
      params.push(`%${destination}%`, `%${destination}%`);
    }

    if (departureDate) {
      query += ` AND DATE(t.departure_datetime) = ?`;
      params.push(departureDate);
    }

    query += ` ORDER BY t.departure_datetime`;

    const trips = await executeQuery(query, params);

  res.json({
      success: true,
      data: trips
    });
  } catch (error) {
    next(error);
  }
});

// ==================== ROUTE PERFORMANCE ANALYTICS ====================

// GET /api/admin/analytics/routes - Route performance analytics
router.get('/analytics/routes', async (req, res, next) => {
  try {
    // 使用系统的固定日期而不是NOW()
    const systemDate = '2025-06-24';
    const routePerformance = await executeQuery(`
      SELECT 
        r.name as route_name,
        COUNT(t.id) as trips_scheduled,
        SUM(t.total_seats - t.available_seats) as total_passengers,
        ROUND(AVG((t.total_seats - t.available_seats) / t.total_seats * 100), 1) as avg_occupancy,
        SUM((t.total_seats - t.available_seats) * t.base_price) as total_revenue
      FROM routes r
      LEFT JOIN trips t ON r.id = t.route_id 
        AND t.departure_datetime >= DATE_SUB('${systemDate}', INTERVAL 30 DAY)
      WHERE r.is_active = true
      GROUP BY r.id, r.name
      ORDER BY total_revenue DESC
    `);

  res.json({
      success: true,
      data: routePerformance
  });
  } catch (error) {
    next(error);
  }
});

// Add more trips to database (admin only)
router.post('/add-more-trips', async (req, res, next) => {
  try {
    // Add more vehicle types if they don't exist
    await executeQuery(`
      INSERT IGNORE INTO vehicle_types (id, name, capacity) VALUES
      ('vt1', 'Standard Bus', 40),
      ('vt2', 'Premium Bus', 30),
      ('vt3', 'Luxury Coach', 25)
    `);

    // Add more vehicles to support more trips
    await executeQuery(`
      INSERT IGNORE INTO vehicles (id, vehicle_number, vehicle_type_id, status) VALUES
      ('v4', 'TWT-004', 'vt1', 'active'),
      ('v5', 'TWT-005', 'vt2', 'active'),
      ('v6', 'TWT-006', 'vt3', 'active')
    `);

    // Add more trips
    const trips = [
      // More KL to Penang trips (most popular route)
      ['t4', 'TWT240004', 'r1', 'v1', '2025-06-15 06:00:00', '2025-06-15 10:30:00', 'scheduled', 38, 40, 45],
      ['t5', 'TWT240005', 'r1', 'v2', '2025-06-15 09:00:00', '2025-06-15 13:30:00', 'scheduled', 28, 30, 45],
      ['t6', 'TWT240006', 'r1', 'v3', '2025-06-15 14:00:00', '2025-06-15 18:30:00', 'scheduled', 22, 25, 45],
      ['t7', 'TWT240007', 'r1', 'v1', '2025-06-15 19:00:00', '2025-06-15 23:30:00', 'scheduled', 35, 40, 50],

      // More KL to JB trips (second most popular)
      ['t8', 'TWT240008', 'r2', 'v2', '2025-06-15 07:00:00', '2025-06-15 11:00:00', 'scheduled', 26, 30, 42],
      ['t9', 'TWT240009', 'r2', 'v3', '2025-06-15 12:00:00', '2025-06-15 16:00:00', 'scheduled', 20, 25, 42],
      ['t10', 'TWT240010', 'r2', 'v1', '2025-06-15 17:00:00', '2025-06-15 21:00:00', 'scheduled', 32, 40, 45],

      // More KL to Melaka trips (budget-friendly route)
      ['t11', 'TWT240011', 'r3', 'v3', '2025-06-15 08:00:00', '2025-06-15 10:30:00', 'scheduled', 18, 25, 25],
      ['t12', 'TWT240012', 'r3', 'v2', '2025-06-15 13:00:00', '2025-06-15 15:30:00', 'scheduled', 25, 30, 25],
      ['t13', 'TWT240013', 'r3', 'v3', '2025-06-15 18:00:00', '2025-06-15 20:30:00', 'scheduled', 20, 25, 28],

      // KL to Ipoh trips (new route)
      ['t14', 'TWT240014', 'r4', 'v1', '2025-06-15 09:30:00', '2025-06-15 12:30:00', 'scheduled', 35, 40, 30],
      ['t15', 'TWT240015', 'r4', 'v2', '2025-06-15 15:30:00', '2025-06-15 18:30:00', 'scheduled', 28, 30, 30],

      // Penang to KL return trips
      ['t16', 'TWT240016', 'r5', 'v1', '2025-06-15 08:00:00', '2025-06-15 12:30:00', 'scheduled', 36, 40, 45],
      ['t17', 'TWT240017', 'r5', 'v2', '2025-06-15 16:00:00', '2025-06-15 20:30:00', 'scheduled', 25, 30, 45],

      // Weekend trips (next day)
      ['t18', 'TWT240018', 'r1', 'v1', '2025-06-16 07:00:00', '2025-06-16 11:30:00', 'scheduled', 30, 40, 50],
      ['t19', 'TWT240019', 'r2', 'v2', '2025-06-16 08:00:00', '2025-06-16 12:00:00', 'scheduled', 22, 30, 45],
      ['t20', 'TXT240020', 'r3', 'v3', '2025-06-16 10:00:00', '2025-06-16 12:30:00', 'scheduled', 15, 25, 30]
    ];

    for (const trip of trips) {
      try {
        await executeQuery(`
          INSERT IGNORE INTO trips (id, trip_number, route_id, vehicle_id, departure_datetime, arrival_datetime, status, available_seats, total_seats, price) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, trip);
      } catch (error) {
        console.log(`Trip ${trip[0]} already exists or error:`, error.message);
      }
    }

    res.json({
      success: true,
      message: 'More trips added successfully',
      tripsAdded: trips.length
    });

  } catch (error) {
    next(error);
  }
});

// GET /api/admin/trips/:id - Get trip details by ID
router.get('/trips/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Get basic trip information
    const tripResult = await executeQuery(`
      SELECT 
        t.*,
        r.name as route_name,
        r.route_code,
        lo.name as origin_name,
        lo.city as origin_city,
        ld.name as destination_name,
        ld.city as destination_city,
        v.vehicle_number,
        v.license_plate,
        v.model as vehicle_model,
        vt.name as vehicle_type,
        vt.capacity as vehicle_capacity,
        (t.total_seats - t.available_seats) as occupied_seats,
        ROUND((t.total_seats - t.available_seats) / t.total_seats * 100, 1) as occupancy_percentage
      FROM trips t
      JOIN routes r ON t.route_id = r.id
      JOIN locations lo ON r.origin_id = lo.id
      JOIN locations ld ON r.destination_id = ld.id
      JOIN vehicles v ON t.vehicle_id = v.id
      JOIN vehicle_types vt ON v.vehicle_type_id = vt.id
      WHERE t.id = ?
    `, [id]);
    
    if (tripResult.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Trip not found'
      });
    }
    
    const trip = tripResult[0];
    
    // Get route stops
    const stopsResult = await executeQuery(`
      SELECT 
        rs.id, 
        rs.stop_order, 
        rs.arrival_offset_minutes,
        rs.departure_offset_minutes,
        rs.price_from_origin,
        rs.boarding_allowed,
        rs.alighting_allowed,
        l.id as location_id,
        l.name as location_name,
        l.city as location_city
      FROM route_stops rs
      JOIN locations l ON rs.location_id = l.id
      WHERE rs.route_id = ?
      ORDER BY rs.stop_order
    `, [trip.route_id]);
    
    // Get seat type pricing - with error handling for missing table
    let seatPricingResult = [];
    try {
      seatPricingResult = await executeQuery(`
        SELECT 
          seat_type_id,
          price_multiplier
        FROM trip_seat_pricing
        WHERE trip_id = ?
      `, [id]);
    } catch (error) {
      console.error('Error fetching seat pricing (table may not exist):', error.message);
      // Continue execution even if this table doesn't exist
    }
    
    // Get pricing rules - with error handling for missing table
    let pricingRulesResult = [];
    try {
      pricingRulesResult = await executeQuery(`
        SELECT 
          rule_name,
          rule_type,
          rule_value
        FROM trip_pricing_rules
        WHERE trip_id = ?
      `, [id]);
    } catch (error) {
      console.error('Error fetching pricing rules (table may not exist):', error.message);
      // Continue execution even if this table doesn't exist
    }
    
    // Combine all data
    const tripDetails = {
      ...trip,
      stops: stopsResult,
      seat_pricing: seatPricingResult,
      pricing_rules: pricingRulesResult
    };
    
    res.json({
      success: true,
      data: tripDetails
    });
  } catch (error) {
    console.error("Error fetching trip details:", error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch trip details',
      error: error.message
    });
  }
});

// PUT /api/admin/trips/:id - Update trip
router.put('/trips/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    // Validate that trip exists
    const tripExists = await executeQuery('SELECT id FROM trips WHERE id = ?', [id]);
    if (tripExists.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Trip not found'
      });
    }
    
    // Format datetime fields if they exist
    if (updateData.departure_datetime) {
      updateData.departure_datetime = formatDateTimeForMySQL(updateData.departure_datetime);
    }
    if (updateData.estimated_arrival_datetime) {
      updateData.estimated_arrival_datetime = formatDateTimeForMySQL(updateData.estimated_arrival_datetime);
    }
    
    // Build dynamic update query
    const allowedFields = [
      'departure_datetime', 'estimated_arrival_datetime', 'base_price', 
      'status', 'available_seats', 'special_notes', 'delay_minutes'
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
      return res.status(400).json({
        success: false,
        message: 'No valid fields to update'
      });
    }
    
    values.push(id);
    
    const updateQuery = `
      UPDATE trips 
      SET ${fieldsToUpdate.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;
    
    await executeQuery(updateQuery, values);
    
    res.json({
      success: true,
      message: 'Trip updated successfully'
    });
  } catch (error) {
    console.error('Error updating trip:', error);
    next(error);
  }
});

// DELETE /api/admin/trips/:id - Delete trip
router.delete('/trips/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Check if trip exists
    const tripExists = await executeQuery('SELECT id, status FROM trips WHERE id = ?', [id]);
    if (tripExists.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Trip not found'
      });
    }
    
    // Check if trip has any bookings
    const bookingsResult = await executeQuery(
      'SELECT COUNT(*) as count FROM bookings WHERE trip_id = ? AND booking_status IN ("confirmed", "pending")',
      [id]
    );
    
    if (bookingsResult[0].count > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete trip with existing bookings. Please cancel all bookings first.'
      });
    }
    
    // Delete the trip
    await executeQuery('DELETE FROM trips WHERE id = ?', [id]);
    
    res.json({
      success: true,
      message: 'Trip deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting trip:', error);
    next(error);
  }
});

// ==================== POPULAR TRIPS ====================

// GET /api/admin/popular-trips - Get popular trips for admin dashboard
router.get('/popular-trips', async (req, res, next) => {
  try {
    // 使用系统的固定日期而不是CURDATE()
    const systemDate = '2025-06-24';

    // 查询热门行程数据（根据预订数量排名）
    const popularTrips = await executeQuery(`
      SELECT 
        t.id,
        r.id as route_id,
        r.name as route_name,
        o.name as origin,
        d.name as destination,
        DATE_FORMAT(t.departure_datetime, '%H:%i') as departure_time,
        DATE(t.departure_datetime) as date,
        t.price_adult as price,
        COUNT(b.id) as booking_count
      FROM 
        trips t
        JOIN routes r ON t.route_id = r.id
        JOIN locations o ON r.origin_id = o.id
        JOIN locations d ON r.destination_id = d.id
        LEFT JOIN bookings b ON t.id = b.trip_id AND b.booking_status = 'confirmed'
      WHERE 
        t.departure_datetime >= '${systemDate}'
      GROUP BY 
        t.id
      ORDER BY 
        booking_count DESC
      LIMIT 10
    `);

    // 格式化返回数据
    const formattedTrips = popularTrips.map(trip => ({
      id: trip.id,
      route: { 
        id: trip.route_id, 
        name: trip.route_name 
      },
      origin: trip.origin,
      destination: trip.destination,
      departureTime: trip.departure_time,
      date: trip.date,
      price: parseFloat(trip.price),
      bookingCount: parseInt(trip.booking_count)
    }));

    res.json({
      success: true,
      data: formattedTrips
    });
  } catch (error) {
    console.error('Error fetching popular trips:', error);
    next(error);
  }
});

// TODO: 实现路线分析控制器后取消注释以下路由
// 获取路线占用率
// router.get('/routes/:routeId/occupancy', authenticateAdmin, routeAnalysisController.getRouteOccupancyRate);

// 计算旅行时间
// router.get('/routes/:routeId/travel-time', authenticateAdmin, routeAnalysisController.calculateTravelTime);

// 计算CO2排放
// router.get('/routes/:routeId/emissions', authenticateAdmin, routeAnalysisController.calculateCO2Emissions);

// 计算动态价格
// router.get('/routes/:routeId/dynamic-price', authenticateAdmin, routeAnalysisController.calculateDynamicPrice);

module.exports = router; 