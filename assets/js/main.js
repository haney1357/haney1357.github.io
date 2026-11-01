(() => {
  'use strict';

  const root = document.documentElement;
  const themeToggle = document.querySelector('.theme-toggle');
  const themeMeta = document.querySelector('meta[name="theme-color"]');
  const themeStorageKey = 'haney-kang-theme';

  const applyTheme = (theme) => {
    const isDark = theme === 'dark';
    root.dataset.theme = isDark ? 'dark' : 'light';

    if (themeToggle) {
      const nextTheme = isDark ? 'light' : 'dark';
      const actionLabel = `Switch to ${nextTheme} theme`;
      themeToggle.setAttribute('aria-label', actionLabel);
      themeToggle.setAttribute('title', actionLabel);
      themeToggle.setAttribute('aria-pressed', String(isDark));

      const label = themeToggle.querySelector('.theme-toggle-label');
      if (label) label.textContent = isDark ? 'Dark' : 'Light';
    }

    if (themeMeta) {
      themeMeta.setAttribute('content', isDark ? '#111922' : '#f4f3ef');
    }
  };

  let initialTheme = root.dataset.theme === 'dark' ? 'dark' : 'light';
  try {
    const savedTheme = localStorage.getItem(themeStorageKey);
    if (savedTheme === 'light' || savedTheme === 'dark') {
      initialTheme = savedTheme;
    }
  } catch (_) {
    // The theme switch still works for this page if local storage is unavailable.
  }
  applyTheme(initialTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const nextTheme = root.dataset.theme === 'dark' ? 'light' : 'dark';
      applyTheme(nextTheme);

      try {
        localStorage.setItem(themeStorageKey, nextTheme);
      } catch (_) {
        // The selected theme remains active until the page is closed.
      }
    });
  }

  const menuButton = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.primary-nav');

  const closeMenu = () => {
    if (!menuButton || !nav) return;
    menuButton.setAttribute('aria-expanded', 'false');
    nav.classList.remove('is-open');
  };

  if (menuButton && nav) {
    menuButton.addEventListener('click', () => {
      const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
      menuButton.setAttribute('aria-expanded', String(!isOpen));
      nav.classList.toggle('is-open', !isOpen);
    });

    nav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', closeMenu);
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') closeMenu();
    });

    document.addEventListener('click', (event) => {
      if (
        menuButton.getAttribute('aria-expanded') === 'true' &&
        !nav.contains(event.target) &&
        !menuButton.contains(event.target)
      ) {
        closeMenu();
      }
    });
  }

  // Highlight the navigation item for the section currently in view.
  const navLinks = [...document.querySelectorAll('.nav-link')];
  const sections = navLinks
    .map((link) => link.getAttribute('href'))
    .filter((href) => href && href.startsWith('#'))
    .map((href) => document.querySelector(href))
    .filter(Boolean);

  if ('IntersectionObserver' in window && sections.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        navLinks.forEach((link) => {
          const isActive = link.getAttribute('href') === `#${entry.target.id}`;
          link.classList.toggle('active', isActive);

          if (isActive) {
            link.setAttribute('aria-current', 'location');
          } else {
            link.removeAttribute('aria-current');
          }
        });
      });
    }, { rootMargin: '-25% 0px -65% 0px' });

    sections.forEach((section) => observer.observe(section));
  }
})();
