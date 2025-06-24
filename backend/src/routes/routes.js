const express = require('express');
const Joi = require('joi');
const Route = require('../models/Route');
const { optionalAuth } = require('../middleware/auth');

const router = express.Router();

// Validation schemas
const searchRoutesSchema = Joi.object({
  origin: Joi.string().optional(),
  destination: Joi.string().optional(),
  routeName: Joi.string().optional()
});

// ========================================
// PUBLIC ROUTE ENDPOINTS
// ========================================

// GET /api/routes - Get all routes
router.get('/', optionalAuth, async (req, res, next) => {
  try {
    const filters = {};
    
    if (req.query.origin_id) {
      filters.origin_id = req.query.origin_id;
    }
    
    if (req.query.destination_id) {
      filters.destination_id = req.query.destination_id;
    }
    
    if (req.query.route_type) {
      filters.route_type = req.query.route_type;
    }
    
    const routes = await Route.findAll(filters);
    
    res.json({
      success: true,
      data: routes,
      count: routes.length
    });
  } catch (error) {
    console.error('Error fetching routes:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch routes',
      error: error.message
    });
  }
});

// GET /api/routes/search - Search routes
router.get('/search', optionalAuth, async (req, res, next) => {
  try {
    const { error, value } = searchRoutesSchema.validate(req.query);
    if (error) {
      return res.status(400).json({
        error: 'Validation failed',
        code: 'VALIDATION_ERROR',
        details: error.details
      });
    }

    const routes = await Route.searchRoutes(value);
    
    res.json({
      success: true,
      data: routes,
      total: routes.length,
      searchParams: value
    });

  } catch (error) {
    next(error);
  }
});

// GET /api/routes/popular - Get popular routes
router.get('/popular', optionalAuth, async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const routes = await Route.getPopularRoutes(limit);
    
    res.json({
      success: true,
      data: routes,
      total: routes.length
    });

  } catch (error) {
    next(error);
  }
});

// GET /api/routes/:id - Get route details by ID
router.get('/:id', optionalAuth, async (req, res, next) => {
  try {
    const route = await Route.findById(req.params.id);
    
    if (!route) {
      return res.status(404).json({
        success: false,
        message: 'Route not found'
      });
    }
    
    res.json({
      success: true,
      data: route
    });
  } catch (error) {
    console.error('Error fetching route:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch route',
      error: error.message
    });
  }
});

// GET /api/routes/stats - Get route statistics
router.get('/admin/stats', optionalAuth, async (req, res, next) => {
  try {
    const stats = await Route.getRouteStats();
    
    res.json({
      success: true,
      data: stats
    });

  } catch (error) {
    next(error);
  }
});

// ========================================
// LOCATION ENDPOINTS
// ========================================

// GET /api/routes/locations/all - Get all locations
router.get('/locations/all', optionalAuth, async (req, res, next) => {
  try {
    const locations = await Route.getAllLocations();
    
    // Group locations by state for easier frontend handling
    const locationsByState = locations.reduce((acc, location) => {
      const state = location.state || 'Other';
      if (!acc[state]) {
        acc[state] = [];
      }
      acc[state].push(location);
      return acc;
    }, {});
    
    res.json({
      success: true,
      data: locations,
      groupedByState: locationsByState,
      total: locations.length
    });

  } catch (error) {
    next(error);
  }
});

// GET /api/routes/locations/search - Search locations
router.get('/locations/search', optionalAuth, async (req, res, next) => {
  try {
    const { q } = req.query;
    
    if (!q || q.trim().length < 2) {
      return res.status(400).json({
        error: 'Search query must be at least 2 characters',
        code: 'INVALID_SEARCH_QUERY'
      });
    }
    
    const locations = await Route.searchLocations(q.trim());
    
    res.json({
      success: true,
      data: locations,
      total: locations.length,
      query: q.trim()
    });

  } catch (error) {
    next(error);
  }
});

module.exports = router; 