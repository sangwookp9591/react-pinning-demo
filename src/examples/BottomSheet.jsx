import { useState, useRef } from 'react';
import './BottomSheet.css';

// 2. Bottom Sheet - 네이티브 앱처럼 하단에서 올라오는 시트
export const BottomSheet = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [sheetHeight, setSheetHeight] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startY = useRef(0);
  const currentTranslate = useRef(0);

  const MAX_HEIGHT = window.innerHeight * 0.9;
  const SNAP_POINTS = [0, MAX_HEIGHT * 0.4, MAX_HEIGHT * 0.7, MAX_HEIGHT];

  const openSheet = (height = SNAP_POINTS[2]) => {
    setIsOpen(true);
    setSheetHeight(height);

    // Flutter에 이벤트 전송
    if (window.flutter_inappwebview) {
      window.flutter_inappwebview.callHandler('onBottomSheetOpen', { height });
    }
  };

  const closeSheet = () => {
    setSheetHeight(0);
    setTimeout(() => setIsOpen(false), 300);

    if (window.flutter_inappwebview) {
      window.flutter_inappwebview.callHandler('onBottomSheetClose');
    }
  };

  const handleTouchStart = (e) => {
    startY.current = e.touches[0].clientY;
    currentTranslate.current = sheetHeight;
    setIsDragging(true);
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;

    const currentY = e.touches[0].clientY;
    const diff = startY.current - currentY;
    const newHeight = Math.max(0, Math.min(MAX_HEIGHT, currentTranslate.current + diff));

    setSheetHeight(newHeight);
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);

    // 가장 가까운 스냅 포인트로 이동
    const closest = SNAP_POINTS.reduce((prev, curr) =>
      Math.abs(curr - sheetHeight) < Math.abs(prev - sheetHeight) ? curr : prev
    );

    if (closest === 0) {
      closeSheet();
    } else {
      setSheetHeight(closest);
    }
  };

  const products = Array.from({ length: 20 }, (_, i) => ({
    id: i + 1,
    name: `상품 ${i + 1}`,
    price: Math.floor(Math.random() * 100000) + 10000,
    image: ['🎮', '👟', '🎧', '📱', '⌚'][i % 5],
  }));

  return (
    <div className="bs-container">
      {/* 메인 컨텐츠 */}
      <div className="bs-main">
        <h1>🛍️ 쇼핑몰</h1>
        <p>상품을 탭하면 Bottom Sheet가 열립니다</p>

        <div className="product-grid">
          {products.map((product) => (
            <div
              key={product.id}
              className="product-card"
              onClick={() => openSheet(SNAP_POINTS[2])}
            >
              <div className="product-image">{product.image}</div>
              <h3>{product.name}</h3>
              <p className="product-price">₩{product.price.toLocaleString()}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Sheet Overlay */}
      {isOpen && (
        <div
          className="bs-overlay"
          style={{ opacity: Math.min(sheetHeight / (MAX_HEIGHT * 0.5), 0.5) }}
          onClick={closeSheet}
        />
      )}

      {/* Bottom Sheet */}
      {isOpen && (
        <div
          className="bottom-sheet"
          style={{
            height: `${sheetHeight}px`,
            transition: isDragging ? 'none' : 'height 0.3s cubic-bezier(0.4, 0.0, 0.2, 1)',
          }}
        >
          {/* 드래그 핸들 */}
          <div
            className="bs-handle-area"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div className="bs-handle" />
          </div>

          {/* Sheet 컨텐츠 */}
          <div className="bs-content">
            <div className="bs-header">
              <div className="product-detail-image">🎮</div>
              <div className="product-detail-info">
                <h2>프리미엄 게임 콘솔</h2>
                <p className="detail-price">₩349,000</p>
                <div className="rating">⭐⭐⭐⭐⭐ 4.8 (1,234)</div>
              </div>
            </div>

            <div className="bs-tabs">
              <button className="tab active">상세정보</button>
              <button className="tab">리뷰</button>
              <button className="tab">배송</button>
            </div>

            <div className="bs-body">
              <section className="detail-section">
                <h3>제품 설명</h3>
                <p>최신 기술이 적용된 프리미엄 게임 콘솔입니다.</p>
                <ul>
                  <li>4K HDR 지원</li>
                  <li>120fps 게임 플레이</li>
                  <li>1TB SSD 내장</li>
                  <li>레이트레이싱 지원</li>
                </ul>
              </section>

              <section className="detail-section">
                <h3>상세 스펙</h3>
                {Array.from({ length: 10 }, (_, i) => (
                  <p key={i}>
                    스펙 항목 {i + 1}: 상세 설명이 여기에 들어갑니다.
                  </p>
                ))}
              </section>

              <section className="detail-section">
                <h3>고객 리뷰</h3>
                {Array.from({ length: 5 }, (_, i) => (
                  <div key={i} className="review-item">
                    <div className="review-header">
                      <span>⭐⭐⭐⭐⭐</span>
                      <span>사용자 {i + 1}</span>
                    </div>
                    <p>정말 만족스러운 제품입니다!</p>
                  </div>
                ))}
              </section>
            </div>

            {/* 하단 고정 버튼 */}
            <div className="bs-footer">
              <button className="btn-cart">🛒 장바구니</button>
              <button className="btn-buy">바로 구매</button>
            </div>
          </div>
        </div>
      )}

      {/* 설명 */}
      {!isOpen && (
        <div className="bs-info">
          <h3>💡 Bottom Sheet 특징</h3>
          <ul>
            <li>3가지 높이로 스냅 (40%, 70%, 90%)</li>
            <li>자연스러운 드래그 제스처</li>
            <li>모달 배경 딤 처리</li>
            <li>Flutter와 양방향 통신</li>
            <li>네이티브 앱과 동일한 UX</li>
          </ul>
        </div>
      )}
    </div>
  );
};
