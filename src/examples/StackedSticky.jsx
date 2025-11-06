import './StackedSticky.css';

// 11. 스택형 Sticky - 여러 헤더가 순차적으로 고정
export const StackedSticky = () => {
  return (
    <div className="stacked-container">
      {/* 1번 헤더: 항상 top: 0에 고정 */}
      <header className="header-1">
        <h2>헤더 1 - 항상 최상단 고정 (top: 0)</h2>
      </header>

      {/* 스페이서 - 스크롤 공간 */}
      <div className="spacer-section">
        <h3>스크롤 해보세요 👇</h3>
        <p>헤더 2가 50px에 도달하면 고정됩니다</p>
      </div>

      {/* 2번 헤더: 스크롤하다가 50px에서 고정 */}
      <header className="header-2">
        <h2>헤더 2 - 스크롤 후 50px에 고정</h2>
      </header>

      {/* 중간 컨텐츠 */}
      <div className="content-section">
        <h3>더 스크롤하면...</h3>
        <p>헤더 3이 헤더 2 아래(100px)에 고정됩니다</p>
        {Array.from({ length: 10 }, (_, i) => (
          <p key={i}>중간 콘텐츠 {i + 1}</p>
        ))}
      </div>

      {/* 3번 헤더: 헤더 2가 고정된 후, 그 아래 50px에서 고정 */}
      <header className="header-3">
        <h2>헤더 3 - 헤더 2 아래 50px에 고정</h2>
      </header>

      {/* 메인 컨텐츠 */}
      <div className="main-content">
        <h3>메인 콘텐츠 영역</h3>
        {Array.from({ length: 50 }, (_, i) => (
          <div key={i} className="content-card">
            <h4>카드 {i + 1}</h4>
            <p>
              이제 3개의 헤더가 모두 고정되어 있습니다.
              헤더 1은 top: 0, 헤더 2는 top: 50px, 헤더 3은 top: 100px에 고정됩니다.
            </p>
          </div>
        ))}
      </div>

      {/* 4번 헤더 (보너스): 추가 레이어 */}
      <div className="extra-spacer">
        <h3>보너스: 4번째 레이어도 가능!</h3>
      </div>

      <header className="header-4">
        <h2>헤더 4 - 헤더 3 아래 50px에 고정</h2>
      </header>

      <div className="final-content">
        {Array.from({ length: 20 }, (_, i) => (
          <p key={i}>최종 콘텐츠 {i + 1}</p>
        ))}
      </div>
    </div>
  );
};
