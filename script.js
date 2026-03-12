/* ----- CONFIGURATION ----- */
// Replace with your Formspree ID (e.g., from .env during build)
const FORMSPREE_ID = "HIDDEN_FORMSPREE_ID"; 

/* ----- NAVIGATION BAR FUNCTION ----- */
const header = document.getElementById("header");
const menuBtn = document.getElementById("menuBtn");
const navLinks = document.getElementById("navLinks");
const links = document.querySelectorAll(".nav-link");

// Toggle Mobile Menu
menuBtn.addEventListener("click", () => {
    navLinks.classList.toggle("active");
    // Change icon between burger and close if applicable, 
    // but for now just toggle visibility via CSS or simple logic
});

// Close menu on link click
links.forEach(link => {
    link.addEventListener("click", () => {
        navLinks.classList.remove("active");
    });
});

// Header scroll effect
window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
        header.classList.add("scrolled");
    } else {
        header.classList.remove("scrolled");
    }
});

/* ----- TYPING EFFECT ----- */
const typed = new Typed("#typed", {
    strings: ["Web Applications", "Mobile Solutions", "Reliable APIs", "Scalable Systems"],
    typeSpeed: 60,
    backSpeed: 40,
    backDelay: 2000,
    loop: true
});

/* ----- SCROLL REVEAL ANIMATION ----- */
const sr = ScrollReveal({
    origin: 'bottom',
    distance: '60px',
    duration: 1200,
    delay: 200,
    reset: false // Keep animations once they appear for a more "stable" feel
});

// Hero
sr.reveal('.hero-subtitle', { delay: 100 });
sr.reveal('.hero-title', { delay: 200 });
sr.reveal('.hero-description', { delay: 300 });
sr.reveal('.hero-btns', { delay: 400 });

// Section Titles
sr.reveal('.section-title', { origin: 'top' });

// Experience Timeline
sr.reveal('.timeline-item', { interval: 200 });

// Glass Cards
sr.reveal('.glass-card', { interval: 150, distance: '40px' });

// Contact Info
sr.reveal('.contact-item', { interval: 100, origin: 'left' });
sr.reveal('.contact-form', { origin: 'right' });

/* ----- ACTIVE LINK OBSERVER ----- */
const sections = document.querySelectorAll("section[id]");

const observerOptions = {
    threshold: 0.2
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const id = entry.target.getAttribute("id");
            links.forEach(link => {
                link.classList.remove("active-link");
                if (link.getAttribute("href") === `#${id}`) {
                    link.classList.add("active-link");
                }
            });
        }
    });
}, observerOptions);

sections.forEach(section => observer.observe(section));

/* ----- CONTACT FORM AJAX ----- */
const contactForm = document.querySelector('.contact-form');
const toast = document.getElementById('toast');
const toastMessage = document.getElementById('toastMessage');

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(contactForm);
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.innerHTML;
        
        // Show loading state
        submitBtn.disabled = true;
        submitBtn.innerHTML = 'Sending... <i class="uil uil-spinner-alt"></i>';
        
        try {
            const formAction = contactForm.action || `https://formspree.io/f/${FORMSPREE_ID}`;
            const response = await fetch(formAction, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            if (response.ok) {
                // Success
                toastMessage.textContent = 'Message sent successfully!';
                toast.classList.add('show');
                contactForm.reset();
            } else {
                // Error from Formspree
                const data = await response.json();
                toastMessage.textContent = data.errors ? data.errors[0].message : 'Oops! Something went wrong.';
                toast.classList.add('show');
            }
        } catch (error) {
            toastMessage.textContent = 'Connection error. Please try again.';
            toast.classList.add('show');
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;
            
            // Hide toast after 4s
            setTimeout(() => {
                toast.classList.remove('show');
            }, 4000);
        }
    });
}
