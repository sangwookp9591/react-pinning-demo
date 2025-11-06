import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import * as styles from './StickyTabs.css';

/**
 * StickyTabs - Flutter WebView 최적화 공통 스티키 탭 컴포넌트
 *
 * @param {Object} props
 * @param {Array<Object>} props.tabs - 탭 배열 [{ label, value, icon?, badge?, active?, variant?, disabled? }]
 * @param {Function} props.onTabChange - 탭 변경 콜백
 * @param {string|number} props.top - 상단 고정 위치 (기본: 0)
 * @param {string} props.variant - 컨테이너 스타일 variant ('default', 'transparent', 'glass', 'dark')
 * @param {string} props.activeColor - 활성 탭 색상 (기본: #667eea)
 * @param {Object} props.containerStyles - 컨테이너 커스텀 스타일
 * @param {boolean} props.autoScroll - 활성 탭 자동 스크롤 (기본: true)
 * @param {Function} props.onTabClick - 탭 클릭 콜백 (Flutter WebView 통신용)
 */
export const StickyTabs = ({
  tabs = [],
  onTabChange,
  top = 0,
  variant = 'default',
  activeColor = '#667eea',
  containerStyles = {},
  autoScroll = true,
  onTabClick,
}) => {
  const containerRef = useRef(null);
  const activeTabRef = useRef(null);

  // 활성 탭으로 자동 스크롤
  useEffect(() => {
    if (autoScroll && activeTabRef.current && containerRef.current) {
      const container = containerRef.current;
      const activeTab = activeTabRef.current;

      const containerWidth = container.offsetWidth;
      const activeTabLeft = activeTab.offsetLeft;
      const activeTabWidth = activeTab.offsetWidth;

      // 탭이 화면 중앙에 오도록 스크롤
      const scrollPosition = activeTabLeft - (containerWidth / 2) + (activeTabWidth / 2);

      container.scrollTo({
        left: scrollPosition,
        behavior: 'smooth',
      });
    }
  }, [tabs, autoScroll]);

  const handleTabClick = (tab, index) => {
    if (tab.disabled) return;

    // Flutter WebView 통신
    if (typeof window !== 'undefined' && window.flutter_inappwebview) {
      window.flutter_inappwebview.callHandler('onTabClick', {
        tab: {
          label: tab.label,
          value: tab.value,
          index,
        },
        timestamp: Date.now(),
      });
    }

    // 커스텀 콜백
    if (onTabClick) {
      onTabClick(tab, index);
    }

    // 탭 변경 콜백
    if (onTabChange) {
      onTabChange(tab.value, tab, index);
    }
  };

  const getTabClassName = (tab) => {
    if (tab.active) {
      return styles.tab.active;
    }
    if (tab.variant) {
      return styles.tab[tab.variant] || styles.tab.default;
    }
    return styles.tab.default;
  };

  const getContainerClassName = () => {
    const baseClass = styles.container;
    const variantClass = styles.containerVariants[variant] || styles.containerVariants.default;
    return `${baseClass} ${variantClass}`;
  };

  return (
    <div
      ref={containerRef}
      className={getContainerClassName()}
      style={{
        top: typeof top === 'number' ? `${top}px` : top,
        ...containerStyles,
      }}
    >
      {tabs.map((tab, index) => {
        const isActive = tab.active;
        const hasIcon = !!tab.icon;
        const hasBadge = tab.badge !== undefined && tab.badge !== null;

        return (
          <button
            key={tab.value || index}
            ref={isActive ? activeTabRef : null}
            className={hasIcon ? `${getTabClassName(tab)} ${styles.tabWithIcon}` : getTabClassName(tab)}
            onClick={() => handleTabClick(tab, index)}
            disabled={tab.disabled}
            style={{
              ...(isActive && activeColor && {
                background: activeColor,
                borderColor: activeColor
              }),
              ...(tab.disabled && {
                opacity: 0.5,
                cursor: 'not-allowed'
              }),
            }}
          >
            {hasIcon && <span className={styles.tabIcon}>{tab.icon}</span>}
            <span>{tab.label}</span>
            {hasBadge && (
              <span className={styles.badge}>
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

StickyTabs.propTypes = {
  tabs: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
      icon: PropTypes.node,
      badge: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      active: PropTypes.bool,
      variant: PropTypes.oneOf(['default', 'primary', 'secondary', 'success', 'danger']),
      disabled: PropTypes.bool,
    })
  ).isRequired,
  onTabChange: PropTypes.func,
  top: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  variant: PropTypes.oneOf(['default', 'transparent', 'glass', 'dark']),
  activeColor: PropTypes.string,
  containerStyles: PropTypes.object,
  autoScroll: PropTypes.bool,
  onTabClick: PropTypes.func,
};
