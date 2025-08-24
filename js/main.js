// Main JavaScript functionality
document.addEventListener('DOMContentLoaded', function () {
    initNavigation();
    initAnimations();
    initCounters();
    initTestimonialCarousel();
    initPlanTabs();
    initScrollEffects();
    initAOS();
});

// Navigation functionality
function initNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });

        document.addEventListener('click', (e) => {
            if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    }

    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                navbar.style.background = 'rgba(255, 255, 255, 0.95)';
                navbar.style.backdropFilter = 'blur(10px)';
            } else {
                navbar.style.background = 'var(--white)';
                navbar.style.backdropFilter = 'none';
            }
        });
    }
}

// Animation initialization with Intersection Observer
function initAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.value-card, .plan-card, .stat-item, .testimonial-card, .blog-card, .step-item');
    animatedElements.forEach(el => observer.observe(el));
}

// Animated counters
function initCounters() {
    const counters = document.querySelectorAll('.stat-number');

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.getAttribute('data-target'));
                const duration = 2000;
                const step = target / (duration / 16);
                let current = 0;

                const updateCounter = () => {
                    if (current < target) {
                        current += step;
                        counter.textContent = Math.floor(current).toLocaleString();
                        requestAnimationFrame(updateCounter);
                    } else {
                        counter.textContent = target.toLocaleString();
                    }
                };

                updateCounter();
                counterObserver.unobserve(counter);
            }
        });
    });

    counters.forEach(counter => counterObserver.observe(counter));
}

// Testimonial carousel
function initTestimonialCarousel() {
    const carousel = document.querySelector('.testimonials-carousel');
    if (!carousel) return;

    const track = carousel.querySelector('.testimonial-track');
    const cards = carousel.querySelectorAll('.testimonial-card');
    const prevBtn = carousel.querySelector('.prev-btn');
    const nextBtn = carousel.querySelector('.next-btn');
    const indicators = carousel.querySelectorAll('.indicator');

    if (!track || cards.length === 0) return;

    let currentIndex = 0;
    const totalCards = cards.length;

    function updateCarousel() {
        const translateX = -currentIndex * 100;
        track.style.transform = `translateX(${translateX}%)`;

        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === currentIndex);
        });
    }

    function nextTestimonial() {
        currentIndex = (currentIndex + 1) % totalCards;
        updateCarousel();
    }

    function prevTestimonial() {
        currentIndex = (currentIndex - 1 + totalCards) % totalCards;
        updateCarousel();
    }

    if (nextBtn) nextBtn.addEventListener('click', nextTestimonial);
    if (prevBtn) prevBtn.addEventListener('click', prevTestimonial);

    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            currentIndex = index;
            updateCarousel();
        });
    });

    // Auto-play carousel
    setInterval(nextTestimonial, 5000);

    // Touch/swipe support for mobile
    let startX = 0;
    let endX = 0;

    track.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
    });

    track.addEventListener('touchend', (e) => {
        endX = e.changedTouches.clientX;
        const diff = startX - endX;

        if (Math.abs(diff) > 50) {
            if (diff > 0) {
                nextTestimonial();
            } else {
                prevTestimonial();
            }
        }
    });
}

// Plans page tabs
function initPlanTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const planSections = document.querySelectorAll('.plan-section');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const planType = btn.getAttribute('data-plan');

            // Update active tab
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Show corresponding section
            planSections.forEach(section => {
                if (section.id === planType) {
                    section.classList.add('active');
                } else {
                    section.classList.remove('active');
                }
            });

            // Scroll to plans section
            const plansNav = document.querySelector('.plans-nav');
            if (plansNav) {
                window.scrollTo({
                    top: plansNav.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Handle hash navigation
    const hash = window.location.hash.substring(1);
    if (hash && ['health', 'motor', 'travel', 'life'].includes(hash)) {
        const targetBtn = document.querySelector(`[data-plan="${hash}"]`);
        if (targetBtn) {
            targetBtn.click();
        }
    }
}

// Scroll effects
function initScrollEffects() {
    // Back to top button (if exists)
    const backToTop = document.querySelector('.back-to-top');
    if (backToTop) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 500) {
                backToTop.style.display = 'block';
            } else {
                backToTop.style.display = 'none';
            }
        });

        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // Parallax effect for hero section
    const hero = document.querySelector('.hero');
    if (hero) {
        window.addEventListener('scroll', () => {
            const scrolled = window.scrollY;
            const rate = scrolled * -0.5;
            hero.style.transform = `translateY(${rate}px)`;
        });
    }
}

// Simple AOS (Animate On Scroll) implementation
function initAOS() {
    const elements = document.querySelectorAll('[data-aos]');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('aos-animate');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    elements.forEach(el => observer.observe(el));
}

// Utility functions
function showLoader(element) {
    if (element) {
        element.classList.add('loading');
    }
}

function hideLoader(element) {
    if (element) {
        element.classList.remove('loading');
    }
}

function showMessage(element, message, type = 'info') {
    if (element) {
        element.innerHTML = message;
        element.className = `form-message ${type}`;
        element.style.display = 'block';
    }
}

function hideMessage(element) {
    if (element) {
        element.style.display = 'none';
    }
}

// Smooth scroll for anchor links
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

// Form validation utilities
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePhone(phone) {
    const re = /^[\+]?[1-9][\d]{0,15}$/;
    return re.test(phone.replace(/\s/g, ''));
}

function validateRequired(value) {
    return value.trim().length > 0;
}

// Export functions for use in other files
window.WeCareAssurance = {
    showLoader,
    hideLoader,
    showMessage,
    hideMessage,
    validateEmail,
    validatePhone,
    validateRequired
};
// Tab Switching
const tabs = document.querySelectorAll(".tab-btn");
const sections = document.querySelectorAll(".insurance-section");

tabs.forEach(tab => {
    tab.addEventListener("click", () => {
        tabs.forEach(t => t.classList.remove("active"));
        tab.classList.add("active");

        const target = tab.getAttribute("data-plan");
        sections.forEach(section => {
            section.classList.remove("active");
            if (section.id === target) {
                section.classList.add("active");
            }
        });
    });
});
const carousel = document.getElementById('heroImageCarousel');
const dynamicWord = document.getElementById('dynamicWord');

carousel.addEventListener('slid.bs.carousel', function (event) {
    const activeItem = carousel.querySelector('.carousel-item.active');
    const newWord = activeItem.getAttribute('data-word');
    dynamicWord.textContent = newWord;
});

// Tab Switch LI / GI
const buttons = document.querySelectorAll(".tab-btn");
const section = document.querySelectorAll(".insurance-section");

buttons.forEach(btn => {
    btn.addEventListener("click", () => {
        buttons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        const plan = btn.dataset.plan;
        sections.forEach(sec => {
            sec.classList.remove("active");
            if (sec.id === plan) {
                sec.classList.add("active");
            }
        });
    });
});
// Show popup on exit intent
document.addEventListener("mouseleave", function (e) {
    if (e.clientY < 10) { // near top of page
        document.getElementById("review-popup").style.display = "flex";
    }
});

function closeReviewPopup() {
    document.getElementById("review-popup").style.display = "none";
}
