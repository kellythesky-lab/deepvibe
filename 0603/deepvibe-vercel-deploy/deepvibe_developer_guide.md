# deepvibe — 개발자 가이드

> 이 문서는 deepvibe 프론트엔드 코드베이스에 처음 합류하는 개발자를 위한 가이드입니다.
> 현재 코드는 **placeholder 단계** (백엔드 미연결, 디자인 완성 90%) 입니다.
> 다음 단계는 카카오 OAuth 실제 연동 + 백엔드 API 연결입니다.

---

## 1. 프로젝트 개요

- **deepvibe**: 카카오톡 대화 분석 기반 관계 분석 서비스 (한국어)
- **현재 단계**: 디자인 + 프론트엔드 완성, 백엔드 미연동
- **배포**: Vercel (`deepvibe-phi.vercel.app`)
- **소스 관리**: GitHub Desktop
- **빌드**: 빌드 없음 (정적 HTML + 단일 Edge Function)

### 핵심 기능
1. 카카오톡 .txt 파일 업로드 → AI 분석
2. 호감도, 답장 속도, 말투 변화 등 7가지 카드 리포트
3. D-Day 위젯 (잠금화면 / 홈)
4. 분석 이력 + 친구 초대 보너스

---

## 2. 파일 구조 (1단계)

```
vercel-deploy/
├─ index.html            # 랜딩 페이지 (106 KB)
├─ upload.html           # 파일 업로드 + 분석 진행 (78 KB)
├─ report.html           # 분석 결과 (116 KB)
├─ history.html          # 분석 이력 (30 KB)
├─ invite.html           # 친구 초대 시스템 (24 KB)
│
├─ terms.html            # 이용약관 (placeholder)
├─ privacy.html          # 개인정보처리방침 (placeholder)
├─ refund.html           # 환불 정책 (placeholder)
│
├─ auth.js               # 카카오 OAuth 모듈 (window.dvAuth API)
├─ auth-ui.js            # Nav UI 동적 주입 (login button / user chip + dropdown)
│
├─ api/
│   └─ og.tsx            # 동적 OG 이미지 (Edge Function, @vercel/og)
│
├─ fonts/
│   └─ Fraunces-Italic.ttf  # Variable font (opsz 9-144, 228 KB)
│
├─ og-index.png          # OG 정적 폴백 (랜딩)
├─ og-upload.png         # OG 정적 폴백 (업로드)
├─ og-report.png         # OG 정적 폴백 (리포트)
│
├─ favicon.svg
├─ package.json          # @vercel/og 의존성만
├─ vercel.json           # cleanUrls, 보안 헤더, 캐시 설정
└─ README.md
```

### 핵심 원칙
- **각 HTML은 자체완결적**: 모든 CSS는 `<style>` 안에 인라인. 외부 CSS 없음.
- **JS는 2개 공유 모듈**: `auth.js` (인증 코어) + `auth-ui.js` (UI 동적 주입)
- **나머지 JS는 페이지별 인라인**: 각 HTML의 `<script>` 안에 위치

---

## 3. 페이지 아키텍처

### 5개 메인 페이지의 표준 구조

모든 페이지는 동일한 시멘틱 구조를 따릅니다:

```html
<nav id="nav">
  <div class="row">
    <a class="logo" href="/">...</a>
    <!-- Auth UI (login button or user chip) is injected by auth-ui.js -->
  </div>
</nav>

<!-- 서브 페이지만 (history, report, invite) -->
<div class="page-back">
  <a class="page-back-link" href="javascript:history.back()">
    <svg>...</svg> 이전
  </a>
</div>

<main>
  <!-- 페이지 콘텐츠 -->
</main>

<!-- index만: Sticky CTA -->
<div class="sticky-cta">...</div>

<script src="auth.js" defer></script>
<script src="auth-ui.js" defer></script>
<script>(() => { /* 페이지별 JS */ })();</script>
```

### 페이지별 역할

| 페이지 | 역할 | 진입점 |
|---|---|---|
| `/` | 랜딩 + 카카오 로그인 CTA | 첫 방문 |
| `/upload` | 파일 업로드 + 분석 진행 화면 | 로그인 후 |
| `/report` | 분석 결과 7카드 + D-Day 모달 + 공유 모달 | 분석 완료 후 |
| `/history` | 분석 이력 리스트 | nav dropdown |
| `/invite` | 친구 초대 + 보너스 관리 | report에서 공유, 또는 dropdown |

---

## 4. 인증 시스템 (auth.js)

### 공개 API

```js
window.dvAuth.init();                  // 페이지 로드 시 호출 (auth-ui.js가 자동 호출)
window.dvAuth.login();                 // 카카오 OAuth 로그인 트리거
window.dvAuth.logout();                // 로그아웃 + localStorage 정리
window.dvAuth.getUser();               // 사용자 객체 반환 (null if not signed in)
window.dvAuth.isSignedIn();            // boolean
window.dvAuth.requireAuth(redirectTo); // 비로그인 시 redirectTo로 이동
window.dvAuth.isPlaceholder();         // 현재 placeholder 모드 여부 (true)
```

### 사용자 객체 구조

```js
{
  kakao_id: 'dev_1234567890',          // 카카오 사용자 ID (placeholder는 'dev_*')
  nickname: '민지',                     // 카카오 닉네임
  profile_image: null,                 // 프로필 이미지 URL
  access_token: '...',                 // 실제 모드에서만
  signed_in_at: '2026-05-26T11:30:00Z',
  is_mock: true,                       // placeholder 모드 여부
}
```

### Placeholder 모드 (현재)

`auth.js` 상단의 `const KAKAO_KEY = null;` 이 활성화된 상태:
- `login()` 호출 시 카카오 SDK를 부르지 않고 mock 사용자 (`민지`) 생성
- localStorage에 저장 → 다음 페이지 로드부터 로그인된 것처럼 동작
- 페이지 가드 (`requireAuth`) 비활성화 → 비로그인 상태에서도 모든 페이지 접근 가능

### Production 전환 (다음 단계)

```js
// auth.js 상단 수정:
const KAKAO_KEY = 'YOUR_REAL_KAKAO_JAVASCRIPT_KEY';
```

전환 시 자동으로:
1. 카카오 SDK 로드 (`https://t1.kakaocdn.net/kakao_js_sdk/2.x.x/kakao.min.js`)
2. `login()` → 실제 OAuth 팝업
3. 페이지 가드 활성화 (`/upload`, `/report`는 로그인 필요)

---

## 5. Auth UI (auth-ui.js)

### 역할
모든 페이지의 nav 우측에 인증 상태별 UI를 **동적 주입**:
- 로그인 안 됨 → `<button class="nav-login">로그인</button>`
- 로그인 됨 → `<button class="user-chip">[아바타] [닉네임]</button>` + dropdown

### v124 변경: CSS 자체 주입
`auth-ui.js`는 페이지 로드 시 `<style id="dv-auth-ui-styles">`를 자동 주입합니다.
즉, **어떤 페이지든** `<nav class="row">`만 있으면 정상 작동합니다.

이전에는 각 HTML에 CSS가 별도로 정의되어 있었고, 일부 페이지(invite, terms 등)에서 CSS 누락으로 디자인이 깨지는 문제가 있었습니다.

### Dropdown 메뉴 항목
```
[프로필]
─────────
내가 그린 결    → /history
이용약관       → /terms
개인정보처리방침 → /privacy
─────────
로그아웃
```

### 카카오 CTA 버튼 자동 wiring
모든 `.btn-kakao` 클래스에 자동으로 클릭 핸들러 추가:
- 로그인 됨 → `/upload`로 이동
- 로그인 안 됨 → `dvAuth.login()` 호출

→ 새 페이지에 카카오 CTA를 추가하려면 `class="btn-kakao"`만 붙이면 됨.

---

## 6. 페이지 상태 (URL 파라미터)

### 디자인 리뷰용 상태 시뮬레이션

각 페이지는 URL 파라미터로 다양한 상태를 미리보기 가능합니다.

#### `/history`
- `?state=empty` — 분석 이력 0개 상태
- `?state=loading` — 데이터 로딩 중 스켈레톤

#### `/invite`
- `?state=empty` — 초대 0건 상태 (카운터 0/0/0)
- `?state=loading` — 데이터 로딩 중 (카운터 `–`)

#### `/upload` (개발용 - 실제 사용자에게는 노출 안 됨)
- `?test=loading` — 분석 진행 화면 (정상 흐름)
- `?test=complete` — 분석 완료 화면
- `?test=full` — 분석 → 완료 전체 시뮬레이션
- `?test=error-server` — 5xx 에러
- `?test=error-timeout` — 타임아웃
- `?test=error-network` — 네트워크 끊김
- `?test=error-unknown` — 알 수 없는 에러
- `?test=offline` — 오프라인 배너

#### `/report`
- `?error=not_found` — 분석 없음
- `?error=expired` — 만료됨 (3일 정책)
- `?error=unauthorized` — 권한 없음
- `?error=server` — 서버 에러
- `?error=unknown` — 알 수 없는 에러

### Placeholder 데이터 시뮬레이션 (v124)

#### `/upload`
- `?partner=동훈` — "결이 궁금한 상대" 입력 필드 자동 채우기

#### `/report`
- `?partner=동훈` — 페이지 안의 모든 "지훈" → "동훈" 치환 (TreeWalker 기반)

```
예: https://deepvibe-phi.vercel.app/report?partner=동훈
→ Hero subtitle, SIGNAL, TEMPO, STYLE, D-Day 위젯, Share Modal의
   모든 "지훈" 텍스트가 "동훈"으로 표시됨
```

치환 작동 원리는 `report.html`의 `replaceTextNodes()` 함수 참고.

---

## 7. 동적 OG 이미지 (api/og.tsx)

### 작동 방식
Vercel Edge Function이 SVG로 OG 이미지를 동적 생성합니다.

```
/api/og?type=index   → 랜딩용 OG (deepvibe 워드마크 중심)
/api/og?type=upload  → 업로드 페이지용 OG (분석 시작 카피)
/api/og?type=report  → 리포트 카드 미리보기 (분석 결과 형태)
```

### 의존성
- `@vercel/og` v0.6.3 (`package.json`)
- `fonts/Fraunces-Italic.ttf` (Edge 함수가 fetch)
- 한글 폰트: Google Fonts CSS API에서 동적 로드 (Noto Sans KR)

### 캐시 정책
- `Cache-Control: public, immutable, max-age=86400, stale-while-revalidate=604800`
- 1일 fresh + 7일 stale → 트래픽 비용 최소화

### 변경 시 주의사항
- `Fraunces-Italic.ttf` 경로는 **same-origin 절대 URL**이어야 함
- 새 OG 타입 추가 시 `getMiniCard()` 또는 `getHeroCard()` 함수 추가
- 정적 폴백 PNG (`og-*.png`)도 함께 갱신 권장 (메신저 일부는 정적 우선)

---

## 8. 디자인 시스템 (요약)

### 색상 토큰 (CSS Variables)

각 HTML의 `:root`에 정의 (이론적으로 모든 페이지 동일):

```css
--ink: #1a1419;        /* 메인 텍스트 */
--ink-2: #2e2630;      /* 보조 텍스트 (검정 90%) */
--muted: #756876;      /* 회색 (약한 텍스트) */
--muted-2: #b8acba;    /* 더 회색 (handle 등) */

--bg: #f4eee9;         /* 배경 (베이지) */
--bg-soft: #ebe4dd;    /* 살짝 진한 배경 */

--line-04: rgba(20,10,30,.04);
--line-08: rgba(20,10,30,.08);
--line-12: rgba(20,10,30,.12);
--line-18: rgba(20,10,30,.18);

--pink: #ff9fbc;
--violet: #cdb4ff;

--kakao: #fee500;
--kakao-ink: #181600;

--danger: #d04a4a;
```

### 폰트
- **Sans (UI)**: `Pretendard, system-ui, -apple-system, ...` (한국어 기본)
- **Serif (강조)**: `Fraunces, serif` (variable, opsz axis 사용)
- **Caveat (액센트)**: 손글씨 느낌의 카피 (영문만)

### Variable Font: Fraunces의 opsz axis

브랜드 DNA. 반드시 적용:
```css
.hero-wordmark em {
  font-family: 'Fraunces', serif;
  font-variation-settings: 'opsz' 144, 'wght' 400;
  /* opsz 144 = 큰 디스플레이 사이즈에 최적화된 형태 */
}

nav .word {
  font-family: 'Fraunces', serif;
  font-variation-settings: 'opsz' 18, 'wght' 400;
  /* opsz 18 = 작은 사이즈에 최적화 */
}
```

opsz를 빼면 폰트가 완전히 달라 보입니다.

### 통일 컴포넌트 (v124)

- `.page-back` — 서브 페이지 상단 "← 이전" 버튼 (history, report, invite)
- `.btn-kakao` — 카카오 노란색 CTA 버튼 (auth-ui.js가 자동 wiring)
- `.toast` — 우하단 토스트 (safe-area 대응)
- `.consent-modal`, `.dday-modal`, `.share-modal` — 동일 슬라이드업 패턴

---

## 9. 백엔드 연동 지점 (다음 단계)

### 9.1 인증
**파일**: `auth.js`

```js
// 현재 (placeholder):
const KAKAO_KEY = null;

// 변경 후:
const KAKAO_KEY = 'YOUR_KAKAO_JAVASCRIPT_KEY';
```

추가로 백엔드 API 연동이 필요한 경우:
```js
// auth.js의 successHandler 내부에서:
// 1. 카카오 access_token을 백엔드로 전송
// 2. 백엔드가 자체 JWT 발급
// 3. JWT를 localStorage에 저장
// 4. 이후 모든 API 호출에 Authorization 헤더 추가
```

### 9.2 분석 시작 (/upload)
**파일**: `upload.html` (line 약 1950-2050)

현재 mock 분석 (5초 setTimeout). 실제 구현:

```js
// btnAnalyze 클릭 시:
const formData = new FormData();
formData.append('partner_name', partnerInput.value);
formData.append('file', fileInput.files[0]);

fetch('/api/analyze', {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${jwt}` },
  body: formData,
})
.then(res => res.json())
.then(({ report_id }) => {
  // showComplete()에 reportUrl 전달
  showComplete(`/report?id=${report_id}`);
})
.catch(err => {
  // 에러 종류에 따라 showAnalyzingError('server' | 'timeout' | 'network' | 'unknown')
});
```

### 9.3 분석 결과 (/report)
**파일**: `report.html` (현재 모든 데이터 하드코딩)

```js
// 페이지 로드 시:
const reportId = urlParams.get('id');
if (!reportId) {
  showReportError('not_found');
  return;
}

fetch(`/api/report/${reportId}`, {
  headers: { 'Authorization': `Bearer ${jwt}` },
})
.then(res => {
  if (res.status === 401) throw 'unauthorized';
  if (res.status === 404) throw 'not_found';
  if (res.status === 410) throw 'expired';
  if (res.status >= 500) throw 'server';
  return res.json();
})
.then(data => renderReport(data))
.catch(err => showReportError(typeof err === 'string' ? err : 'unknown'));
```

`renderReport(data)` 함수는 새로 작성 필요. 현재 HTML의 하드코딩 값들을 `data`의 필드로 치환.

### 9.4 분석 이력 (/history)
**파일**: `history.html` (현재 mock 카드 3개 하드코딩)

```js
fetch('/api/history', {
  headers: { 'Authorization': `Bearer ${jwt}` },
})
.then(res => res.json())
.then(({ items }) => {
  if (items.length === 0) {
    document.body.classList.add('is-empty');
  } else {
    renderHistoryCards(items);  // 새로 작성
  }
});
```

### 9.5 친구 초대 (/invite)
**파일**: `invite.html`

필요한 API:
- `GET /api/invite/stats` — 보낸/가입/받음 카운터
- `GET /api/invite/list` — 초대 카드 리스트
- `POST /api/invite/create` — 초대 링크 생성 (현재 mock: `deepvibe.app/i/AB7K2X`)
- `POST /api/invite/resend` — 다시 보내기

### 9.6 D-Day 위젯
**파일**: `report.html` (D-Day 모달 + iOS Lock Screen 위젯 가이드)

위젯 자체는 iOS Shortcut + 사용자 설정. 백엔드는:
- 사용자의 D-Day 시작일 저장 + 조회
- 자동 재분석 일정 알림 (50일, 100일, 200일, 1000일)

---

## 10. 배포

### Vercel 배포
1. GitHub Desktop으로 `vercel-deploy/` 변경사항 push
2. Vercel이 자동 감지 → 빌드 → 배포
3. `https://deepvibe-phi.vercel.app` 에서 확인

### vercel.json 주요 설정
```json
{
  "cleanUrls": true,        // .html 확장자 자동 제거
  "trailingSlash": false,
  "headers": [
    // 보안: nosniff, SAMEORIGIN, strict-origin
    // 캐시: SVG/PNG는 immutable 1년
  ]
}
```

### 환경 변수
현재 없음. 카카오 OAuth 연동 시 추가 예정:
- `KAKAO_JAVASCRIPT_KEY` (Vercel 환경 변수)

---

## 11. 개발 시 주의사항

### 카피 변경
- 모든 한국어 카피는 PM/디자이너 확인 후 변경
- 마침표 일관성: 완결 문장은 `.` 포함, 명사구는 생략
- "결" / "그리다" / "한 편의 리포트" 등 시그너처 어휘 보존

### 새 페이지 추가 체크리스트
1. ✓ `<nav class="row">` + logo 포함
2. ✓ `<main>` 시멘틱 사용
3. ✓ 서브 페이지면 `<div class="page-back">` 포함
4. ✓ `<script src="auth.js" defer>` + `<script src="auth-ui.js" defer>`
5. ✓ OG 메타 태그 (`og:image`는 `/api/og?type=...` 사용)
6. ✓ 디자인 토큰만 사용 (`--ink`, `--bg`, `--kakao` 등)

### 데이터 하드코딩 위치
모든 placeholder 데이터는 다음 위치에 있습니다:
- `/upload` Hero: "민지님" (line ~1511)
- `/report`: "지훈" (7곳), "민지" (1곳), 점수/날짜/메시지 수 다수
- `/history`: 카드 3개 mock (지훈/채린/동훈)
- `/invite`: 카운터 3/1/1 + 카드 3개 mock + 초대 코드 "AB7K2X"

백엔드 연동 시 모두 동적 데이터로 교체 필요.

### 의도된 디자인 결정
다음은 "버그처럼 보이지만 의도된" 디자인입니다. 수정하지 마세요:
- `index.html`의 hero 워드마크 (`deep`, `vibe`) — Fraunces italic 큰 사이즈
- 카드별 다른 `border-radius` (14/18/20px) — 위계 차이
- 카드별 다른 `box-shadow` 층수 (1/2/3) — 위계 차이
- 모달의 `border-top-left-radius: 24px` (slide-up 모달의 시그너처)

---

## 12. 디자인 시스템 문서

상세한 디자인 시스템 문서는 별도 파일 참조:
- `deepvibe_design_system_v125.md` (1044 lines)
- 색상, 폰트, 컴포넌트, 원칙, 변경 이력 포함

---

## 13. 주요 변경 이력

| 버전 | 주요 변경 |
|---|---|
| v124 | 동적 OG, 점수 표시 제거, page-back 통일, placeholder 동적 치환, auth-ui.js CSS 자체 주입 |
| v123 | Share Modal, 초대 시스템 (/invite), D-Day 모달 |
| v122 | 분석 결과 7카드 완성 |
| v121 | 분석 진행 화면 (orbit + stages) |

---

## 14. 도움이 필요할 때

- **디자인 관련**: PM/디자이너에게 문의 (`deepvibe_design_system_v125.md` 우선 참고)
- **카피 변경**: PM 확인 필수
- **백엔드 연동**: 위 섹션 9 참고
- **배포 이슈**: Vercel 대시보드 확인
