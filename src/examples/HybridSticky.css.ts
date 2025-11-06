import { style, styleVariants, keyframes, globalStyle } from '@vanilla-extract/css';

// 컬러 팔레트
const colors = {
  hero1: '#667eea',
  hero2: '#764ba2',
  layer1: '#f093fb',
  layer2: '#f5576c',
  layer3: '#4facfe',
  layer3End: '#00f2fe',
  layer4: '#43e97b',
  layer4End: '#38f9d7',
  white: '#ffffff',
  black: '#0d1117',
  gray: '#8b949e',
};

// 애니메이션
const fadeIn = keyframes({
  from: { opacity: 0, transform: 'translateY(30px)' },
  to: { opacity: 1, transform: 'translateY(0)' },
});

const scaleIn = keyframes({
  from: { transform: 'scale(0.8)', opacity: 0 },
  to: { transform: 'scale(1)', opacity: 1 },
});

const shimmer = keyframes({
  '0%': { backgroundPosition: '-1000px 0' },
  '100%': { backgroundPosition: '1000px 0' },
});

// 컨테이너
export const container = style({
  height: '100%',
  overflow: 'auto',
  background: colors.black,
  color: colors.white,
  WebkitOverflowScrolling: 'touch',
  position: 'relative',
});

// 히어로 섹션 - 축소되면서 사라짐
export const hero = style({
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '80px 32px',
  background: `linear-gradient(135deg, ${colors.hero1} 0%, ${colors.hero2} 100%)`,
  position: 'relative',
  overflow: 'hidden',
  transformOrigin: 'top center',
  transition: 'transform 0.1s ease-out, opacity 0.1s ease-out',
  willChange: 'transform, opacity',
});

// 히어로 배경 패턴
export const heroPattern = style({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundImage: `
    linear-gradient(30deg, rgba(255, 255, 255, 0.05) 12%, transparent 12.5%, transparent 87%, rgba(255, 255, 255, 0.05) 87.5%, rgba(255, 255, 255, 0.05)),
    linear-gradient(150deg, rgba(255, 255, 255, 0.05) 12%, transparent 12.5%, transparent 87%, rgba(255, 255, 255, 0.05) 87.5%, rgba(255, 255, 255, 0.05))
  `,
  backgroundSize: '80px 140px',
  opacity: 0.3,
});

export const heroContent = style({
  position: 'relative',
  zIndex: 1,
  textAlign: 'center',
  maxWidth: '900px',
  animation: `${fadeIn} 1s ease-out`,
});

export const heroTitle = style({
  fontSize: '72px',
  fontWeight: 'bold',
  margin: '0 0 24px 0',
  background: 'linear-gradient(135deg, #7ee787 0%, #58a6ff 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
  lineHeight: 1.2,
  '@media': {
    '(max-width: 768px)': {
      fontSize: '48px',
    },
  },
});

export const heroSubtitle = style({
  fontSize: '24px',
  color: 'rgba(255, 255, 255, 0.9)',
  margin: '0 0 40px 0',
  lineHeight: 1.6,
});

export const heroCta = style({
  padding: '16px 48px',
  background: colors.white,
  color: colors.hero1,
  border: 'none',
  borderRadius: '30px',
  fontSize: '18px',
  fontWeight: 600,
  cursor: 'pointer',
  transition: 'all 0.3s',
  animation: `${scaleIn} 0.6s ease-out 0.3s both`,
  ':hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)',
  },
  ':active': {
    transform: 'translateY(0)',
  },
});

// 스택형 레이어들 - 순차적으로 고정됨
const layerBase = style({
  position: 'sticky',
  padding: '16px 32px',
  backdropFilter: 'blur(10px)',
  borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
  transition: 'all 0.3s ease',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
});

export const layers = styleVariants({
  layer1: [layerBase, {
    top: 0,
    zIndex: 40,
    background: `linear-gradient(135deg, ${colors.layer1} 0%, ${colors.layer2} 100%)`,
  }],
  layer2: [layerBase, {
    top: '64px',
    zIndex: 30,
    background: 'rgba(102, 126, 234, 0.95)',
  }],
  layer3: [layerBase, {
    top: '128px',
    zIndex: 20,
    background: `linear-gradient(135deg, ${colors.layer3} 0%, ${colors.layer3End} 100%)`,
  }],
  layer4: [layerBase, {
    top: '192px',
    zIndex: 10,
    background: `linear-gradient(135deg, ${colors.layer4} 0%, ${colors.layer4End} 100%)`,
  }],
});

export const layerTitle = style({
  margin: 0,
  fontSize: '18px',
  fontWeight: 600,
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
});

export const layerIcon = style({
  fontSize: '24px',
  animation: `${scaleIn} 0.4s ease-out`,
});

export const layerActions = style({
  display: 'flex',
  gap: '12px',
});

export const layerButton = style({
  padding: '8px 16px',
  background: 'rgba(255, 255, 255, 0.2)',
  border: '1px solid rgba(255, 255, 255, 0.3)',
  borderRadius: '20px',
  color: colors.white,
  fontSize: '14px',
  cursor: 'pointer',
  transition: 'all 0.2s',
  ':hover': {
    background: 'rgba(255, 255, 255, 0.3)',
  },
  ':active': {
    transform: 'scale(0.95)',
  },
});

// 메인 컨텐츠
export const content = style({
  padding: '48px 32px',
  background: colors.black,
  transition: 'opacity 0.3s ease-out',
  willChange: 'opacity',
});

export const section = style({
  maxWidth: '1200px',
  margin: '0 auto 64px',
  animation: `${fadeIn} 0.8s ease-out`,
});

export const sectionTitle = style({
  fontSize: '36px',
  fontWeight: 'bold',
  margin: '0 0 24px 0',
  background: 'linear-gradient(135deg, #7ee787 0%, #58a6ff 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
});

export const grid = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
  gap: '24px',
});

export const card = style({
  background: 'rgba(255, 255, 255, 0.05)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  borderRadius: '16px',
  padding: '32px',
  transition: 'all 0.3s',
  cursor: 'pointer',
  ':hover': {
    background: 'rgba(255, 255, 255, 0.08)',
    borderColor: '#58a6ff',
    transform: 'translateY(-4px)',
    boxShadow: '0 12px 24px rgba(0, 0, 0, 0.3)',
  },
});

export const cardIcon = style({
  fontSize: '48px',
  marginBottom: '16px',
});

export const cardTitle = style({
  fontSize: '24px',
  fontWeight: 600,
  margin: '0 0 12px 0',
  color: colors.white,
});

export const cardDesc = style({
  fontSize: '16px',
  color: colors.gray,
  lineHeight: 1.6,
  margin: 0,
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

// 기술 설명
export const techInfo = style({
  background: 'rgba(255, 255, 255, 0.05)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  borderRadius: '16px',
  padding: '48px',
  margin: '64px auto',
  maxWidth: '1200px',
  borderLeft: '4px solid #7ee787',
});

export const techTitle = style({
  fontSize: '32px',
  fontWeight: 'bold',
  margin: '0 0 32px 0',
  color: colors.white,
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
});

export const techList = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
  gap: '24px',
  margin: 0,
  padding: 0,
  listStyle: 'none',
});

export const techItem = style({
  padding: '20px',
  background: 'rgba(255, 255, 255, 0.03)',
  borderRadius: '12px',
  border: '1px solid rgba(255, 255, 255, 0.05)',
  transition: 'all 0.3s',
  ':hover': {
    background: 'rgba(255, 255, 255, 0.05)',
    borderColor: 'rgba(126, 231, 135, 0.3)',
    transform: 'translateX(4px)',
  },
});

export const techLabel = style({
  color: '#7ee787',
  fontWeight: 600,
  fontSize: '16px',
  marginBottom: '8px',
  display: 'block',
});

export const techDesc = style({
  color: colors.gray,
  fontSize: '14px',
  lineHeight: 1.6,
  margin: 0,
});

// 스타일 상태 variants
export const heroStates = styleVariants({
  expanded: {},
  shrinking: {},
  collapsed: {},
});

export const layerStates = styleVariants({
  floating: {},
  stuck: {},
});
