import './RecipeDetail.css';

// 10. 레시피 사이트 - 재료 목록 고정 + 조리법 스크롤
export const RecipeDetail = () => {
  const ingredients = [
    { item: '닭가슴살', amount: '500g' },
    { item: '양파', amount: '1개' },
    { item: '마늘', amount: '5쪽' },
    { item: '간장', amount: '3큰술' },
    { item: '설탕', amount: '2큰술' },
    { item: '참기름', amount: '1큰술' },
    { item: '후추', amount: '약간' },
  ];

  const steps = Array.from({ length: 12 }, (_, i) => ({
    step: i + 1,
    description: `조리 단계 ${i + 1}의 자세한 설명입니다. 이렇게 하면 맛있는 요리를 만들 수 있습니다.`,
  }));

  return (
    <div className="recipe-container">
      <header className="recipe-header">
        <h1>🍗 매콤 닭볶음 레시피</h1>
        <div className="recipe-meta">
          <span>⏱️ 30분</span>
          <span>👨‍🍳 중급</span>
          <span>👥 4인분</span>
        </div>
      </header>

      <div className="recipe-content">
        {/* 고정된 재료 목록 */}
        <aside className="ingredients-sidebar">
          <h2>재료</h2>
          <ul className="ingredients-list">
            {ingredients.map((ing, i) => (
              <li key={i}>
                <span className="ingredient-name">{ing.item}</span>
                <span className="ingredient-amount">{ing.amount}</span>
              </li>
            ))}
          </ul>
          <button className="shopping-btn">🛒 장보기 리스트 추가</button>
        </aside>

        {/* 스크롤 가능한 조리법 */}
        <main className="steps-content">
          <h2>조리 방법</h2>
          {steps.map((step) => (
            <div key={step.step} className="step-card">
              <div className="step-number">{step.step}</div>
              <div className="step-content">
                <h3>단계 {step.step}</h3>
                <p>{step.description}</p>
                <div className="step-image" />
              </div>
            </div>
          ))}

          <div className="recipe-footer">
            <h3>요리 팁 💡</h3>
            <p>닭가슴살은 미리 소금물에 담가두면 더 부드러워집니다.</p>
            <p>마지막에 참기름을 넣으면 고소한 풍미가 살아납니다.</p>
          </div>
        </main>
      </div>
    </div>
  );
};
