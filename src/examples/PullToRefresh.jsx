import { useState, useRef, useEffect } from 'react';
import './PullToRefresh.css';

// 1. Pull to Refresh - 네이티브 앱처럼 당겨서 새로고침
export const PullToRefresh = () => {
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [items, setItems] = useState([]);
  const containerRef = useRef(null);
  const startY = useRef(0);
  const currentY = useRef(0);

  const PULL_THRESHOLD = 80; // 새로고침 트리거 거리

  useEffect(() => {
    // 초기 데이터 로드
    loadItems();
  }, []);

  const loadItems = () => {
    const newItems = Array.from({ length: 20 }, (_, i) => ({
      id: Date.now() + i,
      title: `게시물 ${Math.floor(Math.random() * 1000)}`,
      content: '새로운 콘텐츠가 로드되었습니다.',
      time: '방금 전',
    }));
    setItems(newItems);
  };

  const handleTouchStart = (e) => {
    const container = containerRef.current;
    // 최상단에 있을 때만 pull-to-refresh 활성화
    if (container.scrollTop === 0) {
      startY.current = e.touches[0].clientY;
    }
  };

  const handleTouchMove = (e) => {
    const container = containerRef.current;
    if (container.scrollTop !== 0 || isRefreshing) return;

    currentY.current = e.touches[0].clientY;
    const distance = currentY.current - startY.current;

    if (distance > 0) {
      // 당기는 거리에 저항 적용 (rubber band 효과)
      const resistance = Math.pow(distance, 0.7);
      setPullDistance(Math.min(resistance, PULL_THRESHOLD * 1.5));

      // 과도한 스크롤 방지
      if (distance > 10) {
        e.preventDefault();
      }
    }
  };

  const handleTouchEnd = () => {
    if (pullDistance >= PULL_THRESHOLD && !isRefreshing) {
      // 새로고침 실행
      setIsRefreshing(true);
      setPullDistance(PULL_THRESHOLD);

      // Flutter에 새로고침 이벤트 전송
      if (window.flutter_inappwebview) {
        window.flutter_inappwebview.callHandler('onRefresh');
      }

      // 시뮬레이션: 2초 후 새 데이터 로드
      setTimeout(() => {
        loadItems();
        setIsRefreshing(false);
        setPullDistance(0);
      }, 2000);
    } else {
      // 임계값 미달 시 원위치
      setPullDistance(0);
    }

    startY.current = 0;
    currentY.current = 0;
  };

  const progress = Math.min(pullDistance / PULL_THRESHOLD, 1);
  const spinnerRotation = progress * 360;

  return (
    <div
      className="ptr-container"
      ref={containerRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Pull to Refresh 인디케이터 */}
      <div
        className="ptr-indicator"
        style={{
          transform: `translateY(${pullDistance - 60}px)`,
          opacity: pullDistance > 0 ? 1 : 0,
        }}
      >
        <div
          className={`ptr-spinner ${isRefreshing ? 'spinning' : ''}`}
          style={{
            transform: `rotate(${spinnerRotation}deg)`,
          }}
        >
          {isRefreshing ? '🔄' : '⬇️'}
        </div>
        <div className="ptr-text">
          {isRefreshing
            ? '새로고침 중...'
            : pullDistance >= PULL_THRESHOLD
            ? '놓으면 새로고침'
            : '아래로 당겨서 새로고침'}
        </div>
      </div>

      {/* 컨텐츠 */}
      <div
        className="ptr-content"
        style={{
          transform: `translateY(${Math.min(pullDistance, PULL_THRESHOLD)}px)`,
          transition: isRefreshing || pullDistance === 0 ? 'transform 0.3s ease' : 'none',
        }}
      >
        <header className="ptr-header">
          <h1>📱 뉴스피드</h1>
          <p>아래로 당겨서 새로고침하세요</p>
        </header>

        <div className="ptr-feed">
          {items.map((item) => (
            <div key={item.id} className="feed-item">
              <div className="feed-avatar">👤</div>
              <div className="feed-content">
                <h3>{item.title}</h3>
                <p>{item.content}</p>
                <span className="feed-time">{item.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 하단 설명 */}
      <div className="ptr-info">
        <p>💡 이 컴포넌트는 Flutter WebView에 최적화되어 있습니다</p>
        <ul>
          <li>네이티브 앱과 동일한 Pull-to-Refresh UX</li>
          <li>Rubber band 효과로 자연스러운 당김 느낌</li>
          <li>Flutter와 양방향 통신 (callHandler)</li>
          <li>터치 이벤트 최적화로 60fps 유지</li>
        </ul>
      </div>
    </div>
  );
};
