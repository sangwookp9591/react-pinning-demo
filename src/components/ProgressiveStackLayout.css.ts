import { style, styleVariants, keyframes } from '@vanilla-extract/css';

// 애니메이션
const fadeIn = keyframes({
  from: { opacity: 0, transform: 'translateY(30px)' },
  to: { opacity: 1, transform: 'translateY(0)' },
});

const scaleIn = keyframes({
  from: { transform: 'scale(0.8)', opacity: 0 },
  to: { transform: 'scale(1)', opacity: 1 },
});

// 컨테이너
export const container = style({
  height: '100%',
  overflow: 'auto',
  position: 'relative',
  WebkitOverflowScrolling: 'touch',
});

// 히어로 섹션 - 축소되면서 사라짐
export const hero = style({
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative',
  overflow: 'hidden',
  transformOrigin: 'top center',
  transition: 'transform 0.1s ease-out, opacity 0.1s ease-out',
  willChange: 'transform, opacity',
});

// 스택형 레이어 베이스
export const layerBase = style({
  position: 'sticky',
  backdropFilter: 'blur(10px)',
  transition: 'all 0.3s ease',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '16px 32px',
  borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
});

// 스페이서
export const spacer = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '80px 32px',
  textAlign: 'center',
});

// 메인 컨텐츠
export const content = style({
  transition: 'opacity 0.3s ease-out',
  willChange: 'opacity',
});

// 진행도 인디케이터
export const progressBar = style({
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  height: '3px',
  background: 'rgba(255, 255, 255, 0.1)',
  zIndex: 1000,
});

export const progressFill = style({
  height: '100%',
  background: 'linear-gradient(90deg, #7ee787 0%, #58a6ff 100%)',
  transition: 'width 0.1s ease-out',
  boxShadow: '0 0 10px rgba(126, 231, 135, 0.5)',
});

// 스크롤 인디케이터
export const scrollIndicator = style({
  position: 'fixed',
  bottom: '32px',
  left: '50%',
  transform: 'translateX(-50%)',
  zIndex: 50,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '8px',
  color: 'rgba(255, 255, 255, 0.7)',
  fontSize: '14px',
  animation: `${fadeIn} 1s ease-out 1s both`,
  transition: 'opacity 0.3s',
});

export const scrollArrow = style({
  fontSize: '24px',
  animation: `${keyframes({
    '0%, 100%': { transform: 'translateY(0)' },
    '50%': { transform: 'translateY(8px)' },
  })} 2s ease-in-out infinite`,
});
