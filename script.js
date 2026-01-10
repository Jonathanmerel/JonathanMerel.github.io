// Efectos de reveal/scrolling profesional
document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
            
            // Cambiar ícono
            const icon = mobileMenuBtn.querySelector('svg');
            if (mobileMenu.classList.contains('hidden')) {
                icon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>';
            } else {
                icon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>';
            }
        });
        
        // Cerrar menú al hacer clic en enlace
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
                mobileMenuBtn.querySelector('svg').innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>';
            });
        });
    }
    
    // Smooth scroll para enlaces internos
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href === '#') return;
            
            e.preventDefault();
            const targetElement = document.querySelector(href);
            
            if (targetElement) {
                // Ajustar para el header fijo
                const headerHeight = document.querySelector('header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Formulario de contacto
    const contactForm = document.getElementById('contact-form');
    const formSuccess = document.getElementById('form-success');
    
    if (contactForm && formSuccess) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validación básica
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const message = document.getElementById('message').value.trim();
            
            if (!name || !email || !message) {
                alert('Por favor completa todos los campos requeridos.');
                return;
            }
            
            // Simulación de envío
            contactForm.classList.add('loading');
            
            setTimeout(() => {
                formSuccess.classList.remove('hidden');
                contactForm.reset();
                contactForm.classList.remove('loading');
                
                setTimeout(() => {
                    formSuccess.classList.add('hidden');
                }, 5000);
            }, 1000);
        });
    }
    
    // ========== EFECTOS DE REVEAL/SCROLLING ==========
    
    // Observer para elementos reveal
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.getAttribute('data-delay') || 0;
                
                setTimeout(() => {
                    entry.target.classList.add('visible');
                    
                    // Si es un punto de timeline, animarlo
                    if (entry.target.classList.contains('timeline-dot')) {
                        entry.target.style.transitionDelay = '0.2s';
                    }
                }, parseInt(delay));
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    // Aplicar observer a todos los elementos reveal
    document.querySelectorAll('.reveal-item').forEach(el => {
        revealObserver.observe(el);
    });
    
    // Animación de la línea de timeline
    const timelineLine = document.querySelector('.timeline-line');
    if (timelineLine) {
        const timelineObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Calcular altura total de la timeline
                    const timelineContainer = document.querySelector('.timeline-container');
                    if (timelineContainer) {
                        const timelineHeight = timelineContainer.scrollHeight;
                        timelineLine.style.height = `${timelineHeight}px`;
                    }
                }
            });
        }, { threshold: 0.1 });
        
        timelineObserver.observe(document.querySelector('.timeline-container'));
    }
    
    // Efecto parallax en hero section
    function updateParallax() {
        const scrollY = window.scrollY;
        const layers = document.querySelectorAll('.layer');
        
        layers.forEach(layer => {
            const depth = layer.getAttribute('data-depth') || 0.1;
            const movement = scrollY * depth;
            layer.style.transform = `translateY(${movement}px)`;
        });
    }
    
    // Aplicar parallax si hay elementos layer
    if (document.querySelector('.layer')) {
        window.addEventListener('scroll', updateParallax);
        updateParallax(); // Llamar inicialmente
    }
    
    // Header scroll effect
    let lastScrollTop = 0;
    const header = document.getElementById('main-header');
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 100) {
            if (scrollTop > lastScrollTop && scrollTop > 200) {
                // Scrolling down - esconder header
                header.classList.add('hidden');
            } else {
                // Scrolling up - mostrar header
                header.classList.remove('hidden');
            }
            
            // Cambiar fondo cuando se hace scroll
            if (scrollTop > 300) {
                header.style.backgroundColor = 'rgba(10, 10, 10, 0.95)';
            } else {
                header.style.backgroundColor = 'rgba(10, 10, 10, 0.8)';
            }
        } else {
            header.classList.remove('hidden');
            header.style.backgroundColor = 'rgba(10, 10, 10, 0.95)';
        }
        
        lastScrollTop = scrollTop;
    });
    
    // Efecto de scroll suave en secciones
    let ticking = false;
    
    function onScroll() {
        if (!ticking) {
            requestAnimationFrame(function() {
                const sections = document.querySelectorAll('section');
                const scrollY = window.scrollY;
                
                sections.forEach(section => {
                    const sectionTop = section.offsetTop;
                    const sectionHeight = section.clientHeight;
                    const windowHeight = window.innerHeight;
                    
                    // Efecto de parallax suave en secciones
                    if (scrollY > sectionTop - windowHeight * 0.8 && 
                        scrollY < sectionTop + sectionHeight) {
                        const progress = (scrollY - sectionTop + windowHeight * 0.8) / 
                                       (sectionHeight + windowHeight * 0.8);
                        section.style.transform = `translateY(${progress * 20}px)`;
                    }
                });
                
                ticking = false;
            });
            
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', onScroll);
    
    // Active nav link
    function setActiveNavLink() {
        const sections = document.querySelectorAll('section');
        const navLinks = document.querySelectorAll('nav a');
        
        let currentSection = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            const headerHeight = document.querySelector('header').offsetHeight;
            
            if (window.scrollY >= (sectionTop - headerHeight - 100)) {
                currentSection = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('text-cyan-500');
            link.classList.add('text-gray-400');
            
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.remove('text-gray-400');
                link.classList.add('text-cyan-500');
            }
        });
    }
    
    window.addEventListener('scroll', setActiveNavLink);
    
    // Inicializar
    setActiveNavLink();
    
    // Forzar reflow para animaciones iniciales
    setTimeout(() => {
        document.querySelectorAll('.reveal-item').forEach(el => {
            el.style.willChange = 'transform, opacity';
        });
    }, 100);
});

// Efecto de cursor personalizado (opcional, muy sutil)
document.addEventListener('mousemove', function(e) {
    const cursor = document.getElementById('custom-cursor');
    if (!cursor) return;
    
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
});