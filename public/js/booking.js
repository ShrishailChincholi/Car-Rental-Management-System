// public/js/booking.js

// ============================================
// Load Cars into Select Dropdown
// ============================================
async function loadAvailableCars() {
    const select = document.getElementById('carSelect');
    if (!select) return;

    try {
        select.innerHTML = '<option value="">Loading cars...</option>';
        select.disabled = true;
        
        const response = await fetch('/api/cars/available');
        const cars = await response.json();

        if (cars.length === 0) {
            select.innerHTML = '<option value="">No cars available</option>';
            select.disabled = true;
            return;
        }

        select.innerHTML = `
            <option value="">Choose a car...</option>
            ${cars.map(car => `
                <option value="${car._id}" data-price="${car.pricePerDay}">
                    ${car.name} ${car.model} - $${car.pricePerDay}/day
                </option>
            `).join('')}
        `;
        select.disabled = false;
    } catch (error) {
        console.error('Error loading cars:', error);
        select.innerHTML = '<option value="">Error loading cars</option>';
        select.disabled = true;
        showNotification('Failed to load available cars', 'error');
    }
}

// Load cars when booking page loads
if (document.getElementById('carSelect')) {
    document.addEventListener('DOMContentLoaded', loadAvailableCars);
}

// ============================================
// Calculate and Update Total Price
// ============================================
function updateTotalPrice() {
    const carSelect = document.getElementById('carSelect');
    const startDate = document.getElementById('startDate');
    const endDate = document.getElementById('endDate');
    const totalDisplay = document.getElementById('totalPrice');
    
    if (!carSelect || !startDate || !endDate || !totalDisplay) return;
    
    const selectedOption = carSelect.options[carSelect.selectedIndex];
    if (!selectedOption || !selectedOption.dataset.price) {
        totalDisplay.style.display = 'none';
        return;
    }
    
    const pricePerDay = parseInt(selectedOption.dataset.price);
    const start = new Date(startDate.value);
    const end = new Date(endDate.value);
    
    if (start && end && end > start) {
        const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
        const total = days * pricePerDay;
        totalDisplay.textContent = `Total: $${total} (${days} days)`;
        totalDisplay.style.display = 'block';
    } else {
        totalDisplay.style.display = 'none';
    }
}

// Add event listeners for price calculation
document.getElementById('startDate')?.addEventListener('change', updateTotalPrice);
document.getElementById('endDate')?.addEventListener('change', updateTotalPrice);
document.getElementById('carSelect')?.addEventListener('change', updateTotalPrice);

// ============================================
// Set Minimum Dates for Date Inputs
// ============================================
function setMinDates() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const todayString = `${year}-${month}-${day}`;
    
    const startDate = document.getElementById('startDate');
    const endDate = document.getElementById('endDate');
    
    if (startDate) {
        startDate.setAttribute('min', todayString);
        startDate.addEventListener('change', function() {
            if (endDate) {
                endDate.setAttribute('min', this.value);
                if (endDate.value && endDate.value <= this.value) {
                    endDate.value = '';
                }
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', setMinDates);

// ============================================
// Handle Booking Form Submission
// ============================================
document.getElementById('bookingForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Clear previous errors
    document.querySelectorAll('.error-message').forEach(el => el.textContent = '');
    document.querySelectorAll('.form-group').forEach(el => el.classList.remove('has-error'));
    
    // Get form values
    const formData = {
        carId: document.getElementById('carSelect').value,
        name: document.getElementById('name').value.trim(),
        email: document.getElementById('email').value.trim(),
        phone: document.getElementById('phone').value.trim(),
        address: document.getElementById('address').value.trim(),
        startDate: document.getElementById('startDate').value,
        endDate: document.getElementById('endDate').value,
        specialRequests: document.getElementById('specialRequests').value.trim()
    };
    
    // Validate form
    let isValid = true;
    
    // Validate car selection
    if (!formData.carId) {
        document.getElementById('carSelect').classList.add('has-error');
        showError('carSelect', 'Please select a car');
        isValid = false;
    }
    
    // Validate name
    if (!formData.name || formData.name.length < 2) {
        document.getElementById('name').classList.add('has-error');
        document.getElementById('nameError').textContent = 'Please enter your full name (minimum 2 characters)';
        isValid = false;
    }
    
    // Validate email
    if (!formData.email || !isValidEmail(formData.email)) {
        document.getElementById('email').classList.add('has-error');
        document.getElementById('emailError').textContent = 'Please enter a valid email address';
        isValid = false;
    }
    
    // Validate phone
    if (!formData.phone || !isValidPhone(formData.phone)) {
        document.getElementById('phone').classList.add('has-error');
        document.getElementById('phoneError').textContent = 'Please enter a valid phone number (10-15 digits)';
        isValid = false;
    }
    
    // Validate dates
    if (!formData.startDate) {
        document.getElementById('startDate').classList.add('has-error');
        document.getElementById('startDateError').textContent = 'Please select a start date';
        isValid = false;
    }
    
    if (!formData.endDate) {
        document.getElementById('endDate').classList.add('has-error');
        document.getElementById('endDateError').textContent = 'Please select an end date';
        isValid = false;
    }
    
    if (formData.startDate && formData.endDate) {
        const start = new Date(formData.startDate);
        const end = new Date(formData.endDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (start < today) {
            document.getElementById('startDate').classList.add('has-error');
            document.getElementById('startDateError').textContent = 'Start date cannot be in the past';
            isValid = false;
        }
        
        if (end <= start) {
            document.getElementById('endDate').classList.add('has-error');
            document.getElementById('endDateError').textContent = 'End date must be after start date';
            isValid = false;
        }
    }
    
    if (!isValid) {
        // Scroll to first error
        const firstError = document.querySelector('.has-error');
        if (firstError) {
            firstError.focus();
            firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        return;
    }
    
    // Submit form
    try {
        const submitBtn = document.querySelector('#bookingForm button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = 'Processing...';
        
        const response = await fetch('/booking/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        
        const data = await response.json();
        
        if (data.success) {
            // Clear saved form data
            localStorage.removeItem('bookingFormData');
            
            // Show success message
            showNotification('Booking created successfully! Redirecting...', 'success');
            
            // Redirect to confirmation page
            setTimeout(() => {
                window.location.href = `/booking/confirmation/${data.bookingId}`;
            }, 1500);
        } else {
            showNotification(data.message || 'Failed to create booking', 'error');
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    } catch (error) {
        console.error('Booking error:', error);
        showNotification('An error occurred. Please try again.', 'error');
        const submitBtn = document.querySelector('#bookingForm button[type="submit"]');
        submitBtn.disabled = false;
        submitBtn.textContent = 'Book Now';
    }
});

// ============================================
// Helper Functions
// ============================================

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPhone(phone) {
    const phoneRegex = /^[\d\s-+()]{10,15}$/;
    return phoneRegex.test(phone);
}

function showError(fieldId, message) {
    const errorElement = document.getElementById(`${fieldId}Error`);
    if (errorElement) {
        errorElement.textContent = message;
    }
}

function showNotification(message, type = 'success') {
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    const colors = {
        success: '#10b981',
        error: '#ef4444',
        warning: '#f59e0b',
        info: '#3b82f6'
    };
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 2rem;
        background: ${colors[type] || colors.info};
        color: white;
        border-radius: 8px;
        font-weight: 500;
        z-index: 10000;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        animation: slideIn 0.3s ease;
        max-width: 400px;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

// Add animation styles if not already present
if (!document.querySelector('#notificationStyles')) {
    const style = document.createElement('style');
    style.id = 'notificationStyles';
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
        .has-error input,
        .has-error select,
        .has-error textarea {
            border-color: #ef4444 !important;
        }
        .error-message {
            color: #ef4444;
            font-size: 0.85rem;
            margin-top: 0.25rem;
            display: block;
        }
    `;
    document.head.appendChild(style);
}

// ============================================
// Clear Form Data
// ============================================
document.querySelector('#bookingForm button[type="reset"]')?.addEventListener('click', () => {
    localStorage.removeItem('bookingFormData');
    document.querySelectorAll('.error-message').forEach(el => el.textContent = '');
    document.querySelectorAll('.has-error').forEach(el => el.classList.remove('has-error'));
    document.getElementById('totalPrice').style.display = 'none';
});

console.log('✅ Booking JavaScript loaded successfully!');