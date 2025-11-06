import './ProductDetail.css';

// 4. 쿠팡/아마존 - 상품 상세 이미지 갤러리 고정
export const ProductDetail = () => {
  return (
    <div className="product-container">
      {/* 고정된 이미지 갤러리 */}
      <div className="product-gallery">
        <div className="main-image">
          <div className="image-placeholder">📷</div>
        </div>
        <div className="thumbnail-list">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="thumbnail" />
          ))}
        </div>
      </div>

      {/* 스크롤 가능한 상품 정보 */}
      <div className="product-info">
        <h1>프리미엄 무선 이어폰</h1>
        <div className="rating">⭐⭐⭐⭐⭐ 4.8 (2,345개 리뷰)</div>
        <div className="price">
          <span className="original">₩149,000</span>
          <span className="discount">₩99,000</span>
          <span className="percent">34% 할인</span>
        </div>

        <div className="options">
          <h3>색상 선택</h3>
          <div className="color-options">
            <button className="color-btn active" style={{ background: '#000' }} />
            <button className="color-btn" style={{ background: '#fff', border: '1px solid #ddd' }} />
            <button className="color-btn" style={{ background: '#3b82f6' }} />
          </div>
        </div>

        <div className="buy-buttons">
          <button className="cart-btn">장바구니</button>
          <button className="buy-btn">바로 구매</button>
        </div>

        <div className="product-details">
          <h3>상품 상세정보</h3>
          {Array.from({ length: 15 }, (_, i) => (
            <p key={i}>
              상세 설명 내용 {i + 1}. 프리미엄 사운드와 노이즈 캔슬링 기능으로
              최상의 음악 경험을 제공합니다.
            </p>
          ))}
        </div>

        <div className="reviews">
          <h3>고객 리뷰 (2,345)</h3>
          {Array.from({ length: 10 }, (_, i) => (
            <div key={i} className="review-card">
              <div className="review-header">
                <span className="reviewer">고객 {i + 1}</span>
                <span className="review-rating">⭐⭐⭐⭐⭐</span>
              </div>
              <p>정말 만족스러운 제품입니다. 추천합니다!</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
