/* ---- reveal on entry ---------------------------------------------------- */
/* First, so nothing the rest of this file might throw can leave the page's
   content stuck at opacity 0. */

const revealables = Array.from(document.querySelectorAll('.reveal'));
const stillness = window.matchMedia('(prefers-reduced-motion: reduce)');

if (stillness.matches || !('IntersectionObserver' in window)) {
    revealables.forEach((el) => el.classList.add('is-static'));
} else {
    const shown = new IntersectionObserver(
        (entries, observer) => {
            for (const entry of entries) {
                if (!entry.isIntersecting) continue;
                entry.target.classList.add('is-in');
                observer.unobserve(entry.target);
            }
        },
        { rootMargin: '0px 0px -12% 0px', threshold: 0.08 }
    );
    revealables.forEach((el) => shown.observe(el));
}

/* ---- contact form ------------------------------------------------------ */

const contactForm = document.getElementById('contactForm');
const formMessage = document.getElementById('formMessage');
const formMessageText = document.getElementById('formMessageText');

const setStatus = (kind, text) => {
    formMessage.classList.remove('is-ok', 'is-no');
    formMessage.classList.add(kind === 'ok' ? 'is-ok' : 'is-no');
    formMessage.querySelector('.msg-mark').textContent =
        kind === 'ok' ? '✓' : '✕';
    formMessageText.textContent = text;
};

contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitButton = contactForm.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Sending…';
    submitButton.disabled = true;
    formMessage.classList.remove('is-ok', 'is-no');

    try {
        const response = await fetch(contactForm.action, {
            method: 'POST',
            body: new FormData(contactForm),
            headers: { Accept: 'application/json' },
        });

        const data = await response.json();

        if (response.ok) {
            setStatus('ok', 'Thank you. Your message has been sent.');
            contactForm.reset();
        } else if (data.errors) {
            const errorMessages = data.errors
                .map((err) => err.message || err)
                .join(', ');
            throw new Error(`Validation errors: ${errorMessages}`);
        } else {
            throw new Error(data.error || 'Form submission failed');
        }
    } catch (error) {
        console.error('Form Error:', error);
        const message =
            error.message && error.message.includes('Validation errors')
                ? error.message
                : 'Sorry, there was an error sending your message. Please try again, or write to grizzlydashenterprise@gmail.com.';
        setStatus('no', message);
    } finally {
        submitButton.textContent = originalText;
        submitButton.disabled = false;
    }
});

/* ---- rail: mark the section the visitor is reading ---------------------- */

const navLinks = Array.from(document.querySelectorAll('.rail nav a'));

if (navLinks.length && 'IntersectionObserver' in window) {
    /* Tracked as a set, so that scrolling back above the first section clears
       the marker instead of leaving the last match stuck on. */
    const inView = new Set();

    const spy = new IntersectionObserver(
        (entries) => {
            for (const entry of entries) {
                if (entry.isIntersecting) inView.add(entry.target.id);
                else inView.delete(entry.target.id);
            }

            navLinks.forEach((a) => {
                const id = a.getAttribute('href').slice(1);
                if (inView.has(id)) a.setAttribute('aria-current', 'true');
                else a.removeAttribute('aria-current');
            });
        },
        { rootMargin: '-45% 0px -50% 0px' }
    );

    navLinks
        .map((a) => document.querySelector(a.getAttribute('href')))
        .filter(Boolean)
        .forEach((section) => spy.observe(section));
}
