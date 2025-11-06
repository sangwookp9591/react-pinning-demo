import { useState, useRef, useEffect } from 'react';
import './FloatingActionButton.css';

// 7. Floating Action Button - 스크롤 방향에 따라 자동 숨김/표시
// 기술: IntersectionObserver + transform + scale + position: fixed
export const FloatingActionButton = () => {
  const [fabVisible, setFabVisible] = useState(true);
  const [fabExpanded, setFabExpanded] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const containerRef = useRef(null);
  const observerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 스크롤 방향 감지
    const handleScroll = () => {
      const currentScrollY = container.scrollTop;

      // 스크롤 다운: FAB 숨김, 스크롤 업: FAB 표시
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setFabVisible(false);
        setFabExpanded(false);
      } else if (currentScrollY < lastScrollY) {
        setFabVisible(true);
      }

      // 스크롤 탑 버튼 표시 (300px 이상 스크롤 시)
      setShowScrollTop(currentScrollY > 300);

      setLastScrollY(currentScrollY);

      // Flutter에 FAB 상태 전송
      if (window.flutter_inappwebview) {
        window.flutter_inappwebview.callHandler('onFabStateChanged', {
          visible: currentScrollY < lastScrollY || currentScrollY < 100,
          scrollTop: currentScrollY,
        });
      }
    };

    // IntersectionObserver로 섹션 감지
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const sectionId = entry.target.id;
            console.log('섹션 진입:', sectionId);
          }
        });
      },
      { threshold: 0.5 }
    );

    // 모든 섹션 관찰
    const sections = container.querySelectorAll('.fab-section');
    sections.forEach((section) => observerRef.current.observe(section));

    container.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      container.removeEventListener('scroll', handleScroll);
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [lastScrollY]);

  const scrollToTop = () => {
    containerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFabClick = () => {
    if (window.flutter_inappwebview) {
      window.flutter_inappwebview.callHandler('onFabClicked');
    }
    setFabExpanded(!fabExpanded);
  };

  return (
    <div className="fab-container" ref={containerRef}>
      {/* 헤더 */}
      <header className="fab-header">
        <h1>📱 쇼핑 앱</h1>
        <button className="header-cart">🛒 <span className="cart-badge">3</span></button>
      </header>

      {/* 컨텐츠 섹션들 */}
      <section id="featured" className="fab-section">
        <h2>✨ 추천 상품</h2>
        <div className="product-grid">
          {Array.from({ length: 6 }, (_, i) => (
            <div key={i} className="product-card-fab">
              <div className="product-image-fab">
                {['👕', '👖', '👗', '👠', '👜', '⌚'][i]}
              </div>
              <h3>상품 {i + 1}</h3>
              <p className="product-price-fab">₩{(i + 1) * 10000}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="new" className="fab-section">
        <h2>🆕 신상품</h2>
        <div className="product-grid">
          {Array.from({ length: 6 }, (_, i) => (
            <div key={i} className="product-card-fab">
              <div className="product-image-fab">
                {['🎮', '📱', '💻', '🎧', '📷', '⌨️'][i]}
              </div>
              <h3>신상품 {i + 1}</h3>
              <p className="product-price-fab">₩{(i + 1) * 15000}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="sale" className="fab-section">
        <h2>🔥 할인 중</h2>
        <div className="product-grid">
          {Array.from({ length: 8 }, (_, i) => (
            <div key={i} className="product-card-fab">
              <div className="product-image-fab">
                {['🍕', '🍔', '🍜', '🍱', '🍛', '🥗', '🍰', '🍩'][i]}
              </div>
              <div className="sale-badge">-50%</div>
              <h3>할인 상품 {i + 1}</h3>
              <p className="product-price-fab">
                <span className="original-price">₩{(i + 1) * 20000}</span>
                ₩{(i + 1) * 10000}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Main FAB - 확장 가능 */}
      <div className={`fab-main ${fabVisible ? 'visible' : 'hidden'}`}>
        <button className="fab-button main" onClick={handleFabClick}>
          {fabExpanded ? '✕' : '➕'}
        </button>

        {/* 확장된 액션들 */}
        {fabExpanded && (
          <div className="fab-actions">
            <button className="fab-button action" style={{ transitionDelay: '0.05s' }}>
              <span className="fab-icon">🛒</span>
              <span className="fab-label">장바구니</span>
            </button>
            <button className="fab-button action" style={{ transitionDelay: '0.1s' }}>
              <span className="fab-icon">❤️</span>
              <span className="fab-label">찜하기</span>
            </button>
            <button className="fab-button action" style={{ transitionDelay: '0.15s' }}>
              <span className="fab-icon">💬</span>
              <span className="fab-label">문의</span>
            </button>
          </div>
        )}
      </div>

      {/* Scroll to Top 버튼 */}
      {showScrollTop && (
        <button
          className={`scroll-top-btn ${fabVisible ? 'with-fab' : ''}`}
          onClick={scrollToTop}
        >
          ⬆️
        </button>
      )}

      {/* 기술 설명 */}
      <div className="tech-info-fab">
        <h3>🛠️ 사용 기술</h3>
        <ul>
          <li>
            <strong>IntersectionObserver:</strong> 섹션별 진입 감지 (페이지 분석에 활용)
          </li>
          <li>
            <strong>position: fixed:</strong> FAB 화면에 고정
          </li>
          <li>
            <strong>transform: scale(0):</strong> 부드러운 나타남/사라짐 애니메이션
          </li>
          <li>
            <strong>Scroll direction detection:</strong> 스크롤 방향에 따라 자동 숨김/표시
          </li>
          <li>
            <strong>Expandable FAB:</strong> 클릭 시 여러 액션으로 확장
          </li>
          <li>
            <strong>Scroll to top:</strong> 300px 이상 스크롤 시 상단 이동 버튼 표시
          </li>
        </ul>
      </div>
    </div>
  );
};
