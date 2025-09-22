// EmailJS Configuration - Your Actual IDs
const EMAILJS_SERVICE_ID = 'service_18hbr8l'; 
const EMAILJS_TEMPLATE_ID = 'template_bogm2bd'; 
const EMAILJS_PUBLIC_KEY = 'Puxx0NSjhHF3G1S6F'; 

// Initialize EmailJS
(function() {
    emailjs.init(EMAILJS_PUBLIC_KEY);
})();

document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    const phoneInput = document.getElementById('phone');
    
    if (contactForm) {
        contactForm.addEventListener('submit', handleFormSubmit);
    }
    
    // Phone number validation - Only 10 digits
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            // Remove all non-digit characters
            let cleaned = e.target.value.replace(/\D/g, '');
            
            // Limit to exactly 10 digits
            if (cleaned.length > 10) {
                cleaned = cleaned.substring(0, 10);
            }
            
            e.target.value = cleaned;
            
            // Real-time validation
            validatePhoneNumber(cleaned);
        });
        
        phoneInput.addEventListener('blur', function(e) {
            validatePhoneNumber(e.target.value);
        });
    }
});

function validatePhoneNumber(phoneNumber) {
    const phoneContainer = document.querySelector('.phone-input-container');
    const phoneError = document.querySelector('.phone-error');
    
    // Remove existing error states
    if (phoneContainer) {
        phoneContainer.classList.remove('error');
    }
    if (phoneError) {
        phoneError.style.display = 'none';
    }
    
    // Validate phone number
    if (phoneNumber.length === 0) {
        return; // Empty is okay until form submission
    }
    
    if (phoneNumber.length !== 10) {
        showPhoneError('Please enter exactly 10 digits');
        return false;
    }
    
    // Check if first digit is valid (Indian mobile numbers start with 6,7,8,9)
    const firstDigit = phoneNumber.charAt(0);
    if (!['6', '7', '8', '9'].includes(firstDigit)) {
        showPhoneError('Mobile number should start with 6, 7, 8, or 9');
        return false;
    }
    
    return true;
}

function showPhoneError(message) {
    const phoneContainer = document.querySelector('.phone-input-container');
    let phoneError = document.querySelector('.phone-error');
    
    if (phoneContainer) {
        phoneContainer.classList.add('error');
    }
    
    // Create error element if doesn't exist
    if (!phoneError) {
        phoneError = document.createElement('span');
        phoneError.className = 'phone-error';
        if (phoneContainer && phoneContainer.parentNode) {
            phoneContainer.parentNode.appendChild(phoneError);
        }
    }
    
    phoneError.textContent = message;
    phoneError.style.display = 'block';
}

async function handleFormSubmit(e) {
    e.preventDefault();
    
    console.log('Form submitted!'); // Debug log
    
    const submitBtn = document.getElementById('submitBtn');
    const formMessage = document.getElementById('formMessage');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoading = submitBtn.querySelector('.btn-loading');
    
    const phoneNumber = document.getElementById('phone').value;
    
    // Validate phone number before submission
    if (!validatePhoneNumber(phoneNumber)) {
        showMessage('Please enter a valid 10-digit mobile number.', 'error');
        return;
    }
    
    // Get form data with +91 prefix for phone
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: '+91' + phoneNumber, // Add regional code
        subject: document.getElementById('subject').value,
        message: document.getElementById('message').value,
        to_email: 'prajapatiishwar79@gmail.com'
    };
    
    console.log('Form Data:', formData); // Debug log
    
    // Validation
    if (!formData.name || !formData.email || !phoneNumber || !formData.message) {
        showMessage('Please fill in all required fields.', 'error');
        return;
    }
    
    if (!document.getElementById('consent').checked) {
        showMessage('Please consent to data processing.', 'error');
        return;
    }
    
    // Show loading state
    submitBtn.disabled = true;
    btnText.style.display = 'none';
    btnLoading.style.display = 'flex';
    
    try {
        const response = await emailjs.send(
            EMAILJS_SERVICE_ID,
            EMAILJS_TEMPLATE_ID,
            formData
        );
        
        console.log('EmailJS Response:', response); // Debug log
        
        if (response.status === 200) {
            showMessage('Thank you! Your message has been sent successfully. We will get back to you within 24 hours.', 'success');
            document.getElementById('contactForm').reset();
        } else {
            throw new Error('Failed to send message');
        }
    } catch (error) {
        console.error('EmailJS Error:', error); // Debug log
        showMessage('Sorry, there was an error sending your message. Please try again or contact us directly.', 'error');
    } finally {
        // Reset button state
        submitBtn.disabled = false;
        btnText.style.display = 'inline';
        btnLoading.style.display = 'none';
    }
}

function showMessage(message, type) {
    const formMessage = document.getElementById('formMessage');
    formMessage.textContent = message;
    formMessage.className = `form-message ${type}`;
    formMessage.style.display = 'block';
    
    // Auto hide after 5 seconds
    setTimeout(() => {
        formMessage.style.display = 'none';
    }, 5000);
}
