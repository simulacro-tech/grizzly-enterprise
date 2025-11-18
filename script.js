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
        const formData = new FormData(contactForm);

        // Add time if you want it in the email
        formData.append(
            '_subject',
            'New Contact Form Submission from ' + formData.get('name')
        );

        const response = await fetch(contactForm.action, {
            method: 'POST',
            body: formData,
            headers: {
                Accept: 'application/json',
            },
        });

        if (response.ok) {
            formMessage.textContent =
                'Thank you! Your message has been sent successfully.';
            formMessage.className = 'form-message success';
            formMessage.style.display = 'block';
            contactForm.reset();
        } else {
            const data = await response.json();
            throw new Error(data.error || 'Form submission failed');
        }
    } catch (error) {
        console.error('Form Error:', error);
        formMessage.textContent =
            'Sorry, there was an error sending your message. Please try again or contact us directly at grizzlydashenterprise@gmail.com.';
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
