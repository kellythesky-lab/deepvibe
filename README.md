# deepvibe — Vercel 배포 가이드 (v123)

## 폴더 구성

```
vercel-deploy/
├── index.html              ← 랜딩
├── upload.html             ← 파일 업로드 + 에러 상태
├── report.html             ← 분석 결과 (7개 카드)
├── history.html            ← 분석 이력 (3가지 상태)
├── invite.html             ← 친구 초대 (v123 신규)
├── terms.html              ← 이용약관
├── privacy.html            ← 개인정보처리방침
├── refund.html             ← 환불정책
│
├── auth.js                 ← Kakao OAuth 모듈
├── auth-ui.js              ← Nav + Sticky CTA + 페이지 가드
├── favicon.svg             ← 탭/홈화면 아이콘
│
├── api/
│   └── og.tsx              ← 동적 OG 이미지 Edge Function ⭐
├── package.json            ← @vercel/og 의존성 ⭐
│
├── og-index.png            ← Fallback OG (정적, 백업)
├── og-upload.png           ← Fallback OG (정적, 백업)
├── og-report.png           ← Fallback OG (정적, 백업)
│
├── vercel.json             ← cleanUrls + 캐시 + 보안 헤더
└── README.md
```

---

## 🚀 배포 — GitHub + Vercel

### 일반 페이지
1. ZIP의 모든 파일을 로컬 리포지토리에 **덮어쓰기**
2. GitHub Desktop → Commit + Push
3. Vercel 30초~1분 후 자동 배포

URL: `https://deepvibe-phi.vercel.app/`

### 동적 OG 이미지 (v124 신규)

@vercel/og 패키지가 자동 설치되며, Edge Function이 자동 배포됩니다.

OG 이미지 URL:
```
https://deepvibe-phi.vercel.app/api/og?type=index
https://deepvibe-phi.vercel.app/api/og?type=upload
https://deepvibe-phi.vercel.app/api/og?type=report
```

- 첫 요청 시 ~500ms (cold start)
- 이후 캐싱 (24시간) → 즉시 응답

---

## 🎨 동적 OG의 장점

1. **사이트와 100% 동일한 워드마크**
   - Google Fonts CDN에서 Fraunces Variable 직접 fetch
   - HTML/CSS 그대로 SVG 변환 → PNG

2. **실시간 업데이트**
   - 카피 변경 시 자동 반영
   - PNG 재생성 불필요

3. **캐싱**
   - 같은 파라미터 → CDN 캐시

---

## 🔐 Kakao OAuth — Phase 1 (현재)

`auth.js`의 `KAKAO_APP_KEY`는 **placeholder**:
- 카카오 로그인 버튼 클릭 → mock 로그인 ("민지")
- localStorage에 사용자 정보 저장
- `/upload`로 리디렉션
- 페이지 가드 **비활성**

---

## ⚙️ Phase 2 — 실제 카카오 키 적용

### 1단계: 카카오 디벨로퍼 콘솔
1. https://developers.kakao.com 접속
2. **내 애플리케이션** → **추가**
3. **앱 키**에서 **JavaScript 키** 복사

### 2단계: 플랫폼 등록
- **Web 플랫폼** 등록
- 사이트 도메인: `https://deepvibe-phi.vercel.app`

### 3단계: 카카오 로그인 활성화
- **카카오 로그인** ON
- 동의항목: 닉네임(필수), 프로필 사진(선택)

### 4단계: 키 적용
`auth.js` 18행 부근:
```javascript
const KAKAO_APP_KEY = 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx';
```

### 5단계: 재배포 → 페이지 가드 자동 활성화

---

## 🧪 테스트 시나리오

### Mock 로그인 (Phase 1)
1. `/` 방문 → "로그인" 버튼
2. 클릭 → "민지"로 mock 로그인
3. `/upload` 자동 이동
4. nav 칩 클릭 → "내가 그린 결" / "로그아웃"

### 동적 OG 미리보기
1. Vercel 배포 후 `/api/og?type=index` 직접 방문
2. 1200x630 PNG 즉시 표시

### SNS 공유 미리보기
1. https://www.opengraph.xyz/ 또는 카카오톡 채팅 입력창
2. URL 붙여넣기 → 미리보기 확인

---

## 🐛 알려진 이슈

| 문제 | 원인 | 해결 |
|---|---|---|
| OG 첫 로드 느림 | Edge cold start | 1회 워밍 후 캐싱됨 |
| Mock 로그인 영구 지속 | localStorage 영속성 | DevTools → 클리어 |
| 시크릿 모드 로그인 실패 | localStorage 차단 | in-memory fallback |

---

## 🆘 OG fallback

동적 OG 실패 시 정적 PNG fallback:
- `og-index.png` / `og-upload.png` / `og-report.png`

---

## 끝

v123 = 출시 준비 완료
v124 = 동적 OG + 친구 초대 + 카피 마이크로 튜닝
