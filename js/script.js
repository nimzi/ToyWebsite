// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
}));

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80; // Account for fixed navbar
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Navbar background change on scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = 'none';
    }
});

// Fade in animation on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Add fade-in class to elements and observe them
document.addEventListener('DOMContentLoaded', () => {
    const elementsToAnimate = document.querySelectorAll('.service-card, .testimonial-card, .about-text, .about-stats');
    elementsToAnimate.forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });
});

// Contact form handling
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(this);
        const name = formData.get('name');
        const email = formData.get('email');
        const subject = formData.get('subject');
        const message = formData.get('message');
        
        // Simple validation
        if (!name || !email || !subject || !message) {
            showNotification('Please fill in all fields.', 'error');
            return;
        }
        
        if (!isValidEmail(email)) {
            showNotification('Please enter a valid email address.', 'error');
            return;
        }
        
        // Open email client with pre-filled data
        const emailSubject = encodeURIComponent(subject);
        const emailBody = encodeURIComponent(
            `Hello,\n\n${message}\n\nBest regards,\n${name}\nEmail: ${email}`
        );
        
        // Get the obfuscated email address
        const emailData = {
            part1: String.fromCharCode(116, 101, 97, 99, 104, 101, 114), // "teacher"
            part2: String.fromCharCode(64), // "@"
            part3: String.fromCharCode(103, 101, 110, 101, 114, 97, 116, 105, 118, 101, 97, 114, 116), // "generativeart"
            part4: String.fromCharCode(46), // "."
            part5: String.fromCharCode(115, 116, 117, 100, 105, 111) // "studio"
        };
        const recipientEmail = emailData.part1 + emailData.part2 + emailData.part3 + emailData.part4 + emailData.part5;
        
        // Create mailto link
        const mailtoLink = `mailto:${recipientEmail}?subject=${emailSubject}&body=${emailBody}`;
        
        // Open email client
        window.open(mailtoLink, '_blank');
        
        // Show success notification
        showNotification('Opening your email client...', 'success');
        
        // Reset form after a short delay
        setTimeout(() => {
            this.reset();
        }, 1000);
    });
}

// Email validation function
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 10000;
        max-width: 400px;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    
    notification.querySelector('.notification-content').style.cssText = `
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
    `;
    
    notification.querySelector('.notification-close').style.cssText = `
        background: none;
        border: none;
        color: white;
        font-size: 1.5rem;
        cursor: pointer;
        padding: 0;
        line-height: 1;
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Close button functionality
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => notification.remove(), 300);
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Counter animation for stats
function animateCounters() {
    const counters = document.querySelectorAll('.stat h3');
    
    counters.forEach(counter => {
        const target = parseInt(counter.textContent.replace(/\D/g, ''));
        const suffix = counter.textContent.replace(/\d/g, '');
        let current = 0;
        const increment = target / 50;
        
        const updateCounter = () => {
            if (current < target) {
                current += increment;
                counter.textContent = Math.ceil(current) + suffix;
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target + suffix;
            }
        };
        
        updateCounter();
    });
}

// Trigger counter animation when stats section is visible
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateCounters();
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const statsSection = document.querySelector('.about-stats');
if (statsSection) {
    statsObserver.observe(statsSection);
}

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroPlaceholder = document.querySelector('.hero-placeholder');
    
    if (heroPlaceholder && scrolled < window.innerHeight) {
        heroPlaceholder.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

// Add loading animation
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// Service card hover effects
document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Testimonial card rotation
let currentTestimonial = 0;
const testimonialCards = document.querySelectorAll('.testimonial-card');

function rotateTestimonials() {
    testimonialCards.forEach((card, index) => {
        if (index === currentTestimonial) {
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
        } else {
            card.style.opacity = '0.7';
            card.style.transform = 'scale(0.95)';
        }
    });
    
    currentTestimonial = (currentTestimonial + 1) % testimonialCards.length;
}

// Initialize testimonial rotation
if (testimonialCards.length > 0) {
    testimonialCards.forEach(card => {
        card.style.transition = 'all 0.5s ease';
    });
    
    rotateTestimonials();
    setInterval(rotateTestimonials, 4000);
}

// Add smooth reveal animation for sections
const revealElements = document.querySelectorAll('.section-header, .hero-content');
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, { threshold: 0.1 });

revealElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'all 0.8s ease';
    revealObserver.observe(el);
});

// Email obfuscation system
function obfuscateEmail() {
    // Email parts - split to make it harder for bots to harvest
    // Using character codes and string manipulation for additional obfuscation
    const emailData = {
        part1: String.fromCharCode(116, 101, 97, 99, 104, 101, 114), // "teacher"
        part2: String.fromCharCode(64), // "@"
        part3: String.fromCharCode(103, 101, 110, 101, 114, 97, 116, 105, 118, 101, 97, 114, 116), // "generativeart"
        part4: String.fromCharCode(46), // "."
        part5: String.fromCharCode(115, 116, 117, 100, 105, 111) // "studio"
    };
    
    // Create the full email address
    const fullEmail = emailData.part1 + emailData.part2 + emailData.part3 + emailData.part4 + emailData.part5;
    
    // Find all elements with obfuscated email class
    const emailElements = document.querySelectorAll('.obfuscated-email');
    
    emailElements.forEach(element => {
        // Create clickable mailto link
        const link = document.createElement('a');
        link.href = `mailto:${fullEmail}`;
        link.textContent = fullEmail;
        link.style.color = 'inherit';
        link.style.textDecoration = 'none';
        link.addEventListener('mouseenter', function() {
            this.style.textDecoration = 'underline';
        });
        link.addEventListener('mouseleave', function() {
            this.style.textDecoration = 'none';
        });
        
        // Replace the placeholder content
        element.innerHTML = '';
        element.appendChild(link);
    });
}

// Telegram obfuscation system
function obfuscateTelegram() {
    // Telegram handle parts - split to make it harder for bots to harvest
    // Using character codes and string manipulation for additional obfuscation
    const telegramData = {
        part1: String.fromCharCode(64), // "@"
        part2: String.fromCharCode(98, 101, 110, 111, 110, 105, 115, 121, 115, 116, 101, 109) // "benonisystem"
    };
    
    // Create the full telegram handle
    const fullTelegram = telegramData.part1 + telegramData.part2;
    
    // Find all elements with obfuscated telegram class
    const telegramElements = document.querySelectorAll('.obfuscated-telegram');
    
    telegramElements.forEach(element => {
        // Create clickable telegram link
        const link = document.createElement('a');
        link.href = `https://t.me/benonisystem`;
        link.textContent = fullTelegram;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.style.color = 'inherit';
        link.style.textDecoration = 'none';
        link.addEventListener('mouseenter', function() {
            this.style.textDecoration = 'underline';
        });
        link.addEventListener('mouseleave', function() {
            this.style.textDecoration = 'none';
        });
        
        // Replace the placeholder content
        element.innerHTML = '';
        element.appendChild(link);
    });
}

// Initialize both email and telegram obfuscation when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    obfuscateEmail();
    obfuscateTelegram();
});
