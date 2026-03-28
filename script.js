/* =============================================
   JONATHAN MEREL — Portfolio JS
   ============================================= */

// ── CUSTOM CURSOR ──────────────────────────────
const cursor = document.getElementById('cursor');
const ring   = document.getElementById('cursor-ring');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
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

document.querySelectorAll('a, button, .skill-block, .project-card').forEach(el => {
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

    // Move & wrap particles
    particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = bgCanvas.width;
        if (p.x > bgCanvas.width)  p.x = 0;
        if (p.y < 0) p.y = bgCanvas.height;
        if (p.y > bgCanvas.height) p.y = 0;

        bgCtx.beginPath();
        bgCtx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        bgCtx.fillStyle = 'rgba(0,200,255,0.25)';
        bgCtx.fill();
    });

    // Draw connection lines
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


// ── HERO 3D NEURAL NETWORK ─────────────────────
const heroCanvas = document.getElementById('hero-canvas');

if (heroCanvas) {
    const hCtx = heroCanvas.getContext('2d');
    heroCanvas.width  = heroCanvas.offsetWidth;
    heroCanvas.height = heroCanvas.offsetHeight;

    let rotation = 0;

    const nodes = Array.from({ length: 30 }, () => ({
        x:  (Math.random() - 0.5) * 300,
        y:  (Math.random() - 0.5) * 300,
        z:  (Math.random() - 0.5) * 300,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        vz: (Math.random() - 0.5) * 0.5
    }));

    function drawHero3D() {
        hCtx.clearRect(0, 0, heroCanvas.width, heroCanvas.height);

        const cx = heroCanvas.width  / 2;
        const cy = heroCanvas.height / 2;
        rotation += 0.005;

        const cosA = Math.cos(rotation);
        const sinA = Math.sin(rotation);
        const cosB = Math.cos(rotation * 0.7);
        const sinB = Math.sin(rotation * 0.7);

        // Update node positions
        nodes.forEach(n => {
            n.x += n.vx;
            n.y += n.vy;
            n.z += n.vz;
            if (Math.abs(n.x) > 200) n.vx *= -1;
            if (Math.abs(n.y) > 200) n.vy *= -1;
            if (Math.abs(n.z) > 200) n.vz *= -1;

            // Rotate Y
            const rx  = n.x * cosA - n.z * sinA;
            const rz  = n.x * sinA + n.z * cosA;
            // Rotate X
            const ry2 = n.y * cosB - rz * sinB;
            const rz2 = n.y * sinB + rz * cosB;

            // Project to 2D
            const fov = 400;
            const scale = fov / (fov + rz2);
            n._sx = cx + rx * scale;
            n._sy = cy + ry2 * scale;
            n._s  = scale;
            n._d  = (rz2 + 200) / 400;
        });

        // Draw edges
        nodes.forEach((a, i) => {
            nodes.slice(i + 1).forEach(b => {
                const dist = Math.hypot(a.x - b.x, a.y - b.y, a.z - b.z);
                if (dist < 120) {
                    const opacity = 0.15 * (1 - dist / 120) * ((a._s + b._s) / 2);
                    hCtx.beginPath();
                    hCtx.moveTo(a._sx, a._sy);
                    hCtx.lineTo(b._sx, b._sy);
                    hCtx.strokeStyle = `rgba(0,200,255,${opacity})`;
                    hCtx.lineWidth   = 0.8;
                    hCtx.stroke();
                }
            });
        });

        // Draw nodes
        nodes.forEach(n => {
            const alpha = 0.4 + n._d * 0.6;
            const r     = 2 + n._d * 3;

            hCtx.beginPath();
            hCtx.arc(n._sx, n._sy, r, 0, Math.PI * 2);

            const grad = hCtx.createRadialGradient(n._sx, n._sy, 0, n._sx, n._sy, r * 2);
            grad.addColorStop(0, `rgba(0,200,255,${alpha})`);
            grad.addColorStop(1, 'rgba(0,200,255,0)');
            hCtx.fillStyle = grad;
            hCtx.fill();
        });

        requestAnimationFrame(drawHero3D);
    }
    drawHero3D();

    window.addEventListener('resize', () => {
        heroCanvas.width  = heroCanvas.offsetWidth;
        heroCanvas.height = heroCanvas.offsetHeight;
    });
}


// ── TYPEWRITER EFFECT ──────────────────────────
const phrases = [
    'Automatización de Procesos',
    'Machine Learning Engineer',
    'Analista de Datos',
    'Desarrollador Python',
    'Especialista en IA'
];
let phraseIndex  = 0;
let charIndex    = 0;
let isDeleting   = false;

function typeEffect() {
    const el = document.getElementById('typed-text');
    if (!el) return;

    const currentPhrase = phrases[phraseIndex];

    if (!isDeleting) {
        el.textContent = currentPhrase.slice(0, ++charIndex);
        if (charIndex === currentPhrase.length) {
            isDeleting = true;
            setTimeout(typeEffect, 1800);
            return;
        }
    } else {
        el.textContent = currentPhrase.slice(0, --charIndex);
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
const revealElements = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.1 });

revealElements.forEach(el => revealObserver.observe(el));


// ── ANIMATED COUNTERS ──────────────────────────
function animateCounter(el, target, duration = 1500) {
    let startTime = null;

    function step(timestamp) {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);
        el.textContent = Math.floor(progress * target);
        if (progress < 1) requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
}

const counterObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateCounter(document.getElementById('counter1'), 5);
            animateCounter(document.getElementById('counter2'), 10);
            counterObserver.disconnect();
        }
    });
}, { threshold: 0.5 });

const heroSection = document.getElementById('hero');
if (heroSection) counterObserver.observe(heroSection);

<script>
(function () {
    // ── FILTROS ──
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

    // ── MODAL ──
    const modal = document.getElementById('cred-modal');
    if (!modal) return;
    
    const modalBackdrop = modal.querySelector('.cred-modal-backdrop');
    const modalClose = modal.querySelector('.cred-modal-close');
    const modalImage = document.getElementById('modal-image');
    const modalTitle = document.getElementById('modal-title');
    const modalIssuer = document.getElementById('modal-issuer');
    const modalMeta = document.getElementById('modal-meta');
    const modalVerify = document.getElementById('modal-verify');
    const modalType = modal.querySelector('.cred-modal-type');

    const certImages = {
        'licenciatura': '191655148.png',
        'ethical-hacking': '1741114791671.jpg',
        'security-risks': '1763850279080.jpg',
        'claude-code': 'certificate-7innh6a58bqy-1773944236.pdf',
        'claude-101': 'certificate-9xmd5kc62g5h-1774643258.pdf'
    };

    function openModal(card) {
        const certId = card.dataset.certId;
        const title = card.querySelector('.cred-title').textContent;
        const issuer = card.querySelector('.cred-issuer').textContent;
        const typeText = card.querySelector('.cred-type').textContent;
        const dateEl = card.querySelector('.cred-date');
        const idEl = card.querySelector('.cred-id');
        const verifyLink = card.querySelector('.cred-verify');

        modalTitle.textContent = title;
        modalIssuer.textContent = issuer;
        modalType.textContent = typeText;

        let metaHTML = '';
        if (dateEl) {
            const dateText = dateEl.textContent.replace(/.*calendar-alt., /, '');
            metaHTML += `<div class="cred-modal-meta-item"><i class="fas fa-calendar-alt"></i><strong>Fecha:</strong> ${dateText}</div>`;
        }
        if (idEl) {
            const idText = idEl.textContent.replace('ID: ', '');
            metaHTML += `<div class="cred-modal-meta-item"><i class="fas fa-fingerprint"></i><strong>ID:</strong> ${idText}</div>`;
        }
        modalMeta.innerHTML = metaHTML;

        if (verifyLink) {
            modalVerify.href = verifyLink.href;
            modalVerify.style.display = 'inline-flex';
        } else {
            modalVerify.style.display = 'none';
        }

        modalImage.classList.remove('loaded');
        const imageSrc = certImages[certId];
        if (imageSrc) {
            modalImage.src = imageSrc;
            modalImage.onload = () => modalImage.classList.add('loaded');
        } else {
            modalImage.style.display = 'none';
        }

        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        modalImage.classList.remove('loaded');
        modalImage.style.display = '';
        modalImage.src = '';
    }

    cards.forEach(card => {
        card.style.cursor = 'pointer';
        card.addEventListener('click', (e) => {
            if (e.target.closest('.cred-verify')) return;
            openModal(card);
        });
    });

    modalClose.addEventListener('click', closeModal);
    modalBackdrop.addEventListener('click', closeModal);
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
})();
</script>
