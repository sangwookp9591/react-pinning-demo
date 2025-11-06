import { useState, useEffect, useRef } from 'react';
import './ShrinkingHero.css';

// 12. GitHub 스타일 - 스크롤 시 히어로 축소/사라짐
export const ShrinkingHero = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const containerRef = useRef(null);
  const heroRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const heroHeight = heroRef.current?.offsetHeight || 500;
      const scrollTop = container.scrollTop;

      // 히어로 높이만큼 스크롤될 때까지의 진행도 (0 ~ 1)
      const progress = Math.min(scrollTop / heroHeight, 1);
      setScrollProgress(progress);
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  // 스크롤 진행도에 따른 값 계산
  const heroScale = 1 - scrollProgress * 0.3; // 1 -> 0.7
  const heroOpacity = 1 - scrollProgress; // 1 -> 0
  const contentOpacity = Math.min(scrollProgress * 2, 1); // 0 -> 1
  const headerBg = `rgba(255, 255, 255, ${Math.min(scrollProgress * 1.5, 0.95)})`;

  return (
    <div className="shrinking-container" ref={containerRef}>
      {/* 고정 헤더 - 스크롤 시 배경 나타남 */}
      <header
        className="shrinking-header"
        style={{
          background: headerBg,
          boxShadow: scrollProgress > 0.1 ? '0 2px 8px rgba(0,0,0,0.1)' : 'none'
        }}
      >
        <div className="header-content">
          <div className="logo">🐙 GitHub</div>
          <nav className="nav-menu">
            <a href="#product">Product</a>
            <a href="#solutions">Solutions</a>
            <a href="#resources">Resources</a>
            <a href="#pricing">Pricing</a>
          </nav>
          <div className="header-actions">
            <button className="btn-secondary">Sign in</button>
            <button className="btn-primary">Sign up</button>
          </div>
        </div>
      </header>

      {/* 히어로 섹션 - 스크롤 시 축소 & 페이드아웃 */}
      <section
        ref={heroRef}
        className="shrinking-hero"
        style={{
          transform: `scale(${heroScale})`,
          opacity: heroOpacity,
        }}
      >
        <div className="hero-content">
          <h1>Let's build from here</h1>
          <p>
            The world's leading AI-powered developer platform.
            Millions of developers and companies build, ship, and maintain their software on GitHub.
          </p>
          <div className="hero-actions">
            <input
              type="email"
              placeholder="Email address"
              className="hero-input"
            />
            <button className="hero-button">Sign up for GitHub</button>
          </div>
          <p className="hero-subtext">
            Start a free enterprise trial →
          </p>
        </div>
      </section>

      {/* 메인 컨텐츠 - 스크롤 시 페이드인 */}
      <main
        className="main-content"
        style={{ opacity: contentOpacity }}
      >
        <section className="feature-section">
          <h2>Productivity</h2>
          <h3>Accelerate high-quality software development</h3>
          <p>
            Our AI-powered platform increases the pace of software development
            and helps teams collaborate more effectively.
          </p>

          <div className="feature-grid">
            {[
              { icon: '🤖', title: 'GitHub Copilot', desc: 'AI pair programmer' },
              { icon: '⚡', title: 'Actions', desc: 'Automate workflows' },
              { icon: '🔒', title: 'Security', desc: 'Find and fix vulnerabilities' },
              { icon: '📦', title: 'Packages', desc: 'Host and manage packages' },
              { icon: '📊', title: 'Insights', desc: 'Track team progress' },
              { icon: '🌐', title: 'Codespaces', desc: 'Instant dev environments' },
            ].map((feature, i) => (
              <div key={i} className="feature-card">
                <div className="feature-icon">{feature.icon}</div>
                <h4>{feature.title}</h4>
                <p>{feature.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="stats-section">
          <div className="stat-item">
            <div className="stat-number">100M+</div>
            <div className="stat-label">Developers</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">330M+</div>
            <div className="stat-label">Repositories</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">90%</div>
            <div className="stat-label">Fortune 100</div>
          </div>
        </section>

        <section className="cta-section">
          <h2>Start building today</h2>
          <p>Join millions of developers on GitHub</p>
          <button className="cta-button">Get started for free</button>
        </section>
      </main>
    </div>
  );
};
