import './TossNavigation.css';

// 2. Toss - 간편한 네비게이션 고정
export const TossNavigation = () => {
  return (
    <div className="toss-container">
      <nav className="toss-nav">
        <div className="toss-logo">toss</div>
        <div className="toss-menu">
          <a href="#about">회사 소개</a>
          <a href="#product">제품</a>
          <a href="#career">채용</a>
        </div>
      </nav>

      <section className="toss-hero">
        <h1>금융의 모든 것</h1>
        <p>토스에서 쉽고 간편하게</p>
      </section>

      <section className="toss-content">
        <div className="feature-card">
          <h2>💳 토스카드</h2>
          <p>혜택 맞춤 추천부터 한 번에</p>
        </div>
        <div className="feature-card">
          <h2>💰 토스뱅크</h2>
          <p>은행보다 쉬운 금융</p>
        </div>
        <div className="feature-card">
          <h2>📊 토스증권</h2>
          <p>수수료 0원으로 투자하기</p>
        </div>
        <div className="feature-card">
          <h2>🏠 토스부동산</h2>
          <p>집 구하기가 쉬워진다</p>
        </div>
        <div className="feature-card">
          <h2>🚗 토스 보험</h2>
          <p>보험도 쉽고 빠르게</p>
        </div>
        <div className="feature-card">
          <h2>💼 토스페이먼츠</h2>
          <p>비즈니스를 위한 결제</p>
        </div>
      </section>
    </div>
  );
};
