import { style } from '@vanilla-extract/css';

// 컨테이너
export const container = style({
  height: '100%',
  overflowY: 'auto',
  background: '#f5f5f5',
  WebkitOverflowScrolling: 'touch',
});

// Collapsing Toolbar
export const toolbar = style({
  position: 'sticky',
  top: 0,
  zIndex: 100,
  overflow: 'hidden',
  transition: 'height 0.1s ease-out',
  willChange: 'height',
});

export const toolbarBackground = style({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  transition: 'opacity 0.1s ease-out, transform 0.1s ease-out',
  willChange: 'opacity, transform',
  transformOrigin: 'center center',
});

export const bgGradient = style({
  width: '100%',
  height: '100%',
  background: 'linear-gradient(to bottom, transparent 0%, rgba(0, 0, 0, 0.3) 100%)',
});

// 상단 액션 바
export const toolbarActions = style({
  position: 'relative',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '12px 16px',
  zIndex: 10,
  transition: 'backdrop-filter 0.2s, background 0.2s',
});

export const actionIcon = style({
  background: 'rgba(255, 255, 255, 0.2)',
  border: 'none',
  width: '40px',
  height: '40px',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '20px',
  cursor: 'pointer',
  backdropFilter: 'blur(10px)',
  transition: 'background 0.2s',
  ':active': {
    background: 'rgba(255, 255, 255, 0.3)',
  },
});

export const actionsRight = style({
  display: 'flex',
  gap: '8px',
});

// 툴바 타이틀
export const toolbarContent = style({
  position: 'absolute',
  bottom: '24px',
  left: '24px',
  right: '24px',
  color: 'white',
  zIndex: 5,
  transformOrigin: 'left bottom',
  transition: 'transform 0.1s ease-out, opacity 0.1s ease-out',
  willChange: 'transform, opacity',
});

// 스티키 탭
export const stickyTabs = style({
  position: 'sticky',
  zIndex: 90,
  display: 'flex',
  gap: '8px',
  padding: '12px 16px',
  background: 'white',
  borderBottom: '1px solid #e5e5e5',
  overflowX: 'auto',
  WebkitOverflowScrolling: 'touch',
  scrollbarWidth: 'none',
  transition: 'top 0.1s ease-out',
  '::-webkit-scrollbar': {
    display: 'none',
  },
});

// 메인 콘텐츠
export const content = style({
  padding: '24px 16px',
});

// 성능 최적화
export const optimized = style({
  contain: 'layout style paint',
});
