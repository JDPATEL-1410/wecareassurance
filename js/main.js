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

carousel.addEventListener('slid.bs.carousel', function () {
    const activeItem = carousel.querySelector('.carousel-item.active');
    let newWord = activeItem.getAttribute('data-word') || "";

    // Remove unwanted words if present
    newWord = newWord.replace(/assurance|insurance/gi, "").trim();

    dynamicWord.textContent = newWord;
});


// === Plans Tab Switching ===
document.addEventListener("DOMContentLoaded", () => {
  const buttons = document.querySelectorAll(".tab-btn");
  const sections = document.querySelectorAll(".insurance-section, .plans-section");

  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      // deactivate all buttons
      buttons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      // show the matching section
      const plan = btn.dataset.plan;
      sections.forEach(sec => {
        if (sec.dataset.plan === plan || sec.id === plan) {
          sec.style.display = "block";
          sec.classList.add("active");
        } else {
          sec.style.display = "none";
          sec.classList.remove("active");
        }
      });
    });
  });
});


// Predefined FAQs
  const faqs = {
    "health insurance": "Health Insurance covers medical expenses due to illness, injury, or hospitalization.",
    "motor insurance": "Motor Insurance covers vehicles against accidents, theft, and third-party liabilities.",
    "travel insurance": "Travel Insurance covers emergencies during travel, trip cancellations, and baggage loss.",
    "home insurance": "Home Insurance protects your house & belongings against fire, theft, and natural disasters.",
    "corporate insurance": "Corporate Insurance covers businesses for property, employees, and liability risks.",
    "liability insurance": "Liability Insurance protects against legal claims due to injury or damage to third parties."
  };

  const chatBtn = document.getElementById("chatBtn");
  const chatBox = document.getElementById("chatBox");
  const sendBtn = document.getElementById("sendBtn");
  const chatInput = document.getElementById("chatInput");
  const chatMessages = document.getElementById("chatMessages");

  // Toggle chatbox
  chatBtn.onclick = () => {
    chatBox.style.display = (chatBox.style.display === "none" ? "flex" : "none");
  };

  // OpenAI API function
  async function getAIResponse(message) {
    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer YOUR_API_KEY" // <-- replace with your OpenAI key
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [{ role: "user", content: message }]
        })
      });

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      return "⚠️ Sorry, I couldn’t fetch the answer right now.";
    }
  }

  // Send message
  sendBtn.onclick = async () => {
    const userMsg = chatInput.value.trim();
    if (!userMsg) return;

    chatMessages.innerHTML += `<div class="user">You: ${userMsg}</div>`;

    // Check FAQ first
    let reply = null;
    for (let key in faqs) {
      if (userMsg.toLowerCase().includes(key)) {
        reply = faqs[key];
        break;
      }
    }

    // If not in FAQs → use AI
    if (!reply) {
      reply = await getAIResponse(userMsg);
    }

    chatMessages.innerHTML += `<div class="bot">AI: ${reply}</div>`;
    chatInput.value = "";
    chatMessages.scrollTop = chatMessages.scrollHeight;
  };
// Enhanced Counter Animation
document.addEventListener('DOMContentLoaded', function() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    const animateCounter = (element) => {
        const target = parseInt(element.getAttribute('data-target'));
        const duration = 2000; // 2 seconds
        const step = target / (duration / 16); // 60fps
        let current = 0;
        
        element.classList.add('counting');
        
        const timer = setInterval(() => {
            current += step;
            if (current >= target) {
                current = target;
                clearInterval(timer);
                element.classList.remove('counting');
            }
            element.textContent = Math.floor(current).toLocaleString();
        }, 16);
    };
    
    // Intersection Observer for triggering animation when in view
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statNumber = entry.target.querySelector('.stat-number');
                if (statNumber && !statNumber.classList.contains('animated')) {
                    statNumber.classList.add('animated');
                    setTimeout(() => animateCounter(statNumber), 200);
                }
            }
        });
    }, { threshold: 0.5 });
    
    document.querySelectorAll('.stat-item').forEach(item => {
        observer.observe(item);
    });
});
// === Value Card Overlay ===
document.addEventListener('DOMContentLoaded', () => {
  const grid = document.querySelector('.values-grid');
  const overlay = document.getElementById('valueCardOverlay');
  if (!grid || !overlay) return;

  const closeBtn = overlay.querySelector('.vc-close');
  const backdrop = overlay.querySelector('.vc-backdrop');
  const content = overlay.querySelector('.vc-content');

  function openOverlay(card) {
    // clone content of card
    const clone = card.cloneNode(true);
    content.innerHTML = '';
    content.append(...Array.from(clone.childNodes));

    overlay.classList.add('active');
    document.body.classList.add('vc-open');
    grid.classList.add('blur-bg');
    closeBtn.focus();
  }

  function closeOverlay() {
    overlay.classList.remove('active');
    document.body.classList.remove('vc-open');
    grid.classList.remove('blur-bg');
  }

  grid.querySelectorAll('.value-card').forEach(card => {
    card.style.cursor = 'pointer';
    card.addEventListener('click', () => openOverlay(card));
  });

  closeBtn.addEventListener('click', closeOverlay);
  backdrop.addEventListener('click', closeOverlay);
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && overlay.classList.contains('active')) {
      closeOverlay();
    }
  });
});
   
