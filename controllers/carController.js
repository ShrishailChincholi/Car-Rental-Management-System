// controllers/carController.js
const Car = require('../models/Car');

// Get all cars with filters
exports.getAllCars = async (req, res) => {
    try {
        const { search, price, fuel, seating } = req.query;
        
        let query = {};
        
        // Search by name or model
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { model: { $regex: search, $options: 'i' } },
                { brand: { $regex: search, $options: 'i' } }
            ];
        }
        
        // Filter by fuel type
        if (fuel && fuel !== 'all') {
            query.fuelType = fuel;
        }
        
        // Filter by seating capacity
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
        
        // If this is an API request (AJAX), return JSON
        if (req.xhr || req.headers.accept?.includes('application/json')) {
            return res.json(cars);
        }
        
        res.render('pages/cars', {
            title: 'Our Cars',
            cars
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Failed to load cars'
        });
    }
};

// Get featured cars for homepage
exports.getFeaturedCars = async (req, res) => {
    try {
        const cars = await Car.find({ availability: true })
            .limit(6)
            .sort({ rating: -1 });
        res.json(cars);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Failed to load featured cars'
        });
    }
};

// Get available cars for booking
exports.getAvailableCars = async (req, res) => {
    try {
        const cars = await Car.find({ availability: true })
            .select('_id name model pricePerDay');
        res.json(cars);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Failed to load available cars'
        });
    }
};

// Get a single car by ID
exports.getCarById = async (req, res) => {
    try {
        const car = await Car.findById(req.params.id);
        if (!car) {
            return res.status(404).json({
                success: false,
                message: 'Car not found'
            });
        }
        res.json(car);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Failed to load car details'
        });
    }
};

// Get car detail page
exports.getCarDetailPage = async (req, res) => {
    try {
        const car = await Car.findById(req.params.id);
        if (!car) {
            return res.status(404).render('pages/error', {
                title: 'Not Found',
                message: 'Car not found'
            });
        }
        res.render('pages/car-detail', {
            title: car.name,
            car
        });
    } catch (error) {
        console.error(error);
        res.status(500).render('pages/error', {
            title: 'Error',
            message: 'Failed to load car details'
        });
    }
};