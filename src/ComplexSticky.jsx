import { useState, useEffect, useRef, useCallback } from 'react';
import './ComplexSticky.css';

export const ComplexSticky = () => {
  const [scrollState, setScrollState] = useState({
    isPinned: false,
    progress: 0,
  });

  const containerRef = useRef(null);
  const headerRef = useRef(null);
  const heroRef = useRef(null);
  const rafRef = useRef(null);

  const handleScroll = useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }

    rafRef.current = requestAnimationFrame(() => {
      if (!containerRef.current || !heroRef.current) return;

      const scrollTop = containerRef.current.scrollTop;
      const heroHeight = heroRef.current.offsetHeight;

      const isPinned = scrollTop > heroHeight;
      const progress = Math.min(scrollTop / heroHeight, 1);

      setScrollState({ isPinned, progress });
    });
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      container.removeEventListener('scroll', handleScroll);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [handleScroll]);

  return (
    <div className="complex-container" ref={containerRef}>
      <header
        ref={headerRef}
        className={`complex-header ${scrollState.isPinned ? 'pinned' : ''}`}
      >
        <h1>고정 헤더 (Complex with Tracking)</h1>
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${scrollState.progress * 100}%` }}
          />
        </div>
      </header>

      <div
        ref={heroRef}
        className="complex-hero"
        style={{
          transform: `translateY(${scrollState.progress * 50}px)`,
          opacity: 1 - scrollState.progress * 0.5,
        }}
      >
        <h2>Hero Section with Parallax</h2>
        <p>스크롤 진행도: {Math.round(scrollState.progress * 100)}%</p>
      </div>

      <div className="complex-content">
        <h2>콘텐츠 영역</h2>
        <p className="status-info">
          상태: {scrollState.isPinned ? '헤더 고정됨' : '일반 스크롤'}
        </p>
        {Array.from({ length: 50 }, (_, i) => (
          <p key={i}>콘텐츠 라인 {i + 1}</p>
        ))}
      </div>
    </div>
  );
};
