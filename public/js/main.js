// ============================================
// Show Modern Notification (for main.js)
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
    
    notification.innerHTML = `
        <div class="notification-icon" style="background:${color}20;color:${color};">
            <i class="fas ${icon}"></i>
        </div>
        <div class="notification-content">
            <p>${message}</p>
        </div>
        <button class="notification-close" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
        <div class="notification-progress" style="background:${color};"></div>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 30px;
        right: 30px;
        min-width: 350px;
        max-width: 450px;
        background: white;
        border-radius: 12px;
        padding: 0;
        box-shadow: 0 20px 60px rgba(0,0,0,0.15), 0 4px 12px rgba(0,0,0,0.05);
        z-index: 99999;
        display: flex;
        align-items: center;
        gap: 16px;
        padding: 16px 20px;
        animation: slideInRight 0.4s cubic-bezier(0.22, 1, 0.36, 1);
        border-left: 5px solid ${color};
        overflow: hidden;
    `;
    
    var style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOutRight {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
        @keyframes progressBar {
            from { width: 100%; }
            to { width: 0%; }
        }
        .modern-notification .notification-icon {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.2rem;
            flex-shrink: 0;
        }
        .modern-notification .notification-content {
            flex: 1;
        }
        .modern-notification .notification-content p {
            margin: 0;
            font-size: 0.95rem;
            color: #1f2937;
            font-weight: 500;
            line-height: 1.4;
        }
        .modern-notification .notification-close {
            background: none;
            border: none;
            color: #9ca3af;
            cursor: pointer;
            font-size: 1rem;
            padding: 4px;
            transition: color 0.2s;
            flex-shrink: 0;
        }
        .modern-notification .notification-close:hover {
            color: #374151;
        }
        .modern-notification .notification-progress {
            position: absolute;
            bottom: 0;
            left: 0;
            height: 3px;
            width: 100%;
            animation: progressBar 4s linear forwards;
            border-radius: 0 0 0 12px;
        }
        .modern-notification-success .notification-progress { background: #10b981; }
        .modern-notification-error .notification-progress { background: #ef4444; }
        .modern-notification-warning .notification-progress { background: #f59e0b; }
        .modern-notification-info .notification-progress { background: #3b82f6; }
        
        @media (max-width: 480px) {
            .modern-notification {
                min-width: auto;
                max-width: 90%;
                right: 5%;
                top: 20px;
                padding: 14px 16px;
            }
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(notification);
    
    setTimeout(function() {
        if (notification.parentElement) {
            notification.style.animation = 'slideOutRight 0.3s cubic-bezier(0.22, 1, 0.36, 1)';
            setTimeout(function() {
                notification.remove();
            }, 300);
        }
    }, 4000);
}

// ============================================
// Navigation Toggle (Mobile Menu)
// ============================================
var navToggle = document.querySelector('.nav-toggle');
var navMenu = document.querySelector('.nav-menu');

if (navToggle && navMenu) {
    navToggle.addEventListener('click', function() {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
}

// Close nav menu when clicking outside
document.addEventListener('click', function(e) {
    if (!e.target.closest('.navbar') && navMenu && navMenu.classList.contains('active')) {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
    }
});

// Close nav menu when clicking a link
var navLinks = document.querySelectorAll('.nav-link');
for (var i = 0; i < navLinks.length; i++) {
    navLinks[i].addEventListener('click', function() {
        if (navMenu && navMenu.classList.contains('active')) {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });
}

// ============================================
// Load Featured Cars on Homepage
// ============================================
function loadFeaturedCars() {
    var container = document.getElementById('featuredCars');
    if (!container) return;

    fetch('/api/cars/featured')
        .then(function(response) {
            return response.json();
        })
        .then(function(cars) {
            if (cars.length === 0) {
                container.innerHTML = '<p class="no-cars">No cars available at the moment.</p>';
                return;
            }

            var html = '';
            for (var i = 0; i < cars.length; i++) {
                var car = cars[i];
                html += '<div class="car-card">';
                html += '<img src="' + (car.image || '/images/default-car.jpg') + '" alt="' + car.name + '" class="car-image" onerror="this.src=\'/images/default-car.jpg\'">';
                html += '<div class="car-info">';
                html += '<h3 class="car-name">' + car.name + ' ' + car.model + '</h3>';
                html += '<div class="car-details">';
                html += '<span><i class="fas fa-gas-pump"></i> ' + car.fuelType + '</span>';
                html += '<span><i class="fas fa-users"></i> ' + car.seatingCapacity + ' seats</span>';
                html += '<span><i class="fas fa-cog"></i> ' + car.transmission + '</span>';
                html += '<span><i class="fas fa-calendar"></i> ' + car.year + '</span>';
                html += '</div>';
                html += '<div class="car-price">$' + car.pricePerDay + ' <span>/ day</span></div>';
                html += '<span class="availability ' + (car.availability ? 'available' : 'unavailable') + '">' + (car.availability ? 'Available' : 'Unavailable') + '</span>';
                if (car.availability) {
                    html += '<a href="/booking?car=' + car._id + '" class="btn btn-primary btn-sm" style="margin-top:10px;display:inline-block;">Book Now</a>';
                }
                html += '</div>';
                html += '</div>';
            }
            container.innerHTML = html;
        })
        .catch(function(error) {
            console.error('Error loading featured cars:', error);
            container.innerHTML = '<p class="error">Failed to load cars. Please refresh the page.</p>';
        });
}

// Load featured cars when homepage loads
if (document.getElementById('featuredCars')) {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadFeaturedCars);
    } else {
        loadFeaturedCars();
    }
}

// ============================================
// Load Cars on Cars Page
// ============================================
function loadAllCars() {
    var container = document.getElementById('carGrid');
    if (!container) {
        return;
    }

    container.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:3rem 0;"><div style="width:50px;height:50px;border:4px solid #e5e7eb;border-top-color:#2563eb;border-radius:50%;animation:spin 0.8s linear infinite;margin:0 auto;"></div><p style="margin-top:1rem;color:#6b7280;">Loading cars...</p></div>';

    var searchInput = document.getElementById('searchInput');
    var priceFilter = document.getElementById('priceFilter');
    var fuelFilter = document.getElementById('fuelFilter');
    var seatingFilter = document.getElementById('seatingFilter');

    var search = searchInput ? searchInput.value : '';
    var price = priceFilter ? priceFilter.value : 'all';
    var fuel = fuelFilter ? fuelFilter.value : 'all';
    var seating = seatingFilter ? seatingFilter.value : 'all';

    var url = '/api/cars?search=' + encodeURIComponent(search) + '&price=' + encodeURIComponent(price) + '&fuel=' + encodeURIComponent(fuel) + '&seating=' + encodeURIComponent(seating);

    fetch(url)
        .then(function(response) {
            if (!response.ok) {
                throw new Error('Server returned ' + response.status);
            }
            return response.json();
        })
        .then(function(cars) {
            if (cars.length === 0) {
                container.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:4rem 0;"><i class="fas fa-car" style="font-size:3rem;color:#d1d5db;margin-bottom:1rem;"></i><h3 style="font-size:1.5rem;color:#6b7280;margin-bottom:0.5rem;">No cars found</h3><p style="color:#9ca3af;">Try adjusting your search or filters</p></div>';
                return;
            }

            var html = '';
            for (var i = 0; i < cars.length; i++) {
                var car = cars[i];
                html += '<div class="car-card">';
                html += '<img src="' + (car.image || '/images/default-car.jpg') + '" alt="' + car.name + '" class="car-image" onerror="this.src=\'/images/default-car.jpg\'">';
                html += '<div class="car-info">';
                html += '<h3 class="car-name">' + car.name + ' ' + car.model + '</h3>';
                html += '<div class="car-details">';
                html += '<span><i class="fas fa-gas-pump"></i> ' + car.fuelType + '</span>';
                html += '<span><i class="fas fa-users"></i> ' + car.seatingCapacity + ' seats</span>';
                html += '<span><i class="fas fa-cog"></i> ' + car.transmission + '</span>';
                html += '<span><i class="fas fa-calendar"></i> ' + car.year + '</span>';
                html += '</div>';
                html += '<div class="car-price">$' + car.pricePerDay + ' <span>/ day</span></div>';
                html += '<span class="availability ' + (car.availability ? 'available' : 'unavailable') + '">' + (car.availability ? 'Available' : 'Unavailable') + '</span>';
                if (car.availability) {
                    html += '<a href="/booking?car=' + car._id + '" class="btn btn-primary btn-sm" style="margin-top:10px;display:inline-block;width:100%;text-align:center;">Book Now</a>';
                }
                html += '</div>';
                html += '</div>';
            }
            container.innerHTML = html;

            var resultCount = document.getElementById('resultCount');
            if (resultCount) {
                resultCount.textContent = 'Showing ' + cars.length + ' car' + (cars.length > 1 ? 's' : '');
            }
        })
        .catch(function(error) {
            console.error('Error loading cars:', error);
            container.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:3rem 0;"><i class="fas fa-exclamation-circle" style="font-size:3rem;color:#ef4444;margin-bottom:1rem;"></i><h3 style="color:#ef4444;">Failed to load cars</h3><p style="color:#6b7280;">' + error.message + '</p><button onclick="location.reload()" class="btn btn-primary" style="margin-top:1rem;"><i class="fas fa-sync"></i> Refresh</button></div>';
        });
}

// ============================================
// Filter Functions for Cars Page
// ============================================
function filterCars() {
    loadAllCars();
}

function debounce(func, wait) {
    var timeout;
    return function() {
        var context = this;
        var args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(function() {
            func.apply(context, args);
        }, wait);
    };
}

// Setup filters on cars page
if (document.getElementById('carGrid')) {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadAllCars);
    } else {
        loadAllCars();
    }

    var searchInput = document.getElementById('searchInput');
    if (searchInput) {
        var debouncedFilter = debounce(filterCars, 300);
        searchInput.addEventListener('input', debouncedFilter);
    }

    var priceFilter = document.getElementById('priceFilter');
    var fuelFilter = document.getElementById('fuelFilter');
    var seatingFilter = document.getElementById('seatingFilter');

    if (priceFilter) priceFilter.addEventListener('change', filterCars);
    if (fuelFilter) fuelFilter.addEventListener('change', filterCars);
    if (seatingFilter) seatingFilter.addEventListener('change', filterCars);
    
    var resetBtn = document.getElementById('resetFilters');
    if (resetBtn) {
        resetBtn.addEventListener('click', function() {
            if (searchInput) searchInput.value = '';
            if (priceFilter) priceFilter.value = 'all';
            if (fuelFilter) fuelFilter.value = 'all';
            if (seatingFilter) seatingFilter.value = 'all';
            filterCars();
        });
    }
}

// ============================================
// Scroll to Top Button
// ============================================
var scrollButton = document.getElementById('scrollToTop');
if (scrollButton) {
    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            scrollButton.style.display = 'flex';
        } else {
            scrollButton.style.display = 'none';
        }
    });

    scrollButton.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Add spin animation
var style = document.createElement('style');
style.textContent = '@keyframes spin{to{transform:rotate(360deg);}}';
document.head.appendChild(style);

console.log('✅ Car Rental System loaded successfully!');