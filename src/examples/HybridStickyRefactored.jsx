import { ProgressiveStackLayout } from '../components/ProgressiveStackLayout';
import * as styles from './HybridSticky.css';

// HybridSticky를 ProgressiveStackLayout 컴포넌트로 리팩토링한 예제
export const HybridStickyRefactored = () => {
  const features = [
    { icon: '🚀', title: '초고속 성능', desc: 'Zero-runtime CSS로 최고의 성능' },
    { icon: '🎨', title: '타입 안전', desc: 'TypeScript 완벽 지원' },
    { icon: '📦', title: '작은 번들', desc: 'Tree-shaking으로 최적화' },
    { icon: '✨', title: '우수한 DX', desc: '자동완성과 오타 방지' },
    { icon: '🎯', title: 'CSS Modules', desc: '로컬 스코프 보장' },
    { icon: '⚡', title: '빌드 최적화', desc: '정적 CSS 추출' },
  ];

  // 히어로 콘텐츠
  const heroContent = (
    <>
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
    </>
  );

  // 레이어 설정
  const layers = [
    {
      content: (
        <>
          <h2 className={styles.layerTitle}>
            <span className={styles.layerIcon}>⚡</span>
            Layer 1 - Sticks to Top
          </h2>
          <div className={styles.layerActions}>
            <button className={styles.layerButton}>Search</button>
            <button className={styles.layerButton}>Menu</button>
          </div>
        </>
      ),
      topOffset: 0,
      zIndex: 40,
      background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      spacerHeight: 400,
      spacerBackground: 'rgba(0, 0, 0, 0.3)',
      spacerContent: (
        <div style={{ padding: '80px 32px', textAlign: 'center' }}>
          <h3 style={{ fontSize: '32px', margin: '0 0 16px 0' }}>⬇️ 계속 스크롤하세요</h3>
          <p style={{ fontSize: '18px', color: '#8b949e', margin: 0 }}>
            레이어들이 순차적으로 고정됩니다
          </p>
        </div>
      ),
      postSpacerHeight: 500,
      postSpacerBackground: 'rgba(0, 0, 0, 0.5)',
      postSpacerContent: (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h3 style={{ fontSize: '28px', marginBottom: '16px' }}>Layer 1이 고정되었습니다!</h3>
          <p style={{ fontSize: '16px', color: '#8b949e', lineHeight: 1.6 }}>
            계속 스크롤하면 Layer 2가 Layer 1 아래 64px에 고정됩니다.
          </p>
        </div>
      ),
    },
    {
      content: (
        <>
          <h2 className={styles.layerTitle}>
            <span className={styles.layerIcon}>🎯</span>
            Layer 2 - Stacks Below Layer 1
          </h2>
          <div className={styles.layerActions}>
            <button className={styles.layerButton}>Filter</button>
            <button className={styles.layerButton}>Sort</button>
          </div>
        </>
      ),
      topOffset: '64px',
      zIndex: 30,
      background: 'rgba(102, 126, 234, 0.95)',
      postSpacerHeight: 500,
      postSpacerBackground: 'rgba(0, 0, 0, 0.6)',
      postSpacerContent: (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h3 style={{ fontSize: '28px', marginBottom: '16px' }}>두 개의 레이어가 쌓였습니다!</h3>
          <p style={{ fontSize: '16px', color: '#8b949e', lineHeight: 1.6 }}>
            이제 Layer 3이 순차적으로 고정됩니다.
          </p>
        </div>
      ),
    },
    {
      content: (
        <>
          <h2 className={styles.layerTitle}>
            <span className={styles.layerIcon}>🎨</span>
            Layer 3 - Progressive Stacking
          </h2>
          <div className={styles.layerActions}>
            <button className={styles.layerButton}>View</button>
            <button className={styles.layerButton}>Share</button>
          </div>
        </>
      ),
      topOffset: '128px',
      zIndex: 20,
      background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      postSpacerHeight: 500,
      postSpacerBackground: 'rgba(0, 0, 0, 0.7)',
      postSpacerContent: (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h3 style={{ fontSize: '28px', marginBottom: '16px' }}>세 개의 레이어 스택!</h3>
          <p style={{ fontSize: '16px', color: '#8b949e', lineHeight: 1.6 }}>
            마지막 Layer 4가 곧 고정됩니다.
          </p>
        </div>
      ),
    },
    {
      content: (
        <>
          <h2 className={styles.layerTitle}>
            <span className={styles.layerIcon}>✨</span>
            Layer 4 - Final Layer
          </h2>
          <div className={styles.layerActions}>
            <button className={styles.layerButton}>Settings</button>
            <button className={styles.layerButton}>Help</button>
          </div>
        </>
      ),
      topOffset: '192px',
      zIndex: 10,
      background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    },
  ];

  return (
    <ProgressiveStackLayout
      hero={heroContent}
      heroStyles={{
        padding: '80px 32px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      }}
      layers={layers}
      containerStyles={{
        background: '#0d1117',
        color: '#ffffff',
      }}
      showProgressBar={true}
      showScrollIndicator={true}
    >
      {/* 메인 콘텐츠 */}
      <div className={styles.content}>
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
            ProgressiveStackLayout 컴포넌트 사용 예제
          </h3>
          <ul className={styles.techList}>
            <li className={styles.techItem}>
              <span className={styles.techLabel}>
                재사용 가능한 레이아웃
              </span>
              <p className={styles.techDesc}>
                hero, layers, children props로 콘텐츠만 전달하면 자동으로 progressive stacking 구현
              </p>
            </li>
            <li className={styles.techItem}>
              <span className={styles.techLabel}>
                Flutter WebView 최적화
              </span>
              <p className={styles.techDesc}>
                window.flutter_inappwebview.callHandler('onProgressiveScroll')로 자동 통신
              </p>
            </li>
            <li className={styles.techItem}>
              <span className={styles.techLabel}>
                커스터마이징 가능
              </span>
              <p className={styles.techDesc}>
                각 레이어의 topOffset, zIndex, background, spacerHeight 등 자유롭게 설정
              </p>
            </li>
            <li className={styles.techItem}>
              <span className={styles.techLabel}>
                TypeScript Props 검증
              </span>
              <p className={styles.techDesc}>
                PropTypes로 모든 props 타입 검증, 안전한 사용 보장
              </p>
            </li>
            <li className={styles.techItem}>
              <span className={styles.techLabel}>
                콜백 함수 지원
              </span>
              <p className={styles.techDesc}>
                onScroll, onHeroProgress 콜백으로 커스텀 로직 추가 가능
              </p>
            </li>
            <li className={styles.techItem}>
              <span className={styles.techLabel}>
                Vanilla Extract 스타일링
              </span>
              <p className={styles.techDesc}>
                Zero-runtime, 타입 안전한 CSS로 성능과 DX 모두 확보
              </p>
            </li>
          </ul>
        </div>
      </div>
    </ProgressiveStackLayout>
  );
};
