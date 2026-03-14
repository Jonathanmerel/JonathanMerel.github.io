// Inicializar partículas (opcional, mejora el efecto)
document.addEventListener('DOMContentLoaded', function() {
    if (typeof particlesJS !== 'undefined') {
        particlesJS('particles-js', {
            particles: {
                number: { value: 80, density: { enable: true, value_area: 800 } },
                color: { value: '#2997ff' },
                shape: { type: 'circle' },
                opacity: { value: 0.2, random: true },
                size: { value: 3, random: true },
                line_linked: { enable: true, distance: 150, color: '#2997ff', opacity: 0.1, width: 1 },
                move: { enable: true, speed: 2, direction: 'none', random: true, straight: false, out_mode: 'out' }
            },
            interactivity: {
                detect_on: 'canvas',
                events: { onhover: { enable: true, mode: 'grab' }, onclick: { enable: true, mode: 'push' } },
                modes: { grab: { distance: 200, line_linked: { opacity: 0.3 } }, push: { particles_nb: 3 } }
            },
            retina_detect: true
        });
    }
});

// Menú móvil
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');

if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Cerrar menú al hacer clic en un enlace
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
}

// Animación de barras de habilidades al hacer scroll
const skillSections = document.querySelectorAll('.skills');
const skillBars = document.querySelectorAll('.skill-progress');

function animateSkills() {
    skillBars.forEach(bar => {
        const width = bar.getAttribute('data-width');
        bar.style.width = width + '%';
    });
}

// Intersection Observer para activar las barras cuando la sección sea visible
const observerSkills = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateSkills();
            observerSkills.unobserve(entry.target); // Solo una vez
        }
    });
}, { threshold: 0.3 });

if (document.querySelector('.skills')) {
    observerSkills.observe(document.querySelector('.skills'));
}

// Formulario de contacto (simulación)
const contactForm = document.getElementById('contact-form');
const formMessage = document.getElementById('form-message');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        // Aquí podrías añadir la lógica para enviar el formulario con fetch
        formMessage.textContent = '¡Mensaje enviado! Gracias por contactarme.';
        contactForm.reset();
        setTimeout(() => {
            formMessage.textContent = '';
        }, 3000);
    });
}

// Efecto de aparición suave para las secciones
const sections = document.querySelectorAll('section');
const observerFade = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, { threshold: 0.1 });

sections.forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(30px)';
    section.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    observerFade.observe(section);
});
