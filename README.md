# 🚗 Car Rental Management System

A modern, full-featured Car Rental Management System built with **Node.js**, **Express**, **MongoDB Atlas**, and **EJS**. This application allows users to browse available cars, view detailed car information, and book cars online with a seamless user experience.

## 🌐 Live Demo

**[🔗 Car Rental System Live](https://car-rental-management-system-au37.onrender.com)**

---

## ✨ Features

### 🏠 Homepage
- Hero section with call-to-action buttons
- Company introduction
- Featured cars display
- Clean and professional design
- Animated car image

### 🚘 Car Listing
- Display multiple cars with:
  - Car images
  - Name/Model
  - Price per day
  - Fuel type
  - Seating capacity
  - Transmission type
  - Year of manufacture
  - Availability status
  - Stock quantity
- Search and filter functionality

### 🔍 Search & Filter
- Search cars by name/model/brand
- Filter by price (Low to High / High to Low)
- Filter by fuel type (Petrol, Diesel, Electric, Hybrid)
- Filter by seating capacity (2, 4, 5, 7, 8+)

### 📝 Car Booking
- Complete booking form with:
  - Car selection with dynamic updates
  - User details (Name, Email, Phone, Address)
  - Rental date selection
  - Quantity selector (multiple cars)
  - Special requests
- Real-time price calculation
- Form validation with error messages
- Modern toast notifications

### 📱 Responsive Design
- Fully responsive on:
  - Mobile devices (320px - 480px)
  - Tablets (481px - 1024px)
  - Desktop screens (1025px+)
- Optimized for all screen sizes
- Touch-friendly buttons

### 🎨 Modern UI
- Gradient color scheme
- Glassmorphism effects
- Smooth animations
- Professional typography
- Interactive hover effects
- Dark theme hero section

---

## 🛠️ Technologies Used

### Backend
| Technology | Purpose |
|------------|---------|
| **Node.js** | JavaScript runtime |
| **Express.js** | Web framework |
| **MongoDB Atlas** | Cloud database |
| **Mongoose** | ODM for MongoDB |
| **dotenv** | Environment variables |

### Frontend
| Technology | Purpose |
|------------|---------|
| **EJS** | Template engine |
| **CSS3** | Custom styling with modern features |
| **JavaScript** | Vanilla JS for interactivity |
| **Font Awesome** | Icons |
| **Google Fonts** | Poppins font |

### Deployment
| Service | Purpose |
|---------|---------|
| **Render** | Cloud hosting platform |
| **MongoDB Atlas** | Cloud database hosting |
| **GitHub** | Version control |

---

## 📁 Project Structure

car-rental-system/
├── config/
│ └── database.js # Database connection
├── controllers/
│ ├── bookingController.js # Booking logic
│ └── carController.js # Car logic
├── middleware/
│ └── validation.js # Form validation
├── models/
│ ├── Booking.js # Booking schema
│ └── Car.js # Car schema
├── public/
│ ├── css/
│ │ └── style.css # Main styles (complete)
│ ├── js/
│ │ ├── booking.js # Booking JavaScript
│ │ └── main.js # Main JavaScript
│ └── images/
│ └── cars/
│ ├── img1.jpg # Toyota Camry
│ ├── img2.jpg # Honda CR-V
│ ├── img3.jpg # Tesla Model 3
│ ├── img4.jpg # Ford Explorer
│ ├── img5.jpg # BMW X5
│ └── img6.jpg # Mercedes C-Class
├── routes/
│ └── index.js # All routes
├── views/
│ ├── layouts/
│ │ └── main.ejs # Main layout
│ ├── partials/
│ │ ├── header.ejs # Header partial
│ │ └── footer.ejs # Footer partial
│ └── pages/
│ ├── index.ejs # Homepage
│ ├── cars.ejs # Cars page
│ ├── booking.ejs # Booking page
│ ├── confirmation.ejs # Confirmation page
│ ├── about.ejs # About page
│ ├── 404.ejs # 404 page
│ └── error.ejs # Error page
├── .env # Environment variables
├── .gitignore # Git ignore
├── package.json # Dependencies
├── package-lock.json # Lock file
├── seed.js # Database seeder
├── server.js # Main server file
└── README.md # Documentation

text

---

## 📦 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas account (or local MongoDB)
- Git

### Step 1: Clone the Repository
```bash
git clone https://github.com/ShrishailChincholi/Car-Rental-Management-System
cd car-rental-system
Step 2: Install Dependencies
bash
npm install
Step 3: Configure Environment Variables
Create a .env file in the root directory:

env
PORT=3000
MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/car_rental?retryWrites=true&w=majority
NODE_ENV=development
Step 4: Seed the Database
bash
npm run seed
Or run directly:

bash
node seed.js
Step 5: Start the Server
bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
Step 6: Open in Browser
text
http://localhost:3000
🗄️ Database Schema
Car Model
javascript
{
  name: String,                    // Car name (e.g., "Toyota")
  model: String,                   // Car model (e.g., "Camry")
  brand: String,                   // Brand name
  year: Number,                    // Manufacturing year
  pricePerDay: Number,             // Price per day in USD
  fuelType: String,                // Petrol, Diesel, Electric, Hybrid
  seatingCapacity: Number,         // Number of seats
  transmission: String,            // Automatic, Manual
  image: String,                   // Image path
  availability: Boolean,           // Is car available?
  quantity: Number,                // Total quantity
  availableQuantity: Number,       // Available for booking
  bookedQuantity: Number,          // Currently booked
  description: String,             // Car description
  features: [String],              // Array of features
  rating: Number,                  // Rating (0-5)
  createdAt: Date                  // Creation date
}
Booking Model
javascript
{
  carId: ObjectId,                 // Reference to Car
  carName: String,                 // Car name (denormalized)
  quantity: Number,                // Number of cars booked
  user: {
    name: String,                  // User's full name
    email: String,                 // User's email
    phone: String,                 // User's phone
    address: String                // User's address
  },
  rentalDates: {
    startDate: Date,               // Rental start date
    endDate: Date                  // Rental end date
  },
  totalPrice: Number,              // Total price
  status: String,                  // Pending, Confirmed, Cancelled, Completed
  specialRequests: String,         // Special requests
  createdAt: Date                  // Creation date
}

🚀 Deployment on Render
Step 1: Push to GitHub
bash
git add .
git commit -m "Initial commit"
git push origin main
Step 2: Deploy on Render
Go to Render.com

Sign up with GitHub

Click "New +" → "Web Service"

Connect your repository

Configure:

Name: car-rental-system

Environment: Node

Build Command: npm install

Start Command: node server.js

Add Environment Variables:

MONGODB_URI: Your MongoDB connection string

NODE_ENV: production

PORT: 10000

Click "Create Web Service"

Step 3: Seed Database on Render
Go to Render Dashboard

Click on your service

Click "Shell" tab

Run: node seed.js

Step 4: Access Your Live App
text
https://car-rental-system.onrender.com
📝 API Endpoints
Method	Endpoint	Description
GET	/	Homepage
GET	/cars	Cars page
GET	/cars/:id	Car details
GET	/booking	Booking page
POST	/booking/create	Create booking
GET	/booking/confirmation/:id	Booking confirmation
GET	/about	About page
GET	/api/cars	Get all cars (JSON)
GET	/api/cars/featured	Get featured cars
GET	/api/cars/available	Get available cars
GET	/health	Health check
🔧 Troubleshooting
MongoDB Connection Error
bash
# Check if IP is whitelisted in MongoDB Atlas
# Add 0.0.0.0/0 to Network Access
Port Already in Use
bash
# Kill the process on port 3000
# Windows: netstat -ano | findstr :3000
# Linux/Mac: lsof -i :3000
Images Not Loading
bash
# Check if images are in public/images/cars/
# Use default placeholder images if missing
Missing Script "seed"
bash
# Add to package.json scripts:
"seed": "node seed.js"
📝 License
This project is licensed under the MIT License - see the LICENSE file for details.

👨‍💻 Author
Shrishail Chincholi

GitHub: @ShrishailChincholi

LinkedIn: Shrishail Chincholi

🙏 Acknowledgments
Font Awesome for icons

Google Fonts for Poppins font

MongoDB Atlas for cloud database

Render for hosting

Express.js community

📞 Support
For support, please create an issue in the GitHub repository or contact:

Email: info@rentcar.com

🎯 Quick Start
bash
# Clone the repository
git clone https://github.com/ShrishailChincholi/Car-Rental-Management-System
cd car-rental-system

# Install dependencies
npm install

# Create .env file with your MongoDB URI
echo "MONGODB_URI=mongodb+srv://username:password@cluster.xxxxx.mongodb.net/car_rental" > .env

# Seed the database
npm run seed

# Start the server
npm run dev

# Open in browser
# http://localhost:3000
🌟 Features Showcase
Feature	Description
🏠 Homepage	Hero section, featured cars, stats
🚘 Car Listing	Grid view with details and stock
🔍 Search & Filter	Real-time search and filtering
📝 Booking System	Complete booking with validation
📱 Responsive	Works on all devices
🎨 Modern UI	Gradient design with animations
📊 Stock Management	Track available quantities
💰 Real-time Pricing	Instant price calculation
🔔 Notifications	Modern toast notifications
🖨️ Print Support	Print booking confirmation
🎉 Thank You
Thank you for using the Car Rental Management System! We hope this system helps you manage car rentals efficiently.

If you find this project useful, please ⭐ star the repository on GitHub!

Made with ❤️ by Shrishail Chincholi

text

---

---

## 📦 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas account (or local MongoDB)
- Git

### Step 1: Clone the Repository
```bash
git clone https://github.com/YOUR_USERNAME/car-rental-system.git
cd car-rental-system