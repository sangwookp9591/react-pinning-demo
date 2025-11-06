import { ScrollSyncTabs } from '../components/ScrollSyncTabs';
import './ScrollSyncTabsDemo.css';

// ScrollSyncTabs 데모 - 스크롤 시 자동 탭 포커스
export const ScrollSyncTabsDemo = () => {
  const sections = [
    {
      id: 'intro',
      label: '소개',
      icon: '👋',
      color: '#667eea',
      content: (
        <div className="scroll-sync-section" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
          <div className="section-inner">
            <div className="section-emoji">👋</div>
            <h1 className="section-title">ScrollSyncTabs</h1>
            <p className="section-description">
              스크롤하면 자동으로 탭이 포커스됩니다
            </p>
            <div className="section-features">
              <div className="feature-badge">IntersectionObserver</div>
              <div className="feature-badge">NativeTabBar 스타일</div>
              <div className="feature-badge">WebView 최적화</div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'features',
      label: '주요 기능',
      icon: '⚡',
      color: '#f5576c',
      content: (
        <div className="scroll-sync-section" style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
          <div className="section-inner">
            <div className="section-emoji">⚡</div>
            <h2 className="section-title">주요 기능</h2>
            <div className="feature-grid">
              <div className="feature-card">
                <span className="feature-icon">🎯</span>
                <h3>자동 탭 포커스</h3>
                <p>섹션이 나타나면 자동으로 해당 탭이 활성화</p>
              </div>
              <div className="feature-card">
                <span className="feature-icon">📱</span>
                <h3>부드러운 스크롤</h3>
                <p>탭 클릭 시 smooth scroll로 섹션 이동</p>
              </div>
              <div className="feature-card">
                <span className="feature-icon">🔄</span>
                <h3>양방향 동기화</h3>
                <p>스크롤 → 탭, 탭 → 스크롤 완벽 동기화</p>
              </div>
              <div className="feature-card">
                <span className="feature-icon">⚙️</span>
                <h3>IntersectionObserver</h3>
                <p>효율적인 섹션 감지 (스크롤 이벤트 불필요)</p>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'usage',
      label: '사용법',
      icon: '📖',
      color: '#00f2fe',
      content: (
        <div className="scroll-sync-section" style={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }}>
          <div className="section-inner">
            <div className="section-emoji">📖</div>
            <h2 className="section-title">간단한 사용법</h2>
            <div className="code-block">
              <pre>{`const sections = [
  {
    id: 'intro',
    label: '소개',
    icon: '👋',
    color: '#667eea',
    content: <YourContent />
  },
  // ... more sections
];

<ScrollSyncTabs
  sections={sections}
  enableSnap={false}
  threshold={0.5}
  showProgress={true}
  onSectionChange={(section, index) => {
    console.log('Changed to:', section.label);
  }}
/>`}</pre>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'examples',
      label: '예제',
      icon: '🎨',
      color: '#38f9d7',
      content: (
        <div className="scroll-sync-section" style={{ background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' }}>
          <div className="section-inner">
            <div className="section-emoji">🎨</div>
            <h2 className="section-title">실제 사용 예제</h2>
            <div className="example-list">
              <div className="example-item">
                <h3>📱 쇼핑몰 상품 상세</h3>
                <p>상품정보 → 리뷰 → 추천 섹션을 탭으로 네비게이션</p>
              </div>
              <div className="example-item">
                <h3>📰 뉴스 기사</h3>
                <p>요약 → 본문 → 관련기사 섹션 탭 네비게이션</p>
              </div>
              <div className="example-item">
                <h3>🎓 온라인 강의</h3>
                <p>강의소개 → 커리큘럼 → 리뷰 섹션 자동 탭 전환</p>
              </div>
              <div className="example-item">
                <h3>🏠 부동산 매물</h3>
                <p>매물정보 → 위치 → 주변시설 섹션 탭 동기화</p>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'advantages',
      label: '장점',
      icon: '✨',
      color: '#fee140',
      content: (
        <div className="scroll-sync-section" style={{ background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' }}>
          <div className="section-inner">
            <div className="section-emoji">✨</div>
            <h2 className="section-title">ScrollSyncTabs의 장점</h2>
            <div className="advantage-list">
              <div className="advantage-item">
                <span className="advantage-number">1</span>
                <div className="advantage-content">
                  <h3>자연스러운 UX</h3>
                  <p>사용자가 스크롤하면 자동으로 탭이 따라가서 현재 위치를 명확하게 표시</p>
                </div>
              </div>
              <div className="advantage-item">
                <span className="advantage-number">2</span>
                <div className="advantage-content">
                  <h3>빠른 네비게이션</h3>
                  <p>긴 페이지에서 탭을 클릭하면 해당 섹션으로 즉시 이동</p>
                </div>
              </div>
              <div className="advantage-item">
                <span className="advantage-number">3</span>
                <div className="advantage-content">
                  <h3>성능 최적화</h3>
                  <p>IntersectionObserver로 효율적인 섹션 감지 (scroll event보다 성능 우수)</p>
                </div>
              </div>
              <div className="advantage-item">
                <span className="advantage-number">4</span>
                <div className="advantage-content">
                  <h3>Flutter WebView 통합</h3>
                  <p>섹션 변경 시 자동으로 Flutter에 알림 전송</p>
                </div>
              </div>
              <div className="advantage-item">
                <span className="advantage-number">5</span>
                <div className="advantage-content">
                  <h3>Next.js 16 최적화</h3>
                  <p>App Router + React 19.2 + Vanilla Extract 완벽 지원</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'tech',
      label: '기술',
      icon: '🛠️',
      color: '#667eea',
      content: (
        <div className="scroll-sync-section" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
          <div className="section-inner">
            <div className="section-emoji">🛠️</div>
            <h2 className="section-title">사용된 기술</h2>
            <div className="tech-grid">
              <div className="tech-card">
                <h4>IntersectionObserver API</h4>
                <p>효율적인 섹션 가시성 감지</p>
              </div>
              <div className="tech-card">
                <h4>Smooth Scroll</h4>
                <p>scrollIntoView로 부드러운 이동</p>
              </div>
              <div className="tech-card">
                <h4>Position Sticky</h4>
                <p>탭바 상단 고정</p>
              </div>
              <div className="tech-card">
                <h4>Vanilla Extract</h4>
                <p>Zero-runtime CSS-in-JS</p>
              </div>
              <div className="tech-card">
                <h4>React Refs</h4>
                <p>DOM 요소 직접 제어</p>
              </div>
              <div className="tech-card">
                <h4>Flutter WebView</h4>
                <p>callHandler로 네이티브 통신</p>
              </div>
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <ScrollSyncTabs
      sections={sections}
      enableSnap={false}
      threshold={0.5}
      showProgress={true}
      onSectionChange={(section, index) => {
        console.log(`Section changed to: ${section.label} (${index})`);
      }}
    />
  );
};
