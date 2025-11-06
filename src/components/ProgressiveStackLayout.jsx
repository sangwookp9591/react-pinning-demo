import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import * as styles from './ProgressiveStackLayout.css';

/**
 * ProgressiveStackLayout - Flutter WebView 최적화 공통 레이아웃
 *
 * GitHub 스타일 히어로 축소 + 스택형 레이어가 순차적으로 고정되는 레이아웃
 *
 * @param {Object} props
 * @param {React.ReactNode} props.hero - 히어로 섹션 콘텐츠
 * @param {Object} props.heroStyles - 히어로 섹션 커스텀 스타일
 * @param {Array<Object>} props.layers - 레이어 배열 [{ content, topOffset, zIndex, background, spacerHeight?, spacerContent? }]
 * @param {React.ReactNode} props.children - 메인 콘텐츠
 * @param {Object} props.containerStyles - 컨테이너 커스텀 스타일
 * @param {boolean} props.showProgressBar - 진행도 바 표시 여부 (기본: true)
 * @param {boolean} props.showScrollIndicator - 스크롤 인디케이터 표시 여부 (기본: true)
 * @param {Function} props.onScroll - 스크롤 콜백 (Flutter WebView 통신용)
 * @param {Function} props.onHeroProgress - 히어로 진행도 콜백
 */
export const ProgressiveStackLayout = ({
  hero,
  heroStyles = {},
  layers = [],
  children,
  containerStyles = {},
  showProgressBar = true,
  showScrollIndicator = true,
  onScroll,
  onHeroProgress,
}) => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [heroProgress, setHeroProgress] = useState(0);
  const containerRef = useRef(null);
  const heroRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    const hero = heroRef.current;
    if (!container || !hero) return;

    const handleScroll = () => {
      const scrollTop = container.scrollTop;
      const scrollHeight = container.scrollHeight - container.clientHeight;
      const heroHeight = hero.offsetHeight;

      // 전체 스크롤 진행도 (0 ~ 100)
      const totalProgress = (scrollTop / scrollHeight) * 100;
      setScrollProgress(totalProgress);

      // 히어로 축소 진행도 (0 ~ 1)
      const heroShrink = Math.min(scrollTop / heroHeight, 1);
      setHeroProgress(heroShrink);

      // Flutter WebView 통신
      if (window.flutter_inappwebview) {
        window.flutter_inappwebview.callHandler('onProgressiveScroll', {
          totalProgress,
          heroProgress: heroShrink,
          scrollTop,
        });
      }

      // 커스텀 콜백
      if (onScroll) {
        onScroll({
          totalProgress,
          heroProgress: heroShrink,
          scrollTop,
        });
      }

      if (onHeroProgress) {
        onHeroProgress(heroShrink);
      }
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, [onScroll, onHeroProgress]);

  // 히어로 스타일 계산
  const heroScale = 1 - heroProgress * 0.3; // 1 -> 0.7
  const heroOpacity = 1 - heroProgress; // 1 -> 0
  const contentOpacity = Math.min(heroProgress * 2, 1); // 0 -> 1

  return (
    <div
      className={styles.container}
      ref={containerRef}
      style={containerStyles}
    >
      {/* 진행도 바 */}
      {showProgressBar && (
        <div className={styles.progressBar}>
          <div
            className={styles.progressFill}
            style={{ width: `${scrollProgress}%` }}
          />
        </div>
      )}

      {/* 히어로 섹션 - 축소되면서 사라짐 */}
      <section
        ref={heroRef}
        className={styles.hero}
        style={{
          transform: `scale(${heroScale})`,
          opacity: heroOpacity,
          ...heroStyles,
        }}
      >
        {hero}

        {/* 스크롤 인디케이터 */}
        {showScrollIndicator && heroProgress < 0.1 && (
          <div className={styles.scrollIndicator}>
            <span>스크롤하여 마법을 경험하세요</span>
            <div className={styles.scrollArrow}>⬇</div>
          </div>
        )}
      </section>

      {/* 스택형 레이어들 - 순차적으로 고정됨 */}
      {layers.map((layer, index) => (
        <React.Fragment key={index}>
          {/* 스페이서 - 레이어가 스크롤되다가 고정되도록 */}
          {layer.spacerHeight && (
            <div
              className={styles.spacer}
              style={{
                height: `${layer.spacerHeight}px`,
                background: layer.spacerBackground || 'rgba(0, 0, 0, 0.3)',
              }}
            >
              {layer.spacerContent}
            </div>
          )}

          {/* 레이어 */}
          <div
            className={styles.layerBase}
            style={{
              top: layer.topOffset || 0,
              zIndex: layer.zIndex || (100 - index * 10),
              background: layer.background || 'rgba(255, 255, 255, 0.95)',
              ...layer.style,
            }}
          >
            {layer.content}
          </div>

          {/* 레이어 고정 후 스페이서 */}
          {layer.postSpacerHeight && (
            <div
              style={{
                height: `${layer.postSpacerHeight}px`,
                background: layer.postSpacerBackground || 'rgba(0, 0, 0, 0.5)',
                padding: '60px 32px',
              }}
            >
              {layer.postSpacerContent}
            </div>
          )}
        </React.Fragment>
      ))}

      {/* 메인 컨텐츠 - 페이드인 */}
      <main
        className={styles.content}
        style={{ opacity: contentOpacity }}
      >
        {children}
      </main>
    </div>
  );
};

ProgressiveStackLayout.propTypes = {
  hero: PropTypes.node.isRequired,
  heroStyles: PropTypes.object,
  layers: PropTypes.arrayOf(
    PropTypes.shape({
      content: PropTypes.node.isRequired,
      topOffset: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      zIndex: PropTypes.number,
      background: PropTypes.string,
      style: PropTypes.object,
      spacerHeight: PropTypes.number,
      spacerBackground: PropTypes.string,
      spacerContent: PropTypes.node,
      postSpacerHeight: PropTypes.number,
      postSpacerBackground: PropTypes.string,
      postSpacerContent: PropTypes.node,
    })
  ),
  children: PropTypes.node,
  containerStyles: PropTypes.object,
  showProgressBar: PropTypes.bool,
  showScrollIndicator: PropTypes.bool,
  onScroll: PropTypes.func,
  onHeroProgress: PropTypes.func,
};
