const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    model: {
        type: String,
        required: true,
        trim: true
    },
    brand: {
        type: String,
        required: true,
        trim: true
    },
    year: {
        type: Number,
        required: true
    },
    pricePerDay: {
        type: Number,
        required: true,
        min: 0
    },
    fuelType: {
        type: String,
        enum: ['Petrol', 'Diesel', 'Electric', 'Hybrid'],
        required: true
    },
    seatingCapacity: {
        type: Number,
        required: true,
        min: 1
    },
    transmission: {
        type: String,
        enum: ['Automatic', 'Manual'],
        required: true
    },
    image: {
        type: String,
        default: 'default-car.jpg'
    },
    availability: {
        type: Boolean,
        default: true
    },
    description: {
        type: String,
        trim: true
    },
    features: [String],
    rating: {
        type: Number,
        min: 0,
        max: 5,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Car', carSchema);