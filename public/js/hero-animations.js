/**
 * Hero entrance + subtle parallax. Respects prefers-reduced-motion.
 */
(function () {
    var hero = document.querySelector('.hero');
    if (!hero) return;

    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function reveal() {
        hero.classList.add('hero--visible');
    }

    if (reduceMotion) {
        reveal();
        return;
    }

    if ('IntersectionObserver' in window) {
        var observer = new IntersectionObserver(
            function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        reveal();
                        observer.disconnect();
                    }
                });
            },
            { threshold: 0.12, rootMargin: '0px 0px -5% 0px' }
        );
        observer.observe(hero);
    } else {
        reveal();
    }

    var orbs = hero.querySelectorAll('.hero__orb');
    var media = hero.querySelector('.hero__media');
    if (!orbs.length || !media) return;

    var targetX = 0;
    var targetY = 0;
    var currentX = 0;
    var currentY = 0;

    function onMove(e) {
        var rect = hero.getBoundingClientRect();
        var cx = rect.left + rect.width / 2;
        var cy = rect.top + rect.height / 2;
        targetX = (e.clientX - cx) / rect.width;
        targetY = (e.clientY - cy) / rect.height;
    }

    function onLeave() {
        targetX = 0;
        targetY = 0;
    }

    function tick() {
        currentX += (targetX - currentX) * 0.06;
        currentY += (targetY - currentY) * 0.06;
        var px = currentX * 18;
        var py = currentY * 14;
        orbs.forEach(function (orb, i) {
            var factor = 0.6 + i * 0.2;
            orb.style.transform =
                'translate(' + (px * factor) + 'px, ' + (py * factor) + 'px)';
        });
        media.style.transform =
            'translate(' + (px * 0.35) + 'px, ' + (py * 0.25) + 'px)';
        requestAnimationFrame(tick);
    }

    hero.addEventListener('mousemove', onMove, { passive: true });
    hero.addEventListener('mouseleave', onLeave, { passive: true });
    requestAnimationFrame(tick);
})();
