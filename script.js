// === KONFIGURACJA REZERWACJI SPOTKAŃ (W1) ===
// Link do kalendarza rezerwacji (Cal.com). Gdy pole jest puste (''),
// przyciski rezerwacji pozostają ukryte, a linki [data-booking-upgrade]
// prowadzą do sekcji #kontakt.
window.IMTO_BOOKING_URL = 'https://cal.com/imto-software-grzegorz-palmer/15min';

// === KONFIGURACJA CHATBOTA (ChatLab, white-label) ===
// Wklej tutaj swój klucz (Bot ID / API Key) z panelu ChatLab:
//   Panel > wybierz bota > zakładka "Add to Website" > "HTML Code" > "Widget".
// Klucz to wartość z linii: window.aichatbotApiKey = "...".
// Dopóki wartość to 'WKLEJ_KLUCZ_CHATLAB', czat NIE ładuje się (bezpieczny placeholder).
window.IMTO_CHATLAB_KEY = 'f5008667-0f84-4fa5-9fd4-4a904af1d53d';
window.IMTO_CHATLAB_PROVIDER = 'f9e9c5e4-6d1a-4b8c-8d3f-3f9e9c5e46d1';

// === LANGUAGE SWITCHER + DOMAIN REDIRECT ===
(function() {
    var LANGS = {
        pl: { flagSrc: 'https://flagcdn.com/20x15/pl.png', code: 'PL' },
        de: { flagSrc: 'https://flagcdn.com/20x15/de.png', code: 'DE' },
        en: { flagSrc: 'https://flagcdn.com/20x15/gb.png', code: 'EN' }
    };

    var hostname = window.location.hostname;
    var path     = window.location.pathname;

    // BASE: prefiks podkatalogu dla GitHub Pages project site.
    // Na własnej domenie (imtosoftware.pl) BASE = ''.
    var BASE = hostname.includes('github.io')
        ? path.replace(/^(\/[^/]+).*/, '$1')   // np. '/imtosoftware-site'
        : '';

    // Ścieżka wewnątrz serwisu (bez BASE)
    var sitePath = BASE ? (path.slice(BASE.length) || '/') : path;

    // Ustal aktualny język z sitePath
    var currentLang = 'pl';
    if (sitePath.startsWith('/de/') || sitePath === '/de') currentLang = 'de';
    if (sitePath.startsWith('/en/') || sitePath === '/en') currentLang = 'en';

    // Ścieżka treści (bez prefiksu językowego)
    var contentPath = sitePath.replace(/^\/(de|en)(\/|$)/, '/') || '/';
    if (!contentPath.startsWith('/')) contentPath = '/' + contentPath;

    // Auto-redirect na podstawie domeny (tylko raz na sesję)
    var params = new URLSearchParams(window.location.search);
    var fromPl = params.get('from') === 'pl';

    if (!sessionStorage.getItem('imto_lang_redirect')) {
        sessionStorage.setItem('imto_lang_redirect', '1');
        if (fromPl) {
            // Wejście z domeny .pl — zostajemy na polskiej wersji, czyścimy URL
            history.replaceState({}, '', contentPath);
        } else if (hostname.endsWith('.de') && currentLang !== 'de') {
            window.location.replace(BASE + '/de' + contentPath);
            return;
        } else if ((hostname.endsWith('.com') || hostname.endsWith('.eu')) && currentLang !== 'en') {
            window.location.replace(BASE + '/en' + contentPath);
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
    document.querySelectorAll('[data-lang-link]').forEach(function(el) {
        var lang = el.getAttribute('data-lang-link');
        el.href = lang === 'pl'
            ? BASE + contentPath
            : BASE + '/' + lang + contentPath;
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

// === REZERWACJA TERMINU (Cal.com / Calendly) ===
// [data-booking-link]    — ukryty przycisk, pojawia się gdy ustawiono URL
// [data-booking-upgrade] — link do #kontakt, podmieniany na kalendarz gdy URL ustawiony
// Musi wykonać się PRZED smooth-scrollem i trackingiem (kolejność w tym pliku).
(function() {
    var url = window.IMTO_BOOKING_URL;
    if (!url) return;
    document.querySelectorAll('[data-booking-link], [data-booking-upgrade]').forEach(function(el) {
        el.href = url;
        el.target = '_blank';
        el.rel = 'noopener';
        el.classList.add('booking-active');
        el.addEventListener('click', function() { imtoTrack('click_booking'); });
    });
})();

// === PORTFOLIO: karuzela 3-kartowa, krok o 1 pełną kartę + autoplay ===
(function() {
    var row = document.querySelector('.case-grid.case-row');
    var prev = document.querySelector('[data-case-row-prev]');
    var next = document.querySelector('[data-case-row-next]');
    if (!row || !prev || !next) return;
    var GAP = 24;
    var idx = 0;
    function cardStep() {
        var card = row.querySelector('.case-card');
        return card ? card.getBoundingClientRect().width + GAP : 400;
    }
    function maxIdx() {
        return Math.max(0, row.querySelectorAll('.case-card').length - 3);
    }
    function goTo(i, instant) {
        var m = maxIdx();
        idx = i < 0 ? m : (i > m ? 0 : i);
        row.scrollTo({ left: Math.round(idx * cardStep()), behavior: instant ? 'auto' : 'smooth' });
    }
    prev.addEventListener('click', function() { goTo(idx - 1); });
    next.addEventListener('click', function() { goTo(idx + 1); });
    window.addEventListener('resize', function() { goTo(idx, true); });

    // Autoplay co 5 s; pauza gdy kursor nad karuzelą lub karta przeglądarki nieaktywna
    var paused = false;
    row.addEventListener('mouseenter', function() { paused = true; });
    row.addEventListener('mouseleave', function() { paused = false; });
    row.addEventListener('touchstart', function() { paused = true; }, { passive: true });
    setInterval(function() { if (!paused && !document.hidden) goTo(idx + 1); }, 5000);
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
        if (!href || !href.startsWith('#') || href === '#') return;
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

    // Autoplay co 5 s (wyłącza się po dotknięciu przez użytkownika)
    var autoplay = setInterval(function() { if (!document.hidden) goTo(current + 1); }, 5000);
    track.addEventListener('touchstart', function() { clearInterval(autoplay); }, { passive: true });

    // Touch swipe
    var startX = 0;
    track.addEventListener('touchstart', function(e) { startX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend', function(e) {
        var diff = startX - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 40) { goTo(diff > 0 ? current + 1 : current - 1); }
    }, { passive: true });
})();

// === ANALYTICS (Microsoft Clarity — ładowane WYŁĄCZNIE po zgodzie cookie / RODO) ===
function imtoLoadAnalytics() {
    if (window.clarity) return;
    (function(c,l,a,r,i,t,y){
        c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
        t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
        y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
    })(window, document, "clarity", "script", "wekaeoaefi");
}

// Zdarzenia konwersji (działa tylko gdy analityka załadowana)
function imtoTrack(name) {
    if (window.clarity) { try { window.clarity('event', name); } catch (e) {} }
}

// === COOKIE CONSENT ===
(function() {
    var banner = document.getElementById('cookieBanner');

    var consent = localStorage.getItem('imto_cookie_consent');
    if (consent === 'accepted') {
        imtoLoadAnalytics();
        imtoLoadChatbot();
    }

    if (!banner) return;

    if (!consent) {
        setTimeout(function() { banner.classList.add('visible'); }, 800);
    }

    document.getElementById('cookieAccept').addEventListener('click', function() {
        localStorage.setItem('imto_cookie_consent', 'accepted');
        banner.classList.remove('visible');
        imtoLoadAnalytics();
        imtoLoadChatbot();
    });

    document.getElementById('cookieReject').addEventListener('click', function() {
        localStorage.setItem('imto_cookie_consent', 'rejected');
        banner.classList.remove('visible');
    });
})();

// === CONVERSION EVENT TRACKING ===
(function() {
    document.querySelectorAll('a[href^="tel:"]').forEach(function(a) {
        a.addEventListener('click', function() { imtoTrack('click_phone'); });
    });
    document.querySelectorAll('a[href^="mailto:"]').forEach(function(a) {
        a.addEventListener('click', function() { imtoTrack('click_email'); });
    });
    document.querySelectorAll('a[href$="#kontakt"], a[href="#kontakt"]').forEach(function(a) {
        a.addEventListener('click', function() { imtoTrack('click_cta_kontakt'); });
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
                imtoTrack('form_submit_success');
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

// === LOADER WIDGETU CZATU (ChatLab) — ładowany WYŁĄCZNIE po zgodzie cookie / RODO ===
// Wywoływany z bloku COOKIE CONSENT (tak jak analityka Clarity). Klucz konfigurujesz
// na górze pliku (window.IMTO_CHATLAB_KEY). Odporny na brak klucza i podwójne wywołanie.
function imtoLoadChatbot() {
    var key = window.IMTO_CHATLAB_KEY;
    if (!key || key === 'WKLEJ_KLUCZ_CHATLAB') return;   // placeholder — nie ładuj
    if (window.__imtoChatlabLoaded) return;              // zabezpieczenie przed dublem
    window.__imtoChatlabLoaded = true;

    window.aichatbotApiKey = key;
    if (window.IMTO_CHATLAB_PROVIDER) {
        window.aichatbotProviderId = window.IMTO_CHATLAB_PROVIDER;
    }

    var s = document.createElement('script');
    s.src = 'https://script.chatlab.com/aichatbot.js';
    s.id = key;
    s.defer = true;
    document.head.appendChild(s);
}
