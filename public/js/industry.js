(function () {
    var page = document.getElementById('ind-page');
    if (!page) return;

    var slug = page.getAttribute('data-slug');
    if (!slug) return;

    function el(tag, cls, html) {
        var e = document.createElement(tag);
        if (cls) e.className = cls;
        if (html) e.innerHTML = html;
        return e;
    }

    function icon(cls) {
        return '<i class="fa ' + cls + '" aria-hidden="true"></i>';
    }

    function renderStats(stats) {
        var wrap = document.getElementById('ind-stats');
        if (!wrap) return;
        var html = stats.map(function (s) {
            return '<div class="ind-stat">' +
                '<span class="ind-stat__value">' + s.value + '</span>' +
                '<span class="ind-stat__label">' + s.label + '</span>' +
                '</div>';
        }).join('');
        wrap.innerHTML = '<div class="ind-stats-panel">' + html + '</div>';
    }

    function renderFeatures(features) {
        var wrap = document.getElementById('ind-features');
        if (!wrap) return;
        wrap.innerHTML = features.map(function (f) {
            return '<article class="ind-feature-card">' +
                '<div class="ind-feature-card__icon" aria-hidden="true">' + icon(f.icon) + '</div>' +
                '<h3>' + f.title + '</h3>' +
                '<p>' + f.desc + '</p>' +
                '</article>';
        }).join('');
    }

    function renderSteps(steps) {
        var wrap = document.getElementById('ind-steps');
        if (!wrap) return;
        wrap.innerHTML = steps.map(function (s) {
            return '<article class="ind-step">' +
                '<span class="ind-step__num" aria-hidden="true">' + s.n + '</span>' +
                '<h3>' + s.title + '</h3>' +
                '<p>' + s.desc + '</p>' +
                '</article>';
        }).join('');
    }

    function renderRelated(all, current) {
        var wrap = document.getElementById('ind-related');
        if (!wrap) return;
        var keys = Object.keys(all).filter(function (k) { return k !== current; });
        // shuffle slightly: take up to 4 excluding current
        var picks = keys.slice(0, 4);
        wrap.innerHTML = picks.map(function (k) {
            var ind = all[k];
            return '<a href="/industry/' + ind.slug + '" class="ind-related-card">' +
                '<span class="ind-related-card__icon" aria-hidden="true">' + icon(ind.icon) + '</span>' +
                '<span class="ind-related-card__body">' +
                '<span class="ind-related-card__name">' + ind.name + '</span>' +
                '<span class="ind-related-card__desc">' + ind.tagline + '</span>' +
                '</span>' +
                '</a>';
        }).join('');
    }

    function removeSkeleton() {
        var skels = document.querySelectorAll('.ind-skel-block');
        skels.forEach(function (s) { s.remove(); });
    }

    function markLoaded() {
        page.classList.add('is-loaded');
    }

    fetch('/data/industries.json')
        .then(function (r) {
            if (!r.ok) throw new Error('fetch failed');
            return r.json();
        })
        .then(function (all) {
            var ind = all[slug];
            if (!ind) {
                // Unknown slug - show fallback
                var hero = document.getElementById('ind-hero-title');
                if (hero) hero.textContent = 'Industry not found';
                return;
            }

            // Update document title
            document.title = ind.name + ' - Industry Solutions - Zeebroo';

            // Update meta description
            var metaEl = document.querySelector('meta[name="description"]');
            if (metaEl) metaEl.setAttribute('content', ind.metaDesc);

            // Update breadcrumb label
            var bcLabel = document.getElementById('ind-bc-label');
            if (bcLabel) bcLabel.textContent = ind.name;

            // Update hero fields (server may have already set these; JS ensures they're correct)
            var heroTitle = document.getElementById('ind-hero-title');
            if (heroTitle) heroTitle.textContent = ind.heroTitle;
            var heroDesc = document.getElementById('ind-hero-desc');
            if (heroDesc) heroDesc.textContent = ind.heroDesc;

            // Features section eyebrow
            var featEyebrow = document.getElementById('ind-feat-eyebrow');
            if (featEyebrow) featEyebrow.textContent = 'Why ' + ind.name + ' teams choose Zeebroo';
            var featHeading = document.getElementById('ind-feat-heading');
            if (featHeading) featHeading.textContent = 'Everything your business needs in one place';

            // CTA text
            var ctaDesc = document.getElementById('ind-cta-desc');
            if (ctaDesc) ctaDesc.textContent = 'Tell us about your ' + ind.name + ' and we will show you how Zeebroo fits the way you work.';

            renderStats(ind.stats);
            renderFeatures(ind.features);
            renderSteps(ind.steps);
            renderRelated(all, slug);
            removeSkeleton();
            markLoaded();
        })
        .catch(function (err) {
            console.error('Industry data failed to load', err);
        });
})();
