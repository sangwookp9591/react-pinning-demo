import { style, styleVariants, globalStyle, keyframes } from '@vanilla-extract/css';

// 테마 변수
export const theme = {
  colors: {
    primary: '#667eea',
    primaryDark: '#5568d3',
    secondary: '#764ba2',
    white: '#ffffff',
    black: '#1a1a1a',
    gray: {
      50: '#fafafa',
      100: '#f5f5f5',
      200: '#e5e5e5',
      300: '#d4d4d4',
      500: '#737373',
      700: '#404040',
    },
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    '2xl': '48px',
  },
  borderRadius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    full: '9999px',
  },
  shadows: {
    sm: '0 1px 3px rgba(0, 0, 0, 0.12)',
    md: '0 4px 6px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px rgba(0, 0, 0, 0.15)',
  },
  transitions: {
    fast: '0.15s ease',
    normal: '0.3s ease',
    slow: '0.5s ease',
  },
};

// 애니메이션
const fadeInUp = keyframes({
  from: {
    opacity: 0,
    transform: 'translateY(20px)',
  },
  to: {
    opacity: 1,
    transform: 'translateY(0)',
  },
});

const slideIn = keyframes({
  from: {
    transform: 'translateX(-100%)',
  },
  to: {
    transform: 'translateX(0)',
  },
});

const pulse = keyframes({
  '0%, 100%': {
    opacity: 1,
  },
  '50%': {
    opacity: 0.5,
  },
});

// 컨테이너
export const container = style({
  height: '100%',
  overflow: 'auto',
  background: theme.colors.gray[50],
  WebkitOverflowScrolling: 'touch',
});

// 스티키 헤더
export const stickyHeader = style({
  position: 'sticky',
  top: 0,
  zIndex: 100,
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: theme.colors.white,
  padding: theme.spacing.lg,
  boxShadow: theme.shadows.md,
  backdropFilter: 'blur(10px)',
  transition: `all ${theme.transitions.normal}`,
});

export const headerContent = style({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  maxWidth: '1200px',
  margin: '0 auto',
});

export const headerTitle = style({
  margin: 0,
  fontSize: '28px',
  fontWeight: 'bold',
  animation: `${fadeInUp} 0.6s ease-out`,
});

export const headerActions = style({
  display: 'flex',
  gap: theme.spacing.md,
});

// 버튼 베이스
const buttonBase = style({
  padding: `${theme.spacing.sm} ${theme.spacing.md}`,
  border: 'none',
  borderRadius: theme.borderRadius.md,
  fontSize: '14px',
  fontWeight: 600,
  cursor: 'pointer',
  transition: `all ${theme.transitions.fast}`,
  ':active': {
    transform: 'scale(0.95)',
  },
});

// 버튼 variants
export const button = styleVariants({
  primary: [buttonBase, {
    background: theme.colors.white,
    color: theme.colors.primary,
    ':hover': {
      background: theme.colors.gray[100],
    },
  }],
  secondary: [buttonBase, {
    background: 'rgba(255, 255, 255, 0.2)',
    color: theme.colors.white,
    border: '1px solid rgba(255, 255, 255, 0.3)',
    ':hover': {
      background: 'rgba(255, 255, 255, 0.3)',
    },
  }],
  ghost: [buttonBase, {
    background: 'transparent',
    color: theme.colors.white,
    ':hover': {
      background: 'rgba(255, 255, 255, 0.1)',
    },
  }],
});

// 스티키 탭바
export const stickyTabs = style({
  position: 'sticky',
  top: '76px', // 헤더 높이
  zIndex: 90,
  display: 'flex',
  gap: theme.spacing.sm,
  padding: theme.spacing.md,
  background: theme.colors.white,
  borderBottom: `1px solid ${theme.colors.gray[200]}`,
  overflowX: 'auto',
  scrollbarWidth: 'none',
  '::-webkit-scrollbar': {
    display: 'none',
  },
});

export const tab = styleVariants({
  base: {
    padding: `${theme.spacing.sm} ${theme.spacing.md}`,
    background: 'transparent',
    border: `1px solid ${theme.colors.gray[200]}`,
    borderRadius: theme.borderRadius.full,
    fontSize: '14px',
    fontWeight: 500,
    color: theme.colors.gray[700],
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    transition: `all ${theme.transitions.fast}`,
    ':hover': {
      background: theme.colors.gray[100],
    },
  },
  active: {
    background: theme.colors.primary,
    color: theme.colors.white,
    borderColor: theme.colors.primary,
  },
});

// 콘텐츠 섹션
export const section = style({
  padding: theme.spacing.lg,
  animation: `${fadeInUp} 0.6s ease-out`,
});

export const sectionTitle = style({
  margin: `0 0 ${theme.spacing.lg} 0`,
  fontSize: '32px',
  color: theme.colors.black,
  fontWeight: 'bold',
});

// 카드 그리드
export const cardGrid = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
  gap: theme.spacing.md,
});

// 카드 베이스
export const cardBase = style({
  background: theme.colors.white,
  borderRadius: theme.borderRadius.lg,
  padding: theme.spacing.lg,
  boxShadow: theme.shadows.sm,
  transition: `all ${theme.transitions.fast}`,
  cursor: 'pointer',
  ':hover': {
    boxShadow: theme.shadows.lg,
    transform: 'translateY(-4px)',
  },
  ':active': {
    transform: 'translateY(-2px)',
  },
});

export const card = styleVariants({
  default: [cardBase, {}],
  featured: [cardBase, {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: theme.colors.white,
  }],
  outlined: [cardBase, {
    border: `2px solid ${theme.colors.primary}`,
    boxShadow: 'none',
  }],
});

export const cardImage = style({
  width: '100%',
  height: '200px',
  background: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
  borderRadius: theme.borderRadius.md,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '64px',
  marginBottom: theme.spacing.md,
});

export const cardTitle = style({
  margin: `0 0 ${theme.spacing.sm} 0`,
  fontSize: '20px',
  fontWeight: 600,
  color: theme.colors.black,
});

export const cardDescription = style({
  margin: `0 0 ${theme.spacing.md} 0`,
  fontSize: '14px',
  color: theme.colors.gray[500],
  lineHeight: 1.6,
});

export const cardPrice = style({
  fontSize: '24px',
  fontWeight: 'bold',
  color: theme.colors.primary,
});

// 스티키 사이드바
export const sidebarContainer = style({
  display: 'flex',
  gap: theme.spacing.lg,
  padding: theme.spacing.lg,
});

export const sidebar = style({
  position: 'sticky',
  top: '140px', // 헤더 + 탭바 높이
  width: '300px',
  height: 'fit-content',
  background: theme.colors.white,
  borderRadius: theme.borderRadius.lg,
  padding: theme.spacing.lg,
  boxShadow: theme.shadows.md,
  flexShrink: 0,
  animation: `${slideIn} 0.4s ease-out`,
});

export const sidebarTitle = style({
  margin: `0 0 ${theme.spacing.md} 0`,
  fontSize: '18px',
  fontWeight: 600,
  color: theme.colors.black,
});

export const sidebarList = style({
  listStyle: 'none',
  margin: 0,
  padding: 0,
});

export const sidebarItem = style({
  padding: `${theme.spacing.sm} ${theme.spacing.md}`,
  borderRadius: theme.borderRadius.sm,
  cursor: 'pointer',
  transition: `all ${theme.transitions.fast}`,
  ':hover': {
    background: theme.colors.gray[100],
  },
});

export const mainContent = style({
  flex: 1,
  minWidth: 0,
});

// Floating Action Button
export const fab = style({
  position: 'fixed',
  bottom: theme.spacing.lg,
  right: theme.spacing.lg,
  width: '56px',
  height: '56px',
  borderRadius: theme.borderRadius.full,
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: theme.colors.white,
  border: 'none',
  fontSize: '24px',
  cursor: 'pointer',
  boxShadow: theme.shadows.xl,
  transition: `all ${theme.transitions.normal}`,
  zIndex: 1000,
  ':hover': {
    transform: 'scale(1.1)',
    boxShadow: '0 25px 35px rgba(0, 0, 0, 0.2)',
  },
  ':active': {
    transform: 'scale(0.95)',
  },
});

// 로딩 스피너
export const spinner = style({
  display: 'inline-block',
  width: '40px',
  height: '40px',
  border: `4px solid ${theme.colors.gray[200]}`,
  borderTopColor: theme.colors.primary,
  borderRadius: theme.borderRadius.full,
  animation: `${pulse} 1s linear infinite`,
});

// 배지
export const badge = style({
  display: 'inline-block',
  padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
  background: theme.colors.primary,
  color: theme.colors.white,
  fontSize: '12px',
  fontWeight: 600,
  borderRadius: theme.borderRadius.full,
});

// 기술 설명
export const techInfo = style({
  background: theme.colors.white,
  padding: theme.spacing.xl,
  margin: `${theme.spacing.xl} ${theme.spacing.lg}`,
  borderRadius: theme.borderRadius.lg,
  boxShadow: theme.shadows.md,
  borderLeft: `4px solid ${theme.colors.primary}`,
});

export const techTitle = style({
  margin: `0 0 ${theme.spacing.md} 0`,
  fontSize: '24px',
  color: theme.colors.black,
});

export const techList = style({
  margin: 0,
  paddingLeft: theme.spacing.lg,
  color: theme.colors.gray[700],
});

export const techItem = style({
  marginBottom: theme.spacing.md,
  lineHeight: 1.6,
});

export const techHighlight = style({
  color: theme.colors.primary,
  fontWeight: 600,
});
