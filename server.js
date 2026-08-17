const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const expressLayouts = require('express-ejs-layouts');
const path = require('path');

// Load environment variables
dotenv.config();

// Import routes
const indexRoutes = require('./routes/index');
const carRoutes = require('./routes/cars');
const bookingRoutes = require('./routes/booking');

// Initialize app
const app = express();

// Database connection
const connectDB = require('./config/database');
connectDB();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// EJS setup
app.use(expressLayouts);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.set('layout', 'layouts/main');

// Routes
app.use('/', indexRoutes);
app.use('/cars', carRoutes);
app.use('/booking', bookingRoutes);

// Error handling middleware
app.use((req, res) => {
    res.status(404).render('pages/404', { title: 'Page Not Found' });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});