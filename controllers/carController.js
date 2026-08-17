const Car = require('../models/Car');


// Get all cars with filters

exports.getAllCars = async (req, res) => {
    try {
        console.log('📥 getAllCars called with query:', req.query);
        
        const { search, price, fuel, seating } = req.query;
        
        let query = {};
        
        // Search by name, model, or brand
        if (search && search !== '') {
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
        
        // Sort by price
        let sort = {};
        if (price === 'low') {
            sort.pricePerDay = 1;
        } else if (price === 'high') {
            sort.pricePerDay = -1;
        }
        
        console.log('🔍 Query:', JSON.stringify(query));
        console.log('📊 Sort:', JSON.stringify(sort));
        
        const cars = await Car.find(query).sort(sort);
        
        console.log(`✅ Found ${cars.length} cars`);
        
        // If API request, return JSON
        if (req.xhr || (req.headers.accept && req.headers.accept.includes('application/json'))) {
            return res.json(cars);
        }
        
        // Render the cars page
        res.render('pages/cars', {
            title: 'Our Cars',
            cars: cars
        });
    } catch (error) {
        console.error('❌ Error in getAllCars:', error);
        if (req.xhr || (req.headers.accept && req.headers.accept.includes('application/json'))) {
            return res.status(500).json({
                success: false,
                message: 'Failed to load cars',
                error: error.message
            });
        }
        res.status(500).render('pages/error', {
            title: 'Error',
            message: 'Failed to load cars: ' + error.message
        });
    }
};

// ============================================
// Get featured cars
// ============================================
exports.getFeaturedCars = async (req, res) => {
    try {
        console.log('📥 getFeaturedCars called');
        
        const cars = await Car.find({ availability: true })
            .limit(6)
            .sort({ rating: -1 });
        
        console.log(`✅ Found ${cars.length} featured cars`);
        res.json(cars);
    } catch (error) {
        console.error('❌ Error in getFeaturedCars:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to load featured cars',
            error: error.message
        });
    }
};

// ============================================
// Get available cars for booking
// ============================================
exports.getAvailableCars = async (req, res) => {
    try {
        console.log('📥 getAvailableCars called');
        
        const cars = await Car.find({ availability: true })
            .select('_id name model pricePerDay');
        
        console.log(`✅ Found ${cars.length} available cars`);
        res.json(cars);
    } catch (error) {
        console.error('❌ Error in getAvailableCars:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to load available cars',
            error: error.message
        });
    }
};

// ============================================
// Get car by ID
// ============================================
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
        console.error('Error in getCarById:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to load car details'
        });
    }
};

// ============================================
// Show car detail page
// ============================================
exports.getCarDetailPage = async (req, res) => {
    try {
        const car = await Car.findById(req.params.id);
        if (!car) {
            return res.status(404).render('pages/404', {
                title: 'Car Not Found'
            });
        }
        res.render('pages/car-detail', {
            title: car.name + ' ' + car.model,
            car: car
        });
    } catch (error) {
        console.error('Error in getCarDetailPage:', error);
        res.status(500).render('pages/error', {
            title: 'Error',
            message: 'Failed to load car details'
        });
    }
};