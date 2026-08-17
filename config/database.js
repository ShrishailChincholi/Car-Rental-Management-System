const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000,
        });
        console.log('✅ MongoDB Connected Successfully');
    } catch (error) {
        console.error('❌ MongoDB Connection Error:', error.message);
        // Don't exit process in production, let it retry
        if (process.env.NODE_ENV === 'production') {
            console.log('⚠️ Retrying connection in 5 seconds...');
            setTimeout(connectDB, 5000);
        } else {
            process.exit(1);
        }
    }
};

module.exports = connectDB;