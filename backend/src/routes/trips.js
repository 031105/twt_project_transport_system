const express = require('express');
const Joi = require('joi');
const Trip = require('../models/Trip');
const { optionalAuth } = require('../middleware/auth');

const router = express.Router();

// Validation schemas
const searchTripsSchema = Joi.object({
  origin: Joi.string().optional(),
  destination: Joi.string().optional(),
  date: Joi.date().optional()
});

// GET /api/trips - Get available trips or search trips
router.get('/', optionalAuth, async (req, res, next) => {
  try {
    const { origin, destination, date } = req.query;
    
    // If search parameters provided, search trips
    if (origin || destination || date) {
      const { error, value } = searchTripsSchema.validate({ origin, destination, date });
      if (error) {
        return res.status(400).json({
          error: 'Validation failed',
          code: 'VALIDATION_ERROR',
          details: error.details
        });
      }
      
      const trips = await Trip.searchTrips({
        origin: value.origin,
        destination: value.destination,
        departureDate: value.date
      });
      
      res.json({
        success: true,
        data: trips,
        total: trips.length,
        searchParams: value
      });
    } else {
      // Get all available trips
      const trips = await Trip.findAll({ status: 'scheduled', limit: 50 });
      
      res.json({
        success: true,
        data: trips,
        total: trips.length
      });
    }

  } catch (error) {
    next(error);
  }
});

// GET /api/trips/:id - Get trip details
router.get('/:id', optionalAuth, async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const trip = await Trip.findById(id);
    if (!trip) {
      return res.status(404).json({
        error: 'Trip not found',
        code: 'TRIP_NOT_FOUND'
      });
    }
    
    res.json({
      success: true,
      data: trip
    });

  } catch (error) {
    next(error);
  }
});

// GET /api/trips/stats - Get trip statistics
router.get('/admin/stats', optionalAuth, async (req, res, next) => {
  try {
    const stats = await Trip.getTripStats();
    
    res.json({
      success: true,
      data: stats
    });

  } catch (error) {
    next(error);
  }
});

module.exports = router; 