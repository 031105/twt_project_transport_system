const express = require('express');
const { executeQuery } = require('../config/database');
const { optionalAuth } = require('../middleware/auth');

const router = express.Router();

// GET /api/seats/trip/:tripId - Get seats for a specific trip
router.get('/trip/:tripId', optionalAuth, async (req, res, next) => {
  try {
    const { tripId } = req.params;
    
    const query = `
      SELECT 
        ts.*,
        st.name as seat_type_name,
        st.price_multiplier,
        st.features as seat_type_features,
        st.description as seat_type_description
      FROM trip_seats ts
      LEFT JOIN seat_types st ON ts.seat_type_id = st.id
      WHERE ts.trip_id = ?
      ORDER BY ts.row_number ASC, ts.seat_position ASC
    `;
    
    const seats = await executeQuery(query, [tripId]);
    
    // Transform seat data to match frontend format
    const transformedSeats = seats.map(seat => ({
      id: seat.id,
      seatNumber: seat.seat_number,
      rowNumber: seat.row_number,
      position: seat.seat_position,
      isAvailable: seat.is_available === 1 && seat.is_blocked === 0,
      isBlocked: seat.is_blocked === 1,
      price: parseFloat(seat.current_price || seat.base_price),
      basePrice: parseFloat(seat.base_price),
      seatType: {
        id: seat.seat_type_id,
        name: seat.seat_type_name || 'Standard',
        priceMultiplier: parseFloat(seat.price_multiplier || 1.0),
        features: seat.seat_type_features ? JSON.parse(seat.seat_type_features) : [],
        description: seat.seat_type_description
      },
      features: seat.features ? JSON.parse(seat.features) : {},
      accessibilityFeatures: seat.accessibility_features ? JSON.parse(seat.accessibility_features) : null
    }));
    
    res.json({
      message: 'Trip seats retrieved successfully',
      data: transformedSeats
    });
    
  } catch (error) {
    next(error);
  }
});

// GET /api/seats/types - Get all seat types
router.get('/types', optionalAuth, async (req, res, next) => {
  try {
    const query = `
      SELECT * FROM seat_types 
      WHERE is_active = 1
      ORDER BY name ASC
    `;
    
    const seatTypes = await executeQuery(query);
    
    const transformedSeatTypes = seatTypes.map(type => ({
      id: type.id,
      name: type.name,
      priceMultiplier: parseFloat(type.price_multiplier),
      features: type.features ? JSON.parse(type.features) : [],
      description: type.description,
      isActive: type.is_active === 1
    }));
    
    res.json({
      message: 'Seat types retrieved successfully',
      data: transformedSeatTypes
    });
    
  } catch (error) {
    next(error);
  }
});

module.exports = router; 