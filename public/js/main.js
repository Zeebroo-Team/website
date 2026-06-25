(function () {
    var nav = document.querySelector('.site-nav');
    var toggle = document.querySelector('.nav-toggle');
    var links = document.querySelectorAll('.nav-links a[href^="#"]');

    if (toggle && nav) {
        toggle.addEventListener('click', function () {
            var open = nav.classList.toggle('is-open');
            toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
            if (!open) closeMegaAll();
        });
        links.forEach(function (a) {
            a.addEventListener('click', function () {
                nav.classList.remove('is-open');
                toggle.setAttribute('aria-expanded', 'false');
                closeMegaAll();
            });
        });
    }

    var header = document.querySelector('.site-header');
    if (header) {
        function updateHeaderScroll() {
            header.classList.toggle('is-scrolled', window.scrollY > 12);
        }
        updateHeaderScroll();
        window.addEventListener('scroll', updateHeaderScroll, { passive: true });
    }

    links.forEach(function (link) {
        link.addEventListener('click', function (e) {
            var id = link.getAttribute('href');
            if (!id || id === '#') return;
            var el = document.querySelector(id);
            if (!el) return;
            e.preventDefault();
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });

    // Mega menu
    var megaItems = document.querySelectorAll('.has-mega');
    var megaCloseTimer;

    function closeMegaAll() {
        megaItems.forEach(function (item) {
            item.classList.remove('is-open');
            var btn = item.querySelector('.nav-mega-trigger');
            if (btn) btn.setAttribute('aria-expanded', 'false');
        });
    }

    function openMega(item) {
        clearTimeout(megaCloseTimer);
        megaItems.forEach(function (other) {
            if (other !== item) {
                other.classList.remove('is-open');
                var btn = other.querySelector('.nav-mega-trigger');
                if (btn) btn.setAttribute('aria-expanded', 'false');
            }
        });
        item.classList.add('is-open');
        var btn = item.querySelector('.nav-mega-trigger');
        if (btn) btn.setAttribute('aria-expanded', 'true');
    }

    function closeMega(item) {
        item.classList.remove('is-open');
        var btn = item.querySelector('.nav-mega-trigger');
        if (btn) btn.setAttribute('aria-expanded', 'false');
    }

    megaItems.forEach(function (item) {
        var trigger = item.querySelector('.nav-mega-trigger');
        var panel = item.querySelector('.nav-mega');

        if (!trigger || !panel) return;

        // Desktop: open on hover
        item.addEventListener('mouseenter', function () {
            if (window.innerWidth >= 900) openMega(item);
        });

        item.addEventListener('mouseleave', function () {
            if (window.innerWidth >= 900) {
                megaCloseTimer = setTimeout(function () { closeMega(item); }, 120);
            }
        });

        panel.addEventListener('mouseenter', function () {
            clearTimeout(megaCloseTimer);
        });

        panel.addEventListener('mouseleave', function () {
            if (window.innerWidth >= 900) {
                megaCloseTimer = setTimeout(function () { closeMega(item); }, 120);
            }
        });

        // Click toggle (mobile + keyboard)
        trigger.addEventListener('click', function () {
            if (item.classList.contains('is-open')) closeMega(item);
            else openMega(item);
        });

        // Close mega links on click (mobile nav cleanup)
        panel.querySelectorAll('a').forEach(function (a) {
            a.addEventListener('click', function () {
                closeMegaAll();
                if (nav) {
                    nav.classList.remove('is-open');
                    if (toggle) toggle.setAttribute('aria-expanded', 'false');
                }
            });
        });
    });

    // Escape closes mega
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            closeMegaAll();
        }
    });

    // Click outside closes mega
    document.addEventListener('click', function (e) {
        megaItems.forEach(function (item) {
            if (!item.contains(e.target)) {
                var panel = item.querySelector('.nav-mega');
                if (panel && !panel.contains(e.target)) {
                    closeMega(item);
                }
            }
        });
    });
})();
