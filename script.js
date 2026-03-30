/* =============================================
   JONATHAN MEREL — Portfolio JS · Data Analyst
   ============================================= */

// ── CUSTOM CURSOR ──────────────────────────────
const cursor = document.getElementById('cursor');
const ring   = document.getElementById('cursor-ring');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cursor.style.left = mx + 'px';
    cursor.style.top  = my + 'px';
});

function animRing() {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(animRing);
}
animRing();

document.querySelectorAll('a, button, .skill-block, .project-card, .cred-card').forEach(el => {
    el.addEventListener('mouseenter', () => {
        cursor.style.width  = '6px';
        cursor.style.height = '6px';
        ring.style.width    = '50px';
        ring.style.height   = '50px';
    });
    el.addEventListener('mouseleave', () => {
        cursor.style.width  = '12px';
        cursor.style.height = '12px';
        ring.style.width    = '36px';
        ring.style.height   = '36px';
    });
});


// ── PARTICLE BACKGROUND ────────────────────────
const bgCanvas = document.getElementById('bg-canvas');
const bgCtx    = bgCanvas.getContext('2d');

function resizeBg() {
    bgCanvas.width  = window.innerWidth;
    bgCanvas.height = window.innerHeight;
}
resizeBg();
window.addEventListener('resize', resizeBg);

const particles = Array.from({ length: 80 }, () => ({
    x:  Math.random() * window.innerWidth,
    y:  Math.random() * window.innerHeight,
    vx: (Math.random() - 0.5) * 0.3,
    vy: (Math.random() - 0.5) * 0.3,
    r:  Math.random() * 1.5 + 0.5
}));

function drawParticles() {
    bgCtx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);

    particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = bgCanvas.width;
        if (p.x > bgCanvas.width)  p.x = 0;
        if (p.y < 0) p.y = bgCanvas.height;
        if (p.y > bgCanvas.height) p.y = 0;

        bgCtx.beginPath();
        bgCtx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        bgCtx.fillStyle = 'rgba(0,200,255,0.25)';
        bgCtx.fill();
    });

    particles.forEach((a, i) => {
        particles.slice(i + 1).forEach(b => {
            const dist = Math.hypot(a.x - b.x, a.y - b.y);
            if (dist < 120) {
                bgCtx.beginPath();
                bgCtx.moveTo(a.x, a.y);
                bgCtx.lineTo(b.x, b.y);
                bgCtx.strokeStyle = `rgba(0,200,255,${0.07 * (1 - dist / 120)})`;
                bgCtx.lineWidth   = 0.5;
                bgCtx.stroke();
            }
        });
    });

    requestAnimationFrame(drawParticles);
}
drawParticles();


// ── TYPEWRITER — Data Analyst phrases ──────────
const phrases = [
    'Data Analyst',
    'Power BI Developer',
    'Excel & SQL Specialist',
    'Business Intelligence',
    'Analista de Datos'
];
let phraseIndex = 0, charIndex = 0, isDeleting = false;

function typeEffect() {
    const el = document.getElementById('typed-text');
    if (!el) return;

    const current = phrases[phraseIndex];

    if (!isDeleting) {
        el.textContent = current.slice(0, ++charIndex);
        if (charIndex === current.length) {
            isDeleting = true;
            setTimeout(typeEffect, 1800);
            return;
        }
    } else {
        el.textContent = current.slice(0, --charIndex);
        if (charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
        }
    }

    setTimeout(typeEffect, isDeleting ? 60 : 90);
}
typeEffect();


// ── NAV SCROLL ─────────────────────────────────
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);

    // Active nav link según sección visible
    const sections = document.querySelectorAll('section[id]');
    const scrollY  = window.scrollY + 100;
    sections.forEach(sec => {
        const top    = sec.offsetTop;
        const height = sec.offsetHeight;
        const id     = sec.getAttribute('id');
        const link   = document.querySelector(`.nav-links a[href="#${id}"]`);
        if (link) {
            if (scrollY >= top && scrollY < top + height) {
                document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
                link.classList.add('active');
            }
        }
    });
});


// ── HAMBURGER MENU ─────────────────────────────
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('nav-links');

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    hamburger.classList.toggle('active');
});

navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
        navLinks.classList.remove('open');
        hamburger.classList.remove('active');
    });
});


// ── SCROLL REVEAL ──────────────────────────────
const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('visible');
    });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));


// ── FILTROS CREDENCIALES ────────────────────────
(function () {
    const filterBtns = document.querySelectorAll('.cred-filter-btn');
    const cards      = document.querySelectorAll('.cred-card');
    const countEl    = document.getElementById('cred-count');

    function updateCount() {
        const visible = document.querySelectorAll('.cred-card:not(.hidden)').length;
        if (countEl) countEl.textContent = visible;
    }

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const filter = btn.dataset.filter;
            cards.forEach(card => {
                if (filter === 'all' || card.dataset.category === filter) {
                    card.classList.remove('hidden');
                } else {
                    card.classList.add('hidden');
                }
            });
            updateCount();
        });
    });

    updateCount();
})();
