// EmailJS Configuration
const EMAILJS_SERVICE_ID = 'service_w5kpsl7';
const EMAILJS_TEMPLATE_ID = 'template_fo8i5za';
const EMAILJS_PUBLIC_KEY = '0Zdr-9RuUMbK_QFdq';

// Initialize EmailJS
emailjs.init(EMAILJS_PUBLIC_KEY);

const contactForm = document.getElementById('contactForm');
const formMessage = document.getElementById('formMessage');

contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitButton = contactForm.querySelector('.submit-button');
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Sending...';
    submitButton.disabled = true;
    formMessage.style.display = 'none';

    try {
        const formData = {
            name: contactForm.name.value,
            email: contactForm.email.value,
            message: contactForm.message.value,
            time: new Date().toLocaleString(),
        };

        await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, formData);

        formMessage.textContent =
            'Thank you! Your message has been sent successfully.';
        formMessage.className = 'form-message success';
        formMessage.style.display = 'block';
        contactForm.reset();
    } catch (error) {
        console.error('EmailJS Error:', error);
        formMessage.textContent =
            'Sorry, there was an error sending your message. Please try again or contact us directly.';
        formMessage.className = 'form-message error';
        formMessage.style.display = 'block';
    } finally {
        submitButton.textContent = originalText;
        submitButton.disabled = false;
    }
});

// Prevent icon animation from restarting
const heroIcon = document.querySelector('.hero-icon');
if (heroIcon) {
    heroIcon.addEventListener(
        'animationend',
        () => {
            heroIcon.classList.add('animated');
        },
        { once: true }
    );
}

// Smooth scroll for any anchor links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
            });
        }
    });
});
