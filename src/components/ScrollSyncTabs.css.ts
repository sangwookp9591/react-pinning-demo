import { style, styleVariants } from '@vanilla-extract/css';

// 컨테이너
export const container = style({
  height: '100%',
  overflow: 'auto',
  WebkitOverflowScrolling: 'touch',
  scrollBehavior: 'smooth',
});

// 스티키 탭바
export const tabBar = style({
  position: 'sticky',
  top: 0,
  zIndex: 100,
  background: 'white',
  borderBottom: '1px solid #e5e5e5',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
});

export const tabScroll = style({
  overflowX: 'auto',
  WebkitOverflowScrolling: 'touch',
  scrollbarWidth: 'none',
  '::-webkit-scrollbar': {
    display: 'none',
  },
});

export const tabButtons = style({
  display: 'flex',
  position: 'relative',
  padding: '8px 16px 0',
});

// 탭 버튼
export const tab = style({
  padding: '12px 20px',
  background: 'transparent',
  border: 'none',
  fontSize: '15px',
  fontWeight: 500,
  color: '#666',
  cursor: 'pointer',
  transition: 'all 0.3s',
  whiteSpace: 'nowrap',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  position: 'relative',
  ':active': {
    transform: 'scale(0.95)',
  },
});

export const tabActive = style({
  color: '#667eea',
  fontWeight: 600,
});

export const tabIcon = style({
  fontSize: '20px',
  lineHeight: 1,
});

export const tabLabel = style({
  lineHeight: 1,
});

// 인디케이터
export const indicator = style({
  position: 'absolute',
  bottom: 0,
  height: '3px',
  background: '#667eea',
  borderRadius: '3px 3px 0 0',
  transition: 'all 0.3s cubic-bezier(0.4, 0.0, 0.2, 1)',
});

// 섹션
export const section = style({
  minHeight: '100vh',
  padding: '40px 20px',
  scrollMarginTop: '60px', // 탭바 높이만큼
});

// 섹션 variants
export const sectionVariants = styleVariants({
  default: {},
  snap: {
    scrollSnapAlign: 'start',
  },
});

// 진행도 바
export const progressBar = style({
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  height: '2px',
  background: 'rgba(102, 126, 234, 0.1)',
  zIndex: 1000,
});

export const progressFill = style({
  height: '100%',
  background: '#667eea',
  transition: 'width 0.1s ease-out',
  boxShadow: '0 0 10px rgba(102, 126, 234, 0.5)',
});
