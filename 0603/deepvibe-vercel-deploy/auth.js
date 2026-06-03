/**
 * deepvibe Auth Module — Phase 1
 *
 * Kakao OAuth front-end wiring. App Key is a placeholder until Phase 2
 * (Kakao Developer Console registration).
 *
 * Sessions are stored in localStorage for now. When backend is integrated
 * in Phase 3, this should be replaced with httpOnly session cookies.
 *
 * Usage:
 *   <script src="auth.js" defer></script>
 *   window.dvAuth.init();           // call once per page (on load)
 *   window.dvAuth.login();          // trigger Kakao login flow
 *   window.dvAuth.logout();
 *   window.dvAuth.getUser();        // null if not signed in
 *   window.dvAuth.requireAuth(redirectTo);  // page guard
 */
(() => {
  // ============================================================
  // CONFIG — replace KAKAO_APP_KEY with the JavaScript key from
  // https://developers.kakao.com after registering the app.
  // ============================================================
  const KAKAO_APP_KEY = 'YOUR_KAKAO_JAVASCRIPT_KEY_HERE';
  const STORAGE_KEY_USER = 'deepvibe_user';
  const SDK_VERSION = '2.6.0';

  // Detect whether we're running with a real key or still in dev placeholder mode
  const isPlaceholder = KAKAO_APP_KEY === 'YOUR_KAKAO_JAVASCRIPT_KEY_HERE';

  // ============================================================
  // SDK LOADING
  // ============================================================
  let sdkLoadPromise = null;

  const loadKakaoSdk = () => {
    if (sdkLoadPromise) return sdkLoadPromise;
    sdkLoadPromise = new Promise((resolve, reject) => {
      // Already loaded?
      if (window.Kakao && window.Kakao.isInitialized && window.Kakao.isInitialized()) {
        resolve(window.Kakao);
        return;
      }
      // Already on page but not initialized
      if (window.Kakao) {
        try {
          if (!window.Kakao.isInitialized()) window.Kakao.init(KAKAO_APP_KEY);
          resolve(window.Kakao);
        } catch (e) { reject(e); }
        return;
      }
      // Need to inject script
      const script = document.createElement('script');
      script.src = `https://t1.kakaocdn.net/kakao_js_sdk/${SDK_VERSION}/kakao.min.js`;
      script.crossOrigin = 'anonymous';
      script.async = true;
      script.onload = () => {
        try {
          if (!window.Kakao.isInitialized()) window.Kakao.init(KAKAO_APP_KEY);
          resolve(window.Kakao);
        } catch (e) { reject(e); }
      };
      script.onerror = () => reject(new Error('Kakao SDK 로드 실패'));
      document.head.appendChild(script);
    });
    return sdkLoadPromise;
  };

  // ============================================================
  // USER STATE — localStorage backed (replace with session cookies in Phase 3)
  // ============================================================
  const getUser = () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_USER);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  };

  const setUser = (user) => {
    try {
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
    } catch (e) {
      // Private mode or storage full — fall back to in-memory
      window._dvAuthMemoryUser = user;
    }
  };

  const clearUser = () => {
    try { localStorage.removeItem(STORAGE_KEY_USER); } catch (e) {}
    window._dvAuthMemoryUser = null;
  };

  const isSignedIn = () => !!getUser();

  // ============================================================
  // LOGIN FLOW
  // ============================================================
  const login = async () => {
    // Dev placeholder fallback — without a real key, simulate a successful
    // login so the rest of the flow can be developed and tested.
    if (isPlaceholder) {
      console.warn('[dvAuth] KAKAO_APP_KEY is a placeholder. Simulating login for development.');
      const mockUser = {
        kakao_id: 'dev_' + Date.now(),
        nickname: '민지',
        profile_image: null,
        signed_in_at: new Date().toISOString(),
        is_mock: true,
      };
      setUser(mockUser);
      // Redirect to upload (same as the real flow)
      window.location.href = '/upload';
      return;
    }

    // Real Kakao flow
    try {
      await loadKakaoSdk();
      window.Kakao.Auth.login({
        scope: 'profile_nickname,profile_image',
        success: async (authObj) => {
          // Fetch profile
          try {
            const profile = await new Promise((resolve, reject) => {
              window.Kakao.API.request({
                url: '/v2/user/me',
                success: resolve,
                fail: reject,
              });
            });
            const user = {
              kakao_id: String(profile.id),
              nickname: profile.properties?.nickname || profile.kakao_account?.profile?.nickname || '사용자',
              profile_image: profile.properties?.profile_image || profile.kakao_account?.profile?.profile_image_url || null,
              access_token: authObj.access_token,
              signed_in_at: new Date().toISOString(),
            };
            setUser(user);
            window.location.href = '/upload';
          } catch (e) {
            console.error('[dvAuth] profile fetch failed:', e);
            alert('로그인은 됐지만 정보를 가져오지 못했어요. 다시 시도해주세요.');
          }
        },
        fail: (err) => {
          // User cancelled or other auth error
          if (err && err.error === 'access_denied') {
            // User explicitly cancelled — silent
            return;
          }
          console.error('[dvAuth] auth failed:', err);
          alert('로그인에 문제가 있어요. 잠시 후 다시 시도해주세요.');
        },
      });
    } catch (e) {
      console.error('[dvAuth] SDK load failed:', e);
      alert('카카오 로그인을 불러오지 못했어요. 네트워크 상태를 확인해주세요.');
    }
  };

  // ============================================================
  // LOGOUT
  // ============================================================
  const logout = async () => {
    if (isPlaceholder) {
      // Mock logout — just clear local state
      clearUser();
      window.location.href = '/';
      return;
    }
    try {
      await loadKakaoSdk();
      if (window.Kakao.Auth.getAccessToken()) {
        window.Kakao.Auth.logout(() => {
          clearUser();
          window.location.href = '/';
        });
      } else {
        clearUser();
        window.location.href = '/';
      }
    } catch (e) {
      // Even if SDK fails, still clear local state
      clearUser();
      window.location.href = '/';
    }
  };

  // ============================================================
  // PAGE GUARD — redirect to landing if not signed in
  // ============================================================
  const requireAuth = (loginPath = '/') => {
    if (!isSignedIn()) {
      window.location.href = loginPath;
      return false;
    }
    return true;
  };

  // ============================================================
  // INIT — called once per page on load. Preloads SDK in background
  // (best-effort) so the first login click is fast.
  // ============================================================
  const init = () => {
    // Only preload if we have a real key — no need to load SDK in placeholder mode
    if (!isPlaceholder) {
      loadKakaoSdk().catch((e) => {
        // Non-fatal — login() will retry
        console.warn('[dvAuth] SDK preload failed, will retry on login:', e);
      });
    }
  };

  // ============================================================
  // EXPORT
  // ============================================================
  window.dvAuth = {
    init,
    login,
    logout,
    getUser,
    isSignedIn,
    requireAuth,
    isPlaceholder,
  };
})();
