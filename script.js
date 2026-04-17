// === LANGUAGE SWITCHER + DOMAIN REDIRECT ===
(function() {
    var LANGS = {
        pl: { flagSrc: 'https://flagcdn.com/20x15/pl.png', code: 'PL' },
        de: { flagSrc: 'https://flagcdn.com/20x15/de.png', code: 'DE' },
        en: { flagSrc: 'https://flagcdn.com/20x15/gb.png', code: 'EN' }
    };

    var path     = window.location.pathname;
    var hostname = window.location.hostname;

    // Ustal aktualny język z ścieżki URL
    var currentLang = 'pl';
    if (path.startsWith('/de/') || path === '/de') currentLang = 'de';
    if (path.startsWith('/en/') || path === '/en') currentLang = 'en';

    // Auto-redirect na podstawie domeny (tylko raz na sesję)
    if (!sessionStorage.getItem('imto_lang_redirect')) {
        sessionStorage.setItem('imto_lang_redirect', '1');
        var domainLang = null;
        if (hostname.endsWith('.de') && currentLang !== 'de') domainLang = 'de';
        if ((hostname.endsWith('.com') || hostname.endsWith('.eu')) && currentLang !== 'en') domainLang = 'en';
        if (domainLang) {
            var basePath = path.replace(/^\/(de|en)\//, '/');
            window.location.replace('/' + domainLang + basePath);
            return;
        }
    }

    // Aktualizuj przycisk przełącznika
    var flagEl = document.getElementById('navLangFlag');
    var codeEl = document.getElementById('navLangCode');
    if (flagEl && LANGS[currentLang]) {
        flagEl.src = LANGS[currentLang].flagSrc;
        flagEl.alt = LANGS[currentLang].code;
        codeEl.textContent = LANGS[currentLang].code;
    }

    // Buduj linki dla każdej opcji
    var basePath = path.replace(/^\/(de|en)(\/|$)/, '/');
    if (!basePath.startsWith('/')) basePath = '/' + basePath;
    document.querySelectorAll('[data-lang-link]').forEach(function(el) {
        var lang = el.getAttribute('data-lang-link');
        if (lang === 'pl') {
            el.href = basePath || '/';
        } else {
            el.href = '/' + lang + basePath;
        }
        if (lang === currentLang) el.classList.add('active');
    });

    // Obsługa dropdown
    var btn  = document.getElementById('navLangBtn');
    var menu = document.getElementById('navLangMenu');
    if (btn && menu) {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            var isOpen = menu.classList.toggle('open');
            btn.setAttribute('aria-expanded', isOpen);
        });
        document.addEventListener('click', function() {
            menu.classList.remove('open');
            btn.setAttribute('aria-expanded', 'false');
        });
    }
})();

// === INTERSECTION OBSERVER (fade-in animations) ===
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -30px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
        }
    });
}, observerOptions);

document.querySelectorAll('.animate').forEach((el) => {
    observer.observe(el);
});

// === FAQ SMOOTH TRANSITIONS ===
document.querySelectorAll('.faq-item').forEach((item) => {
    const content = item.querySelector('.faq-content');
    if (!content) return;

    item.addEventListener('toggle', function() {
        if (this.open) {
            content.style.maxHeight = content.scrollHeight + 'px';
        } else {
            content.style.maxHeight = '0';
        }
    });

    content.style.maxHeight = '0';
    content.style.overflow = 'hidden';
    content.style.transition = 'max-height 0.3s ease';
});

// === SMOOTH SCROLL ===
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        const target = document.querySelector(href);
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// === MOBILE CAROUSEL ===
(function() {
    const track = document.getElementById('caseTrack');
    const dotsContainer = document.getElementById('carouselDots');
    const prevBtn = document.getElementById('carouselPrev');
    const nextBtn = document.getElementById('carouselNext');
    if (!track) return;

    const viewport = track.parentElement;
    const cards = Array.from(track.querySelectorAll('.case-card'));
    let current = 0;
    const total = cards.length;

    function setCardWidths() {
        const w = viewport.offsetWidth;
        cards.forEach(function(card) { card.style.width = w + 'px'; });
    }
    setCardWidths();
    window.addEventListener('resize', function() { setCardWidths(); goTo(current); });

    // Build dots
    cards.forEach(function(_, i) {
        const dot = document.createElement('button');
        dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
        dot.setAttribute('aria-label', 'Projekt ' + (i + 1));
        dot.addEventListener('click', function() { goTo(i); });
        dotsContainer.appendChild(dot);
    });

    function goTo(idx) {
        current = (idx + total) % total;
        const w = viewport.offsetWidth;
        track.style.transform = 'translateX(-' + (current * w) + 'px)';
        dotsContainer.querySelectorAll('.carousel-dot').forEach(function(d, i) {
            d.classList.toggle('active', i === current);
        });
    }

    prevBtn.addEventListener('click', function() { goTo(current - 1); });
    nextBtn.addEventListener('click', function() { goTo(current + 1); });

    // Touch swipe
    var startX = 0;
    track.addEventListener('touchstart', function(e) { startX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend', function(e) {
        var diff = startX - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 40) { goTo(diff > 0 ? current + 1 : current - 1); }
    }, { passive: true });
})();

// === COOKIE CONSENT ===
(function() {
    var banner = document.getElementById('cookieBanner');
    if (!banner) return;

    var consent = localStorage.getItem('imto_cookie_consent');
    if (!consent) {
        setTimeout(function() { banner.classList.add('visible'); }, 800);
    }

    document.getElementById('cookieAccept').addEventListener('click', function() {
        localStorage.setItem('imto_cookie_consent', 'accepted');
        banner.classList.remove('visible');
    });

    document.getElementById('cookieReject').addEventListener('click', function() {
        localStorage.setItem('imto_cookie_consent', 'rejected');
        banner.classList.remove('visible');
    });
})();

// === CONTACT FORM (Formspree) ===
(function() {
    var form = document.getElementById('contactForm');
    var success = document.getElementById('formSuccess');
    var bar = document.getElementById('formProgressBar');
    if (!form) return;

    function progressStart() {
        bar.style.transition = 'width 2.5s ease-out';
        bar.style.width = '0%';
        // force reflow so transition fires from 0
        bar.offsetWidth;
        bar.style.width = '72%';
    }

    function progressDone(callback) {
        bar.style.transition = 'width 0.25s ease';
        bar.style.width = '100%';
        setTimeout(callback, 280);
    }

    function progressReset() {
        bar.style.transition = 'none';
        bar.style.width = '0%';
    }

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        var btn = form.querySelector('button[type="submit"]');
        btn.textContent = 'Wysyłanie…';
        btn.disabled = true;
        progressStart();

        fetch(form.action, {
            method: 'POST',
            body: new FormData(form),
            headers: { 'Accept': 'application/json' }
        })
        .then(function(res) {
            if (res.ok) {
                progressDone(function() {
                    form.style.display = 'none';
                    success.style.display = 'block';
                    success.scrollIntoView({ behavior: 'smooth', block: 'center' });
                });
            } else {
                progressReset();
                btn.textContent = 'Błąd — spróbuj ponownie';
                btn.disabled = false;
            }
        })
        .catch(function() {
            progressReset();
            btn.textContent = 'Błąd — spróbuj ponownie';
            btn.disabled = false;
        });
    });
})();

// === HAMBURGER MENU ===
(function() {
    var btn = document.getElementById('navHamburger');
    var menu = document.getElementById('navMobileMenu');
    if (!btn || !menu) return;

    btn.addEventListener('click', function() {
        var isOpen = menu.classList.toggle('open');
        btn.classList.toggle('open', isOpen);
        btn.setAttribute('aria-expanded', isOpen);
    });

    menu.querySelectorAll('a').forEach(function(link) {
        link.addEventListener('click', function() {
            menu.classList.remove('open');
            btn.classList.remove('open');
            btn.setAttribute('aria-expanded', false);
        });
    });
})();

// === STICKY MOBILE BAR ===
(function() {
    var bar = document.getElementById('mobileStickyBar');
    var kontakt = document.getElementById('kontakt');
    if (!bar) return;

    function updateBar() {
        var scrollY = window.scrollY || window.pageYOffset;
        if (scrollY < 300) {
            bar.classList.remove('visible');
            return;
        }
        // Hide when contact section is visible
        if (kontakt) {
            var rect = kontakt.getBoundingClientRect();
            if (rect.top < window.innerHeight * 0.8) {
                bar.classList.remove('visible');
                return;
            }
        }
        bar.classList.add('visible');
    }

    window.addEventListener('scroll', updateBar, { passive: true });
    updateBar();
})();
