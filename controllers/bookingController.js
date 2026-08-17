// controllers/bookingController.js
const Booking = require('../models/Booking');
const Car = require('../models/Car');

// Show booking page
exports.showBookingPage = async (req, res) => {
    try {
        const cars = await Car.find({ availability: true });
        res.render('pages/booking', {
            title: 'Book a Car',
            cars
        });
    } catch (error) {
        console.error(error);
        res.status(500).render('pages/error', {
            title: 'Error',
            message: 'Failed to load booking page'
        });
    }
};

// Create a new booking
exports.createBooking = async (req, res) => {
    try {
        const {
            carId,
            name,
            email,
            phone,
            address,
            startDate,
            endDate,
            specialRequests
        } = req.body;
        
        // Validate required fields
        if (!carId || !name || !email || !phone || !startDate || !endDate) {
            return res.status(400).json({
                success: false,
                message: 'All required fields must be filled'
            });
        }
        
        // Validate dates
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
        
        // Check if car exists and is available
        const car = await Car.findById(carId);
        if (!car) {
            return res.status(400).json({
                success: false,
                message: 'Car not found'
            });
        }
        
        if (!car.availability) {
            return res.status(400).json({
                success: false,
                message: 'Car is not available for booking'
            });
        }
        
        // Calculate total price
        const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
        const totalPrice = days * car.pricePerDay;
        
        // Create booking
        const booking = new Booking({
            carId: car._id,
            carName: `${car.name} ${car.model}`,
            user: {
                name,
                email,
                phone,
                address: address || ''
            },
            rentalDates: {
                startDate: start,
                endDate: end
            },
            totalPrice,
            specialRequests: specialRequests || '',
            status: 'Pending'
        });
        
        await booking.save();
        
        // Update car availability
        car.availability = false;
        await car.save();
        
        res.status(201).json({
            success: true,
            message: 'Booking created successfully',
            bookingId: booking._id
        });
    } catch (error) {
        console.error('Booking creation error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create booking'
        });
    }
};

// Get booking confirmation
exports.getBookingConfirmation = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) {
            return res.status(404).render('pages/error', {
                title: 'Not Found',
                message: 'Booking not found'
            });
        }
        res.render('pages/confirmation', {
            title: 'Booking Confirmation',
            booking
        });
    } catch (error) {
        console.error(error);
        res.status(500).render('pages/error', {
            title: 'Error',
            message: 'Failed to load booking confirmation'
        });
    }
};

// Get all bookings (admin feature)
exports.getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find()
            .sort({ createdAt: -1 })
            .populate('carId');
        res.render('pages/admin/bookings', {
            title: 'All Bookings',
            bookings
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Failed to load bookings'
        });
    }
};

// Update booking status
exports.updateBookingStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        
        const booking = await Booking.findById(id);
        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found'
            });
        }
        
        booking.status = status;
        await booking.save();
        
        res.json({
            success: true,
            message: 'Booking status updated successfully'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Failed to update booking status'
        });
    }
};