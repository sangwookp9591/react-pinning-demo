import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import * as styles from './ScrollSyncTabs.css';

/**
 * ScrollSyncTabs - 스크롤 동기화 탭 컴포넌트 (Flutter WebView 최적화)
 *
 * 섹션이 화면에 나타나면 자동으로 해당 탭이 포커스됨
 *
 * @param {Object} props
 * @param {Array<Object>} props.sections - 섹션 배열 [{ id, label, icon?, color?, content }]
 * @param {boolean} props.enableSnap - CSS scroll-snap 활성화 (기본: false)
 * @param {number} props.threshold - IntersectionObserver threshold (기본: 0.5)
 * @param {boolean} props.showProgress - 진행도 바 표시 (기본: true)
 * @param {Object} props.containerStyles - 컨테이너 커스텀 스타일
 * @param {Function} props.onSectionChange - 섹션 변경 콜백 (Flutter WebView 통신용)
 */
export const ScrollSyncTabs = ({
  sections = [],
  enableSnap = false,
  threshold = 0.5,
  showProgress = true,
  containerStyles = {},
  onSectionChange,
}) => {
  const [activeSection, setActiveSection] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [indicatorStyle, setIndicatorStyle] = useState({});

  const containerRef = useRef(null);
  const tabsRef = useRef([]);
  const sectionsRef = useRef([]);
  const tabScrollRef = useRef(null);
  const isUserScrolling = useRef(true); // 사용자 스크롤인지 프로그램 스크롤인지 구분

  // IntersectionObserver로 현재 보이는 섹션 감지
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!isUserScrolling.current) {
          console.log('🚫 Ignoring scroll (programmatic)');
          return;
        }

        // 가장 많이 보이는 섹션 찾기
        let mostVisibleEntry = null;
        let maxRatio = 0;

        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > maxRatio) {
            maxRatio = entry.intersectionRatio;
            mostVisibleEntry = entry;
          }
        });

        if (mostVisibleEntry) {
          const index = parseInt(mostVisibleEntry.target.dataset.index);
          console.log(`✅ Section ${index} is most visible (${(maxRatio * 100).toFixed(0)}%)`);
          setActiveSection(index);

          // Flutter WebView 통신
          if (typeof window !== 'undefined' && window.flutter_inappwebview) {
            window.flutter_inappwebview.callHandler('onSectionChange', {
              sectionId: sections[index].id,
              sectionLabel: sections[index].label,
              sectionIndex: index,
              timestamp: Date.now(),
            });
          }

          // 커스텀 콜백
          if (onSectionChange) {
            onSectionChange(sections[index], index);
          }
        }
      },
      {
        root: container,
        threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0],
        rootMargin: '-80px 0px -20% 0px',
      }
    );

    // 모든 섹션 관찰
    sectionsRef.current.forEach((section) => {
      if (section) observer.observe(section);
    });

    return () => observer.disconnect();
  }, [sections, threshold, onSectionChange]);

  // 스크롤 진행도 계산
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollHeight = container.scrollHeight - container.clientHeight;
      const scrollTop = container.scrollTop;
      const progress = (scrollTop / scrollHeight) * 100;
      setScrollProgress(progress);
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  // 탭 인디케이터 업데이트
  useEffect(() => {
    updateIndicator(activeSection);
  }, [activeSection]);

  const updateIndicator = (index) => {
    const tab = tabsRef.current[index];
    if (tab) {
      setIndicatorStyle({
        left: tab.offsetLeft,
        width: tab.offsetWidth,
      });

      // 탭바 자동 스크롤 (선택된 탭이 화면 중앙으로)
      const tabScroll = tabScrollRef.current;
      if (tabScroll) {
        const tabCenter = tab.offsetLeft + tab.offsetWidth / 2;
        const containerCenter = tabScroll.offsetWidth / 2;
        const scrollPosition = tabCenter - containerCenter;

        tabScroll.scrollTo({
          left: scrollPosition,
          behavior: 'smooth',
        });
      }
    }
  };

  const handleTabClick = (index) => {
    // 프로그램적 스크롤 시작
    isUserScrolling.current = false;

    setActiveSection(index);

    // 해당 섹션으로 스크롤
    const container = containerRef.current;
    const section = sectionsRef.current[index];

    if (container && section) {
      // 섹션의 컨테이너 내부 위치 계산
      const sectionTop = section.offsetTop;

      // 탭바 높이만큼 오프셋 (60px)
      const scrollTop = sectionTop - 60;

      container.scrollTo({
        top: scrollTop,
        behavior: 'smooth',
      });

      // 스크롤 완료 후 다시 사용자 스크롤 감지 활성화
      setTimeout(() => {
        isUserScrolling.current = true;
      }, 1000);
    }
  };

  return (
    <div
      ref={containerRef}
      className={styles.container}
      style={{
        scrollSnapType: enableSnap ? 'y mandatory' : 'none',
        ...containerStyles,
      }}
    >
      {/* 진행도 바 */}
      {showProgress && (
        <div className={styles.progressBar}>
          <div
            className={styles.progressFill}
            style={{ width: `${scrollProgress}%` }}
          />
        </div>
      )}

      {/* 스티키 탭바 */}
      <div className={styles.tabBar}>
        <div ref={tabScrollRef} className={styles.tabScroll}>
          <div className={styles.tabButtons}>
            {sections.map((section, index) => (
              <button
                key={section.id || index}
                ref={(el) => (tabsRef.current[index] = el)}
                className={`${styles.tab} ${activeSection === index ? styles.tabActive : ''}`}
                onClick={() => handleTabClick(index)}
              >
                {section.icon && (
                  <span className={styles.tabIcon}>{section.icon}</span>
                )}
                <span className={styles.tabLabel}>{section.label}</span>
              </button>
            ))}

            {/* 애니메이션 인디케이터 */}
            <div
              className={styles.indicator}
              style={{
                ...indicatorStyle,
                background: sections[activeSection]?.color || '#667eea',
              }}
            />
          </div>
        </div>
      </div>

      {/* 섹션들 */}
      {sections.map((section, index) => (
        <div
          key={section.id || index}
          ref={(el) => (sectionsRef.current[index] = el)}
          data-index={index}
          className={`${styles.section} ${enableSnap ? styles.sectionVariants.snap : styles.sectionVariants.default}`}
        >
          {section.content}
        </div>
      ))}
    </div>
  );
};

ScrollSyncTabs.propTypes = {
  sections: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      label: PropTypes.string.isRequired,
      icon: PropTypes.node,
      color: PropTypes.string,
      content: PropTypes.node.isRequired,
    })
  ).isRequired,
  enableSnap: PropTypes.bool,
  threshold: PropTypes.number,
  showProgress: PropTypes.bool,
  containerStyles: PropTypes.object,
  onSectionChange: PropTypes.func,
};
