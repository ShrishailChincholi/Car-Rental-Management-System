// ============================================
// Load Cars into Select Dropdown and Auto-select
// ============================================
function loadAvailableCars() {
    var select = document.getElementById('carSelect');
    if (!select) return;

    var selectedValue = select.value;
    
    if (selectedValue) {
        console.log('Car already selected:', selectedValue);
        updateTotalPrice();
        updateQuantityInput();
        return;
    }

    if (select.options.length > 1) {
        var hasSelected = false;
        for (var i = 0; i < select.options.length; i++) {
            if (select.options[i].selected && select.options[i].value !== '') {
                hasSelected = true;
                break;
            }
        }
        
        if (!hasSelected && select.options.length > 1) {
            select.options[1].selected = true;
            console.log('Auto-selected first car:', select.options[1].text);
        }
        
        updateTotalPrice();
        updateQuantityInput();
    }
}

// ============================================
// Update Quantity Input Max Value
// ============================================
function updateQuantityInput() {
    var select = document.getElementById('carSelect');
    var quantityInput = document.getElementById('quantity');
    if (!select || !quantityInput) return;
    
    var selectedOption = select.options[select.selectedIndex];
    if (!selectedOption || !selectedOption.dataset.quantity) {
        quantityInput.max = 10;
        return;
    }
    
    var maxQuantity = parseInt(selectedOption.dataset.quantity);
    quantityInput.max = maxQuantity;
    quantityInput.placeholder = 'Max: ' + maxQuantity;
    
    var smallText = document.querySelector('small[style*="color:#6b7280"]');
    if (smallText) {
        smallText.textContent = 'Maximum available: ' + maxQuantity + ' cars';
    }
    
    if (parseInt(quantityInput.value) > maxQuantity) {
        quantityInput.value = maxQuantity;
    }
}

// ============================================
// Show Modern Notification
// ============================================
function showModernNotification(message, type) {
    type = type || 'success';
    
    var existing = document.querySelector('.modern-notification');
    if (existing) {
        existing.remove();
    }

    var notification = document.createElement('div');
    notification.className = 'modern-notification modern-notification-' + type;
    
    var icons = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        warning: 'fa-exclamation-triangle',
        info: 'fa-info-circle'
    };
    
    var colors = {
        success: '#10b981',
        error: '#ef4444',
        warning: '#f59e0b',
        info: '#3b82f6'
    };
    
    var icon = icons[type] || icons.info;
    var color = colors[type] || colors.info;
    
    notification.innerHTML = '<div class="notification-icon" style="background:' + color + '20;color:' + color + ';"><i class="fas ' + icon + '"></i></div><div class="notification-content"><p>' + message + '</p></div><button class="notification-close" onclick="this.parentElement.remove()"><i class="fas fa-times"></i></button><div class="notification-progress" style="background:' + color + ';"></div>';
    
    notification.style.cssText = 'position:fixed;top:30px;right:30px;min-width:350px;max-width:450px;background:white;border-radius:12px;padding:0;box-shadow:0 20px 60px rgba(0,0,0,0.15),0 4px 12px rgba(0,0,0,0.05);z-index:99999;display:flex;align-items:center;gap:16px;padding:16px 20px;animation:slideInRight 0.4s cubic-bezier(0.22,1,0.36,1);border-left:5px solid ' + color + ';overflow:hidden;';
    
    var style = document.createElement('style');
    style.textContent = '@keyframes slideInRight{from{transform:translateX(100%);opacity:0;}to{transform:translateX(0);opacity:1;}}@keyframes slideOutRight{from{transform:translateX(0);opacity:1;}to{transform:translateX(100%);opacity:0;}}@keyframes progressBar{from{width:100%;}to{width:0%;}}.modern-notification .notification-icon{width:40px;height:40px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:1.2rem;flex-shrink:0;}.modern-notification .notification-content{flex:1;}.modern-notification .notification-content p{margin:0;font-size:0.95rem;color:#1f2937;font-weight:500;line-height:1.4;}.modern-notification .notification-close{background:none;border:none;color:#9ca3af;cursor:pointer;font-size:1rem;padding:4px;transition:color 0.2s;flex-shrink:0;}.modern-notification .notification-close:hover{color:#374151;}.modern-notification .notification-progress{position:absolute;bottom:0;left:0;height:3px;width:100%;animation:progressBar 4s linear forwards;border-radius:0 0 0 12px;}.modern-notification-success .notification-progress{background:#10b981;}.modern-notification-error .notification-progress{background:#ef4444;}.modern-notification-warning .notification-progress{background:#f59e0b;}.modern-notification-info .notification-progress{background:#3b82f6;}@media(max-width:480px){.modern-notification{min-width:auto;max-width:90%;right:5%;top:20px;padding:14px 16px;}}';
    document.head.appendChild(style);
    
    document.body.appendChild(notification);
    
    setTimeout(function() {
        if (notification.parentElement) {
            notification.style.animation = 'slideOutRight 0.3s cubic-bezier(0.22,1,0.36,1)';
            setTimeout(function() {
                notification.remove();
            }, 300);
        }
    }, 4000);
}

// ============================================
// Calculate and Update Total Price with Quantity
// ============================================
function updateTotalPrice() {
    var carSelect = document.getElementById('carSelect');
    var startDate = document.getElementById('startDate');
    var endDate = document.getElementById('endDate');
    var quantityInput = document.getElementById('quantity');
    var totalDisplay = document.getElementById('totalPrice');

    if (!carSelect || !startDate || !endDate || !totalDisplay || !quantityInput) return;

    var selectedOption = carSelect.options[carSelect.selectedIndex];
    if (!selectedOption || !selectedOption.dataset.price) {
        totalDisplay.style.display = 'none';
        return;
    }

    var pricePerDay = parseInt(selectedOption.dataset.price);
    var quantity = parseInt(quantityInput.value) || 1;
    var start = new Date(startDate.value);
    var end = new Date(endDate.value);

    if (start && end && end > start) {
        var days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
        var total = days * pricePerDay * quantity;
        totalDisplay.textContent = 'Total: $' + total + ' (' + days + ' days, ' + quantity + ' car' + (quantity > 1 ? 's' : '') + ')';
        totalDisplay.style.display = 'block';
        totalDisplay.style.animation = 'fadeIn 0.3s ease';
    } else {
        totalDisplay.style.display = 'none';
    }
}

// ============================================
// Set Minimum Dates for Date Inputs
// ============================================
function setMinDates() {
    var today = new Date();
    var year = today.getFullYear();
    var month = String(today.getMonth() + 1).padStart(2, '0');
    var day = String(today.getDate()).padStart(2, '0');
    var todayString = year + '-' + month + '-' + day;

    var startDate = document.getElementById('startDate');
    var endDate = document.getElementById('endDate');

    if (startDate) {
        startDate.setAttribute('min', todayString);
        startDate.addEventListener('change', function() {
            if (endDate) {
                endDate.setAttribute('min', this.value);
                if (endDate.value && endDate.value <= this.value) {
                    endDate.value = '';
                }
            }
            updateTotalPrice();
        });
    }
}

// ============================================
// Handle Booking Form Submission with Quantity
// ============================================
var bookingForm = document.getElementById('bookingForm');
if (bookingForm) {
    bookingForm.addEventListener('submit', function(e) {
        e.preventDefault();

        var errorMessages = document.querySelectorAll('.error-message');
        for (var i = 0; i < errorMessages.length; i++) {
            errorMessages[i].textContent = '';
        }

        var errorFields = document.querySelectorAll('.has-error');
        for (var j = 0; j < errorFields.length; j++) {
            errorFields[j].classList.remove('has-error');
        }

        var formData = {
            carId: document.getElementById('carSelect').value,
            name: document.getElementById('name').value.trim(),
            email: document.getElementById('email').value.trim(),
            phone: document.getElementById('phone').value.trim(),
            address: document.getElementById('address').value.trim(),
            startDate: document.getElementById('startDate').value,
            endDate: document.getElementById('endDate').value,
            quantity: document.getElementById('quantity').value,
            specialRequests: document.getElementById('specialRequests').value.trim()
        };

        var isValid = true;

        if (!formData.carId) {
            document.getElementById('carSelect').classList.add('has-error');
            document.getElementById('carSelectError').textContent = 'Please select a car';
            isValid = false;
        }

        if (!formData.name || formData.name.length < 2) {
            document.getElementById('name').classList.add('has-error');
            document.getElementById('nameError').textContent = 'Please enter your full name (minimum 2 characters)';
            isValid = false;
        }

        if (!formData.email || !isValidEmail(formData.email)) {
            document.getElementById('email').classList.add('has-error');
            document.getElementById('emailError').textContent = 'Please enter a valid email address';
            isValid = false;
        }

        if (!formData.phone || !isValidPhone(formData.phone)) {
            document.getElementById('phone').classList.add('has-error');
            document.getElementById('phoneError').textContent = 'Please enter a valid phone number (10-15 digits)';
            isValid = false;
        }

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
            var start = new Date(formData.startDate);
            var end = new Date(formData.endDate);
            var today = new Date();
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

        var quantity = parseInt(formData.quantity) || 1;
        var select = document.getElementById('carSelect');
        var selectedOption = select.options[select.selectedIndex];
        if (selectedOption && selectedOption.dataset.quantity) {
            var maxQuantity = parseInt(selectedOption.dataset.quantity);
            if (quantity > maxQuantity) {
                document.getElementById('quantity').classList.add('has-error');
                document.getElementById('quantityError').textContent = 'Only ' + maxQuantity + ' cars available';
                isValid = false;
            }
        }

        if (!isValid) {
            var firstError = document.querySelector('.has-error');
            if (firstError) {
                firstError.focus();
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            return;
        }

        var submitBtn = document.querySelector('#bookingForm button[type="submit"]');
        var originalText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';

        fetch('/booking/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            if (data.success) {
                localStorage.removeItem('bookingFormData');
                showModernNotification('Booking created successfully! Redirecting...', 'success');
                setTimeout(function() {
                    window.location.href = '/booking/confirmation/' + data.bookingId;
                }, 1500);
            } else {
                showModernNotification(data.message || 'Failed to create booking', 'error');
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
            }
        })
        .catch(function(error) {
            console.error('Booking error:', error);
            showModernNotification('An error occurred. Please try again.', 'error');
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        });
    });
}

// ============================================
// Helper Functions
// ============================================

function isValidEmail(email) {
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPhone(phone) {
    var phoneRegex = /^[\d\s-+()]{10,15}$/;
    return phoneRegex.test(phone);
}

// ============================================
// Initialize on DOM ready
// ============================================
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        loadAvailableCars();
        setMinDates();
        updateQuantityInput();
    });
} else {
    loadAvailableCars();
    setMinDates();
    updateQuantityInput();
}

var startDateEl = document.getElementById('startDate');
var endDateEl = document.getElementById('endDate');
var carSelectEl = document.getElementById('carSelect');
var quantityEl = document.getElementById('quantity');

if (startDateEl) startDateEl.addEventListener('change', updateTotalPrice);
if (endDateEl) endDateEl.addEventListener('change', updateTotalPrice);
if (carSelectEl) {
    carSelectEl.addEventListener('change', function() {
        updateQuantityInput();
        updateTotalPrice();
    });
}
if (quantityEl) {
    quantityEl.addEventListener('change', updateTotalPrice);
    quantityEl.addEventListener('input', updateTotalPrice);
}

console.log('Booking JavaScript loaded successfully with quantity support!');