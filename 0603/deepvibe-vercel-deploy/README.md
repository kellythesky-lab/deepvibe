# deepvibe

> 두 사람 사이에 흐르는 결을 그리는 AI 관계 분석 서비스
>
> 카카오톡 대화를 올리면, 호감도·답장 속도·말투 변화 등을 한 편의 리포트로 그려드려요.

**버전**: v124 · **상태**: 디자인 + 프론트엔드 완성, 백엔드 미연동

배포: [deepvibe-phi.vercel.app](https://deepvibe-phi.vercel.app/)

---

## 빠른 시작

### 처음 합류하는 개발자라면

1. 이 README를 끝까지 읽기 (5분)
2. **[`deepvibe_developer_guide.md`](./deepvibe_developer_guide.md)** 읽기 (15분) — 아키텍처, API, 백엔드 연동 지점
3. 로컬에서 `index.html`을 브라우저로 열어 페이지 확인
4. 디자인 변경 시 **[`deepvibe_design_system_v125.md`](./deepvibe_design_system_v125.md)** 참고

### 로컬 미리보기

```bash
# Python (간단)
python3 -m http.server 3000

# 또는 Node
npx serve .
```

→ `http://localhost:3000` 접속

> ⚠️ `/api/og` (동적 OG)는 Vercel Edge Function이므로 로컬에서는 작동 안 함. 정적 fallback (`og-*.png`)로 대체됩니다.

---

## 📂 파일 구조

```
vercel-deploy/
├── index.html              ← 랜딩 (Sticky CTA, FAQ, JOURNEY 카드)
├── upload.html             ← 파일 업로드 + 분석 진행
├── report.html             ← 분석 결과 (7카드 + D-Day/Share 모달)
├── history.html            ← 분석 이력 (3가지 상태)
├── invite.html             ← 친구 초대 + 보너스 관리
├── terms.html              ← 이용약관 (placeholder)
├── privacy.html            ← 개인정보처리방침 (placeholder)
├── refund.html             ← 환불정책 (placeholder)
│
├── auth.js                 ← Kakao OAuth 코어 모듈 (window.dvAuth)
├── auth-ui.js              ← Nav UI 동적 주입 (CSS 자체 포함, v124)
├── favicon.svg
│
├── api/
│   └── og.tsx              ← 동적 OG 이미지 (Vercel Edge Function)
├── package.json            ← @vercel/og 의존성만
├── vercel.json             ← cleanUrls + 보안 헤더 + 캐시
│
├── fonts/
│   └── Fraunces-Italic.ttf ← OG에서 사용 (변수 폰트, opsz axis)
│
├── og-index.png            ← OG 정적 fallback
├── og-upload.png
├── og-report.png
│
├── deepvibe_developer_guide.md      ⭐ 개발자 가이드
└── deepvibe_design_system_v125.md   ⭐ 디자인 시스템
```

---

## 🚀 배포

GitHub Desktop으로 push → Vercel 자동 배포 (30초~1분)

배포 URL: `https://deepvibe-phi.vercel.app/`

### vercel.json 주요 설정
- `cleanUrls: true` — `.html` 확장자 자동 제거
- 보안 헤더: `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`
- 정적 자산 캐시: SVG/PNG는 1년 immutable

---

## 🔐 인증 모드

### Placeholder 모드 (현재)

`auth.js` 상단의 `KAKAO_APP_KEY`가 `null` → mock 로그인:

- 카카오 버튼 클릭 → 가상의 사용자 "민지"로 즉시 로그인
- localStorage에 저장 → 다음 페이지부터 로그인된 상태
- 페이지 가드 비활성 → 비로그인 상태에서도 모든 페이지 접근 가능
- 디자인 리뷰에 편함

### Production 전환 (다음 단계)

자세한 절차는 [`deepvibe_developer_guide.md` § 9.1](./deepvibe_developer_guide.md) 참고. 요약:

1. [Kakao Developers](https://developers.kakao.com) 앱 등록
2. Web 플랫폼 등록 (도메인: `https://deepvibe-phi.vercel.app`)
3. 동의항목: 닉네임(필수), 프로필 사진(선택)
4. `auth.js`의 `KAKAO_APP_KEY` 변경
5. 재배포 → 페이지 가드 자동 활성화

---

## 🎨 디자인 시스템

상세 문서: [`deepvibe_design_system_v125.md`](./deepvibe_design_system_v125.md)

### 핵심 토큰
- 색상: `--ink` (검정), `--bg` (베이지), `--kakao` (노란색), `--pink`, `--violet`
- 폰트: Pretendard (UI), Fraunces (강조 - opsz axis 필수)
- 컴포넌트: `.btn-kakao`, `.page-back`, `.card`, `.toast`, `.consent/dday/share-modal`

### 시그너처 어휘
- "결" / "그리다" / "한 편의 리포트" — PM 확인 없이 변경 금지

---

## 🧪 페이지 상태 시뮬레이션

디자인 리뷰 시 URL 파라미터로 다양한 상태 미리보기:

### `/history`
```
?state=empty      ← 분석 0개
?state=loading    ← 스켈레톤
```

### `/invite`
```
?state=empty      ← 초대 0건
?state=loading    ← 로딩 중
```

### `/upload` (개발용)
```
?test=loading           ← 분석 진행
?test=complete          ← 완료 화면
?test=full              ← 전체 시뮬레이션
?test=error-server      ← 5xx 에러
?test=error-timeout     ← 타임아웃
?test=error-network     ← 네트워크
?test=error-unknown     ← 알 수 없음
?test=offline           ← 오프라인 배너
```

### `/report`
```
?error=not_found        ← 분석 없음
?error=expired          ← 만료 (3일)
?error=unauthorized     ← 권한 없음
?error=server           ← 서버 에러
?error=unknown          ← 알 수 없음
```

### Placeholder 데이터 치환 (v124)
```
/upload?partner=동훈    ← 입력 필드 자동 채우기
/report?partner=동훈    ← 모든 "지훈" → "동훈" 동적 치환
```

전체 상태 매트릭스: [`deepvibe_developer_guide.md` § 6](./deepvibe_developer_guide.md)

---

## 🖼️ 동적 OG 이미지

Vercel Edge Function이 사이트와 동일한 디자인의 OG 이미지를 동적 생성:

```
https://deepvibe-phi.vercel.app/api/og?type=index
https://deepvibe-phi.vercel.app/api/og?type=upload
https://deepvibe-phi.vercel.app/api/og?type=report
```

### 작동 방식
- `@vercel/og` v0.6.3 (Satori 기반)
- Fraunces 폰트: same-origin (`/fonts/Fraunces-Italic.ttf`) fetch
- 한글 폰트: Google Fonts CSS API에서 동적 로드 (Noto Sans KR)
- 캐시: 24시간 fresh + 7일 stale-while-revalidate

### Fallback
동적 OG 실패 시 정적 PNG (`og-index.png` 등). 일부 메신저는 정적 PNG를 우선시함.

---

## ✅ 현재 상태

### 완성됨 (v124)
- ✓ 5개 메인 페이지 (index, upload, report, history, invite) 디자인
- ✓ Kakao OAuth placeholder 모드 + 인증 UI
- ✓ 동적 OG 이미지 (Edge Function)
- ✓ 페이지 상태 시뮬레이션 (empty / loading / error)
- ✓ Placeholder 데이터 동적 치환 (`?partner=`)
- ✓ Page-back 컴포넌트 통일 (서브 페이지)
- ✓ Auth UI CSS 자체 주입 (어떤 페이지에서도 정상 표시)
- ✓ iOS safe-area 대응 (sticky CTA, toast)
- ✓ `prefers-reduced-motion` 접근성

### 비즈 결정 대기 (placeholder)
- 사업자 정보 + 통신판매업 신고번호
- 이용약관 / 개인정보처리방침 / 환불정책 (법률 검토)
- 결제 모델 + 가격 정책 → "무료" 카피 조정
- 실제 분석 소요 시간 → 카피 반영
- AI 모델 선택 → FAQ 정확성 카피
- 카카오 검수 (친구 권한 필요)

### 백엔드 미연동
- 분석 API (현재 5초 setTimeout mock)
- 분석 결과 데이터 (현재 모두 하드코딩)
- 분석 이력 / 친구 초대 API
- D-Day 위젯 사용자 설정 저장

상세: [`deepvibe_developer_guide.md` § 9](./deepvibe_developer_guide.md)

---

## 🐛 알려진 이슈

| 문제 | 원인 | 해결 |
|---|---|---|
| OG 첫 로드 ~500ms | Edge cold start | 1회 워밍 후 캐싱됨 (24h) |
| Mock 로그인 영구 지속 | localStorage 영속성 | DevTools → Application → Clear |
| 시크릿 모드 로그인 실패 | localStorage 차단 | in-memory fallback 작동 |
| 다크 모드 미지원 | 의도된 결정 | 베이지 톤이 브랜드 시그너처 |

---

## 📚 추가 문서

- **[`deepvibe_developer_guide.md`](./deepvibe_developer_guide.md)** — 개발자 온보딩, 아키텍처, 백엔드 연동 지점
- **[`deepvibe_design_system_v125.md`](./deepvibe_design_system_v125.md)** — 디자인 시스템, 색상/폰트/컴포넌트, 변경 이력

---

## 끝

질문/이슈는 PM 또는 디자이너에게 문의.
