
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');

if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
}

// Close nav menu when clicking outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('.navbar') && navMenu && navMenu.classList.contains('active')) {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
    }
});

// Close nav menu when clicking a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        if (navMenu && navMenu.classList.contains('active')) {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });
});

// ============================================
// Smooth Scrolling for Anchor Links
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ============================================
// Load Featured Cars on Homepage
// ============================================
async function loadFeaturedCars() {
    const container = document.getElementById('featuredCars');
    if (!container) return;

    try {
        const response = await fetch('/api/cars/featured');
        const cars = await response.json();

        if (cars.length === 0) {
            container.innerHTML = '<p class="no-cars">No cars available at the moment.</p>';
            return;
        }

        container.innerHTML = cars.map(car => `
            <div class="car-card">
                <img src="${car.image || '/images/default-car.jpg'}" alt="${car.name}" class="car-image" onerror="this.src='/images/default-car.jpg'">
                <div class="car-info">
                    <h3 class="car-name">${car.name} ${car.model}</h3>
                    <div class="car-details">
                        <span><i class="fas fa-gas-pump"></i> ${car.fuelType}</span>
                        <span><i class="fas fa-users"></i> ${car.seatingCapacity} seats</span>
                        <span><i class="fas fa-cog"></i> ${car.transmission}</span>
                        <span><i class="fas fa-calendar"></i> ${car.year}</span>
                    </div>
                    <div class="car-price">
                        $${car.pricePerDay} <span>/ day</span>
                    </div>
                    <span class="availability ${car.availability ? 'available' : 'unavailable'}">
                        ${car.availability ? 'Available' : 'Unavailable'}
                    </span>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading featured cars:', error);
        container.innerHTML = '<p class="error">Failed to load cars. Please refresh the page.</p>';
    }
}

// Load featured cars when homepage loads
if (document.getElementById('featuredCars')) {
    document.addEventListener('DOMContentLoaded', loadFeaturedCars);
}

// ============================================
// Load Cars on Cars Page
// ============================================
async function loadAllCars() {
    const container = document.getElementById('carGrid');
    if (!container) return;

    try {
        // Get current filter values
        const search = document.getElementById('searchInput')?.value || '';
        const price = document.getElementById('priceFilter')?.value || 'all';
        const fuel = document.getElementById('fuelFilter')?.value || 'all';
        const seating = document.getElementById('seatingFilter')?.value || 'all';

        // Build query string
        const params = new URLSearchParams({
            search,
            price,
            fuel,
            seating
        });

        const response = await fetch(`/api/cars?${params.toString()}`);
        const cars = await response.json();

        if (cars.length === 0) {
            container.innerHTML = `
                <div class="no-results">
                    <i class="fas fa-car"></i>
                    <h3>No cars found</h3>
                    <p>Try adjusting your search or filters</p>
                </div>
            `;
            return;
        }

        container.innerHTML = cars.map(car => `
            <div class="car-card">
                <img src="${car.image || '/images/default-car.jpg'}" alt="${car.name}" class="car-image" onerror="this.src='/images/default-car.jpg'">
                <div class="car-info">
                    <h3 class="car-name">${car.name} ${car.model}</h3>
                    <div class="car-details">
                        <span><i class="fas fa-gas-pump"></i> ${car.fuelType}</span>
                        <span><i class="fas fa-users"></i> ${car.seatingCapacity} seats</span>
                        <span><i class="fas fa-cog"></i> ${car.transmission}</span>
                        <span><i class="fas fa-calendar"></i> ${car.year}</span>
                    </div>
                    <div class="car-price">
                        $${car.pricePerDay} <span>/ day</span>
                    </div>
                    <span class="availability ${car.availability ? 'available' : 'unavailable'}">
                        ${car.availability ? 'Available' : 'Unavailable'}
                    </span>
                    ${car.availability ? `<a href="/booking" class="btn btn-primary btn-sm">Book Now</a>` : ''}
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading cars:', error);
        container.innerHTML = '<p class="error">Failed to load cars. Please refresh the page.</p>';
    }
}

// ============================================
// Filter Functions for Cars Page
// ============================================
function filterCars() {
    loadAllCars();
}

// Debounce function for search
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Setup filters on cars page
if (document.getElementById('carGrid')) {
    document.addEventListener('DOMContentLoaded', loadAllCars);
    
    // Search input with debounce
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', debounce(filterCars, 300));
    }
    
    // Filter dropdowns
    document.getElementById('priceFilter')?.addEventListener('change', filterCars);
    document.getElementById('fuelFilter')?.addEventListener('change', filterCars);
    document.getElementById('seatingFilter')?.addEventListener('change', filterCars);
}

// ============================================
// Utility Functions
// ============================================

// Format date
function formatDate(date) {
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

// Format currency
const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
};

// Show notification
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
    
    // Auto dismiss after 5 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

// Add animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ============================================
// Scroll to Top Button
// ============================================
const scrollButton = document.getElementById('scrollToTop');
if (scrollButton) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            scrollButton.style.display = 'flex';
        } else {
            scrollButton.style.display = 'none';
        }
    });

    scrollButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ============================================
// Lazy Loading Images
// ============================================
if ('IntersectionObserver' in window) {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// ============================================
// Form Auto-save (for booking form)
// ============================================
if (document.getElementById('bookingForm')) {
    const form = document.getElementById('bookingForm');
    const inputs = form.querySelectorAll('input, select, textarea');
    
    inputs.forEach(input => {
        input.addEventListener('change', () => {
            const data = new FormData(form);
            const formData = {};
            data.forEach((value, key) => {
                formData[key] = value;
            });
            try {
                localStorage.setItem('bookingFormData', JSON.stringify(formData));
            } catch (e) {
                // Ignore if localStorage is not available
            }
        });
    });
    
    // Load saved data
    try {
        const saved = localStorage.getItem('bookingFormData');
        if (saved) {
            const data = JSON.parse(saved);
            Object.keys(data).forEach(key => {
                const input = form.querySelector(`[name="${key}"]`);
                if (input) {
                    input.value = data[key];
                }
            });
        }
    } catch (e) {
        // Ignore if localStorage is not available
    }
}

console.log('✅ Car Rental System loaded successfully!');