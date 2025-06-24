const express = require('express');
const Location = require('../models/Location');
const { optionalAuth } = require('../middleware/auth');

const router = express.Router();

// GET /api/locations - Get all locations
router.get('/', optionalAuth, async (req, res, next) => {
  try {
    const locations = await Location.getAllLocations();
    
    res.json({
      success: true,
      data: locations,
      total: locations.length
    });

  } catch (error) {
    next(error);
  }
});

// GET /api/locations/:id - Get location details
router.get('/:id', optionalAuth, async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const location = await Location.getLocationById(id);
    if (!location) {
      return res.status(404).json({
        error: 'Location not found',
        code: 'LOCATION_NOT_FOUND'
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

// POST /api/locations - Create a new location
router.post('/', optionalAuth, async (req, res, next) => {
  try {
    const locationData = req.body;
    
    // Basic validation
    if (!locationData.name || !locationData.city) {
      return res.status(400).json({
        success: false,
        error: 'Name and city are required fields',
        code: 'VALIDATION_ERROR'
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

// PUT /api/locations/:id - Update a location
router.put('/:id', optionalAuth, async (req, res, next) => {
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
        error: 'Location not found',
        code: 'LOCATION_NOT_FOUND'
      });
    }
    next(error);
  }
});

// DELETE /api/locations/:id - Delete a location (soft delete)
router.delete('/:id', optionalAuth, async (req, res, next) => {
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
        error: 'Location not found',
        code: 'LOCATION_NOT_FOUND'
      });
    }
    if (error.message === 'Location is in use and cannot be deleted') {
      return res.status(400).json({
        success: false,
        error: 'Location is in use and cannot be deleted',
        code: 'LOCATION_IN_USE'
      });
    }
    next(error);
  }
});

module.exports = router; 