const express = require('express');
const router = express.Router();
const Car = require('../models/Car');

// ============================================
// Home page
// ============================================
router.get('/', async function(req, res) {
    try {
        const featuredCars = await Car.find({ availability: true })
            .limit(6)
            .sort({ rating: -1 });
        
        res.render('pages/index', {
            title: 'Home',
            featuredCars: featuredCars
        });
    } catch (error) {
        console.error('Homepage error:', error);
        res.status(500).render('pages/error', {
            title: 'Error',
            message: 'Failed to load homepage'
        });
    }
});

// ============================================
// About page - FIXED
// ============================================
router.get('/about', function(req, res) {
    try {
        res.render('pages/about', {
            title: 'About Us'
        });
    } catch (error) {
        console.error('About page error:', error);
        res.status(500).render('pages/error', {
            title: 'Error',
            message: 'Failed to load about page'
        });
    }
});

// ============================================
// Cars page
// ============================================
router.get('/cars', async function(req, res) {
    try {
        const { search, price, fuel, seating } = req.query;
        
        let query = {};
        
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { model: { $regex: search, $options: 'i' } },
                { brand: { $regex: search, $options: 'i' } }
            ];
        }
        
        if (fuel && fuel !== 'all') {
            query.fuelType = fuel;
        }
        
        if (seating && seating !== 'all') {
            const seats = parseInt(seating);
            if (seats === 8) {
                query.seatingCapacity = { $gte: 8 };
            } else {
                query.seatingCapacity = seats;
            }
        }
        
        let sort = {};
        if (price === 'low') {
            sort.pricePerDay = 1;
        } else if (price === 'high') {
            sort.pricePerDay = -1;
        }
        
        const cars = await Car.find(query).sort(sort);
        
        res.render('pages/cars', {
            title: 'Our Cars',
            cars: cars
        });
    } catch (error) {
        console.error('Cars page error:', error);
        res.status(500).render('pages/error', {
            title: 'Error',
            message: 'Failed to load cars'
        });
    }
});

// ============================================
// Booking page
// ============================================
router.get('/booking', async function(req, res) {
    try {
        const carId = req.query.car;
        let selectedCar = null;
        let cars = [];
        
        cars = await Car.find({ availableQuantity: { $gt: 0 } });
        
        if (carId) {
            selectedCar = await Car.findById(carId);
        }
        
        if (!selectedCar && cars.length > 0) {
            selectedCar = cars[0];
        }
        
        res.render('pages/booking', {
            title: 'Book a Car',
            cars: cars,
            selectedCar: selectedCar
        });
    } catch (error) {
        console.error('Booking page error:', error);
        res.status(500).render('pages/error', {
            title: 'Error',
            message: 'Failed to load booking page'
        });
    }
});

// ============================================
// Booking creation
// ============================================
router.post('/booking/create', async function(req, res) {
    try {
        const Booking = require('../models/Booking');
        const { carId, name, email, phone, address, startDate, endDate, specialRequests, quantity } = req.body;
        
        const bookingQuantity = parseInt(quantity) || 1;
        
        if (!carId || !name || !email || !phone || !startDate || !endDate) {
            return res.status(400).json({
                success: false,
                message: 'All required fields must be filled'
            });
        }
        
        const start = new Date(startDate);
        const end = new Date(endDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (start < today) {
            return res.status(400).json({
                success: false,
                message: 'Start date cannot be in the past'
            });
        }
        
        if (start >= end) {
            return res.status(400).json({
                success: false,
                message: 'End date must be after start date'
            });
        }
        
        const car = await Car.findById(carId);
        if (!car) {
            return res.status(400).json({
                success: false,
                message: 'Car not found'
            });
        }
        
        if (car.availableQuantity < bookingQuantity) {
            return res.status(400).json({
                success: false,
                message: 'Sorry, only ' + car.availableQuantity + ' cars available for booking'
            });
        }
        
        const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
        const totalPrice = days * car.pricePerDay * bookingQuantity;
        
        const booking = new Booking({
            carId: car._id,
            carName: car.name + ' ' + car.model,
            quantity: bookingQuantity,
            user: {
                name: name,
                email: email,
                phone: phone,
                address: address || ''
            },
            rentalDates: {
                startDate: start,
                endDate: end
            },
            totalPrice: totalPrice,
            specialRequests: specialRequests || '',
            status: 'Pending'
        });
        
        await booking.save();
        
        car.availableQuantity -= bookingQuantity;
        car.bookedQuantity += bookingQuantity;
        car.availability = car.availableQuantity > 0;
        await car.save();
        
        res.status(201).json({
            success: true,
            message: 'Booking created successfully',
            bookingId: booking._id,
            remainingQuantity: car.availableQuantity
        });
    } catch (error) {
        console.error('Booking creation error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create booking'
        });
    }
});

// ============================================
// Booking confirmation
// ============================================
router.get('/booking/confirmation/:id', async function(req, res) {
    try {
        const Booking = require('../models/Booking');
        const booking = await Booking.findById(req.params.id);
        if (!booking) {
            return res.status(404).render('pages/404', {
                title: 'Booking Not Found'
            });
        }
        res.render('pages/confirmation', {
            title: 'Booking Confirmation',
            booking: booking
        });
    } catch (error) {
        console.error('Confirmation error:', error);
        res.status(500).render('pages/error', {
            title: 'Error',
            message: 'Failed to load booking confirmation'
        });
    }
});

// ============================================
// API Routes
// ============================================
router.get('/api/cars', async function(req, res) {
    try {
        const { search, price, fuel, seating } = req.query;
        
        let query = {};
        
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { model: { $regex: search, $options: 'i' } },
                { brand: { $regex: search, $options: 'i' } }
            ];
        }
        
        if (fuel && fuel !== 'all') {
            query.fuelType = fuel;
        }
        
        if (seating && seating !== 'all') {
            const seats = parseInt(seating);
            if (seats === 8) {
                query.seatingCapacity = { $gte: 8 };
            } else {
                query.seatingCapacity = seats;
            }
        }
        
        let sort = {};
        if (price === 'low') {
            sort.pricePerDay = 1;
        } else if (price === 'high') {
            sort.pricePerDay = -1;
        }
        
        const cars = await Car.find(query).sort(sort);
        res.json(cars);
    } catch (error) {
        console.error('API error:', error);
        res.status(500).json({ error: 'Failed to load cars' });
    }
});

router.get('/api/cars/featured', async function(req, res) {
    try {
        const cars = await Car.find({ availableQuantity: { $gt: 0 } })
            .limit(6)
            .sort({ rating: -1 });
        res.json(cars);
    } catch (error) {
        console.error('Featured cars error:', error);
        res.status(500).json({ error: 'Failed to load featured cars' });
    }
});

router.get('/api/cars/available', async function(req, res) {
    try {
        const cars = await Car.find({ availableQuantity: { $gt: 0 } })
            .select('_id name model pricePerDay availableQuantity');
        res.json(cars);
    } catch (error) {
        console.error('Available cars error:', error);
        res.status(500).json({ error: 'Failed to load available cars' });
    }
});

// ============================================
// Health check (for Render)
// ============================================
router.get('/health', function(req, res) {
    res.status(200).json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// ============================================
// 404 handler - MUST BE AT THE END
// ============================================
router.use(function(req, res) {
    res.status(404).render('pages/404', {
        title: 'Page Not Found'
    });
});

module.exports = router;