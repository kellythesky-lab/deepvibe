# deepvibe — Vercel 배포 가이드

## 폴더 구성

```
vercel-deploy/
├── index.html       ← v108 (랜딩 페이지)
├── favicon.svg      ← 탭/홈화면 아이콘 (vesica piscis 로고)
├── og-image.svg     ← 카톡 공유 카드 (1200×630)
├── vercel.json      ← Vercel 설정 (캐시, 보안 헤더)
└── README.md        ← 이 파일
```

## 배포 — 3가지 방법 (가장 쉬운 것부터)

### 🟢 방법 1: Vercel 웹 사이트에서 *드래그앤드롭* (가장 쉬움, 3분)

1. **https://vercel.com/signup** 접속
2. **GitHub / Google / 이메일**로 가입 (무료)
3. 가입 완료 후 **"Add New" > "Project"** 클릭
4. **"Import Git Repository"** 화면에서 *하단의* "Browse" 또는 "Drag and drop your project" 영역에 **`vercel-deploy` 폴더 통째로 드래그**
5. *Project Name* 입력 (예: `deepvibe-preview`)
   - URL은 자동 생성: `https://deepvibe-preview.vercel.app`
6. **"Deploy"** 클릭
7. ⏳ 30초~1분 기다림
8. 🎉 **URL 발급** — 그 URL을 카톡으로 공유!

### 🟡 방법 2: Vercel CLI (개발자용, 더 빠름)

```bash
# Node.js 설치되어 있어야 함
npm i -g vercel

# 폴더로 이동
cd vercel-deploy

# 첫 배포
vercel

# 질문에 답하면 자동 배포
# - "Set up and deploy?" → Y
# - "Which scope?" → 본인 계정 선택
# - "Link to existing project?" → N
# - "What's your project's name?" → deepvibe-preview
# - "In which directory is your code located?" → ./
# - "Want to modify these settings?" → N

# 배포 URL이 터미널에 출력됨
```

### 🔵 방법 3: GitHub 연동 (장기 운영, 자동 배포)

1. GitHub 리포지토리 생성 (예: `deepvibe-landing`)
2. `vercel-deploy/` 내용을 *리포지토리 *루트*에 *push*
3. Vercel에서 "Import Git Repository" → 해당 리포 선택
4. 자동 배포 + 이후 *git push 때마다 *재배포*

## 배포 후 *반드시* 확인

### 1. 모바일에서 *직접 *접속*

발급된 URL을 **본인 폰의 카톡에서 *나에게 보내기*** → 탭

체크:
- [ ] 폰트가 *제대로 *로드되는지* (Fraunces 영문 + 한글 fallback)
- [ ] Hero 카드가 *3.2초마다 *회전하는지*
- [ ] D-Day 위젯이 *frosted 효과*가 *보이는지* (iOS 15+ / Android 최신)
- [ ] Sticky CTA 노란 버튼이 *하단에 *고정되는지*
- [ ] 스크롤이 *부드러운지*
- [ ] FAQ 펼치기/접기 *작동하는지*
- [ ] 320px 작은 폰 (iPhone SE)에서 *정상*인지

### 2. 카톡 *공유 *미리보기* 확인

URL을 *카톡에서 *다른 채팅방으로 *공유* → 미리보기 카드가 *제대로 *뜨는지* 확인:

- [ ] 제목: "deepvibe — 카톡 대화로 읽는 우리 사이"
- [ ] 설명: "두 사람 사이에 흐르는 결을..."
- [ ] 이미지: og-image.svg (deepvibe 로고 + 카피)

⚠️ **카카오톡은 *간혹 *SVG OG 이미지를 *지원 *안 함*. 그 경우 *PNG로 변환한 *OG 이미지* 필요. PNG 만드는 방법은 *추가 *질문해주세요*.

### 3. *링크 *공유 *시 *주의*

- **Vercel 무료 도메인** (`xxx.vercel.app`)은 *모든 사람에게 *공개*. 비공개로 *하려면 *Vercel Pro 필요.
- **카톡으로 *URL 공유 시*** — 자동으로 OG 미리보기 *카드 *생성*. 안 뜨면 *카카오 공식 디버그*: https://devtalk.kakao.com/  
- **링크 만료** — Vercel은 *영구 *URL 유지*. 다른 곳 *재배포해도 *동일 URL 유지*.

## 커스텀 도메인 *연결 (나중에)*

Vercel은 *커스텀 도메인 *무료 *연결 *지원*:

1. 도메인 *구매* (Cloudflare Registrar / Namecheap / Gabia 등)
   - `deepvibe.kr` 또는 `deepvibe.com` 등
2. Vercel 프로젝트 *Settings → Domains → Add*
3. 도메인 *DNS 설정* (A 레코드 또는 CNAME)
4. *24시간 *내 *연결 완료*

## 자주 *생기는 *문제*

| 문제 | 원인 | 해결 |
|---|---|---|
| OG 이미지가 *안 뜸* | 카톡이 SVG 미지원 | PNG로 *변환 *필요* |
| 폰트 *늦게 *로드* | Google Fonts 첫 *방문 *지연* | 정상, 2번째부터 *캐시* |
| 폰에서 *밝은 줄무늬* | 위젯의 *backdrop-filter* | iOS 15+ 필요, 그 이하는 *흐림 없이 *표시 (정상) |
| 새로 고침 시 *layout shift* | 폰트 *FOUT* | font-display: swap *적용됨* (정상 작동) |
| URL이 *너무 길다* | Vercel 무료 도메인 | 커스텀 도메인 *연결* 또는 *비트리 등 *단축 *URL* 사용 |

## 다음 *단계*

1. **OG 이미지를 PNG로 변환** (카톡 *호환성*) — 다음 작업
2. **실제 도메인 *구매*** (`deepvibe.kr`)
3. **카카오 OAuth *연동*** — 백엔드 *구축 *필요*
4. **분석 기능 *구현*** — AI 백엔드 *연결*

## 끝

이 폴더의 *4개 *파일*만으로 *완전한 *공유 가능 *상태*. *복잡한 *빌드 *과정 *없음*.
