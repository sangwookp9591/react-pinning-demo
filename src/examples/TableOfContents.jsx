import './TableOfContents.css';

// 5. Medium/브런치 - 목차 고정 + 본문 스크롤
export const TableOfContents = () => {
  const sections = [
    'Introduction',
    'Problem Statement',
    'Solution Overview',
    'Implementation',
    'Results',
    'Conclusion',
  ];

  return (
    <div className="toc-container">
      {/* 고정된 목차 */}
      <aside className="toc-sidebar">
        <h3>목차</h3>
        <nav className="toc-nav">
          {sections.map((section, i) => (
            <a key={i} href={`#${section}`} className="toc-link">
              {i + 1}. {section}
            </a>
          ))}
        </nav>
        <div className="reading-time">☕ 15분 분량</div>
      </aside>

      {/* 스크롤 가능한 아티클 */}
      <article className="article-content">
        <header className="article-header">
          <h1>How We Scaled Our System to Handle 1M Users</h1>
          <div className="article-meta">
            <span>by John Doe</span>
            <span>·</span>
            <span>Dec 15, 2024</span>
          </div>
        </header>

        {sections.map((section, i) => (
          <section key={i} id={section} className="article-section">
            <h2>{section}</h2>
            {Array.from({ length: 5 }, (_, j) => (
              <p key={j}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.
              </p>
            ))}
          </section>
        ))}
      </article>
    </div>
  );
};
