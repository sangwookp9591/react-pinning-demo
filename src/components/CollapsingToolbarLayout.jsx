import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import * as styles from './CollapsingToolbarLayout.css';

/**
 * CollapsingToolbarLayout - Flutter WebView 최적화 공통 레이아웃
 *
 * Material Design 스타일 축소 툴바 레이아웃
 *
 * @param {Object} props
 * @param {React.ReactNode} props.title - 툴바 타이틀 콘텐츠
 * @param {React.ReactNode} props.backgroundImage - 툴바 배경 (선택)
 * @param {string} props.backgroundGradient - 배경 그라디언트 (기본: 보라색)
 * @param {Array<Object>} props.actions - 우측 액션 버튼 배열 [{ icon, onClick }]
 * @param {React.ReactNode} props.backButton - 뒤로가기 버튼 (선택)
 * @param {Array<Object>} props.tabs - 탭 배열 [{ label, value, active }]
 * @param {Function} props.onTabChange - 탭 변경 콜백
 * @param {React.ReactNode} props.children - 메인 콘텐츠
 * @param {number} props.maxHeight - 툴바 최대 높이 (기본: 300)
 * @param {number} props.minHeight - 툴바 최소 높이 (기본: 60)
 * @param {Object} props.containerStyles - 컨테이너 커스텀 스타일
 * @param {Function} props.onScroll - 스크롤 콜백 (Flutter WebView 통신용)
 */
export const CollapsingToolbarLayout = ({
  title,
  backgroundImage,
  backgroundGradient = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  actions = [],
  backButton,
  tabs = [],
  onTabChange,
  children,
  maxHeight = 300,
  minHeight = 60,
  containerStyles = {},
  onScroll,
}) => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollTop = container.scrollTop;
      const maxScroll = maxHeight - minHeight;

      // 0 ~ 1 사이의 진행도
      const progress = Math.min(scrollTop / maxScroll, 1);
      setScrollProgress(progress);

      // Flutter WebView 통신
      if (window.flutter_inappwebview) {
        window.flutter_inappwebview.callHandler('onToolbarCollapse', {
          progress,
          isCollapsed: progress >= 1,
          scrollTop,
        });
      }

      // 커스텀 콜백
      if (onScroll) {
        onScroll({
          progress,
          isCollapsed: progress >= 1,
          scrollTop,
        });
      }
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, [maxHeight, minHeight, onScroll]);

  // 진행도에 따른 값 계산
  const toolbarHeight = maxHeight - (maxHeight - minHeight) * scrollProgress;
  const titleScale = 1 - scrollProgress * 0.4; // 1 -> 0.6
  const titleTranslateY = -scrollProgress * 80; // 위로 이동
  const imageOpacity = 1 - scrollProgress * 0.7; // 1 -> 0.3
  const imageScale = 1 + scrollProgress * 0.2; // 패러랙스 zoom
  const backdropBlur = scrollProgress * 10; // 0 -> 10px

  return (
    <div
      className={styles.container}
      ref={containerRef}
      style={containerStyles}
    >
      {/* Collapsing Toolbar */}
      <div
        className={`${styles.toolbar} ${styles.optimized}`}
        style={{
          height: `${toolbarHeight}px`,
        }}
      >
        {/* 배경 이미지/그라디언트 - 패러랙스 효과 */}
        <div
          className={`${styles.toolbarBackground} ${styles.optimized}`}
          style={{
            opacity: imageOpacity,
            transform: `scale(${imageScale})`,
            background: backgroundGradient,
          }}
        >
          {backgroundImage}
          <div className={styles.bgGradient} />
        </div>

        {/* 상단 액션 바 - 항상 보임 */}
        <div
          className={styles.toolbarActions}
          style={{
            backdropFilter: `blur(${backdropBlur}px)`,
            background: `rgba(255, 255, 255, ${scrollProgress * 0.95})`,
          }}
        >
          {backButton || <button className={styles.actionIcon}>←</button>}
          <div className={styles.actionsRight}>
            {actions.map((action, i) => (
              <button
                key={i}
                className={styles.actionIcon}
                onClick={action.onClick}
              >
                {action.icon}
              </button>
            ))}
          </div>
        </div>

        {/* 타이틀 - 축소되면서 위로 이동 */}
        <div
          className={`${styles.toolbarContent} ${styles.optimized}`}
          style={{
            transform: `translateY(${titleTranslateY}px) scale(${titleScale})`,
            opacity: 1 - scrollProgress * 0.3,
          }}
        >
          {title}
        </div>
      </div>

      {/* 스티키 탭 - 툴바 축소 후 상단 고정 */}
      {tabs.length > 0 && (
        <div
          className={styles.stickyTabs}
          style={{
            top: `${toolbarHeight}px`,
          }}
        >
          {tabs.map((tab, i) => (
            <button
              key={i}
              className="tab"
              style={{
                padding: '8px 16px',
                background: tab.active ? '#667eea' : 'transparent',
                border: `1px solid ${tab.active ? '#667eea' : '#e5e5e5'}`,
                borderRadius: '20px',
                fontSize: '14px',
                fontWeight: 500,
                color: tab.active ? 'white' : '#666',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s',
                flexShrink: 0,
              }}
              onClick={() => onTabChange && onTabChange(tab.value)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}

      {/* 메인 콘텐츠 */}
      <div className={styles.content}>
        {children}
      </div>
    </div>
  );
};

CollapsingToolbarLayout.propTypes = {
  title: PropTypes.node.isRequired,
  backgroundImage: PropTypes.node,
  backgroundGradient: PropTypes.string,
  actions: PropTypes.arrayOf(
    PropTypes.shape({
      icon: PropTypes.node.isRequired,
      onClick: PropTypes.func,
    })
  ),
  backButton: PropTypes.node,
  tabs: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
      active: PropTypes.bool,
    })
  ),
  onTabChange: PropTypes.func,
  children: PropTypes.node,
  maxHeight: PropTypes.number,
  minHeight: PropTypes.number,
  containerStyles: PropTypes.object,
  onScroll: PropTypes.func,
};
