import './NotionSidebar.css';

// 3. Notion - 사이드바 + 컨텐츠 독립 스크롤
export const NotionSidebar = () => {
  const pages = ['Getting Started', 'Quick Start', 'Templates', 'Guides', 'API Reference'];

  return (
    <div className="notion-container">
      {/* 고정 사이드바 */}
      <aside className="notion-sidebar">
        <div className="notion-workspace">
          <h3>📝 My Workspace</h3>
        </div>
        <nav className="notion-nav">
          {pages.map((page, i) => (
            <a key={i} href={`#${page}`} className="notion-page">
              📄 {page}
            </a>
          ))}
        </nav>
        <div className="notion-footer">
          <button>+ New Page</button>
        </div>
      </aside>

      {/* 스크롤 가능한 메인 콘텐츠 */}
      <main className="notion-main">
        <h1>Welcome to Notion</h1>
        <p>Everything you need to know about getting started.</p>

        {Array.from({ length: 20 }, (_, i) => (
          <div key={i} className="notion-block">
            <h2>Section {i + 1}</h2>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
          </div>
        ))}
      </main>
    </div>
  );
};
