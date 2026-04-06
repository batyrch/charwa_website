/* ============================================================
   Charwa GmbH v2 — Main JavaScript
   ============================================================ */

(function() {
    'use strict';

    // ===== Sticky Navigation =====
    var nav = document.getElementById('nav');
    var scrollThreshold = 50;

    function handleScroll() {
        if (window.scrollY > scrollThreshold) {
            nav.classList.add('nav--scrolled');
        } else {
            nav.classList.remove('nav--scrolled');
        }
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // check on load

    // ===== Theme Toggle =====
    // States: null (auto) -> 'light' -> 'dark' -> null (auto)
    var themeToggle = document.getElementById('themeToggle');
    var themeStates = [null, 'light', 'dark'];

    function getCurrentThemeIndex() {
        var current = localStorage.getItem('charwa_theme');
        if (current === 'light') return 1;
        if (current === 'dark') return 2;
        return 0;
    }

    function applyTheme(theme) {
        if (theme) {
            document.documentElement.setAttribute('data-theme', theme);
        } else {
            document.documentElement.removeAttribute('data-theme');
        }
        updateThemeIcon(theme);
    }

    function updateThemeIcon(theme) {
        if (!themeToggle) return;
        var icons = {
            auto: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="9"/><path d="M12 3a9 9 0 0 0 0 18V3z" fill="currentColor"/></svg>',
            light: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>',
            dark: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>'
        };
        var key = theme || 'auto';
        themeToggle.innerHTML = icons[key];
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            var idx = getCurrentThemeIndex();
            var nextIdx = (idx + 1) % themeStates.length;
            var nextTheme = themeStates[nextIdx];

            if (nextTheme) {
                localStorage.setItem('charwa_theme', nextTheme);
            } else {
                localStorage.removeItem('charwa_theme');
            }

            applyTheme(nextTheme);
        });
    }

    // Apply saved theme (also handled by inline script in <head>, but this ensures icon is correct)
    var savedTheme = localStorage.getItem('charwa_theme');
    applyTheme(savedTheme);

    // ===== Mobile Hamburger Menu =====
    var hamburger = document.getElementById('hamburger');
    var navMenu = document.getElementById('navMenu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('open');
            navMenu.classList.toggle('open');
            document.body.style.overflow = navMenu.classList.contains('open') ? 'hidden' : '';
        });

        // Close menu on link click
        navMenu.querySelectorAll('a').forEach(function(link) {
            link.addEventListener('click', function() {
                hamburger.classList.remove('open');
                navMenu.classList.remove('open');
                document.body.style.overflow = '';
            });
        });
    }

    // ===== Active Nav Link =====
    var currentPage = document.body.getAttribute('data-page');
    if (currentPage) {
        document.querySelectorAll('.nav__menu a').forEach(function(link) {
            var href = link.getAttribute('href');
            if (
                (currentPage === 'home' && (href === 'index.html' || href === './')) ||
                (href === currentPage + '.html')
            ) {
                link.classList.add('active');
            }
        });
    }

    // ===== Smooth Scroll for Anchor Links =====
    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
        anchor.addEventListener('click', function(e) {
            var targetId = this.getAttribute('href');
            if (targetId === '#') return;
            var target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

})();
