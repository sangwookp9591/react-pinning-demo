import './SimpleSticky.css';

export const SimpleSticky = () => {
  return (
    <div className="simple-container">
      <header className="simple-header">
        <h1>고정 헤더 (Simple CSS Sticky)</h1>
      </header>

      <div className="simple-hero">
        <h2>Hero Section</h2>
        <p>스크롤하면 헤더가 고정됩니다</p>
      </div>

      <div className="simple-content">
        <h2>콘텐츠 영역</h2>
        {Array.from({ length: 50 }, (_, i) => (
          <p key={i}>콘텐츠 라인 {i + 1}</p>
        ))}
      </div>
    </div>
  );
};
