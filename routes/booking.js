// routes/booking.js (Optional)
const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');

// Show booking page
router.get('/', bookingController.showBookingPage);

// Create booking
router.post('/create', bookingController.createBooking);

// Get confirmation
router.get('/confirmation/:id', bookingController.getBookingConfirmation);

module.exports = router;