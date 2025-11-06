import { useState, useRef, useEffect } from 'react';
import './CollapsingToolbar.css';

// 6. Collapsing Toolbar - Material Design 스타일 축소 툴바
// 기술: CSS calc() + clamp() + position: sticky + transform + backdrop-filter
export const CollapsingToolbar = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const containerRef = useRef(null);
  const toolbarMaxHeight = 300;
  const toolbarMinHeight = 60;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollTop = container.scrollTop;
      const maxScroll = toolbarMaxHeight - toolbarMinHeight;

      // 0 ~ 1 사이의 진행도
      const progress = Math.min(scrollTop / maxScroll, 1);
      setScrollProgress(progress);

      // Flutter에 스크롤 진행도 전송
      if (window.flutter_inappwebview) {
        window.flutter_inappwebview.callHandler('onToolbarCollapse', {
          progress,
          isCollapsed: progress >= 1,
        });
      }
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  // 진행도에 따른 값 계산
  const toolbarHeight = toolbarMaxHeight - (toolbarMaxHeight - toolbarMinHeight) * scrollProgress;
  const titleScale = 1 - scrollProgress * 0.4; // 1 -> 0.6
  const titleTranslateY = -scrollProgress * 80; // 위로 이동
  const imageOpacity = 1 - scrollProgress * 0.7; // 1 -> 0.3
  const imageScale = 1 + scrollProgress * 0.2; // 패러랙스 zoom
  const backdropBlur = scrollProgress * 10; // 0 -> 10px

  return (
    <div className="collapsing-container" ref={containerRef}>
      {/* Collapsing Toolbar */}
      <div
        className="collapsing-toolbar"
        style={{
          height: `${toolbarHeight}px`,
        }}
      >
        {/* 배경 이미지 - 패러랙스 효과 */}
        <div
          className="toolbar-background"
          style={{
            opacity: imageOpacity,
            transform: `scale(${imageScale})`,
          }}
        >
          <div className="bg-gradient" />
        </div>

        {/* 상단 액션 바 - 항상 보임 */}
        <div
          className="toolbar-actions"
          style={{
            backdropFilter: `blur(${backdropBlur}px)`,
            background: `rgba(255, 255, 255, ${scrollProgress * 0.95})`,
          }}
        >
          <button className="action-icon">←</button>
          <div className="actions-right">
            <button className="action-icon">🔍</button>
            <button className="action-icon">❤️</button>
            <button className="action-icon">⋮</button>
          </div>
        </div>

        {/* 타이틀 - 축소되면서 위로 이동 */}
        <div
          className="toolbar-content"
          style={{
            transform: `translateY(${titleTranslateY}px) scale(${titleScale})`,
            opacity: 1 - scrollProgress * 0.3,
          }}
        >
          <h1>제주도 여행 가이드</h1>
          <p>최고의 관광지와 맛집을 소개합니다</p>
          <div className="toolbar-stats">
            <span>⭐ 4.8</span>
            <span>•</span>
            <span>리뷰 1,234개</span>
            <span>•</span>
            <span>방문자 수 50만+</span>
          </div>
        </div>
      </div>

      {/* 스티키 탭 - 툴바 축소 후 상단 고정 */}
      <div
        className="sticky-tabs"
        style={{
          top: `${toolbarHeight}px`,
        }}
      >
        <button className="tab active">전체</button>
        <button className="tab">관광지</button>
        <button className="tab">맛집</button>
        <button className="tab">숙소</button>
        <button className="tab">교통</button>
      </div>

      {/* 컨텐츠 */}
      <div className="collapsing-content">
        <section className="content-section">
          <h2>🏝️ 인기 관광지</h2>
          {Array.from({ length: 5 }, (_, i) => (
            <div key={i} className="place-card">
              <div className="place-image">
                {['🌊', '🗻', '🌴', '🏖️', '🌅'][i]}
              </div>
              <div className="place-info">
                <h3>명소 {i + 1}</h3>
                <p>제주도의 아름다운 풍경을 감상하세요</p>
                <div className="place-meta">
                  <span>⭐ 4.{9 - i}</span>
                  <span>📍 제주시</span>
                </div>
              </div>
            </div>
          ))}
        </section>

        <section className="content-section">
          <h2>🍜 추천 맛집</h2>
          {Array.from({ length: 5 }, (_, i) => (
            <div key={i} className="place-card">
              <div className="place-image">
                {['🍲', '🍜', '🍱', '🍛', '🥘'][i]}
              </div>
              <div className="place-info">
                <h3>맛집 {i + 1}</h3>
                <p>제주도 특산물로 만든 전통 요리</p>
                <div className="place-meta">
                  <span>⭐ 4.{8 - i}</span>
                  <span>💰 15,000원~</span>
                </div>
              </div>
            </div>
          ))}
        </section>

        <section className="content-section">
          <h2>🏨 숙소 추천</h2>
          {Array.from({ length: 5 }, (_, i) => (
            <div key={i} className="place-card">
              <div className="place-image">
                {['🏨', '🏠', '🏡', '🏘️', '🏢'][i]}
              </div>
              <div className="place-info">
                <h3>숙소 {i + 1}</h3>
                <p>편안한 휴식을 위한 최고의 선택</p>
                <div className="place-meta">
                  <span>⭐ 4.{7 - i}</span>
                  <span>💰 ₩80,000/박</span>
                </div>
              </div>
            </div>
          ))}
        </section>
      </div>

      {/* 기술 설명 */}
      <div className="tech-info-collapse">
        <h3>🛠️ 사용 기술</h3>
        <ul>
          <li>
            <strong>CSS calc() & clamp():</strong> 동적 높이 계산으로 부드러운 축소
          </li>
          <li>
            <strong>position: sticky:</strong> 탭바가 툴바 축소 후 상단 고정
          </li>
          <li>
            <strong>transform: scale():</strong> 타이틀 크기 애니메이션
          </li>
          <li>
            <strong>backdrop-filter: blur():</strong> 유리 모피즘(glassmorphism) 효과
          </li>
          <li>
            <strong>Parallax effect:</strong> 배경 이미지 확대로 입체감
          </li>
          <li>
            <strong>will-change:</strong> GPU 가속으로 60fps 유지
          </li>
        </ul>
      </div>
    </div>
  );
};
