// middleware/validation.js

// Validate email format
exports.validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

// Validate phone number
exports.validatePhone = (phone) => {
    const phoneRegex = /^[\d\s-+()]{10,15}$/;
    return phoneRegex.test(phone);
};

// Validate booking form
exports.validateBookingForm = (req, res, next) => {
    const { name, email, phone, carId, startDate, endDate } = req.body;
    
    const errors = [];
    
    // Validate name
    if (!name || name.length < 2) {
        errors.push('Full name is required (minimum 2 characters)');
    }
    
    // Validate email
    if (!email || !exports.validateEmail(email)) {
        errors.push('Valid email address is required');
    }
    
    // Validate phone
    if (!phone || !exports.validatePhone(phone)) {
        errors.push('Valid phone number is required (10-15 digits)');
    }
    
    // Validate car selection
    if (!carId) {
        errors.push('Please select a car');
    }
    
    // Validate dates
    if (!startDate || !endDate) {
        errors.push('Start and end dates are required');
    } else {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (start < today) {
            errors.push('Start date cannot be in the past');
        }
        
        if (end <= start) {
            errors.push('End date must be after start date');
        }
    }
    
    // If there are errors, return them
    if (errors.length > 0) {
        return res.status(400).json({
            success: false,
            errors: errors
        });
    }
    
    next();
};

// Validate car search/filter parameters
exports.validateSearchParams = (req, res, next) => {
    const { search, price, fuel, seating } = req.query;
    
    // Sanitize search input
    if (search) {
        req.query.search = search.trim().replace(/[<>]/g, '');
    }
    
    // Validate price filter
    if (price && !['all', 'low', 'high'].includes(price)) {
        req.query.price = 'all';
    }
    
    // Validate fuel filter
    if (fuel && !['all', 'Petrol', 'Diesel', 'Electric', 'Hybrid'].includes(fuel)) {
        req.query.fuel = 'all';
    }
    
    // Validate seating filter
    if (seating && !['all', '2', '4', '5', '7', '8'].includes(seating)) {
        req.query.seating = 'all';
    }
    
    next();
};

// Rate limiting middleware (simple implementation)
exports.rateLimit = (maxRequests = 10, timeWindow = 60000) => {
    const requests = {};
    
    return (req, res, next) => {
        const ip = req.ip || req.connection.remoteAddress;
        const now = Date.now();
        
        if (!requests[ip]) {
            requests[ip] = {
                count: 1,
                firstRequest: now
            };
        } else {
            const timeDiff = now - requests[ip].firstRequest;
            
            if (timeDiff < timeWindow) {
                if (requests[ip].count >= maxRequests) {
                    return res.status(429).json({
                        success: false,
                        message: 'Too many requests, please try again later'
                    });
                }
                requests[ip].count++;
            } else {
                requests[ip] = {
                    count: 1,
                    firstRequest: now
                };
            }
        }
        
        next();
    };
};