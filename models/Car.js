const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    model: { type: String, required: true, trim: true },
    brand: { type: String, required: true, trim: true },
    year: { type: Number, required: true },
    pricePerDay: { type: Number, required: true, min: 0 },
    fuelType: { type: String, enum: ['Petrol', 'Diesel', 'Electric', 'Hybrid'], required: true },
    seatingCapacity: { type: Number, required: true, min: 1 },
    transmission: { type: String, enum: ['Automatic', 'Manual'], required: true },
    image: { type: String, default: '/images/default-car.jpg' },
    availability: { type: Boolean, default: true },
    quantity: { type: Number, default: 1, min: 0 },  // NEW: Total quantity
    availableQuantity: { type: Number, default: 1, min: 0 },  // NEW: Available for booking
    bookedQuantity: { type: Number, default: 0, min: 0 },  // NEW: Currently booked
    description: { type: String, trim: true },
    features: [String],
    rating: { type: Number, min: 0, max: 5, default: 0 },
    createdAt: { type: Date, default: Date.now }
});

// Virtual field to check if car is available
carSchema.virtual('isAvailable').get(function() {
    return this.availableQuantity > 0;
});

// Method to book a car
carSchema.methods.bookCar = async function(quantity = 1) {
    if (this.availableQuantity >= quantity) {
        this.availableQuantity -= quantity;
        this.bookedQuantity += quantity;
        this.availability = this.availableQuantity > 0;
        await this.save();
        return true;
    }
    return false;
};

// Method to cancel a booking
carSchema.methods.cancelBooking = async function(quantity = 1) {
    this.availableQuantity += quantity;
    this.bookedQuantity -= quantity;
    this.availability = this.availableQuantity > 0;
    await this.save();
};

module.exports = mongoose.model('Car', carSchema);