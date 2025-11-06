import { useState, useRef, useEffect } from 'react';
import * as styles from './HybridSticky.css';

// 10. Hybrid Sticky - GitHub 히어로 축소 + 스택형 레이어 (Vanilla Extract)
export const HybridSticky = () => {
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

      // Flutter에 스크롤 상태 전송
      if (window.flutter_inappwebview) {
        window.flutter_inappwebview.callHandler('onHybridScroll', {
          totalProgress,
          heroProgress: heroShrink,
          scrollTop,
        });
      }
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  // 히어로 스타일 계산
  const heroScale = 1 - heroProgress * 0.3; // 1 -> 0.7
  const heroOpacity = 1 - heroProgress; // 1 -> 0
  const contentOpacity = Math.min(heroProgress * 2, 1); // 0 -> 1

  const features = [
    { icon: '🚀', title: '초고속 성능', desc: 'Zero-runtime CSS로 최고의 성능' },
    { icon: '🎨', title: '타입 안전', desc: 'TypeScript 완벽 지원' },
    { icon: '📦', title: '작은 번들', desc: 'Tree-shaking으로 최적화' },
    { icon: '✨', title: '우수한 DX', desc: '자동완성과 오타 방지' },
    { icon: '🎯', title: 'CSS Modules', desc: '로컬 스코프 보장' },
    { icon: '⚡', title: '빌드 최적화', desc: '정적 CSS 추출' },
  ];

  return (
    <div className={styles.container} ref={containerRef}>
      {/* 진행도 바 */}
      <div className={styles.progressBar}>
        <div
          className={styles.progressFill}
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* 히어로 섹션 - 축소되면서 사라짐 */}
      <section
        ref={heroRef}
        className={styles.hero}
        style={{
          transform: `scale(${heroScale})`,
          opacity: heroOpacity,
        }}
      >
        <div className={styles.heroPattern} />
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            Hybrid Sticky Experience
          </h1>
          <p className={styles.heroSubtitle}>
            GitHub 스타일 히어로 축소 + 스택형 레이어가 만나
            <br />
            완전히 새로운 스크롤 경험을 만듭니다
          </p>
          <button className={styles.heroCta}>
            시작하기
          </button>
        </div>

        {/* 스크롤 인디케이터 */}
        {heroProgress < 0.1 && (
          <div className={styles.scrollIndicator}>
            <span>스크롤하여 마법을 경험하세요</span>
            <div className={styles.scrollArrow}>⬇</div>
          </div>
        )}
      </section>

      {/* 스페이서 - 레이어 1이 스크롤되다가 고정되도록 */}
      <div style={{ height: '400px', background: 'rgba(0, 0, 0, 0.3)' }}>
        <div style={{ padding: '80px 32px', textAlign: 'center' }}>
          <h3 style={{ fontSize: '32px', margin: '0 0 16px 0' }}>⬇️ 계속 스크롤하세요</h3>
          <p style={{ fontSize: '18px', color: '#8b949e', margin: 0 }}>
            레이어들이 순차적으로 고정됩니다
          </p>
        </div>
      </div>

      {/* 스택형 레이어 1 - 스크롤되다가 최상단에 고정 */}
      <div className={styles.layers.layer1}>
        <h2 className={styles.layerTitle}>
          <span className={styles.layerIcon}>⚡</span>
          Layer 1 - Sticks to Top
        </h2>
        <div className={styles.layerActions}>
          <button className={styles.layerButton}>Search</button>
          <button className={styles.layerButton}>Menu</button>
        </div>
      </div>

      {/* 중간 컨텐츠 */}
      <div style={{ height: '500px', background: 'rgba(0, 0, 0, 0.5)', padding: '60px 32px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h3 style={{ fontSize: '28px', marginBottom: '16px' }}>Layer 1이 고정되었습니다!</h3>
          <p style={{ fontSize: '16px', color: '#8b949e', lineHeight: 1.6 }}>
            계속 스크롤하면 Layer 2가 Layer 1 아래 64px에 고정됩니다.
          </p>
        </div>
      </div>

      {/* 스택형 레이어 2 - Layer 1 아래 64px에 고정 */}
      <div className={styles.layers.layer2}>
        <h2 className={styles.layerTitle}>
          <span className={styles.layerIcon}>🎯</span>
          Layer 2 - Stacks Below Layer 1
        </h2>
        <div className={styles.layerActions}>
          <button className={styles.layerButton}>Filter</button>
          <button className={styles.layerButton}>Sort</button>
        </div>
      </div>

      {/* 중간 컨텐츠 */}
      <div style={{ height: '500px', background: 'rgba(0, 0, 0, 0.6)', padding: '60px 32px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h3 style={{ fontSize: '28px', marginBottom: '16px' }}>두 개의 레이어가 쌓였습니다!</h3>
          <p style={{ fontSize: '16px', color: '#8b949e', lineHeight: 1.6 }}>
            이제 Layer 3이 순차적으로 고정됩니다.
          </p>
        </div>
      </div>

      {/* 스택형 레이어 3 - Layer 2 아래 64px에 고정 */}
      <div className={styles.layers.layer3}>
        <h2 className={styles.layerTitle}>
          <span className={styles.layerIcon}>🎨</span>
          Layer 3 - Progressive Stacking
        </h2>
        <div className={styles.layerActions}>
          <button className={styles.layerButton}>View</button>
          <button className={styles.layerButton}>Share</button>
        </div>
      </div>

      {/* 중간 컨텐츠 */}
      <div style={{ height: '500px', background: 'rgba(0, 0, 0, 0.7)', padding: '60px 32px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h3 style={{ fontSize: '28px', marginBottom: '16px' }}>세 개의 레이어 스택!</h3>
          <p style={{ fontSize: '16px', color: '#8b949e', lineHeight: 1.6 }}>
            마지막 Layer 4가 곧 고정됩니다.
          </p>
        </div>
      </div>

      {/* 스택형 레이어 4 - Layer 3 아래 64px에 고정 */}
      <div className={styles.layers.layer4}>
        <h2 className={styles.layerTitle}>
          <span className={styles.layerIcon}>✨</span>
          Layer 4 - Final Layer
        </h2>
        <div className={styles.layerActions}>
          <button className={styles.layerButton}>Settings</button>
          <button className={styles.layerButton}>Help</button>
        </div>
      </div>

      {/* 메인 컨텐츠 - 페이드인 */}
      <main
        className={styles.content}
        style={{ opacity: contentOpacity }}
      >
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            🎉 모든 레이어가 고정되었습니다!
          </h2>
          <p style={{ fontSize: '18px', color: '#8b949e', marginBottom: '48px', textAlign: 'center' }}>
            4개의 레이어가 순차적으로 쌓이면서 완성된 멋진 UI를 확인하세요
          </p>

          <h2 className={styles.sectionTitle} style={{ marginTop: '48px' }}>주요 기능</h2>
          <div className={styles.grid}>
            {features.map((feature, i) => (
              <div key={i} className={styles.card}>
                <div className={styles.cardIcon}>{feature.icon}</div>
                <h3 className={styles.cardTitle}>{feature.title}</h3>
                <p className={styles.cardDesc}>{feature.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>더 많은 기능</h2>
          <div className={styles.grid}>
            {[
              { icon: '🔒', title: 'Type Safety', desc: 'CSS 오타 방지' },
              { icon: '🎭', title: 'Variants', desc: '상태별 스타일 관리' },
              { icon: '🌈', title: 'Themes', desc: '디자인 토큰 시스템' },
              { icon: '🔥', title: 'Hot Reload', desc: 'CSS 즉시 반영' },
              { icon: '📱', title: 'Responsive', desc: '모바일 퍼스트' },
              { icon: '♿', title: 'Accessible', desc: 'a11y 고려' },
            ].map((feature, i) => (
              <div key={i} className={styles.card}>
                <div className={styles.cardIcon}>{feature.icon}</div>
                <h3 className={styles.cardTitle}>{feature.title}</h3>
                <p className={styles.cardDesc}>{feature.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 기술 설명 */}
        <div className={styles.techInfo}>
          <h3 className={styles.techTitle}>
            <span>🛠️</span>
            사용된 고급 기술
          </h3>
          <ul className={styles.techList}>
            <li className={styles.techItem}>
              <span className={styles.techLabel}>
                Hero Shrinking Effect
              </span>
              <p className={styles.techDesc}>
                transform: scale() + opacity로 히어로 섹션이 스크롤 시 부드럽게 축소되며 사라짐
              </p>
            </li>
            <li className={styles.techItem}>
              <span className={styles.techLabel}>
                Progressive Stacked Sticky Layers
              </span>
              <p className={styles.techDesc}>
                각 레이어가 스크롤되다가 순차적으로 고정되면서 쌓이는 효과 (position: sticky + 서로 다른 top 값)
              </p>
            </li>
            <li className={styles.techItem}>
              <span className={styles.techLabel}>
                Spacer Sections
              </span>
              <p className={styles.techDesc}>
                레이어 사이에 스페이서를 두어 스크롤되면서 순차적으로 고정되는 자연스러운 흐름 생성
              </p>
            </li>
            <li className={styles.techItem}>
              <span className={styles.techLabel}>
                Vanilla Extract Style Variants
              </span>
              <p className={styles.techDesc}>
                styleVariants로 레이어별 그라디언트 배경을 타입 안전하게 관리
              </p>
            </li>
            <li className={styles.techItem}>
              <span className={styles.techLabel}>
                Content Fade-in
              </span>
              <p className={styles.techDesc}>
                히어로가 사라지면서 메인 콘텐츠가 opacity 애니메이션으로 나타남
              </p>
            </li>
            <li className={styles.techItem}>
              <span className={styles.techLabel}>
                Progress Indicator
              </span>
              <p className={styles.techDesc}>
                fixed position + width transition으로 실시간 스크롤 진행도 표시
              </p>
            </li>
            <li className={styles.techItem}>
              <span className={styles.techLabel}>
                Backdrop Filter
              </span>
              <p className={styles.techDesc}>
                backdrop-filter: blur()로 레이어에 glassmorphism 효과 적용
              </p>
            </li>
            <li className={styles.techItem}>
              <span className={styles.techLabel}>
                CSS Keyframes
              </span>
              <p className={styles.techDesc}>
                @vanilla-extract/css의 keyframes()로 타입 안전한 애니메이션 정의
              </p>
            </li>
            <li className={styles.techItem}>
              <span className={styles.techLabel}>
                Zero Runtime CSS
              </span>
              <p className={styles.techDesc}>
                빌드 타임에 정적 CSS로 추출되어 런타임 오버헤드 0
              </p>
            </li>
            <li className={styles.techItem}>
              <span className={styles.techLabel}>
                will-change Optimization
              </span>
              <p className={styles.techDesc}>
                GPU 가속으로 60fps 부드러운 스크롤 애니메이션 보장
              </p>
            </li>
          </ul>
        </div>
      </main>
    </div>
  );
};
