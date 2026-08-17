// ============================================
// Reusable Car Card Component
// ============================================
function createCarCard(car, showBookButton = true) {
    var imageUrl = car.image || '/images/default-car.jpg';
    var availabilityClass = car.availability ? 'available' : 'unavailable';
    var availabilityText = car.availability ? 'Available' : 'Unavailable';
    var stockStatus = '';
    
    // Show stock information
    if (car.availableQuantity !== undefined) {
        if (car.availableQuantity === 0) {
            stockStatus = '<span class="stock-badge out-of-stock"><i class="fas fa-times-circle"></i> Out of Stock</span>';
        } else if (car.availableQuantity <= 2) {
            stockStatus = '<span class="stock-badge low-stock"><i class="fas fa-exclamation-triangle"></i> Only ' + car.availableQuantity + ' left</span>';
        } else {
            stockStatus = '<span class="stock-badge in-stock"><i class="fas fa-check-circle"></i> ' + car.availableQuantity + ' available</span>';
        }
    }
    
    var bookButton = '';
    if (showBookButton && car.availability && car.availableQuantity > 0) {
        bookButton = '<a href="/booking?car=' + car._id + '" class="btn btn-primary btn-sm" style="margin-top:10px;display:inline-block;width:100%;text-align:center;">📅 Book Now</a>';
    } else if (showBookButton && car.availableQuantity === 0) {
        bookButton = '<button class="btn btn-secondary btn-sm" style="margin-top:10px;display:inline-block;width:100%;text-align:center;cursor:not-allowed;" disabled>❌ Out of Stock</button>';
    }
    
    var html = '<div class="car-card" data-car-id="' + car._id + '">';
    html += '<img src="' + imageUrl + '" alt="' + car.name + '" class="car-image" onerror="this.src=\'/images/default-car.jpg\'">';
    html += '<div class="car-info">';
    html += '<h3 class="car-name">' + car.name + ' ' + car.model + '</h3>';
    html += '<div class="car-details">';
    html += '<span><i class="fas fa-gas-pump"></i> ' + car.fuelType + '</span>';
    html += '<span><i class="fas fa-users"></i> ' + car.seatingCapacity + ' seats</span>';
    html += '<span><i class="fas fa-cog"></i> ' + car.transmission + '</span>';
    html += '<span><i class="fas fa-calendar"></i> ' + car.year + '</span>';
    html += '</div>';
    html += '<div class="car-price">$' + car.pricePerDay + ' <span>/ day</span></div>';
    html += '<div class="car-stock-info">' + stockStatus + '</div>';
    html += '<span class="availability ' + availabilityClass + '">' + availabilityText + '</span>';
    html += bookButton;
    html += '</div>';
    html += '</div>';
    
    return html;
}

// ============================================
// Reusable Booking Form Component
// ============================================
function createBookingForm(car, cars) {
    var html = '<form id="bookingForm" class="booking-form">';
    
    // Car Selection
    html += '<div class="form-group">';
    html += '<label for="carSelect"><i class="fas fa-car"></i> Select Car <span class="required">*</span></label>';
    html += '<select id="carSelect" name="carSelect" required>';
    html += '<option value="">Choose a car...</option>';
    
    if (cars && cars.length > 0) {
        for (var i = 0; i < cars.length; i++) {
            var c = cars[i];
            var isSelected = (car && car._id && c._id.toString() === car._id.toString());
            var stockInfo = ' (' + c.availableQuantity + ' available)';
            html += '<option value="' + c._id + '" data-price="' + c.pricePerDay + '" data-quantity="' + c.availableQuantity + '" ' + (isSelected ? 'selected' : '') + '>';
            html += c.name + ' ' + c.model + ' - $' + c.pricePerDay + '/day' + stockInfo;
            html += '</option>';
        }
    }
    html += '</select>';
    html += '<span class="error-message" id="carSelectError"></span>';
    html += '</div>';
    
    // Selected Car Info
    if (car) {
        html += '<div class="selected-car-info" style="background:#f0f7ff;padding:1rem 1.5rem;border-radius:8px;margin-bottom:1.5rem;border-left:4px solid #2563eb;">';
        html += '<h4 style="margin-bottom:0.3rem;color:#2563eb;font-size:1rem;"><i class="fas fa-check-circle"></i> Selected Car:</h4>';
        html += '<p style="margin:0;font-size:1.1rem;font-weight:600;">' + car.name + ' ' + car.model + '</p>';
        html += '<p style="margin:0;color:#6b7280;font-size:0.9rem;">';
        html += '<i class="fas fa-gas-pump"></i> ' + car.fuelType + ' • ';
        html += '<i class="fas fa-users"></i> ' + car.seatingCapacity + ' seats • ';
        html += '<i class="fas fa-cog"></i> ' + car.transmission + ' • ';
        html += '<i class="fas fa-dollar-sign"></i> $' + car.pricePerDay + '/day • ';
        html += '<i class="fas fa-boxes"></i> ' + car.availableQuantity + ' available';
        html += '</p>';
        html += '</div>';
    }
    
    // Quantity Selector
    html += '<div class="form-group">';
    html += '<label for="quantity"><i class="fas fa-boxes"></i> Number of Cars <span class="required">*</span></label>';
    html += '<div class="quantity-selector">';
    html += '<button type="button" class="quantity-btn" onclick="updateQuantity(-1)"><i class="fas fa-minus"></i></button>';
    html += '<input type="number" id="quantity" name="quantity" value="1" min="1" max="' + (car ? car.availableQuantity : 10) + '" required>';
    html += '<button type="button" class="quantity-btn" onclick="updateQuantity(1)"><i class="fas fa-plus"></i></button>';
    html += '</div>';
    html += '<span class="error-message" id="quantityError"></span>';
    html += '<small style="color:#6b7280;font-size:0.85rem;">Maximum available: ' + (car ? car.availableQuantity : 0) + ' cars</small>';
    html += '</div>';
    
    // User Details
    html += '<div class="form-row">';
    html += '<div class="form-group">';
    html += '<label for="name"><i class="fas fa-user"></i> Full Name <span class="required">*</span></label>';
    html += '<input type="text" id="name" name="name" placeholder="Enter your full name" required>';
    html += '<span class="error-message" id="nameError"></span>';
    html += '</div>';
    html += '<div class="form-group">';
    html += '<label for="email"><i class="fas fa-envelope"></i> Email Address <span class="required">*</span></label>';
    html += '<input type="email" id="email" name="email" placeholder="Enter your email" required>';
    html += '<span class="error-message" id="emailError"></span>';
    html += '</div>';
    html += '</div>';
    
    html += '<div class="form-row">';
    html += '<div class="form-group">';
    html += '<label for="phone"><i class="fas fa-phone"></i> Phone Number <span class="required">*</span></label>';
    html += '<input type="tel" id="phone" name="phone" placeholder="Enter your phone number" required>';
    html += '<span class="error-message" id="phoneError"></span>';
    html += '</div>';
    html += '<div class="form-group">';
    html += '<label for="address"><i class="fas fa-map-marker-alt"></i> Address</label>';
    html += '<input type="text" id="address" name="address" placeholder="Enter your address">';
    html += '</div>';
    html += '</div>';
    
    // Rental Dates
    html += '<div class="form-row">';
    html += '<div class="form-group">';
    html += '<label for="startDate"><i class="fas fa-calendar-alt"></i> Start Date <span class="required">*</span></label>';
    html += '<input type="date" id="startDate" name="startDate" required>';
    html += '<span class="error-message" id="startDateError"></span>';
    html += '</div>';
    html += '<div class="form-group">';
    html += '<label for="endDate"><i class="fas fa-calendar-alt"></i> End Date <span class="required">*</span></label>';
    html += '<input type="date" id="endDate" name="endDate" required>';
    html += '<span class="error-message" id="endDateError"></span>';
    html += '</div>';
    html += '</div>';
    
    // Total Price
    html += '<div class="form-group">';
    html += '<label for="totalPrice"><i class="fas fa-dollar-sign"></i> Total Price</label>';
    html += '<div id="totalPrice" class="total-price-display" style="display: none;">$0 <span>for 0 days, 0 cars</span></div>';
    html += '</div>';
    
    // Special Requests
    html += '<div class="form-group">';
    html += '<label for="specialRequests"><i class="fas fa-comment"></i> Special Requests</label>';
    html += '<textarea id="specialRequests" name="specialRequests" rows="3" placeholder="Any special requests or requirements..."></textarea>';
    html += '</div>';
    
    // Submit Buttons
    html += '<div class="form-actions">';
    html += '<button type="submit" class="btn btn-primary"><i class="fas fa-check"></i> Book Now</button>';
    html += '<button type="reset" class="btn btn-secondary"><i class="fas fa-redo"></i> Clear</button>';
    html += '</div>';
    
    html += '</form>';
    
    return html;
}

// ============================================
// Quantity Update Function
// ============================================
function updateQuantity(change) {
    var quantityInput = document.getElementById('quantity');
    if (!quantityInput) return;
    
    var currentValue = parseInt(quantityInput.value) || 0;
    var newValue = currentValue + change;
    var max = parseInt(quantityInput.getAttribute('max')) || 10;
    var min = parseInt(quantityInput.getAttribute('min')) || 1;
    
    if (newValue < min) newValue = min;
    if (newValue > max) newValue = max;
    
    quantityInput.value = newValue;
    
    // Trigger price update
    if (typeof updateTotalPrice === 'function') {
        updateTotalPrice();
    }
}

// ============================================
// Reusable Stock Badge Component
// ============================================
function createStockBadge(quantity) {
    var html = '';
    if (quantity === 0) {
        html = '<span class="stock-badge out-of-stock"><i class="fas fa-times-circle"></i> Out of Stock</span>';
    } else if (quantity <= 2) {
        html = '<span class="stock-badge low-stock"><i class="fas fa-exclamation-triangle"></i> Only ' + quantity + ' left</span>';
    } else {
        html = '<span class="stock-badge in-stock"><i class="fas fa-check-circle"></i> ' + quantity + ' available</span>';
    }
    return html;
}

// ============================================
// Reusable Price Display Component
// ============================================
function createPriceDisplay(pricePerDay, quantity = 1, days = 0) {
    var total = pricePerDay * quantity * days;
    return '<span style="font-weight:700;color:#2563eb;font-size:1.5rem;">$' + total + '</span><span style="color:#6b7280;font-size:0.9rem;"> for ' + days + ' days, ' + quantity + ' car' + (quantity > 1 ? 's' : '') + '</span>';
}

// ============================================
// Reusable Rating Component
// ============================================
function createRating(rating) {
    var fullStars = Math.floor(rating);
    var halfStar = rating % 1 >= 0.5;
    var emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    
    var html = '';
    for (var i = 0; i < fullStars; i++) {
        html += '<i class="fas fa-star" style="color:#f59e0b;"></i>';
    }
    if (halfStar) {
        html += '<i class="fas fa-star-half-alt" style="color:#f59e0b;"></i>';
    }
    for (var j = 0; j < emptyStars; j++) {
        html += '<i class="far fa-star" style="color:#d1d5db;"></i>';
    }
    html += ' <span style="color:#6b7280;font-size:0.85rem;">(' + rating + ')</span>';
    
    return html;
}

// ============================================
// Reusable Car List Component
// ============================================
function renderCarList(container, cars, showBookButton = true) {
    if (!container) return;
    
    if (cars.length === 0) {
        container.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:4rem 0;"><i class="fas fa-car" style="font-size:3rem;color:#d1d5db;margin-bottom:1rem;"></i><h3 style="font-size:1.5rem;color:#6b7280;margin-bottom:0.5rem;">No cars found</h3><p style="color:#9ca3af;">Try adjusting your search or filters</p></div>';
        return;
    }
    
    var html = '';
    for (var i = 0; i < cars.length; i++) {
        html += createCarCard(cars[i], showBookButton);
    }
    container.innerHTML = html;
}

// ============================================
// CSS for Stock Badges (Add to your style.css)
// ============================================
var stockStyles = document.createElement('style');
stockStyles.textContent = `
    .car-stock-info {
        margin: 8px 0;
    }
    
    .stock-badge {
        display: inline-block;
        padding: 3px 10px;
        border-radius: 50px;
        font-size: 0.75rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }
    
    .stock-badge.in-stock {
        background: #d1fae5;
        color: #065f46;
    }
    
    .stock-badge.low-stock {
        background: #fef3c7;
        color: #92400e;
        animation: pulse 1.5s ease-in-out infinite;
    }
    
    .stock-badge.out-of-stock {
        background: #fee2e2;
        color: #991b1b;
    }
    
    .quantity-selector {
        display: flex;
        align-items: center;
        gap: 10px;
    }
    
    .quantity-selector input[type="number"] {
        width: 80px;
        text-align: center;
        font-size: 1.2rem;
        font-weight: 600;
        padding: 8px;
        border: 2px solid #e5e7eb;
        border-radius: 8px;
        -moz-appearance: textfield;
    }
    
    .quantity-selector input[type="number"]::-webkit-inner-spin-button,
    .quantity-selector input[type="number"]::-webkit-outer-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }
    
    .quantity-btn {
        width: 40px;
        height: 40px;
        border: 2px solid #e5e7eb;
        border-radius: 50%;
        background: white;
        color: #374151;
        font-size: 1rem;
        cursor: pointer;
        transition: all 0.2s;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    .quantity-btn:hover {
        background: #2563eb;
        color: white;
        border-color: #2563eb;
        transform: scale(1.05);
    }
    
    .quantity-btn:active {
        transform: scale(0.95);
    }
    
    @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.6; }
    }
`;
document.head.appendChild(stockStyles);

console.log('✅ Reusable components loaded successfully!');