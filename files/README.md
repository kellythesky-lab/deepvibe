# deepvibe — Vercel 배포 가이드 (v120)

## 폴더 구성

```
vercel-deploy/
├── index.html        ← 랜딩 (Sticky CTA → Kakao 로그인 → /upload)
├── upload.html       ← 업로드 (분석 5-stage 16.5초 → /report)
├── report.html       ← 결과 (Hero + 6개 카드 + D-Day + 공유)
├── auth.js           ← Kakao OAuth 모듈 (Phase 1, placeholder)
├── auth-ui.js        ← Nav 갱신 + Sticky CTA 후크 + 페이지 가드
├── favicon.svg       ← 탭/홈화면 아이콘
├── og-index.png      ← 랜딩용 OG (카톡 공유)
├── og-upload.png     ← 업로드용 OG
├── og-report.png     ← 리포트용 OG
├── vercel.json       ← cleanUrls + 캐시 + 보안 헤더
└── README.md         ← 이 파일
```

---

## 🚀 배포 — GitHub + Vercel

이미 GitHub Desktop으로 연결되어 있다면:
1. ZIP의 모든 파일을 로컬 리포지토리에 **덮어쓰기**
2. GitHub Desktop → Commit + Push
3. Vercel이 30초~1분 후 자동 배포

URL: `https://deepvibe-phi.vercel.app/`

---

## 🔐 Kakao OAuth — Phase 1 (현재 상태)

`auth.js`의 `KAKAO_APP_KEY`가 **placeholder**(`'YOUR_KAKAO_JAVASCRIPT_KEY_HERE'`)인 상태입니다.
이 상태에서는 다음과 같이 동작합니다:

- 카카오 로그인 버튼 클릭 → **mock 로그인** ("민지"로 가상 로그인)
- localStorage에 사용자 정보 저장
- `/upload`로 리디렉션
- 페이지 가드 **비활성** (디자인 리뷰 편의)

---

## ⚙️ Phase 2 — 실제 카카오 키 적용 방법

### 1단계: 카카오 디벨로퍼 콘솔 등록

1. **https://developers.kakao.com** 접속 → 카카오 계정 로그인
2. 우측 상단 **"내 애플리케이션"** 클릭
3. **"애플리케이션 추가하기"** 클릭
   - **앱 이름**: `deepvibe`
   - **사업자명**: 개인 (사업자 등록 전이면 본인 이름)
   - **카테고리**: `생활`
4. 생성 완료 후 **"앱 키"** 메뉴에서 **JavaScript 키** 복사

### 2단계: 플랫폼 등록

1. 사이드바 → **"플랫폼"** → **"Web 플랫폼 등록"**
2. **사이트 도메인**:
   ```
   https://deepvibe-phi.vercel.app
   http://localhost:3000  ← 로컬 테스트용 (선택)
   ```

### 3단계: 카카오 로그인 활성화

1. 사이드바 → **"카카오 로그인"** → 상태 **ON**으로 변경
2. **Redirect URI 등록** (현재 SDK 방식은 사용 안 함, 향후 백엔드 통합 시 필요):
   ```
   https://deepvibe-phi.vercel.app/auth/callback
   ```
3. 사이드바 → **"카카오 로그인 > 동의항목"**
   - **닉네임**: 필수 동의
   - **프로필 사진**: 선택 동의

### 4단계: 키를 코드에 적용

`auth.js` 파일 열기 → 18행 부근:

```javascript
// Before
const KAKAO_APP_KEY = 'YOUR_KAKAO_JAVASCRIPT_KEY_HERE';

// After (방금 복사한 JavaScript 키 붙여넣기)
const KAKAO_APP_KEY = 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx';
```

### 5단계: 재배포

GitHub Desktop → Commit + Push → Vercel 자동 배포

이제 실제 카카오 로그인이 작동하고, `/upload`와 `/report`에 **페이지 가드도 자동 활성화**됩니다.

---

## 🔮 Phase 3 — 백엔드 통합 (향후)

현재는 카카오 Access Token이 **localStorage에 저장**됩니다. 보안상 권장되지 않는 방식이며, 백엔드 API 구축 후에는:

1. 카카오 OAuth Authorization Code Flow로 전환
2. 백엔드에서 access_token 보관
3. 클라이언트는 httpOnly session cookie만 사용
4. `auth.js`의 localStorage 로직을 `/api/auth/me` 호출로 교체

---

## 🐛 알려진 이슈

| 문제 | 원인 | 해결 |
|---|---|---|
| Mock 로그인이 영구 지속 | localStorage 영속성 | DevTools → Application → localStorage 클리어 |
| 모바일에서 SDK 로드 지연 | Kakao CDN | placeholder 모드에서는 SDK 로드 안 함 |
| 시크릿 모드 로그인 실패 | localStorage 차단 | in-memory fallback (페이지 새로고침 시 초기화) |

---

## 🔍 테스트 시나리오

### Mock 로그인 (placeholder 모드)
1. `/` 방문 → "로그인" 버튼 표시
2. Sticky CTA 또는 nav "로그인" 클릭 → "민지"로 mock 로그인
3. `/upload` 자동 이동, nav에 "민지" 칩 표시
4. 칩 클릭 → "로그아웃" 드롭다운
5. 로그아웃 → `/`로 이동, 다시 "로그인" 버튼

### 실제 카카오 로그인 (Phase 2 이후)
1. 동일하게 진행되지만 카카오 OAuth 시트가 표시됨
2. 사용자 닉네임과 프로필 이미지가 실제로 반영됨
3. 비로그인 상태에서 `/upload`나 `/report` 직접 접근 시 `/`로 강제 이동

---

## 끝

Phase 1 완료. Phase 2(키 적용)는 카카오 디벨로퍼 등록 후 5분 이내 가능.
