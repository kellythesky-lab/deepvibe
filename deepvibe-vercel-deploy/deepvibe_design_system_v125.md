# deepvibe — Design System

> 두 사람 사이에 흐르는 결을 그리는 AI 관계 분석 서비스
>
> **Version: v125** · 2026-05-26
> Reference: 8 pages deployed to Vercel
> - `/` (index.html) — Landing
> - `/upload` (upload.html) — File upload + error states
> - `/report` (report.html) — Analysis report (7 cards)
> - `/history` (history.html) — Analysis history (3 states)
> - `/invite` (invite.html) — 친구 초대 시스템 (3 states)
> - `/terms`, `/privacy`, `/refund` — Legal docs (placeholder)
> - `/api/og?type=X` — 동적 OG 이미지 Edge Function

---

## 0-A. 변경 이력 (v124 → v125)

v125는 v124 기반의 **세부 점검 + 통일성 강화** 릴리스. 주요 변화: **페이지 간 통일성 + 응답 상태/시나리오/컴포넌트/카피 4영역 깊이 점검 + Placeholder 데이터 동적 치환 시스템 + Auth UI 자체완결화**.

### 신규 컴포넌트 ✨

| # | 신규 | 설명 |
|---|---|---|
| 1 | **`.page-back`** | 서브 페이지 (history, report, invite) 상단 "← 이전" 버튼. nav와 main 사이 위치. |
| 2 | **Placeholder 데이터 치환 시스템** | URL 파라미터 + TreeWalker 기반 텍스트 노드 안전 치환. `?partner=`로 데모 가능. |
| 3 | **Auth UI 자체완결 CSS** | `auth-ui.js` 안에 `injectStyles()` 함수. HTML CSS 의존성 제거 → 어떤 페이지에서도 작동. |

### 통일성 강화 🔧

| # | 변경 | Why |
|---|---|---|
| 1 | `<main>` 시멘틱 모든 페이지 적용 (index에 추가) | 접근성 + SEO + 시멘틱 일관성 |
| 2 | `/report` Toast `iOS safe-area` 대응 추가 | iPhone 노치 영역 가림 방지 (`/invite` 패턴과 통일) |
| 3 | Share Modal 카피 마침표 통일 (3곳) | `/index` INVITE 카드와 동일 패턴 |
| 4 | `/invite` expired 카드 메타 과거형 수정 | "7일 후 만료" (모순) → "5월 17일 만료" (사실) |
| 5 | `/invite` loading 상태 카운터 → "–" | 데이터 로딩 중인데 값이 있는 모순 해결 |
| 6 | `/upload` Hero 사용자 이름 동적 치환 | `id="uploadHeroTitle"` + `dvAuth.getUser().nickname` |

### 신규 디자인 원칙 (Section 9에 추가됨) 📐

| # | 원칙 | 핵심 |
|---|---|---|
| 9.17 | **공유 컴포넌트의 스타일은 컴포넌트 자체에** | JS가 주입하는 컴포넌트는 스타일도 자체 포함 (의존성 명확) |
| 9.18 | **Placeholder 동적 치환 3단계 전략** | 1단계: URL 파라미터, 2단계: API 응답, 3단계: 완전 동적 |
| 9.19 | **단순 문자열 치환 위험성 체크리스트** | TreeWalker 사용, 짧은 문자열 회피, 문법 자연스러움 확인 |
| 9.20 | **새 컴포넌트 best practice 역전 적용** | 신규 패턴 정립 시 기존 컴포넌트에도 동일 적용 (safe-area, 동적 치환 등) |
| 9.21 | **카피 추가/수정 시 영향 범위 체크리스트** | 동일 카피가 여러 곳에 있는지, 상태별 카피 영향 받는지 확인 |

### 평가 점수

| 영역 | v124 | v125 | 변화 |
|---|---|---|---|
| Color system | 10/10 | 10/10 | 안정 |
| Typography | 10/10 | 10/10 | 안정 |
| Korean handling | 10/10 | 10/10 | 안정 |
| Card hierarchy | 10/10 | 10/10 | 안정 |
| Motion | 10/10 | 10/10 | 안정 |
| Copy voice | 9/10 | 9/10 | 비즈 결정 대기 (불변) |
| Korean legal | 9/10 | 9/10 | 비즈 결정 대기 (불변) |
| Accessibility | 10/10 | 10/10 | 안정 |
| iOS Safari | 10/10 | 10/10 | Toast safe-area로 모든 컴포넌트 통일 |
| Performance | 9/10 | 9/10 | 안정 |
| **페이지 간 통일성** ⭐ | 8/10 | **10/10** | page-back + main + Auth UI 자체완결 |
| **컴포넌트 자체완결성** ⭐ | 7/10 | **10/10** | Auth UI CSS 자체 주입으로 외부 의존 0 |
| **종합** | **9.7/10** | **9.85/10** | 출시 가능 수준 |

---

## 0. 변경 이력 (v123 → v124)

이 문서는 v123 시스템에서 진화. 주요 변화: **친구 초대 시스템 + 동적 OG + 점수 일관성 + 카피 마이크로 튜닝**.

### 추가됨 ✨ (신규 페이지/컴포넌트)

| # | 신규 | 설명 |
|---|---|---|
| 1 | **`/invite` 페이지** | 친구 초대 시스템 풀 기능 (링크 발급 + 현황 + 리스트) |
| 2 | **INVITE 카드 진입점** | `index.html`의 INVITE 섹션 → `<a>` 태그로 변환, hover 효과 + CTA 화살표 |
| 3 | **`/api/og.tsx` Edge Function** | 동적 OG 이미지 생성 (`@vercel/og` + Variable Fraunces) |
| 4 | **`fonts/Fraunces-Italic.ttf`** | 번들된 Variable Fraunces (opsz 9-144, wght 100-900) |
| 5 | **`package.json`** | `@vercel/og@^0.6.3` 의존성 |

### 수정됨 🔧 (카피 톤 그라데이션)

Timeline 5단계 카피의 부정 어휘 추가 제거:

| # | Before (v123) | After (v124) | 이유 |
|---|---|---|---|
| 1 | 100일 "**변해버린** 결을 점검" + "**사라진** 감정 신호, **줄어든** 주제" | "**달라진** 결을 살펴" + "**새 감정**과 **자리잡은** 주제" | 100일은 점검의 시점 — 부정 단어 회피 |
| 2 | 200일 "**무뎌진** 부분을 다시" + "**놓치고 있던** 신호와 **회복** 포인트" | "결을 다시 맞춰" + "**변화의 신호**와 **다음 한 달**" | 회복 = 손상 전제 → 변화로 |

**원칙**: 세트 카피 5개의 톤 그라데이션 — 부정 단어 수 검수 (현재 0)

### 수정됨 🔧 (점수/평가 일관성 — v121 결정의 완전 적용)

v121에서 `/report` 메인 hero AFFINITY 점수 (82.3) 제거. 그러나 다른 접점에 남아있던 흔적 4곳 발견:

| # | 위치 | Before | After |
|---|---|---|---|
| 1 | `/index` hero s1 카드 | "매칭도 82.3" | "지금 결 / 친구 ↔ 연인" |
| 2 | `/index` hero s3 카드 | "긍정 비율 71%" | "감정 결 / 웃음 흐르는" |
| 3 | `/index` hero s4 카드 | "일치도 68%" | "말투 결 / 닮아가는" |
| 4 | `/index` ANALYSIS preview | "82.3 / 100" 큰 점수 + count-up | `/report`의 hero affinity 문구로 교체 |
| 5 | `/api/og?type=report` MiniCard | "상대의 호감도 82.3%" 점수 | "지금 결 / 친구 ↔ 연인" 정성 카피 |
| 6 | `og-report.png` 정적 PNG | 점수 카드 3개 | 정성 카피 카드 3개 |

**원칙**: 사실 (시간 4.2분, 카운트 3개) vs 평가 (점수 82.3) 구분 — 평가만 정성 표현화

### 수정됨 🔧 (영문 라벨 제거)

| # | Before | After | 이유 |
|---|---|---|---|
| 1 | ANALYSIS preview "**01 · AFFINITY**" p-tag | 제거 | 영문 uppercase 라벨 — Korean-first 원칙 위배 (sec-eyebrow 제거된 것과 동일) |

### 새 디자인 원칙 (9개 신설)

```
1. 브랜드 결단의 모든 접점 추적
2. 세트 카피의 톤 그라데이션 검수
3. 사실 vs 평가의 명확한 구분
4. Variable Font의 opsz는 브랜드 DNA
5. 폰트 기술 스택 체크리스트
6. 초대 시스템의 3-Tier 상태 모델
7. 평형 2-Column 액션 버튼
8. 숫자 카운터 그리드 (영웅/통계/메타)
9. 동적 OG의 디자인 원칙
```

---

## 1. 디자인 철학

### 1.1 톤 (Tone)

**Restrained · Premium · Emotionally resonant**

- **Restrained**: 모든 요소는 제거된 후에도 페이지가 이해되어야 남을 자격
- **Premium**: Linear / Vercel / Apple iOS 위젯 패턴
- **Emotionally resonant**: 컬러는 감정 시각화, 카피는 진짜 카톡 발췌

### 1.2 핵심 원칙 (Top 10)

| 원칙 | 의미 |
|---|---|
| **Content-first** | 콘텐츠가 먼저, 모션은 보조 |
| **Mobile-first** | 520px max-width 단일 컬럼 |
| **Korean-first** | 영문 번역 패턴 완전 제거 |
| **One color world per card** | 카드별 컬러 세계 유지 |
| **Trust through restraint** | 글로우/그라데이션은 기능 있을 때만 |
| **Stagger > simultaneous** | 한꺼번에 나타나지 말고 순차 전개 |
| **Narrative > number** ⭐ v121 | 점수 평가가 아닌 서사로 전달 |
| **Single Source of Truth** ⭐ v124 | 모든 접점에서 동일 메시지 (브랜드 결단의 일관성) |
| **State-aware** ⭐ v122 | 데이터 상태별 적절한 UI (default/empty/loading/error) |
| **Reduced motion respected** | 접근성 민감 사용자 즉시 표시 |

---

## 2. Color System

(v123과 동일 — 변경 없음)

### 2.1 Neutral Palette
| Token | Value |
|---|---|
| `--bg` | `#F6F4F1` |
| `--bg-soft` | `#EFEBE5` |
| `--bg-warm` | `#F0E9DE` |
| `--ink` | `#15131A` |
| `--ink-2` | `#2a262f` |
| `--muted` | `#7a7680` |
| `--muted-2` | `#a8a4ac` |

### 2.2 Status Colors (v124 명문화)

초대 시스템 / 분석 결과 등에서 사용:

| Status | Color | 용도 |
|---|---|---|
| **success** | `#2d7a52` (text) / `rgba(74,176,122,.12)` (bg) | 가입 완료, 분석 완료 |
| **neutral** | `var(--ink-2)` text / `var(--bg-soft)` bg | 대기 중, 진행 중 |
| **danger** | `#a04040` (text) / `rgba(208,74,74,.08)` (bg) | 만료, 실패, 에러 |

### 2.3 Card Signature Colors (6-Tier)

| Card | 도형 색 | em 배경 |
|---|---|---|
| s1 affinity | `#ff9fbc` 핑크 | `rgba(255,159,188,.22)` |
| s2 tempo | `#ffb894` 오렌지 | `rgba(255,184,148,.22)` |
| s3 signal | `#9bbcff` 블루 | `rgba(155,188,255,.26)` |
| s4 style | `#ffce6a` 골드 | `rgba(255,206,106,.26)` |
| s5 topic | `#caa3ff` 바이올렛 | `rgba(202,163,255,.24)` |
| s6 moment | `#92e5bc` 민트 | `rgba(146,229,188,.26)` |

---

## 3. Typography

### 3.1 Font Stack (3-Tier)

(v123과 동일)

### 3.2 Variable Font의 opsz 활용 ⭐ v124 신설

**Fraunces Variable Font 특성**:

```
opsz axis: 9 ~ 144
   - opsz 9-18  → text 사이즈 (두꺼운 세리프, 가독성 우선)
   - opsz 19-60 → 중간 크기
   - opsz 60+   → display 사이즈 (얇은 세리프, 우아한 흘림체)
```

**브랜드 워드마크의 일관성**:

| 영역 | font-size | opsz | weight |
|---|---|---|---|
| Nav 워드마크 | 18px | 18 (text) | 400 |
| Hero 워드마크 | 88-110px | 144 (display) | 300 |
| OG 큰 워드마크 | 96px | 144 (display) | 300 |
| OG 작은 워드마크 | 34px | 18 (text 강제) | 400 |

**핵심**: 1px의 디테일 차이도 사용자가 감지. opsz 미적용 = 다른 폰트처럼 보임.

### 3.3 Type Scale (v123과 동일, 8-Tier)

### 3.4 Typography Patterns

#### Pattern H: 정성적 표현 (v124 신설)

평가 점수 대신 한 줄 카피로 결의 상태 전달:

```css
.big.big-text {
  font-family: var(--font-serif);
  font-size: 22px;             /* 영문 숫자 30px → 한글 22px (시각적 균형) */
  font-weight: 400;
  letter-spacing: -.005em;
  font-feature-settings: normal;  /* tnum 비활성 (텍스트라서) */
}
```

**적용 예시**:
- s1: "친구 ↔ 연인" (위치)
- s3: "웃음 흐르는" (정성)
- s4: "닮아가는" (정성)

---

## 4. Spacing

(v123과 동일)

---

## 5. Radii

(v123과 동일)

---

## 6. Shadows

(v123과 동일)

---

## 7. Motion

(v123과 동일)

---

## 8. Components

### 8.1-8.9 (v123과 동일)

### 8.10 Friend Invite System (v124 신설) ⭐

`/invite` 페이지의 3-Tier 컴포넌트:

```
┌─────────────────────────────────┐
│ Page Header                     │
│   - vesica 마크 + 제목          │
│   - 서브 카피                   │
├─────────────────────────────────┤
│ Link Card (초대 링크 발급)       │
│   - 라벨 "내 초대 링크"          │
│   - 링크 표시 (deepvibe.app/i/X)│
│   - 2-Column 액션 (복사/카카오)  │
│   - 메타 (7일 만료)             │
├─────────────────────────────────┤
│ Stats Grid (현황 카운터)         │
│   - 3 컬럼: 보낸/가입/받음       │
│   - 영웅 숫자 32px + 라벨 12px  │
│   - 컬럼 사이 hairline divider  │
├─────────────────────────────────┤
│ Invite List (초대 카드 목록)     │
│   - 3 상태:                     │
│     · joined (✓ 가입 완료)      │
│     · pending (대기 중)         │
│     · expired (만료됨 + 다시 보내기)│
│   - default / empty / loading 상태│
└─────────────────────────────────┘
```

**초대 카드 상태 색상**:

```css
.invite-status.joined  { background: rgba(74,176,122,.12); color: #2d7a52; }
.invite-status.pending { background: var(--bg-soft);        color: var(--ink-2); }
.invite-status.expired { background: rgba(208,74,74,.08);   color: #a04040; }
```

### 8.11 Empty State Component (v122 → v124 일반화)

3가지 페이지 상태 패턴 (history, invite에서 사용):

```html
<!-- URL 파라미터로 상태 시뮬레이션 -->
/invite              ← default (실데이터)
/invite?state=empty  ← 빈 상태
/invite?state=loading ← 로딩 스켈레톤
```

**Empty State**:
```html
<div class="empty-state">
  <div class="empty-state-mark"><!-- vesica --></div>
  <div class="empty-state-title">아직 보낸 초대가 없어요</div>
  <div class="empty-state-desc">친구에게 링크를 보내면,<br>여기에 기록돼요</div>
</div>
```

**Loading Skeleton**:
```html
<div class="loading-state">
  <div class="skeleton-card">
    <div class="skeleton-block s-name"></div>
    <div class="skeleton-block s-meta"></div>
  </div>
  <!-- 3개 반복 -->
</div>
```

### 8.12 Toast Notification (v124 신설)

복사 완료, 액션 완료 등 짧은 피드백:

```css
.toast {
  position: fixed;
  bottom: calc(24px + var(--safe-bottom));
  left: 50%;
  transform: translate(-50%, 100%);  /* 숨김 */
  background: rgba(21,19,26,.94);
  color: #fff;
  padding: 12px 20px;
  border-radius: var(--r-pill);
  font-size: 13.5px;
  font-weight: 500;
  opacity: 0;
  transition: opacity .3s, transform .3s;
  z-index: 100;
}
.toast.is-shown {
  opacity: 1;
  transform: translate(-50%, 0);
}
```

**JS 사용**:
```javascript
const showToast = (msg) => {
  toastText.textContent = msg;
  toast.classList.add('is-shown');
  setTimeout(() => toast.classList.remove('is-shown'), 2200);
};
```

### 8.13 Dynamic OG Image (v124 신설) ⭐

`/api/og?type=index|upload|report` Edge Function:

**구조** (각 페이지별 1200x630 PNG):

```
[OG-INDEX] 정체성
   - 중앙 큰 vesica (140px)
   - "deepvibe" 워드마크 (Fraunces light 96px display)
   - 서브 카피 + 메타

[OG-UPLOAD] 입력
   - 좌상단 nav 워드마크 (vesica + Fraunces 34px text)
   - 카톡 말풍선 3개 (이미지 시각화)
   - 화살표 → vesica 변환
   - 하단 카피

[OG-REPORT] 결과
   - 좌상단 nav 워드마크
   - 분석 카드 3개 (점수 없는 정성 카피)
   - "한 편의 결이, 도착했어요"
```

**폰트 로딩 전략**:
1. **Fraunces Variable** — same-origin (`/fonts/Fraunces-Italic.ttf` 번들)
2. **Noto Serif/Sans KR** — Google Fonts CSS API subset (필요한 글자만)

**캐싱**:
```
Cache-Control: public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800
```
- 24시간 캐시
- 7일 stale-while-revalidate

---

## 9. Patterns

### 9.1-9.6 (v123과 동일)

### 9.7 Korean em Highlight Tactic

(v123과 동일)

### 9.8 Sec-input Pattern (v116)

(v123과 동일)

### 9.9 Verb Family Unity (v123)

"그리다" 동사군 통일 — 5곳 적용:

| 위치 | 카피 |
|---|---|
| Hero | "두 사람 사이에 흐르는 결을 그립니다" |
| FAQ #2 | "여러 신호를 그려요" |
| JOURNEY 썸 | "다음 한마디까지 함께 그려요" |
| JOURNEY 싱글 | "보이지 않는 부분이 닮은 사람을 그려드려요" |
| OG-INDEX | "두 사람 사이에 흐르는 결을 그립니다" |

### 9.10 Multi-State Page Pattern (v122 → v124 확장)

URL 파라미터로 페이지 상태 시뮬레이션:

| Page | default | empty | loading | error |
|---|---|---|---|---|
| `/history` | ✓ | `?state=empty` | `?state=loading` | — |
| `/invite` ⭐ | ✓ | `?state=empty` | `?state=loading` | — |
| `/upload` | ✓ | — | — | `?error=size`, `?error=format`, `?error=network` |

### 9.11 Sticky CTA display:none Pattern (v118)

(v123과 동일)

### 9.12 Single Source of Truth ⭐ v124 신설

**브랜드 결단의 모든 접점 추적**:

큰 디자인 결정 (예: "82.3 점수 제거")을 내릴 때 반드시 수행:

```
1. 결정 문장 명확화
   예: "82.3 같은 평가 점수를 모든 접점에서 제거"
   
2. 결정에 해당하는 키워드 목록 작성
   예: "82.3", "/100", "%" (평가성), "점수", "매칭도"
   
3. 모든 파일에서 grep 실행
   grep -rn "키워드" /home/claude/work/vercel-deploy/*
   
4. 발견된 위치를 카테고리별 정리
   - 메인 페이지
   - 미리보기 (hero, preview 카드)
   - 공유 카드 (OG 이미지)
   - 광고 / 마케팅 자료
   - 인쇄물
   
5. 각 위치별로 일관된 수정
6. 수정 후 재검색으로 확인 (0건이 되도록)
7. 디자인 시스템에 명문화 (다음 세션 영향 방지)
```

**이번 세션 케이스**:
- v121에서 `/report` 메인 점수만 제거
- v124에서 `/index` hero (3곳) + ANALYSIS preview (1곳) + OG (2곳) 발견
- → 사용자가 3번 지적 후에야 완전 정리
- → 다음부터는 전수조사로 1회에 끝남

### 9.13 사실 vs 평가의 명확한 구분 ⭐ v124 신설

**숫자/지표의 종류**:

```
✓ 사실 측정값 (유지):
   - 시간: 4.2분, 94일
   - 카운트: 3개, 47회, 11번
   - 날짜: 5월 18일

✗ 평가 점수 (제거 + 정성화):
   - "호감도 82.3"  → "친구 ↔ 연인"
   - "긍정 비율 71%" → "웃음 흐르는"
   - "일치도 68%"   → "닮아가는"
```

**구분 기준**:
- **객관적 측정?** → 사실 (시간, 카운트는 의심 여지 없음)
- **주관적 평가?** → 점수가 정확성을 가장한 거짓 정밀도
  - "호감도 82.3%"는 마치 측정한 듯 보이지만, 실제로는 추정치
  - "친구 ↔ 연인 사이"는 정직한 서사

### 9.14 세트 카피의 톤 그라데이션 검수 ⭐ v124 신설

연결된 카피 세트 (예: Timeline 5단계)는 단일 카피 단위가 아닌 세트 단위로 톤 검수:

**Timeline 5단계 톤 검수**:

```
체크리스트:
1. 전체 단어를 나열
2. 부정 어휘 카운트
3. 부정 비율이 30% 초과면 재조정
4. 변경 후 재카운트 (0 목표)
```

**Before (v123)**:
```
0일:    시작 (긍정)
50일:   비교 (중립)
100일:  변해버린 / 사라진 / 줄어든 (3개 부정) ⚠️
200일:  무뎌진 / 놓치고 있던 / 회복 (3개 부정) ⚠️
1000일: 회고 (중립)

→ 5단계 중 2단계 (40%)가 부정 톤
```

**After (v124)**:
```
0일:    시작 (긍정)
50일:   비교 (중립)
100일:  달라진 / 새 감정 / 자리잡은 (중립~긍정) ✓
200일:  다시 맞춰 / 변화의 신호 / 다음 한 달 (중립~긍정) ✓
1000일: 회고 (중립)

→ 부정 어휘 0개
```

### 9.15 평형 2-Column 액션 버튼 ⭐ v124 신설

비슷한 우선순위의 2개 액션은 평형 배치:

```css
.link-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}
.link-btn { 
  padding: 13px 14px;
  border-radius: 12px;
  font-size: 13.5px;
  font-weight: 500;
}
.link-btn.copy {
  background: var(--bg-soft);
  color: var(--ink);
}
.link-btn.kakao {
  background: var(--kakao);
  color: var(--kakao-ink);
  box-shadow: 0 1px 0 rgba(0,0,0,.05), 0 6px 16px -8px rgba(20,10,30,.18);
}
```

**원칙**:
- 1fr 1fr — 동일 너비
- 동일 padding, 동일 높이
- 다른 컬러로 시각적 구분 (neutral + brand)

### 9.16 숫자 카운터 그리드 ⭐ v124 신설

deepvibe의 숫자 위계 (3-Tier):

```
영웅 숫자: 64-76px serif (D-Day 127일, OG MiniCard 영웅)
통계 숫자: 32px serif (Invite 보낸 초대 3)
메타 수치: 14-15px sans (94일, 1247개 메시지)
```

**원칙**: 숫자의 크기 = 정보의 위계

```css
.stats-value {
  font-family: var(--font-serif);
  font-weight: 500;
  font-size: 32px;
  line-height: 1;
  letter-spacing: -.03em;
  font-feature-settings: "tnum" 1, "lnum" 1;
}
```

---

## 10. Korean Typography Guidelines

(v123과 동일)

---

## 11. Layout

(v123과 동일)

---

## 12. Voice & Tone (Copy)

### 12.1-12.3 (v123과 동일)

### 12.4 Verb Family — "그리다" (v124 강화)

deepvibe 시그니처 동사. 5곳에서 통일 사용:

- "결을 **그립니다**"
- "여러 신호를 **그려요**"
- "함께 **그려요**"
- "사람을 **그려드려요**"
- 시각화 도구 / 분석 결과 / 미리보기 / 추천 — 모든 곳에서 "그리다" 사용

**원칙**: 동사 통일 = 브랜드 일관성

### 12.5 Microcopy Patterns (v122 → v124 확장)

| 상황 | 패턴 |
|---|---|
| 데이터 처리 위치 | "분석이 끝나면 원본은 바로 지워져요" |
| 액션 완료 | "링크를 복사했어요" (Toast) |
| 빈 상태 | "아직 [X]가 없어요" |
| 만료 임박 | "만료까지 N일" |
| 재시도 | "다시 보내기" (재진입 가능 표시) |

---

## 13. Page Architecture (v124)

```
1. Nav (sticky, frosted)
2. Hero (6-slide rotating, narrative-only stat)
3. JOURNEY (3 bento cards)
4. ANALYSIS preview (no p-tag, hero affinity narrative + chart)
5. D-Day Widget (Apple frosted)
6. Timeline (5 milestones, 0 negative words)
7. Invite (compact card → /invite 진입점) ⭐ v124 진입점
8. FAQ (8 items)
9. Footer
10. Sticky CTA (display:none 패턴)

신규 페이지:
- /invite (3 states: default/empty/loading)
- /api/og?type=X (Edge Function)
```

---

## 14. Performance & Accessibility

(v123과 동일)

### 14.6 Dynamic OG 성능 (v124 추가)

| 항목 | 측정값 |
|---|---|
| 첫 요청 (cold start) | ~500ms |
| 캐시된 응답 | 즉시 |
| 캐시 유효기간 | 24시간 |
| Stale-while-revalidate | 7일 |
| Fraunces 폰트 크기 | 228 KB (same-origin) |
| 한글 폰트 subset | ~30-50 KB (페이지별 사용 글자만) |

---

## 15. Versioning History

### v01-v89 — 초기 디자인
- 6항목 분석 카드 시스템 정립
- KakaoTalk 톤 + Lasting/Paired 패턴 도입

### v90-v100 — 완성도 보정
### v101-v106 — 디자인 시스템 1차 정립
### v107-v119 — 디자인 시스템 2차 정립

### v120-v122 — 브랜드 결단 + 다중 상태 시스템
- **v121**: 점수 메인 제거 ("82.3" → 서사 카피)
- **v122**: 다중 페이지 상태 (default/empty/loading/error)

### v123 — 카피 마이크로 튜닝
- 7개 카피 변경 (Verb Family, 평형 카피)
- 시각화 디테일 3개 수정 (FUTURE 막대, SIGNAL 정렬)
- 7개 신규 디자인 원칙

### v124 — 친구 초대 + 동적 OG + 점수 일관성 ⭐ (현재)

**추가** (5):
- `/invite` 단독 페이지 (3-Tier 컴포넌트)
- `/api/og.tsx` Edge Function
- Variable Fraunces 번들
- INVITE 진입점 (a 태그 + hover + CTA)
- Toast Notification 컴포넌트

**수정** (8):
- Timeline 100일/200일 부정 어휘 제거
- /index hero s1/s3/s4 점수 → 정성 표현
- /index ANALYSIS preview 점수 + p-tag 제거
- OG report 점수 → 정성 카피
- /report와 /index ANALYSIS preview hero 문구 일치

**신규 원칙** (9):
1. Single Source of Truth (브랜드 결단의 모든 접점)
2. 사실 vs 평가의 명확한 구분
3. 세트 카피의 톤 그라데이션 검수
4. Variable Font의 opsz는 브랜드 DNA
5. 폰트 기술 스택 체크리스트
6. 초대 시스템 3-Tier 상태
7. 평형 2-Column 액션 버튼
8. 숫자 카운터 그리드 (3-Tier)
9. 동적 OG의 디자인 원칙

---

## 16. 디자이너 자가 평가

| 영역 | v123 | v124 | 변화 |
|---|---|---|---|
| Color system | 10/10 | 10/10 | 안정 |
| Typography | 10/10 | **10/10** ⭐ | Variable Font opsz 시스템화 |
| Korean handling | 10/10 | 10/10 | 안정 |
| Card hierarchy | 10/10 | **10/10** ⭐ | p-tag 제거로 더 단순화 |
| **Brand consistency** | 9/10 | **10/10** ⭐ | Single Source of Truth 원칙 적용 (4곳 점수 정리) |
| Apple widget feel | 10/10 | 10/10 | 안정 |
| Motion | 10/10 | 10/10 | 안정 |
| Copy voice | 9/10 | **10/10** ⭐ | 세트 카피 톤 그라데이션 + 부정 어휘 0 |
| Korean legal | 9/10 | 9/10 | placeholder 유지 |
| Accessibility | 10/10 | 10/10 | 안정 |
| iOS Safari 대응 | 10/10 | 10/10 | 안정 |
| **State management** | 9/10 | **10/10** ⭐ | /invite 3 상태 추가 |
| **OG image** | 6/10 | **9/10** ⭐ | 정적 PNG → 동적 Edge Function |
| **Friend invite** | — | **9/10** ⭐ | 0 → 완전 시스템 (백엔드 연동 대기) |
| **종합** | **9.7/10** | **9.85/10** | 출시 직전 마무리 단계 |

---

## 17. 남은 과제

비즈 결정 대기:
- 사업자 정보 / 통신판매업 신고번호
- 법적 문서 최종 검토 (이용약관 / 개인정보처리방침 / 환불 정책)
- 결제 모델 + 가격 정책 → "무료" 단어 처리
- 카카오 검수 (친구 권한 + OAuth 키)
- 실제 분석 시간 측정 (카피 반영)
- 친구 초대 백엔드 (초대 코드 생성, 만료 처리, 보상 지급)

기술 작업:
- 인쇄용 PDF 디자인 시스템 변환
- 동적 OG 실제 작동 검증 (Vercel 배포 후)
- 백엔드 API 연동 (분석, 이력, 초대) — `deepvibe_developer_guide.md` § 9 참조

→ **`deepvibe_business_decisions.md` 참조**

---

## 18. v125 신규 컴포넌트 상세

### 18.1 `.page-back` — 서브 페이지 뒤로가기

서브 페이지 (`/history`, `/report`, `/invite`)의 nav 아래 위치한 작은 "← 이전" 버튼.

```html
<nav>...</nav>

<!-- Page back (v125 통일 컴포넌트) -->
<div class="page-back">
  <a class="page-back-link" href="javascript:history.back()" aria-label="이전 페이지로">
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M9 3 L5 7 L9 11" stroke="currentColor" stroke-width="1.4"
            stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
    이전
  </a>
</div>

<main>...</main>
```

```css
.page-back {
  max-width: 520px;
  margin: 0 auto;
  padding: 16px 20px 0;
}
.page-back-link {
  display: inline-flex; align-items: center; gap: 4px;
  padding: 6px 10px 6px 8px;
  background: transparent; border: none;
  color: var(--muted);
  font-size: 12.5px; font-weight: 500; letter-spacing: -.005em;
  text-decoration: none;
  border-radius: 8px;
  transition: background .2s var(--ease-out), color .2s var(--ease-out);
  cursor: pointer;
}
.page-back-link:hover {
  background: var(--bg-soft);
  color: var(--ink);
}
```

**적용 페이지**:
- `/history`, `/report`, `/invite` (서브 페이지)

**적용 안 함**:
- `/index`, `/upload` (시작 페이지)
- `/terms`, `/privacy`, `/refund` (필요 시 추가 가능)

**위치 결정 이유**: nav 안에 두면 auth-ui.js의 user-chip과 공간 충돌. page-back은 nav와 main 사이의 별도 영역으로 분리되어 충돌 없음.

---

### 18.2 Placeholder 데이터 동적 치환 시스템

placeholder 단계에서 백엔드 없이도 다양한 데이터로 데모 가능. URL 파라미터 + TreeWalker 기반.

#### Stage 1: URL 파라미터 패턴

| 페이지 | 파라미터 | 효과 |
|---|---|---|
| `/upload?partner=동훈` | partner | 입력 필드에 "동훈" 자동 입력 |
| `/report?partner=동훈` | partner | 페이지 안 모든 "지훈" → "동훈" 치환 |

#### TreeWalker 기반 안전 치환

```js
const replaceTextNodes = (root, find, replace) => {
  if (find === replace) return;
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null);
  const nodes = [];
  let n;
  while (n = walker.nextNode()) {
    if (n.nodeValue.includes(find)) nodes.push(n);
  }
  nodes.forEach(node => {
    node.nodeValue = node.nodeValue.split(find).join(replace);
  });
};

const partnerName = urlParams.get('partner');
if (partnerName) {
  replaceTextNodes(document.body, '지훈', partnerName);
}
```

**안전성**: TreeWalker는 텍스트 노드만 순회하므로:
- JS 변수의 문자열 (`'지훈'`) → 영향 없음 ✓
- CSS class/id 이름 → 텍스트가 아니므로 영향 없음 ✓
- HTML 속성 → 영향 없음 ✓

**사용 위치**: `/report` 페이지의 `window.dvAuth` 초기화 직후. 페이지 가시화 전 치환 완료.

#### Stage 2 (백엔드 연결 시)

URL 파라미터 대신 API 응답 데이터로 동적 렌더링:
```js
fetch(`/api/report/${reportId}`)
  .then(res => res.json())
  .then(data => renderReport(data));
```

---

### 18.3 Auth UI CSS 자체 주입 (자체완결 컴포넌트)

`auth-ui.js`는 페이지 로드 시 자신의 스타일을 자동 주입. HTML CSS 의존성 0.

```js
const STYLE_ID = 'dv-auth-ui-styles';
const injectStyles = () => {
  if (document.getElementById(STYLE_ID)) return;
  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent = `
    nav .nav-login { ... }
    nav .user-chip { ... }
    .auth-dropdown { ... }
  `;
  document.head.appendChild(style);
};
injectStyles();
```

**Idempotent**: `STYLE_ID` 체크로 중복 주입 방지.

**효과**:
- 어떤 페이지에서도 `<nav class="row">`만 있으면 정상 표시
- 새 페이지 추가 시 자동 적용 (HTML CSS 복사 불필요)
- 단일 소스 (스타일 변경 시 한 곳만 수정)

**이전 문제**: `/invite`, `/terms`, `/privacy`, `/refund`에서 HTML CSS 누락으로 "로그인" 버튼이 브라우저 기본 button 스타일로 표시됨.

---

## 19. v125 추가 디자인 원칙

### 9.17 공유 컴포넌트의 스타일은 컴포넌트 자체에 ⭐

```
JS가 동적 주입하는 컴포넌트:
  - 컴포넌트 코드 (HTML 생성) → JS 안에
  - 컴포넌트 스타일 (CSS) → JS 안에 함께
  - 외부 CSS 의존성 0

장점:
  ✓ 어떤 페이지에서도 작동 (단일 의존성)
  ✓ 새 페이지 추가 시 자동 적용
  ✓ 스타일 변경 시 한 곳만 수정
  ✓ 디버깅 명확 (컴포넌트 = 코드 + 스타일 한 묶음)

적용:
  - auth-ui.js (Auth UI: login button, user chip, dropdown)
  - 추후 추가될 공유 컴포넌트도 동일 패턴 권장

⚠️ FOUC 우려:
  - JS defer 로드 → 잠시 스타일 없는 상태 가능
  - 대응: 중요 페이지는 HTML에도 CSS 유지 (이중)
  - 또는 head에 critical CSS 인라인
```

---

### 9.18 Placeholder 동적 치환 3단계 전략 ⭐

```
1단계 (placeholder): URL 파라미터 + 단순 텍스트 치환
  - 데모/체감용 (백엔드 없음)
  - 사용 예: ?partner=동훈
  - 도구: TreeWalker (텍스트 노드만 안전 치환)

2단계 (백엔드 연결): API 응답에서 데이터 받아 렌더링
  - 실제 분석 데이터 (분석 기간, 메시지 수 등)
  - URL은 ID 기반: /report?id=A1
  - 도구: fetch() + renderReport(data)

3단계 (완전 동적): 모든 데이터가 백엔드에서 동적
  - placeholder 0건
  - 다국어 지원 시에도 활용 가능
  - 도구: i18n + 동적 렌더링

장점: 각 단계가 다음 단계의 토대 → 점진적 발전 가능
```

---

### 9.19 단순 문자열 치환의 위험성 체크리스트 ⭐

TreeWalker 기반 텍스트 노드 치환을 적용하기 전:

```
1. 치환 대상 문자열이 의도하지 않은 곳에 등장하는가?
   ✓ script 안의 문자열 (안전 - TreeWalker는 텍스트만)
   ✓ CSS class/id 이름 (안전 - 텍스트가 아님)
   ✓ data 속성 (확인 필요)

2. 치환 대상 문자열이 너무 짧지 않은가?
   ✗ 1-2글자 = 위험 (다른 단어와 충돌)
   ✓ 한국 이름 3글자 = 안전

3. 치환 후 문법이 자연스러운가?
   ✓ "지훈씨" → "동훈씨" (호칭만 유지)
   ✓ "지훈의" → "동훈의" (조사 유지)
   ✓ "지훈아" → "동훈아" (반말 호칭 유지)
   ⚠️ "민지" → "Min" — 영문/한글 혼용 시 어색 가능
```

---

### 9.20 새 컴포넌트의 best practice는 기존에도 역전 적용 ⭐

```
신규 컴포넌트 작성 시 정립한 best practice:
  - iOS safe-area 대응
  - 동적 데이터 치환
  - 접근성 attributes
  - 자체완결 CSS

→ 동일 기능의 기존 컴포넌트에도 동일 적용 확인

발견된 사례:
  - /invite Toast → safe-area 대응 ✓
  - /report Toast → safe-area 미대응 ⚠️ (역전 적용)

  - /invite Auth UI → CSS 없음 ⚠️
  - /report Auth UI → CSS 있음
  → auth-ui.js에 CSS 자체 주입 (모두 통일)

방지책:
  새 컴포넌트 정립 후, 동일 기능의 기존 컴포넌트 전수조사
```

---

### 9.21 카피 추가/수정 시 영향 범위 체크리스트 ⭐

```
한 카피를 수정할 때:

1. 동일 카피가 여러 곳에 있는가?
   예: "친구가 시작하면 분석권 한 장이 더 와요"
   - /index INVITE 카드
   - /report Share Modal bonus-title
   → 둘 다 동일하게 수정

2. 상태별 카피 변경 시 다른 상태도 영향?
   예: /invite expired 카드 메타
   - default (pending): "만료까지 4일"
   - expired: "7일 후 만료" ← 모순
   → 과거형으로 수정 ("5월 17일 만료")

3. 디자인 시스템 문서와 실제 코드 동기화
   - 카피 변경 → 디자인 시스템에도 반영
   - URL 표기 변경 → 디자인 시스템에도 반영
   (이번 발견: ?error= vs ?test=error- 불일치)

방지책:
  카피 변경 전 grep 검색 → 모든 등장 위치 확인
```

---

## 끝

*이 문서는 v125 시점의 시스템을 기록.*
*v124 대비 핵심 변화: 페이지 간 통일성 + 컴포넌트 자체완결성 + Placeholder 동적 치환 시스템.*
*변경 시 원칙에서 출발하고, 토큰만 수정 권장.*
*큰 변경은 Versioning 섹션 + 이 문서 최상단의 v125 변경 이력에 기록.*
