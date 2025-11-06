import { style, styleVariants } from '@vanilla-extract/css';

// 컨테이너
export const container = style({
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
  transition: 'top 0.1s ease-out, background 0.2s',
  '::-webkit-scrollbar': {
    display: 'none',
  },
});

// 탭 베이스 스타일
const tabBase = style({
  padding: '8px 16px',
  border: '1px solid #e5e5e5',
  borderRadius: '20px',
  fontSize: '14px',
  fontWeight: 500,
  cursor: 'pointer',
  whiteSpace: 'nowrap',
  transition: 'all 0.2s',
  flexShrink: 0,
  ':active': {
    transform: 'scale(0.95)',
  },
});

// 탭 variants
export const tab = styleVariants({
  default: [tabBase, {
    background: 'transparent',
    color: '#666',
    borderColor: '#e5e5e5',
    ':hover': {
      background: '#f5f5f5',
    },
  }],
  active: [tabBase, {
    background: '#667eea',
    color: 'white',
    borderColor: '#667eea',
    ':hover': {
      background: '#5568d3',
    },
  }],
  primary: [tabBase, {
    background: 'transparent',
    color: '#667eea',
    borderColor: '#667eea',
    ':hover': {
      background: 'rgba(102, 126, 234, 0.1)',
    },
  }],
  secondary: [tabBase, {
    background: 'transparent',
    color: '#764ba2',
    borderColor: '#764ba2',
    ':hover': {
      background: 'rgba(118, 75, 162, 0.1)',
    },
  }],
  success: [tabBase, {
    background: 'transparent',
    color: '#10b981',
    borderColor: '#10b981',
    ':hover': {
      background: 'rgba(16, 185, 129, 0.1)',
    },
  }],
  danger: [tabBase, {
    background: 'transparent',
    color: '#ef4444',
    borderColor: '#ef4444',
    ':hover': {
      background: 'rgba(239, 68, 68, 0.1)',
    },
  }],
});

// 아이콘이 있는 탭
export const tabWithIcon = style({
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
});

export const tabIcon = style({
  fontSize: '16px',
  lineHeight: 1,
});

// 배지
export const badge = style({
  marginLeft: '6px',
  padding: '2px 6px',
  fontSize: '11px',
  fontWeight: 600,
  borderRadius: '10px',
  background: 'rgba(255, 255, 255, 0.3)',
});

// 컨테이너 variants
export const containerVariants = styleVariants({
  default: {},
  transparent: {
    background: 'transparent',
    borderBottom: 'none',
    backdropFilter: 'blur(10px)',
  },
  glass: {
    background: 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(10px)',
  },
  dark: {
    background: '#1a1a1a',
    borderBottom: '1px solid #333',
  },
});
