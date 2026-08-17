// routes/index.js
const express = require('express');
const router = express.Router();
const carController = require('../controllers/carController');
const bookingController = require('../controllers/bookingController');
const { validateSearchParams } = require('../middleware/validation');

// Home page
router.get('/', async (req, res) => {
    try {
        const Car = require('../models/Car');
        const featuredCars = await Car.find({ availability: true })
            .limit(6)
            .sort({ rating: -1 });
        
        res.render('pages/index', {
            title: 'Home',
            featuredCars
        });
    } catch (error) {
        console.error(error);
        res.status(500).render('pages/error', {
            title: 'Error',
            message: 'Failed to load homepage'
        });
    }
});

// About page
router.get('/about', (req, res) => {
    res.render('pages/about', {
        title: 'About Us'
    });
});

// API Routes
router.get('/api/cars', validateSearchParams, carController.getAllCars);
router.get('/api/cars/featured', carController.getFeaturedCars);
router.get('/api/cars/available', carController.getAvailableCars);
router.get('/api/cars/:id', carController.getCarById);

// Car detail page
router.get('/cars/:id', carController.getCarDetailPage);

// Booking API
router.get('/booking', bookingController.showBookingPage);
router.post('/booking/create', bookingController.createBooking);
router.get('/booking/confirmation/:id', bookingController.getBookingConfirmation);

module.exports = router;