import { ImageResponse } from '@vercel/og';

export const config = {
  runtime: 'edge',
};

const COLORS = {
  bg: '#F6F4F1',
  bgSoft: '#EFEBE5',
  ink: '#15131A',
  ink2: '#2a262f',
  muted: '#7a7680',
  muted2: '#a8a4ac',
  pink: '#ff6f91',
  pinkSoft: '#ff9fbc',
  violet: '#b967ff',
  violetSoft: '#caa3ff',
  coral: '#ff8a7d',
  orange: '#ffb894',
  kakao: '#FEE500',
  kakaoInk: '#3D1E1E',
};

function VesicaMark({ size = 40 }: { size?: number }) {
  const w = size * (30 / 18);
  const h = size;
  return (
    <svg width={w} height={h} viewBox="0 0 30 18" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="logo-blur" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="0.55" />
        </filter>
        <radialGradient id="logo-pink" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ff6f91" stopOpacity="0.95" />
          <stop offset="70%" stopColor="#ff9fbc" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#ffb4c6" stopOpacity="0.7" />
        </radialGradient>
        <radialGradient id="logo-violet" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#b967ff" stopOpacity="0.95" />
          <stop offset="70%" stopColor="#caa3ff" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#dec4ff" stopOpacity="0.7" />
        </radialGradient>
      </defs>
      <g filter="url(#logo-blur)">
        <circle cx="11" cy="9" r="7.5" fill="url(#logo-pink)" />
        <circle cx="19" cy="9" r="7.5" fill="url(#logo-violet)" />
      </g>
    </svg>
  );
}

function Background() {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: COLORS.bg,
        display: 'flex',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: '-200px',
          left: '-150px',
          width: '600px',
          height: '600px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,159,188,0.25) 0%, rgba(255,159,188,0) 60%)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '-200px',
          right: '-150px',
          width: '600px',
          height: '600px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(202,163,255,0.22) 0%, rgba(202,163,255,0) 60%)',
        }}
      />
    </div>
  );
}

function OGIndex() {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        background: COLORS.bg,
      }}
    >
      <Background />
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          zIndex: 2,
        }}
      >
        <div style={{ marginBottom: '40px', display: 'flex' }}>
          <VesicaMark size={140} />
        </div>
        <div
          style={{
            fontFamily: 'Fraunces',
            fontWeight: 300,
            fontStyle: 'italic',
            fontSize: '96px',
            lineHeight: 1,
            letterSpacing: '-0.035em',
            color: COLORS.ink,
            marginBottom: '24px',
            display: 'flex',
          }}
        >
          deepvibe
        </div>
        <div
          style={{
            fontFamily: 'NotoSerifKR',
            fontWeight: 400,
            fontSize: '36px',
            color: COLORS.ink,
            letterSpacing: '-0.02em',
            marginBottom: '20px',
            display: 'flex',
          }}
        >
          두 사람 사이에 흐르는 결을 그립니다
        </div>
        <div
          style={{
            fontFamily: 'NotoSansKR',
            fontWeight: 400,
            fontSize: '22px',
            color: COLORS.muted,
            letterSpacing: '-0.005em',
            display: 'flex',
          }}
        >
          카톡 대화로 읽는 우리 사이 · AI 관계 분석
        </div>
      </div>
    </div>
  );
}

function OGUpload() {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        background: COLORS.bg,
      }}
    >
      <Background />
      <div
        style={{
          position: 'absolute',
          top: '36px',
          left: '60px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          zIndex: 2,
        }}
      >
        <VesicaMark size={28} />
        <div
          style={{
            fontFamily: 'Fraunces',
            fontWeight: 400,
            fontStyle: 'italic',
            fontSize: '34px',
            letterSpacing: '-0.01em',
            color: COLORS.ink,
          }}
        >
          deepvibe
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          top: '170px',
          left: 0,
          right: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          paddingLeft: '140px',
          zIndex: 2,
        }}
      >
        <div
          style={{
            display: 'flex',
            background: '#F4F4F5',
            padding: '14px 22px',
            borderRadius: '22px',
            fontFamily: 'NotoSansKR',
            fontWeight: 500,
            fontSize: '22px',
            color: COLORS.ink,
            boxShadow: '0 4px 12px rgba(20,10,30,0.06)',
            marginBottom: '12px',
            letterSpacing: '-0.005em',
          }}
        >
          오늘 진짜 좋았어요
        </div>
        <div
          style={{
            display: 'flex',
            background: COLORS.kakao,
            padding: '14px 24px',
            borderRadius: '22px',
            fontFamily: 'NotoSansKR',
            fontWeight: 500,
            fontSize: '22px',
            color: COLORS.kakaoInk,
            boxShadow: '0 4px 12px rgba(20,10,30,0.08)',
            marginBottom: '12px',
            marginLeft: '60px',
            letterSpacing: '-0.005em',
          }}
        >
          저두요
        </div>
        <div
          style={{
            display: 'flex',
            background: '#F4F4F5',
            padding: '14px 22px',
            borderRadius: '22px',
            fontFamily: 'NotoSansKR',
            fontWeight: 500,
            fontSize: '22px',
            color: COLORS.ink,
            boxShadow: '0 4px 12px rgba(20,10,30,0.06)',
            marginLeft: '20px',
            letterSpacing: '-0.005em',
          }}
        >
          다음 주에 만나요!
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          right: '120px',
          top: '230px',
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          zIndex: 2,
        }}
      >
        <div
          style={{
            fontFamily: 'NotoSansKR',
            fontWeight: 400,
            fontSize: '40px',
            color: COLORS.muted,
            display: 'flex',
          }}
        >
          →
        </div>
        <VesicaMark size={80} />
      </div>

      <div
        style={{
          position: 'absolute',
          bottom: '70px',
          left: 0,
          right: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          zIndex: 2,
        }}
      >
        <div
          style={{
            fontFamily: 'NotoSerifKR',
            fontWeight: 400,
            fontSize: '42px',
            color: COLORS.ink,
            letterSpacing: '-0.02em',
            marginBottom: '14px',
            display: 'flex',
          }}
        >
          대화를 들려주세요
        </div>
        <div
          style={{
            fontFamily: 'NotoSansKR',
            fontWeight: 400,
            fontSize: '22px',
            color: COLORS.ink2,
            letterSpacing: '-0.005em',
            marginBottom: '12px',
            display: 'flex',
          }}
        >
          한 편의 리포트로, 두 사람의 결을 정리해드려요
        </div>
        <div
          style={{
            fontFamily: 'NotoSansKR',
            fontWeight: 400,
            fontSize: '18px',
            color: COLORS.muted,
            letterSpacing: '-0.002em',
            display: 'flex',
          }}
        >
          분석이 끝나면 원본은 바로 지워져요
        </div>
      </div>
    </div>
  );
}

function MiniCard({
  accentColor,
  label,
  caption,
}: {
  accentColor: string;
  label: string;
  caption: string;
}) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        background: '#fff',
        borderRadius: '22px',
        padding: '26px 24px',
        width: '280px',
        height: '160px',
        justifyContent: 'space-between',
        boxShadow:
          '0 1px 2px rgba(20,10,30,0.04), 0 12px 28px -16px rgba(20,10,30,0.1), 0 24px 48px -20px rgba(20,10,30,0.15)',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        <div
          style={{
            width: '12px',
            height: '12px',
            borderRadius: '50%',
            background: accentColor,
          }}
        />
        <div
          style={{
            fontFamily: 'NotoSansKR',
            fontSize: '16px',
            color: COLORS.muted,
            letterSpacing: '-0.002em',
          }}
        >
          {label}
        </div>
      </div>
      <div
        style={{
          display: 'flex',
          fontFamily: 'NotoSerifKR',
          fontWeight: 400,
          fontSize: '28px',
          color: COLORS.ink,
          letterSpacing: '-0.015em',
          lineHeight: 1.25,
        }}
      >
        {caption}
      </div>
    </div>
  );
}

function OGReport() {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        background: COLORS.bg,
      }}
    >
      <Background />
      <div
        style={{
          position: 'absolute',
          top: '36px',
          left: '60px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          zIndex: 2,
        }}
      >
        <VesicaMark size={28} />
        <div
          style={{
            fontFamily: 'Fraunces',
            fontWeight: 400,
            fontStyle: 'italic',
            fontSize: '34px',
            letterSpacing: '-0.01em',
            color: COLORS.ink,
          }}
        >
          deepvibe
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          top: '160px',
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'center',
          gap: '30px',
          zIndex: 2,
        }}
      >
        <MiniCard accentColor={COLORS.pink} label="지금 결" caption="친구 ↔ 연인" />
        <MiniCard accentColor={COLORS.orange} label="감정 결" caption="웃음 흐르는" />
        <MiniCard accentColor={COLORS.coral} label="다가오는 결" caption="미래가 보이는" />
      </div>

      <div
        style={{
          position: 'absolute',
          bottom: '60px',
          left: 0,
          right: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          zIndex: 2,
        }}
      >
        <div
          style={{
            fontFamily: 'NotoSerifKR',
            fontWeight: 400,
            fontSize: '44px',
            color: COLORS.ink,
            letterSpacing: '-0.02em',
            marginBottom: '14px',
            display: 'flex',
          }}
        >
          한 편의 결이, 도착했어요
        </div>
        <div
          style={{
            fontFamily: 'NotoSansKR',
            fontWeight: 400,
            fontSize: '22px',
            color: COLORS.ink2,
            letterSpacing: '-0.005em',
            marginBottom: '12px',
            display: 'flex',
          }}
        >
          두 사람 사이에 흐르는 결을 읽어드렸어요
        </div>
        <div
          style={{
            fontFamily: 'NotoSansKR',
            fontWeight: 400,
            fontSize: '18px',
            color: COLORS.muted,
            letterSpacing: '-0.002em',
            display: 'flex',
          }}
        >
          호감도 · 결정적 순간 · 감정 시그널 · 답장 속도 · 말투 · 주제 · 미래
        </div>
      </div>
    </div>
  );
}

// ==================== Font fetch helper ====================
async function fetchFontFromGoogle(text: string, family: string) {
  // Google Fonts CSS API - 페이지에 사용되는 한글 텍스트만 subset
  const url = `https://fonts.googleapis.com/css2?family=${family}&text=${encodeURIComponent(text)}`;
  const css = await (
    await fetch(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.83 Mobile Safari/537.36',
      },
    })
  ).text();
  const fontUrl = css.match(/url\((https:\/\/[^)]+\.ttf)\)/)?.[1];
  if (!fontUrl) return null;
  return await (await fetch(fontUrl)).arrayBuffer();
}

// ==================== Handler ====================
export default async function handler(req: Request) {
  const url = new URL(req.url);
  const type = url.searchParams.get('type') || 'index';

  // 1. Fraunces - same-origin (번들된 폰트, 안정적)
  const frauncesItalicData = await fetch(
    new URL('/fonts/Fraunces-Italic.ttf', url.origin)
  ).then((r) => r.arrayBuffer());

  // 2. 한글 폰트 - 페이지에 실제 사용되는 글자만 subset fetch
  const allKoreanText =
    '두사람이에흐르는결을그립니다카톡대화로읽우리사AI관계분석호감도정적순간감시그널답장속도말투주제미래의편한리포트로정해드려요들으세달이저시작아언끝나면원본바지워져';
  
  const notoSerifData = await fetchFontFromGoogle(allKoreanText, 'Noto+Serif+KR:wght@400');
  const notoSansData = await fetchFontFromGoogle(allKoreanText, 'Noto+Sans+KR:wght@400');

  let element;
  if (type === 'upload') {
    element = <OGUpload />;
  } else if (type === 'report') {
    element = <OGReport />;
  } else {
    element = <OGIndex />;
  }

  const fonts: any[] = [
    {
      name: 'Fraunces',
      data: frauncesItalicData,
      style: 'italic',
      weight: 400,
    },
  ];

  if (notoSerifData) {
    fonts.push({
      name: 'NotoSerifKR',
      data: notoSerifData,
      style: 'normal',
      weight: 400,
    });
  }
  if (notoSansData) {
    fonts.push({
      name: 'NotoSansKR',
      data: notoSansData,
      style: 'normal',
      weight: 400,
    });
  }

  return new ImageResponse(element, {
    width: 1200,
    height: 630,
    fonts,
    headers: {
      'Cache-Control': 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800',
    },
  });
}
