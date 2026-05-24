/**
 * deepvibe Auth UI — Phase 1
 *
 * Wires up nav (login button ↔ user chip), Sticky CTA login click,
 * page guards, and the logout dropdown. Depends on auth.js (window.dvAuth).
 *
 * Loaded on all 3 pages. Each page can opt into guards via data-auth-required
 * on the <body> tag — for now this is OFF in placeholder mode so the design
 * is still reviewable without forcing a (mock) login on every visit.
 */
(() => {
  if (!window.dvAuth) {
    console.warn('[dvAuthUI] dvAuth not loaded — auth-ui will not run.');
    return;
  }

  // ============================================================
  // INIT — dvAuth init (preload SDK if real key)
  // ============================================================
  window.dvAuth.init();

  // ============================================================
  // NAV — render user chip if signed in, login button if not
  // ============================================================
  const renderNav = () => {
    const navRow = document.querySelector('nav .row');
    if (!navRow) return;

    // Remove existing right-side elements (login button OR user chip)
    const existing = navRow.querySelector('.nav-login, .user-chip');
    if (existing) existing.remove();

    const user = window.dvAuth.getUser();
    if (user) {
      // Signed in → render user chip
      const chip = document.createElement('button');
      chip.className = 'user-chip';
      chip.setAttribute('aria-label', '사용자 메뉴');
      chip.setAttribute('aria-haspopup', 'true');
      chip.setAttribute('aria-expanded', 'false');

      const avatar = document.createElement('span');
      avatar.className = 'avatar';
      if (user.profile_image) {
        const img = document.createElement('img');
        img.src = user.profile_image;
        img.alt = '';
        img.referrerPolicy = 'no-referrer';
        avatar.appendChild(img);
      } else {
        avatar.textContent = (user.nickname || '?').charAt(0);
      }
      chip.appendChild(avatar);

      const name = document.createElement('span');
      name.textContent = user.nickname || '사용자';
      chip.appendChild(name);

      navRow.appendChild(chip);
      attachUserChipBehavior(chip);
    } else {
      // Signed out → render login button
      const btn = document.createElement('button');
      btn.className = 'nav-login';
      btn.setAttribute('aria-label', '로그인');
      btn.textContent = '로그인';
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        window.dvAuth.login();
      });
      navRow.appendChild(btn);
    }
  };

  // ============================================================
  // USER CHIP BEHAVIOR — dropdown with logout
  // ============================================================
  const attachUserChipBehavior = (chip) => {
    let dropdown = null;

    const closeDropdown = () => {
      if (dropdown) {
        dropdown.classList.remove('is-open');
        chip.setAttribute('aria-expanded', 'false');
        // Remove from DOM after transition
        setTimeout(() => { if (dropdown && !dropdown.classList.contains('is-open')) {
          dropdown.remove();
          dropdown = null;
        }}, 250);
      }
    };

    const openDropdown = () => {
      if (dropdown) return;
      dropdown = document.createElement('div');
      dropdown.className = 'auth-dropdown';
      dropdown.setAttribute('role', 'menu');

      const logoutBtn = document.createElement('button');
      logoutBtn.type = 'button';
      logoutBtn.setAttribute('role', 'menuitem');
      logoutBtn.textContent = '로그아웃';
      logoutBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        window.dvAuth.logout();
      });
      dropdown.appendChild(logoutBtn);

      const nav = document.querySelector('nav');
      nav.appendChild(dropdown);

      // Animate in
      requestAnimationFrame(() => {
        dropdown.classList.add('is-open');
      });
      chip.setAttribute('aria-expanded', 'true');

      // Close on outside click
      setTimeout(() => {
        document.addEventListener('click', onOutsideClick, { once: true });
      }, 0);
    };

    const onOutsideClick = (e) => {
      if (dropdown && !dropdown.contains(e.target) && e.target !== chip) {
        closeDropdown();
      } else if (dropdown && dropdown.classList.contains('is-open')) {
        // Click inside dropdown — re-arm listener
        document.addEventListener('click', onOutsideClick, { once: true });
      }
    };

    chip.addEventListener('click', (e) => {
      e.stopPropagation();
      if (dropdown && dropdown.classList.contains('is-open')) {
        closeDropdown();
      } else {
        openDropdown();
      }
    });

    // Esc key closes dropdown
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && dropdown) closeDropdown();
    });
  };

  // ============================================================
  // KAKAO CTA BUTTONS — every .btn-kakao triggers login flow
  // ============================================================
  const wireKakaoButtons = () => {
    document.querySelectorAll('.btn-kakao').forEach(btn => {
      // Mark as auth-wired so we can remove old listeners
      if (btn.dataset.authWired === '1') return;
      btn.dataset.authWired = '1';

      // Replace the direct navigation behavior with login flow
      btn.addEventListener('click', (e) => {
        // If user is already signed in, skip login and go straight to upload
        if (window.dvAuth.isSignedIn()) {
          window.location.href = '/upload';
          return;
        }
        // Otherwise kick off Kakao login (handles redirect on success)
        window.dvAuth.login();
      }, { capture: true });
    });
  };

  // ============================================================
  // PAGE GUARD — require sign-in on /upload and /report
  //
  // OFF in placeholder mode so design reviews don't require a mock sign-in
  // on every page load. Once a real Kakao key is in place (Phase 2), this
  // becomes active automatically.
  // ============================================================
  const enforcePageGuard = () => {
    if (window.dvAuth.isPlaceholder) return;
    const path = window.location.pathname;
    const isProtected = path === '/upload' || path === '/report'
                     || path.endsWith('/upload.html') || path.endsWith('/report.html');
    if (isProtected && !window.dvAuth.isSignedIn()) {
      window.location.href = '/';
    }
  };

  // ============================================================
  // BOOT
  // ============================================================
  const boot = () => {
    enforcePageGuard();
    renderNav();
    wireKakaoButtons();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
