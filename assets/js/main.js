// ===== GumeR Portfolio JS =====

// Year in footer
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ===== i18n toggle =====
const LANG_KEY = 'gumer-lang';
const i18nEls = document.querySelectorAll('[data-es]');
// Cache original EN HTML on first load
i18nEls.forEach(el => { el.dataset.en = el.innerHTML; });

const applyLang = (lang) => {
    i18nEls.forEach(el => {
        const next = lang === 'es' ? el.dataset.es : el.dataset.en;
        if (next != null) el.innerHTML = next;
    });
    document.documentElement.lang = lang;
    const tgl = document.getElementById('lang-toggle');
    if (tgl) tgl.dataset.lang = lang;
    localStorage.setItem(LANG_KEY, lang);

    // Re-apply year after footer__meta innerHTML swap
    const y = document.getElementById('year') || document.getElementById('year-es');
    if (y) y.textContent = new Date().getFullYear();
};

const storedLang = localStorage.getItem(LANG_KEY) || 'en';
applyLang(storedLang);

const langToggle = document.getElementById('lang-toggle');
langToggle?.addEventListener('click', () => {
    const next = (langToggle.dataset.lang === 'es') ? 'en' : 'es';
    applyLang(next);
});

// ===== Cursor glow =====
const glow = document.querySelector('.cursor-glow');
let mouseX = 0, mouseY = 0, glowX = 0, glowY = 0;

if (!window.matchMedia('(pointer: coarse)').matches) {
    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    const animateGlow = () => {
        glowX += (mouseX - glowX) * 0.12;
        glowY += (mouseY - glowY) * 0.12;
        if (glow) glow.style.transform = `translate(${glowX}px, ${glowY}px) translate(-50%, -50%)`;
        requestAnimationFrame(animateGlow);
    };
    animateGlow();
} else if (glow) {
    glow.style.display = 'none';
}

// ===== Nav scroll state =====
const nav = document.getElementById('nav');
const onScroll = () => {
    if (window.scrollY > 20) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
};
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// ===== Mobile menu =====
const toggle = document.getElementById('nav-toggle');
const menu = document.getElementById('nav-menu');
toggle?.addEventListener('click', () => menu.classList.toggle('open'));
menu?.querySelectorAll('.nav__link').forEach(link =>
    link.addEventListener('click', () => menu.classList.remove('open'))
);

// ===== Active section in nav =====
const sections = document.querySelectorAll('main section[id]');
const navLinks = document.querySelectorAll('.nav__link');
const spy = () => {
    const y = window.scrollY + 120;
    let active = '';
    sections.forEach(s => {
        if (s.offsetTop <= y) active = s.id;
    });
    navLinks.forEach(l => {
        const href = l.getAttribute('href').replace('#', '');
        l.classList.toggle('active', href === active);
    });
};
window.addEventListener('scroll', spy, { passive: true });
spy();

// ===== Reveal on scroll =====
const revealEls = document.querySelectorAll('.reveal');
const io = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
            setTimeout(() => entry.target.classList.add('is-visible'), i * 40);
            io.unobserve(entry.target);
        }
    });
}, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
revealEls.forEach(el => io.observe(el));

// ===== Card spotlight =====
document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const r = card.getBoundingClientRect();
        card.style.setProperty('--mx', `${e.clientX - r.left}px`);
        card.style.setProperty('--my', `${e.clientY - r.top}px`);
    });
});

// ===== Smooth anchor scroll with nav offset =====
document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
        const href = a.getAttribute('href');
        if (href === '#' || href.length < 2) return;
        const target = document.querySelector(href);
        if (!target) return;
        e.preventDefault();
        const top = target.getBoundingClientRect().top + window.scrollY - 70;
        window.scrollTo({ top, behavior: 'smooth' });
    });
});
