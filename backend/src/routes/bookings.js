const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const Booking = require('../models/Booking');

const router = express.Router();

// All booking routes require authentication
router.use(authenticateToken);

// GET /api/bookings - Get user bookings
router.get('/', async (req, res, next) => {
  try {
    const bookings = await Booking.getUserBookings(req.user.id);
    res.json({
      message: 'User bookings retrieved successfully',
      data: bookings
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/bookings/user/:userId - Get bookings for specific user (admin)
router.get('/user/:userId', async (req, res, next) => {
  try {
    const { userId } = req.params;
    const bookings = await Booking.getUserBookings(userId);
    res.json({
      message: 'User bookings retrieved successfully',
      data: bookings
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/bookings/:id - Get booking by ID
router.get('/:id', async (req, res, next) => {
  try {
    const booking = await Booking.getBookingById(req.params.id);
    if (!booking) {
      return res.status(404).json({
        error: 'Booking not found',
        code: 'BOOKING_NOT_FOUND'
      });
    }
    res.json({
      message: 'Booking retrieved successfully',
      data: booking
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/bookings - Create new booking
router.post('/', async (req, res, next) => {
  try {
    const bookingData = {
      userId: req.user.id,
      ...req.body
    };
    
    const result = await Booking.createBooking(bookingData);
    res.status(201).json({
      message: 'Booking created successfully',
      data: result
    });
  } catch (error) {
    next(error);
  }
});

// PUT /api/bookings/:id/status - Update booking status
router.put('/:id/status', async (req, res, next) => {
  try {
    const { status } = req.body;
    await Booking.updateBookingStatus(req.params.id, status);
    res.json({
      message: 'Booking status updated successfully'
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router; 