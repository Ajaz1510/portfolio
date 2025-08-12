// Spacebar Navigation Feature
let currentSectionIndex = 0;
const sections = ['hero', 'services', 'tools', 'projects', 'testimonials', 'contact'];

// Spacebar Navigation
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        e.preventDefault(); // Prevent page scroll
        navigateToNextSection();
    }
    
    if (e.key === 'Escape') {
        // Close mobile menu
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
    
    // Arrow key navigation
    if (e.key === 'ArrowDown') {
        e.preventDefault();
        navigateToNextSection();
    }
    
    if (e.key === 'ArrowUp') {
        e.preventDefault();
        navigateToPrevSection();
    }
});

function navigateToNextSection() {
    currentSectionIndex = (currentSectionIndex + 1) % sections.length;
    scrollToSection(sections[currentSectionIndex]);
}

function navigateToPrevSection() {
    currentSectionIndex = (currentSectionIndex - 1 + sections.length) % sections.length;
    scrollToSection(sections[currentSectionIndex]);
}

function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId) || document.querySelector(`.${sectionId}`);
    if (section) {
        section.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
        
        // Update current section index based on actual scroll
        const index = sections.indexOf(sectionId);
        if (index !== -1) {
            currentSectionIndex = index;
        }
        
        // Add visual feedback
        showNavigationFeedback(sectionId);
    }
}

function showNavigationFeedback(sectionId) {
    // Remove existing indicators
    const existingIndicator = document.querySelector('.section-indicator');
    if (existingIndicator) {
        existingIndicator.remove();
    }
    
    // Create section indicator
    const indicator = document.createElement('div');
    indicator.className = 'section-indicator';
    indicator.textContent = getSectionDisplayName(sectionId);
    indicator.style.cssText = `
        position: fixed;
        bottom: 30px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(255, 69, 0, 0.9);
        color: white;
        padding: 10px 20px;
        border-radius: 25px;
        font-size: 14px;
        font-weight: 500;
        z-index: 10000;
        opacity: 0;
        transition: opacity 0.3s ease;
        pointer-events: none;
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.1);
    `;
    
    document.body.appendChild(indicator);
    
    // Animate in
    setTimeout(() => {
        indicator.style.opacity = '1';
    }, 100);
    
    // Remove after delay
    setTimeout(() => {
        indicator.style.opacity = '0';
        setTimeout(() => {
            if (indicator.parentNode) {
                indicator.parentNode.removeChild(indicator);
            }
        }, 300);
    }, 2000);
}

function getSectionDisplayName(sectionId) {
    const names = {
        'hero': 'Home',
        'services': 'Services',
        'tools': 'Tools',
        'projects': 'Projects',
        'testimonials': 'Testimonials',
        'contact': 'Contact'
    };
    return names[sectionId] || sectionId;
}

// Update current section based on scroll
let isScrolling = false;
window.addEventListener('scroll', throttle(() => {
    if (isScrolling) return;
    
    const scrollPosition = window.scrollY + window.innerHeight / 2;
    
    sections.forEach((sectionId, index) => {
        const section = document.getElementById(sectionId) || document.querySelector(`.${sectionId}`);
        if (section) {
            const sectionTop = section.offsetTop;
            const sectionBottom = sectionTop + section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                currentSectionIndex = index;
            }
        }
    });
}, 100));

// Show spacebar hint on page load
function showSpacebarHint() {
    const hint = document.createElement('div');
    hint.className = 'spacebar-hint';
    hint.innerHTML = `
        <div style="display: flex; align-items: center; gap: 10px;">
            <kbd style="background: #333; color: #fff; padding: 5px 10px; border-radius: 4px; font-size: 12px;">SPACE</kbd>
            <span style="font-size: 12px; color: #ccc;">Navigate sections</span>
        </div>
    `;
    hint.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: rgba(0, 0, 0, 0.8);
        padding: 15px;
        border-radius: 10px;
        z-index: 10000;
        opacity: 0;
        transition: opacity 0.3s ease;
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.1);
    `;
    
    document.body.appendChild(hint);
    
    setTimeout(() => {
        hint.style.opacity = '1';
    }, 1000);
    
    setTimeout(() => {
        hint.style.opacity = '0';
        setTimeout(() => {
            if (hint.parentNode) {
                hint.parentNode.removeChild(hint);
            }
        }, 300);
    }, 5000);
}

// Enhanced Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
    
    // Add body scroll lock when menu is open
    if (navMenu.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = 'auto';
    }
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = 'auto';
    });
});

// Enhanced smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href').substring(1);
        const target = document.getElementById(targetId) || document.querySelector(`.${targetId}`);
        
        if (target) {
            const offset = 80; // Navbar height
            const targetPosition = target.offsetTop - offset;
            
            isScrolling = true;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
            
            // Update current section index
            const sectionIndex = sections.indexOf(targetId);
            if (sectionIndex !== -1) {
                currentSectionIndex = sectionIndex;
            }
            
            setTimeout(() => {
                isScrolling = false;
            }, 1000);
        }
    });
});

// Advanced Scroll Reveal Animation
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            
            // Stagger animation for grid items
            const gridItems = entry.target.querySelectorAll('.service-card, .project-card, .testimonial-card');
            gridItems.forEach((item, index) => {
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'translateY(0)';
                }, index * 100);
            });
        }
    });
}, observerOptions);

// Enhanced Contact Form Handling
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = this.querySelector('input[type="text"]').value;
        const email = this.querySelector('input[type="email"]').value;
        const message = this.querySelector('textarea').value;
        
        // Enhanced validation
        if (!name.trim()) {
            showNotification('Please enter your name', 'error');
            return;
        }
        
        if (!isValidEmail(email)) {
            showNotification('Please enter a valid email address', 'error');
            return;
        }
        
        if (!message.trim()) {
            showNotification('Please enter your message', 'error');
            return;
        }
        
        // Enhanced submit animation
        const submitBtn = this.querySelector('.submit-btn');
        const originalText = submitBtn.textContent;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> SENDING...';
        submitBtn.disabled = true;
        
        // Simulate form submission with realistic delay
        setTimeout(() => {
            showNotification('Thank you for your message! I\'ll get back to you soon.', 'success');
            this.reset();
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            
            // Add success animation
            submitBtn.style.transform = 'scale(1.05)';
            setTimeout(() => {
                submitBtn.style.transform = 'scale(1)';
            }, 200);
        }, 2000);
    });
}

// Utility Functions
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#00ff88' : type === 'error' ? '#ff4757' : '#ff4500'};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        z-index: 10000;
        opacity: 0;
        transform: translateX(100%);
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        font-weight: 500;
        box-shadow: 0 10px 25px rgba(0,0,0,0.2);
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Animate out and remove
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 4000);
}

// Enhanced Navbar on Scroll
let lastScrollY = window.scrollY;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;
    
    // Change navbar background
    if (currentScrollY > 100) {
        navbar.style.backgroundColor = 'rgba(10, 10, 10, 0.98)';
        navbar.style.backdropFilter = 'blur(20px)';
    } else {
        navbar.style.backgroundColor = 'rgba(10, 10, 10, 0.95)';
        navbar.style.backdropFilter = 'blur(10px)';
    }
    
    // Hide/show navbar on scroll
    if (currentScrollY > lastScrollY && currentScrollY > 100) {
        navbar.style.transform = 'translateY(-100%)';
    } else {
        navbar.style.transform = 'translateY(0)';
    }
    
    lastScrollY = currentScrollY;
});

// Enhanced CTA Button Click Handler
document.querySelector('.cta-button')?.addEventListener('click', (e) => {
    e.target.style.transform = 'scale(0.95)';
    setTimeout(() => {
        e.target.style.transform = 'scale(1)';
        scrollToSection('contact');
    }, 150);
});

// Enhanced Project Links Handler
document.querySelectorAll('.project-link').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Add click animation
        const card = e.target.closest('.project-card');
        card.style.transform = 'scale(0.98)';
        
        setTimeout(() => {
            card.style.transform = 'scale(1)';
            showNotification('Project case study coming soon!', 'info');
        }, 150);
    });
});

// Enhanced View All Projects Button
document.querySelector('.view-all-btn')?.addEventListener('click', (e) => {
    e.target.style.transform = 'scale(0.95)';
    setTimeout(() => {
        e.target.style.transform = 'scale(1)';
        showNotification('More amazing projects coming soon!', 'info');
    }, 150);
});

// Enhanced Typing Effect for Hero Title
function enhancedTypeWriter(element, text, speed = 100) {
    element.textContent = '';
    element.style.borderRight = '3px solid #ff4500';
    let i = 0;
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        } else {
            // Remove cursor after typing
            setTimeout(() => {
                element.style.borderRight = 'none';
            }, 1000);
        }
    }
    
    type();
}

// Enhanced Parallax Effect
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallax = document.querySelector('.hero-content');
    const profileCard = document.querySelector('.profile-card');
    
    if (parallax) {
        const speed = scrolled * 0.3;
        parallax.style.transform = `translateY(${speed}px)`;
    }
    
    if (profileCard) {
        const speed = scrolled * -0.2;
        profileCard.style.transform = `translateY(${speed}px)`;
    }
    
    // Update progress bar
    updateScrollProgress();
});

// Enhanced Progress Indicator
function updateScrollProgress() {
    const scrollTop = window.pageYOffset;
    const docHeight = document.body.offsetHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    
    let progressBar = document.querySelector('.scroll-progress');
    if (!progressBar) {
        progressBar = document.createElement('div');
        progressBar.className = 'scroll-progress';
        progressBar.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 0%;
            height: 3px;
            background: linear-gradient(90deg, #ff4500, #ff6b35);
            z-index: 9999;
            transition: width 0.1s ease;
        `;
        document.body.appendChild(progressBar);
    }
    
    progressBar.style.width = `${scrollPercent}%`;
}

// Enhanced Mouse Follow Effect
document.addEventListener('mousemove', (e) => {
    const cursor = document.querySelector('.custom-cursor');
    if (!cursor) {
        const newCursor = document.createElement('div');
        newCursor.className = 'custom-cursor';
        newCursor.style.cssText = `
            position: fixed;
            width: 20px;
            height: 20px;
            background: radial-gradient(circle, rgba(255,69,0,0.3) 0%, transparent 70%);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9998;
            transition: transform 0.1s ease;
        `;
        document.body.appendChild(newCursor);
    }
    
    const cursorElement = document.querySelector('.custom-cursor');
    cursorElement.style.left = e.clientX - 10 + 'px';
    cursorElement.style.top = e.clientY - 10 + 'px';
});

// Enhanced Page Load Animation
window.addEventListener('load', () => {
    document.body.style.opacity = '1';
    
    // Initialize typing effect
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const originalText = heroTitle.textContent;
        setTimeout(() => {
            enhancedTypeWriter(heroTitle, originalText, 100);
        }, 800);
    }
    
    // Initialize scroll reveal
    const revealElements = document.querySelectorAll('.services, .projects, .testimonials, .contact');
    revealElements.forEach(el => {
        el.classList.add('reveal');
        revealObserver.observe(el);
    });
    
    // Initialize stagger animations
    initializeStaggerAnimations();
});

// Initialize Stagger Animations
function initializeStaggerAnimations() {
    const serviceCards = document.querySelectorAll('.service-card');
    const projectCards = document.querySelectorAll('.project-card');
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    
    [serviceCards, projectCards, testimonialCards].forEach(collection => {
        collection.forEach((item, index) => {
            item.classList.add('stagger-item');
            item.style.animationDelay = `${index * 0.1}s`;
        });
    });
}

// Enhanced Hover Effects
document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px) scale(1.02)';
        this.style.zIndex = '10';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
        this.style.zIndex = '1';
    });
});

// Keyboard Navigation Support
document.addEventListener('keydown', (e) => {
    // This is now handled in the spacebar navigation section above
});

// Performance Optimization - Throttle scroll events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('🎨 Aezaz Saiyed Portfolio - Loaded Successfully!');
    
    // Add loading class to body
    document.body.classList.add('loading');
    
    // Remove loading class after animations
    setTimeout(() => {
        document.body.classList.remove('loading');
    }, 1000);
    
    // Show spacebar hint after page loads
    setTimeout(() => {
        showSpacebarHint();
    }, 2000);
});
