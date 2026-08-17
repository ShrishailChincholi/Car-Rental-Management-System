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

// 404 handler
app.use((req, res) => {
    res.status(404).render('pages/404', {
        title: 'Page Not Found'
    });
});

// Error handler for production
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).render('pages/error', {
        title: 'Server Error',
        message: 'Something went wrong! Please try again later.'
    });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📱 Environment: ${process.env.NODE_ENV || 'development'}`);
});