const contactForm = document.getElementById('contactForm');
const formMessage = document.getElementById('formMessage');

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const submitButton = contactForm.querySelector('.submit-button');
        const ctaText = submitButton.querySelector('.cta-text');
        const originalText = ctaText
            ? ctaText.textContent
            : submitButton.textContent;
        if (ctaText) ctaText.textContent = 'Sending…';
        else submitButton.textContent = 'Sending…';
        submitButton.disabled = true;
        formMessage.style.display = 'none';
        formMessage.className = 'form-message';

        try {
            const formData = new FormData(contactForm);
            const response = await fetch(contactForm.action, {
                method: 'POST',
                body: formData,
                headers: { Accept: 'application/json' },
            });
            const data = await response.json();

            if (response.ok) {
                formMessage.textContent =
                    'Thank you. Your message has been received — a reply lands inside two business days.';
                formMessage.classList.add('success');
                formMessage.style.display = 'block';
                contactForm.reset();
            } else {
                if (data.errors) {
                    const errorMessages = data.errors
                        .map((err) => err.message || err)
                        .join(', ');
                    throw new Error(errorMessages);
                }
                throw new Error(data.error || 'Form submission failed');
            }
        } catch (error) {
            console.error('Form Error:', error);
            const fallback =
                'Sorry, there was an error sending your message. Please try again or email grizzlydashenterprise@gmail.com directly.';
            formMessage.textContent =
                error.message && error.message.length < 200
                    ? error.message
                    : fallback;
            formMessage.classList.add('error');
            formMessage.style.display = 'block';
        } finally {
            if (ctaText) ctaText.textContent = originalText;
            else submitButton.textContent = originalText;
            submitButton.disabled = false;
        }
    });
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
        const id = this.getAttribute('href');
        if (id === '#' || id.length < 2) return;
        const target = document.querySelector(id);
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
});

// Scroll reveal — fade elements in as they enter the viewport
const revealEls = document.querySelectorAll('.reveal');
if (revealEls.length && 'IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
        (entries) => {
            for (const entry of entries) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    revealObserver.unobserve(entry.target);
                }
            }
        },
        { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
    );
    revealEls.forEach((el) => revealObserver.observe(el));
}

// Floating nav — show after the hero leaves the viewport
const floatNav = document.querySelector('.float-nav');
const heroSection = document.querySelector('.hero');
if (floatNav && heroSection && 'IntersectionObserver' in window) {
    const navObserver = new IntersectionObserver(
        ([entry]) => {
            floatNav.classList.toggle('is-visible', !entry.isIntersecting);
        },
        { threshold: 0, rootMargin: '-72px 0px 0px 0px' }
    );
    navObserver.observe(heroSection);
}

// Active section in float-nav — observe linked sections, toggle .active
const navLinks = floatNav
    ? floatNav.querySelectorAll('a[href^="#"]')
    : [];
if (navLinks.length && 'IntersectionObserver' in window) {
    const navMap = new Map();
    navLinks.forEach((link) => {
        const id = link.getAttribute('href').slice(1);
        const sec = document.getElementById(id);
        if (sec) navMap.set(sec, link);
    });
    if (navMap.size) {
        const setActive = (link) => {
            navLinks.forEach((l) => l.classList.toggle('active', l === link));
        };
        const sectionObserver = new IntersectionObserver(
            (entries) => {
                // Pick the top-most intersecting section
                const visible = entries
                    .filter((e) => e.isIntersecting)
                    .sort(
                        (a, b) =>
                            a.boundingClientRect.top -
                            b.boundingClientRect.top
                    );
                if (visible.length) {
                    const link = navMap.get(visible[0].target);
                    if (link) setActive(link);
                }
            },
            { threshold: 0.35 }
        );
        navMap.forEach((_, sec) => sectionObserver.observe(sec));
    }
}

// Click ripple on gold buttons
const rippleTargets = document.querySelectorAll(
    '.hero-cta, .submit-button'
);
rippleTargets.forEach((btn) => {
    btn.addEventListener('click', (e) => {
        const rect = btn.getBoundingClientRect();
        const ripple = document.createElement('span');
        ripple.className = 'ripple';
        ripple.style.left = e.clientX - rect.left + 'px';
        ripple.style.top = e.clientY - rect.top + 'px';
        btn.appendChild(ripple);
        setTimeout(() => ripple.remove(), 720);
    });
});
