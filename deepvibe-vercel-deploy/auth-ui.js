/**
 * deepvibe Auth UI — Phase 1
 *
 * Wires up nav (login button ↔ user chip), Sticky CTA login click,
 * page guards, and the logout dropdown. Depends on auth.js (window.dvAuth).
 *
 * Loaded on all pages. Each page can opt into guards via data-auth-required
 * on the <body> tag — for now this is OFF in placeholder mode so the design
 * is still reviewable without forcing a (mock) login on every visit.
 *
 * v124: CSS is now self-injected (see injectStyles below) so this module
 * works on any page with a <nav class="row"> regardless of HTML CSS.
 */
(() => {
  if (!window.dvAuth) {
    console.warn('[dvAuthUI] dvAuth not loaded — auth-ui will not run.');
    return;
  }

  // ============================================================
  // SELF-CONTAINED STYLES — inject once per page
  // Idempotent: only injects if not already present
  // Uses CSS variables from main stylesheet (--ink-2, --line-08, etc.)
  // ============================================================
  const STYLE_ID = 'dv-auth-ui-styles';
  const injectStyles = () => {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
      /* ============ Login Button (signed-out state) ============ */
      nav .nav-login{
        position:relative;
        display:inline-flex;align-items:center;
        padding:8px 4px;
        background:transparent;
        border:none;
        color:var(--ink-2);
        font-family:var(--font-sans);
        font-size:11px;font-weight:500;letter-spacing:-.005em;
        min-height:36px;
        cursor:pointer;
        transition:color var(--dur-base, .25s) var(--ease-out, ease-out);
      }
      nav .nav-login:hover{color:var(--ink)}
      nav .nav-login:active{color:var(--muted)}
      nav .nav-login::after{
        content:"";position:absolute;
        left:4px;right:4px;bottom:6px;
        height:.5px;
        background:currentColor;
        opacity:0;
        transform:scaleX(0);transform-origin:left;
        transition:opacity .4s var(--ease-out, ease-out), transform .4s var(--ease-out, ease-out);
      }
      nav .nav-login:hover::after{opacity:.5;transform:scaleX(1)}

      /* ============ User Chip (signed-in state) ============ */
      nav .user-chip{
        display:inline-flex;align-items:center;gap:8px;
        padding:6px 12px 6px 6px;
        background:#fff;
        border:.5px solid var(--line-08);
        border-radius:999px;
        font-family:var(--font-sans);
        font-size:12.5px;font-weight:500;color:var(--ink-2);
        transition:background .2s var(--ease-out, ease-out), border-color .2s var(--ease-out, ease-out);
        box-shadow:0 1px 2px var(--line-04);
        cursor:pointer;
      }
      nav .user-chip:hover{background:#fff;border-color:var(--line-12)}
      nav .user-chip .avatar{
        width:22px;height:22px;border-radius:50%;
        background:linear-gradient(135deg, var(--pink, #ff9fbc), var(--violet, #cdb4ff));
        display:flex;align-items:center;justify-content:center;
        color:#fff;font-size:10px;font-weight:600;
        letter-spacing:0;
        overflow:hidden;
      }
      nav .user-chip .avatar img{
        width:100%;height:100%;object-fit:cover;
      }

      /* ============ Auth Dropdown (logout menu) ============ */
      .auth-dropdown{
        position:absolute;
        top:calc(100% + 6px);right:20px;
        min-width:140px;
        background:#fff;
        border:.5px solid var(--line-08);
        border-radius:12px;
        box-shadow:0 8px 24px -10px rgba(20,10,30,.18), 0 1px 2px var(--line-04);
        padding:6px;
        opacity:0;
        transform:translateY(-4px);
        pointer-events:none;
        transition:opacity .2s var(--ease-out, ease-out), transform .2s var(--ease-out, ease-out);
        z-index:100;
      }
      .auth-dropdown.is-open{
        opacity:1;
        transform:translateY(0);
        pointer-events:auto;
      }
      .auth-dropdown button,
      .auth-dropdown a{
        display:block;width:100%;
        padding:9px 12px;
        background:transparent;border:none;
        text-align:left;
        font-family:var(--font-sans);
        font-size:13px;color:var(--ink-2);
        border-radius:8px;
        cursor:pointer;
        transition:background .15s var(--ease-out, ease-out);
        text-decoration:none;
        box-sizing:border-box;
      }
      .auth-dropdown button:hover,
      .auth-dropdown a:hover{background:var(--bg-soft, #f7f4f2)}
    `;
    document.head.appendChild(style);
  };
  injectStyles();

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

      // "내가 그린 결" — link to history page
      const historyLink = document.createElement('a');
      historyLink.setAttribute('role', 'menuitem');
      historyLink.setAttribute('href', '/history');
      historyLink.textContent = '내가 그린 결';
      dropdown.appendChild(historyLink);

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
  // TERMS AGREEMENT MODAL — first-time user consent
  //
  // Shows once after sign-in. User must agree to 만 14세 + 이용약관 +
  // 개인정보처리방침 to proceed. Marketing consent is optional.
  // localStorage key: 'dv_terms_agreed_v1' (bump version when terms change)
  // ============================================================
  const TERMS_KEY = 'dv_terms_agreed_v1';

  const hasAgreedToTerms = () => {
    try {
      return localStorage.getItem(TERMS_KEY) === 'true';
    } catch (e) {
      return false;
    }
  };

  const setTermsAgreed = (marketing = false) => {
    try {
      localStorage.setItem(TERMS_KEY, 'true');
      if (marketing) {
        localStorage.setItem('dv_marketing_consent_v1', 'true');
      }
    } catch (e) {}
  };

  const showConsentModal = () => {
    // Don't show twice
    if (document.querySelector('.consent-modal-overlay')) return;

    const overlay = document.createElement('div');
    overlay.className = 'consent-modal-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-labelledby', 'consentTitle');

    overlay.innerHTML = `
      <div class="consent-modal">
        <div class="consent-modal-handle" aria-hidden="true"></div>
        <h2 class="consent-modal-title" id="consentTitle">시작하기 전에, <em>잠깐만요</em></h2>
        <p class="consent-modal-desc">두 사람의 결을 안전하게 그리기 위해, 아래 항목에 동의해 주세요.</p>

        <ul class="consent-list">
          <li class="consent-item">
            <label class="consent-row">
              <input type="checkbox" id="agreeAge" class="consent-check" data-required="1">
              <span class="consent-check-box" aria-hidden="true">
                <svg viewBox="0 0 12 12" fill="none"><path d="M2.5 6 L5 8.5 L9.5 3.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
              </span>
              <span class="consent-text">
                <span class="consent-tag">필수</span>
                <span class="consent-label">만 14세 이상이에요</span>
              </span>
            </label>
          </li>
          <li class="consent-item">
            <label class="consent-row">
              <input type="checkbox" id="agreeTerms" class="consent-check" data-required="1">
              <span class="consent-check-box" aria-hidden="true">
                <svg viewBox="0 0 12 12" fill="none"><path d="M2.5 6 L5 8.5 L9.5 3.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
              </span>
              <span class="consent-text">
                <span class="consent-tag">필수</span>
                <span class="consent-label">이용약관에 동의해요</span>
                <a href="/terms" target="_blank" class="consent-link" aria-label="이용약관 자세히 보기">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M4 2 H10 V8 M10 2 L4 8 M3 5 V10 H8" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                </a>
              </span>
            </label>
          </li>
          <li class="consent-item">
            <label class="consent-row">
              <input type="checkbox" id="agreePrivacy" class="consent-check" data-required="1">
              <span class="consent-check-box" aria-hidden="true">
                <svg viewBox="0 0 12 12" fill="none"><path d="M2.5 6 L5 8.5 L9.5 3.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
              </span>
              <span class="consent-text">
                <span class="consent-tag">필수</span>
                <span class="consent-label">개인정보 수집·이용에 동의해요</span>
                <a href="/privacy" target="_blank" class="consent-link" aria-label="개인정보처리방침 자세히 보기">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M4 2 H10 V8 M10 2 L4 8 M3 5 V10 H8" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                </a>
              </span>
            </label>
          </li>
          <li class="consent-item">
            <label class="consent-row">
              <input type="checkbox" id="agreeMarketing" class="consent-check">
              <span class="consent-check-box" aria-hidden="true">
                <svg viewBox="0 0 12 12" fill="none"><path d="M2.5 6 L5 8.5 L9.5 3.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
              </span>
              <span class="consent-text">
                <span class="consent-tag consent-tag-optional">선택</span>
                <span class="consent-label">마케팅 정보 받기 (신규 기능 알림)</span>
              </span>
            </label>
          </li>
        </ul>

        <div class="consent-all-row">
          <label class="consent-row consent-row-all">
            <input type="checkbox" id="agreeAll" class="consent-check">
            <span class="consent-check-box" aria-hidden="true">
              <svg viewBox="0 0 12 12" fill="none"><path d="M2.5 6 L5 8.5 L9.5 3.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </span>
            <span class="consent-text">
              <span class="consent-label consent-label-all">모두 동의</span>
            </span>
          </label>
        </div>

        <button type="button" class="btn-consent-submit" id="btnConsentSubmit" disabled>
          시작하기
        </button>
        <button type="button" class="btn-consent-cancel" id="btnConsentCancel">
          나중에 할게요
        </button>
      </div>
    `;

    document.body.appendChild(overlay);

    // Animate in
    requestAnimationFrame(() => {
      overlay.classList.add('is-open');
    });
    document.body.style.overflow = 'hidden';

    // Wire up checkboxes
    const requiredChecks = overlay.querySelectorAll('.consent-check[data-required="1"]');
    const allChecks = overlay.querySelectorAll('.consent-check:not(#agreeAll)');
    const agreeAll = overlay.querySelector('#agreeAll');
    const agreeMarketing = overlay.querySelector('#agreeMarketing');
    const submitBtn = overlay.querySelector('#btnConsentSubmit');
    const cancelBtn = overlay.querySelector('#btnConsentCancel');

    const updateSubmitState = () => {
      const allRequiredChecked = Array.from(requiredChecks).every(c => c.checked);
      submitBtn.disabled = !allRequiredChecked;

      // Update "agree all" checkbox to reflect current state
      const allChecked = Array.from(allChecks).every(c => c.checked);
      agreeAll.checked = allChecked;
    };

    allChecks.forEach(c => c.addEventListener('change', updateSubmitState));

    agreeAll.addEventListener('change', () => {
      allChecks.forEach(c => { c.checked = agreeAll.checked; });
      updateSubmitState();
    });

    submitBtn.addEventListener('click', () => {
      setTermsAgreed(agreeMarketing.checked);
      closeConsentModal();
    });

    cancelBtn.addEventListener('click', () => {
      // User declined — sign them out
      closeConsentModal();
      window.dvAuth.logout();
    });

    // No outside-click close — must explicitly choose
  };

  const closeConsentModal = () => {
    const overlay = document.querySelector('.consent-modal-overlay');
    if (!overlay) return;
    overlay.classList.remove('is-open');
    document.body.style.overflow = '';
    setTimeout(() => overlay.remove(), 350);
  };

  // Trigger consent modal when needed
  const checkConsent = () => {
    if (window.dvAuth.isSignedIn() && !hasAgreedToTerms()) {
      showConsentModal();
    }
  };

  // Expose globally
  window.dvConsent = {
    hasAgreed: hasAgreedToTerms,
    show: showConsentModal,
    setAgreed: setTermsAgreed,
    clear: () => { try { localStorage.removeItem(TERMS_KEY); } catch (e) {} },
  };

  // ============================================================
  // BOOT
  // ============================================================
  const boot = () => {
    enforcePageGuard();
    renderNav();
    wireKakaoButtons();
    checkConsent();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
