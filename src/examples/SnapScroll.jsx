import { useState, useRef, useEffect } from 'react';
import './SnapScroll.css';

// 8. Snap Scroll - 섹션별 스냅 스크롤 + 네비게이션 동기화
// 기술: CSS scroll-snap + IntersectionObserver + position: fixed + progress indicator
export const SnapScroll = () => {
  const [activeSection, setActiveSection] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const containerRef = useRef(null);
  const sectionsRef = useRef([]);

  const sections = [
    {
      id: 0,
      title: '환영합니다',
      subtitle: '스냅 스크롤 데모',
      emoji: '👋',
      color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    },
    {
      id: 1,
      title: '빠른 성능',
      subtitle: '60fps 부드러운 스크롤',
      emoji: '⚡',
      color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    },
    {
      id: 2,
      title: '쉬운 사용',
      subtitle: 'CSS만으로 구현',
      emoji: '✨',
      color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    },
    {
      id: 3,
      title: '모바일 최적화',
      subtitle: '터치 제스처 완벽 지원',
      emoji: '📱',
      color: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    },
    {
      id: 4,
      title: '완료!',
      subtitle: '이제 시작해보세요',
      emoji: '🎉',
      color: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    },
  ];

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // IntersectionObserver로 현재 보이는 섹션 감지
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.dataset.index);
            setActiveSection(index);

            // Flutter에 섹션 변경 알림
            if (window.flutter_inappwebview) {
              window.flutter_inappwebview.callHandler('onSectionChanged', {
                sectionId: index,
                sectionTitle: sections[index].title,
              });
            }
          }
        });
      },
      {
        root: container,
        threshold: 0.6, // 60% 이상 보일 때
      }
    );

    // 모든 섹션 관찰
    sectionsRef.current.forEach((section) => {
      if (section) observer.observe(section);
    });

    // 스크롤 진행도 계산
    const handleScroll = () => {
      const scrollHeight = container.scrollHeight - container.clientHeight;
      const scrollTop = container.scrollTop;
      const progress = (scrollTop / scrollHeight) * 100;
      setScrollProgress(progress);
    };

    container.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      observer.disconnect();
      container.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToSection = (index) => {
    sectionsRef.current[index]?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  return (
    <div className="snap-scroll-container" ref={containerRef}>
      {/* 고정 네비게이션 도트 */}
      <nav className="snap-nav">
        {sections.map((section, index) => (
          <button
            key={section.id}
            className={`nav-dot ${activeSection === index ? 'active' : ''}`}
            onClick={() => scrollToSection(index)}
            aria-label={`섹션 ${index + 1}로 이동`}
          >
            <span className="dot-label">{section.emoji}</span>
          </button>
        ))}
      </nav>

      {/* 스크롤 진행 바 */}
      <div className="scroll-progress-bar">
        <div
          className="progress-fill-bar"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* 섹션들 - 스냅 스크롤 */}
      {sections.map((section, index) => (
        <section
          key={section.id}
          ref={(el) => (sectionsRef.current[index] = el)}
          data-index={index}
          className="snap-section"
          style={{ background: section.color }}
        >
          <div className="section-content">
            <div className="section-emoji">{section.emoji}</div>
            <h1 className="section-title">{section.title}</h1>
            <p className="section-subtitle">{section.subtitle}</p>

            {/* 섹션별 추가 콘텐츠 */}
            {index === 0 && (
              <div className="section-details">
                <p>↓ 아래로 스크롤하거나 옆의 도트를 클릭하세요</p>
              </div>
            )}

            {index === 1 && (
              <div className="section-details">
                <div className="feature-list">
                  <div className="feature-item">
                    <span className="feature-icon">🚀</span>
                    <span>CSS scroll-snap</span>
                  </div>
                  <div className="feature-item">
                    <span className="feature-icon">📐</span>
                    <span>자동 정렬</span>
                  </div>
                  <div className="feature-item">
                    <span className="feature-icon">💨</span>
                    <span>부드러운 전환</span>
                  </div>
                </div>
              </div>
            )}

            {index === 2 && (
              <div className="section-details">
                <div className="code-preview">
                  <pre>
                    {`.container {\n  scroll-snap-type: y mandatory;\n}\n\n.section {\n  scroll-snap-align: start;\n}`}
                  </pre>
                </div>
              </div>
            )}

            {index === 3 && (
              <div className="section-details">
                <div className="device-preview">
                  <div className="device-screen">
                    <div className="device-content">📱</div>
                  </div>
                </div>
              </div>
            )}

            {index === 4 && (
              <div className="section-details">
                <button
                  className="cta-button-snap"
                  onClick={() => {
                    if (window.flutter_inappwebview) {
                      window.flutter_inappwebview.callHandler('onGetStarted');
                    }
                    scrollToSection(0);
                  }}
                >
                  처음으로 돌아가기
                </button>
              </div>
            )}

            {/* 섹션 번호 */}
            <div className="section-number">{index + 1} / {sections.length}</div>
          </div>
        </section>
      ))}

      {/* 기술 설명 - 마지막 섹션 */}
      <div className="tech-info-snap">
        <h3>🛠️ 사용 기술</h3>
        <ul>
          <li>
            <strong>CSS scroll-snap-type: y mandatory:</strong> 섹션별 자동 스냅
          </li>
          <li>
            <strong>scroll-snap-align: start:</strong> 섹션 시작 지점에 정렬
          </li>
          <li>
            <strong>IntersectionObserver:</strong> 현재 섹션 감지 (네비게이션 동기화)
          </li>
          <li>
            <strong>position: fixed:</strong> 네비게이션 도트 화면 고정
          </li>
          <li>
            <strong>scrollIntoView():</strong> 부드러운 섹션 이동
          </li>
          <li>
            <strong>Progress indicator:</strong> 실시간 스크롤 진행도 표시
          </li>
        </ul>
      </div>
    </div>
  );
};
