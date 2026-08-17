// seed.js - Place this in the root directory (car-rental-system/seed.js)
const mongoose = require('mongoose');
const Car = require('./models/Car');
const dotenv = require('dotenv');

dotenv.config();

const sampleCars = [
    {
        name: 'Toyota',
        model: 'Camry',
        brand: 'Toyota',
        year: 2023,
        pricePerDay: 65,
        fuelType: 'Petrol',
        seatingCapacity: 5,
        transmission: 'Automatic',
        image: '/images/cars/camry.jpg',
        availability: true,
        description: 'Comfortable and reliable sedan perfect for family trips.',
        features: ['GPS Navigation', 'Bluetooth', 'Backup Camera', 'Leather Seats'],
        rating: 4.5
    },
    {
        name: 'Honda',
        model: 'CR-V',
        brand: 'Honda',
        year: 2023,
        pricePerDay: 80,
        fuelType: 'Hybrid',
        seatingCapacity: 5,
        transmission: 'Automatic',
        image: '/images/cars/crv.jpg',
        availability: true,
        description: 'Versatile SUV with excellent fuel economy and spacious interior.',
        features: ['AWD', 'Sunroof', 'Apple CarPlay', 'Heated Seats'],
        rating: 4.7
    },
    {
        name: 'Tesla',
        model: 'Model 3',
        brand: 'Tesla',
        year: 2023,
        pricePerDay: 120,
        fuelType: 'Electric',
        seatingCapacity: 5,
        transmission: 'Automatic',
        image: '/images/cars/tesla3.jpg',
        availability: true,
        description: 'Premium electric sedan with cutting-edge technology and autopilot.',
        features: ['Autopilot', 'Premium Sound', 'Glass Roof', 'Phone Key'],
        rating: 4.9
    },
    {
        name: 'Ford',
        model: 'Explorer',
        brand: 'Ford',
        year: 2023,
        pricePerDay: 95,
        fuelType: 'Diesel',
        seatingCapacity: 7,
        transmission: 'Automatic',
        image: '/images/cars/explorer.jpg',
        availability: true,
        description: 'Spacious SUV with third-row seating, perfect for large families.',
        features: ['4WD', 'Tow Package', 'Third Row', 'Rear AC'],
        rating: 4.3
    },
    {
        name: 'BMW',
        model: 'X5',
        brand: 'BMW',
        year: 2023,
        pricePerDay: 150,
        fuelType: 'Petrol',
        seatingCapacity: 5,
        transmission: 'Automatic',
        image: '/images/cars/x5.jpg',
        availability: true,
        description: 'Luxury SUV with superior performance and advanced technology.',
        features: ['Air Suspension', 'Harmon Kardon', 'Panoramic Roof', 'Adaptive Cruise'],
        rating: 4.8
    },
    {
        name: 'Mercedes-Benz',
        model: 'C-Class',
        brand: 'Mercedes-Benz',
        year: 2023,
        pricePerDay: 140,
        fuelType: 'Petrol',
        seatingCapacity: 5,
        transmission: 'Automatic',
        image: '/images/cars/cclass.jpg',
        availability: true,
        description: 'Elegant luxury sedan with premium comfort and advanced safety.',
        features: ['MBUX', 'LED Lights', 'Head-up Display', 'Parking Assist'],
        rating: 4.6
    }
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        await Car.deleteMany({});
        await Car.insertMany(sampleCars);
        console.log('Database seeded successfully!');
        process.exit();
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seedDB();