document.addEventListener('DOMContentLoaded', () => {
  const state = getAuthState();

  guardPage(state);
  applyAuthVisibility(state);
  wireAvatarMenu(state);
  bindAuthLinks();
  bindAuthForms();
  bindPremiumLinks(state);
  bindBackLinks(state);
  bindLogout();
});

function getAuthState() {
  return {
    isLoggedIn: localStorage.getItem('isLoggedIn') === 'true',
    userInitial: localStorage.getItem('userInitial') || 'A',
    hasPremium: localStorage.getItem('hasPremium') === 'true',
  };
}

function getNextFromUrl() {
  const next = new URLSearchParams(window.location.search).get('next');
  if (!next) return null;
  try {
    const url = new URL(next, window.location.origin);
    if (url.origin !== window.location.origin) return null;
    return url.pathname + url.search + url.hash;
  } catch {
    return null;
  }
}

function setNext(urlPath) {
  if (!urlPath) return;
  sessionStorage.setItem('nextAfterAuth', urlPath);
}

function consumeNext() {
  const fromQuery = getNextFromUrl();
  if (fromQuery) return fromQuery;
  const stored = sessionStorage.getItem('nextAfterAuth');
  sessionStorage.removeItem('nextAfterAuth');
  return stored || null;
}

function redirectToAuth(page) {
  const here =
    window.location.pathname.split('/').pop() +
    window.location.search +
    window.location.hash;
  const next = encodeURIComponent(here);
  window.location.href = `${page}?next=${next}`;
}

function applyAuthVisibility(state) {
  const loginBtn = document.querySelector('[data-auth="login"]');
  const joinBtn = document.querySelector('[data-auth="join"]');
  const avatarWrap = document.querySelector('[data-auth="avatar"]');
  const avatarLetter = document.querySelector('[data-auth="avatar-letter"]');

  const loggedInOnly = document.querySelectorAll('[data-auth-visible="logged_in"]');
  const loggedOutOnly = document.querySelectorAll('[data-auth-visible="logged_out"]');

  if (state.isLoggedIn) {
    if (loginBtn) loginBtn.classList.add('is-hidden');
    if (joinBtn) joinBtn.classList.add('is-hidden');
    if (avatarWrap) avatarWrap.classList.remove('is-hidden');
    if (avatarLetter) avatarLetter.textContent = state.userInitial;
    loggedInOnly.forEach((el) => el.classList.remove('is-hidden'));
    loggedOutOnly.forEach((el) => el.classList.add('is-hidden'));
    return;
  }

  if (loginBtn) loginBtn.classList.remove('is-hidden');
  if (joinBtn) joinBtn.classList.remove('is-hidden');
  if (avatarWrap) avatarWrap.classList.add('is-hidden');
  loggedInOnly.forEach((el) => el.classList.add('is-hidden'));
  loggedOutOnly.forEach((el) => el.classList.remove('is-hidden'));
}

function guardPage(state) {
  const path = window.location.pathname.toLowerCase();

  if (path.endsWith('dashboard.html') && !state.isLoggedIn) {
    setNext('dashboard.html');
    redirectToAuth('login.html');
    return;
  }

  if (path.endsWith('player-premium.html') && (!state.isLoggedIn || !state.hasPremium)) {
    window.location.href = 'course-premium.html';
    return;
  }

  if ((path.endsWith('login.html') || path.endsWith('register.html')) && state.isLoggedIn) {
    const next = consumeNext();
    window.location.href = next || 'dashboard.html';
  }
}

function bindAuthLinks() {
  const authLinks = document.querySelectorAll('[data-auth-link]');
  authLinks.forEach((link) => {
    link.addEventListener(
      'click',
      () => {
        const dest = link.getAttribute('href');
        if (!dest) return;
        const here =
          window.location.pathname.split('/').pop() +
          window.location.search +
          window.location.hash;
        link.setAttribute('href', `${dest}?next=${encodeURIComponent(here)}`);
      },
      { once: true }
    );
  });
}

function bindAuthForms() {
  const loginForm = document.querySelector('[data-auth-form="login"]');
  const registerForm = document.querySelector('[data-auth-form="register"]');

  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('email');
      const name = document.getElementById('name');
      const initial =
        name && name.value.trim()
          ? name.value.trim()[0]
          : (email && email.value.trim()[0]) || 'A';

      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userInitial', initial.toUpperCase());

      const next = consumeNext();
      window.location.href = next || 'dashboard.html';
    });
  }

  if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('name');
      const initial = name && name.value.trim() ? name.value.trim()[0] : 'A';

      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userInitial', initial.toUpperCase());
      if (localStorage.getItem('hasPremium') === null) {
        localStorage.setItem('hasPremium', 'false');
      }

      const next = consumeNext();
      window.location.href = next || 'dashboard.html';
    });
  }
}

function bindPremiumLinks(state) {
  const premiumLinks = document.querySelectorAll('[data-premium]');
  premiumLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      if (!state.hasPremium) {
        const wa = link.getAttribute('data-whatsapp');
        if (wa) {
          e.preventDefault();
          window.location.href = wa;
        }
      }
    });
  });
}

function bindBackLinks(state) {
  const backLink = document.querySelector('[data-back-link]');
  if (!backLink) return;
  backLink.setAttribute('href', state.isLoggedIn ? 'dashboard.html' : 'courses.html');
}

function bindLogout() {
  const logout = document.querySelectorAll('[data-action="logout"]');
  if (!logout.length) return;

  logout.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      localStorage.setItem('isLoggedIn', 'false');
      window.location.href = 'index.html';
    });
  });
}

function wireAvatarMenu(state) {
  if (!state.isLoggedIn) return;
  const wrap = document.querySelector('.nav-avatar-wrap[data-auth="avatar"]');
  if (!wrap) return;
  const button = wrap.querySelector('.nav-avatar');
  const menu = wrap.querySelector('.nav-avatar-menu');
  if (!button || !menu) return;

  button.setAttribute('aria-haspopup', 'menu');
  button.setAttribute('aria-expanded', 'false');

  const close = () => {
    wrap.classList.remove('is-open');
    button.setAttribute('aria-expanded', 'false');
  };

  const open = () => {
    wrap.classList.add('is-open');
    button.setAttribute('aria-expanded', 'true');
  };

  button.addEventListener('click', (e) => {
    e.preventDefault();
    if (wrap.classList.contains('is-open')) close();
    else open();
  });

  document.addEventListener('click', (e) => {
    if (!wrap.contains(e.target)) close();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') close();
  });
}
