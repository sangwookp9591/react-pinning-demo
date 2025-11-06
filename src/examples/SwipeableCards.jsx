import { useState, useRef } from 'react';
import './SwipeableCards.css';

// 3. Swipeable Cards - Tinder처럼 스와이프 가능한 카드
export const SwipeableCards = () => {
  const [cards, setCards] = useState([
    { id: 1, title: '서울 강남', price: '₩450,000', image: '🏙️', rating: 4.9 },
    { id: 2, title: '제주 바다뷰', price: '₩320,000', image: '🌊', rating: 4.8 },
    { id: 3, title: '부산 해운대', price: '₩280,000', image: '🏖️', rating: 4.7 },
    { id: 4, title: '경주 한옥', price: '₩180,000', image: '🏘️', rating: 4.6 },
    { id: 5, title: '강릉 펜션', price: '₩220,000', image: '🏔️', rating: 4.5 },
  ]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [likes, setLikes] = useState([]);
  const [passes, setPasses] = useState([]);

  const startPos = useRef({ x: 0, y: 0 });
  const cardRef = useRef(null);

  const SWIPE_THRESHOLD = 100;

  const handleTouchStart = (e) => {
    startPos.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    };
    setIsDragging(true);
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;

    const deltaX = e.touches[0].clientX - startPos.current.x;
    const deltaY = e.touches[0].clientY - startPos.current.y;

    setPosition({ x: deltaX, y: deltaY });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);

    if (Math.abs(position.x) > SWIPE_THRESHOLD) {
      // 스와이프 완료
      const direction = position.x > 0 ? 'right' : 'left';
      handleSwipe(direction);
    } else {
      // 원위치
      setPosition({ x: 0, y: 0 });
    }
  };

  const handleSwipe = (direction) => {
    const currentCard = cards[currentIndex];

    // 애니메이션으로 화면 밖으로 날림
    setPosition({
      x: direction === 'right' ? 1000 : -1000,
      y: position.y,
    });

    // Flutter에 이벤트 전송
    if (window.flutter_inappwebview) {
      window.flutter_inappwebview.callHandler('onCardSwiped', {
        cardId: currentCard.id,
        direction,
      });
    }

    setTimeout(() => {
      if (direction === 'right') {
        setLikes([...likes, currentCard]);
      } else {
        setPasses([...passes, currentCard]);
      }

      setCurrentIndex(currentIndex + 1);
      setPosition({ x: 0, y: 0 });
    }, 300);
  };

  const handleButtonSwipe = (direction) => {
    setPosition({
      x: direction === 'right' ? 500 : -500,
      y: 0,
    });
    handleSwipe(direction);
  };

  if (currentIndex >= cards.length) {
    return (
      <div className="swipe-container">
        <div className="swipe-complete">
          <h2>🎉 모든 카드를 확인했습니다!</h2>
          <div className="swipe-stats">
            <div className="stat-box">
              <div className="stat-icon">❤️</div>
              <div className="stat-number">{likes.length}</div>
              <div className="stat-label">좋아요</div>
            </div>
            <div className="stat-box">
              <div className="stat-icon">👎</div>
              <div className="stat-number">{passes.length}</div>
              <div className="stat-label">패스</div>
            </div>
          </div>
          <button
            className="reset-btn"
            onClick={() => {
              setCurrentIndex(0);
              setLikes([]);
              setPasses([]);
            }}
          >
            다시 시작
          </button>
        </div>
      </div>
    );
  }

  const currentCard = cards[currentIndex];
  const rotation = position.x / 20;
  const opacity = 1 - Math.abs(position.x) / 500;

  return (
    <div className="swipe-container">
      <header className="swipe-header">
        <h1>🏠 숙소 찾기</h1>
        <p>좌우로 스와이프하여 선택하세요</p>
      </header>

      {/* 카드 스택 */}
      <div className="card-stack">
        {/* 다음 카드들 미리보기 */}
        {cards.slice(currentIndex + 1, currentIndex + 3).map((card, index) => (
          <div
            key={card.id}
            className="swipe-card preview"
            style={{
              transform: `scale(${1 - (index + 1) * 0.05}) translateY(${(index + 1) * -10}px)`,
              zIndex: cards.length - index - 1,
              opacity: 1 - (index + 1) * 0.3,
            }}
          >
            <div className="card-image">{card.image}</div>
          </div>
        ))}

        {/* 현재 카드 */}
        <div
          ref={cardRef}
          className="swipe-card active"
          style={{
            transform: `translateX(${position.x}px) translateY(${position.y}px) rotate(${rotation}deg)`,
            opacity: opacity,
            transition: isDragging ? 'none' : 'all 0.3s cubic-bezier(0.4, 0.0, 0.2, 1)',
            zIndex: cards.length,
          }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* 스와이프 인디케이터 */}
          <div
            className="swipe-indicator like"
            style={{ opacity: Math.max(0, position.x / 200) }}
          >
            ❤️ LIKE
          </div>
          <div
            className="swipe-indicator nope"
            style={{ opacity: Math.max(0, -position.x / 200) }}
          >
            👎 NOPE
          </div>

          <div className="card-image">{currentCard.image}</div>
          <div className="card-info">
            <h2>{currentCard.title}</h2>
            <div className="card-details">
              <span className="card-rating">⭐ {currentCard.rating}</span>
              <span className="card-price">{currentCard.price} / 박</span>
            </div>
            <div className="card-features">
              <span>🛏️ 킹 사이즈 침대</span>
              <span>🅿️ 주차 가능</span>
              <span>🏊 수영장</span>
            </div>
          </div>
        </div>
      </div>

      {/* 스와이프 버튼 */}
      <div className="swipe-actions">
        <button
          className="action-btn nope"
          onClick={() => handleButtonSwipe('left')}
        >
          ✕
        </button>
        <button
          className="action-btn super"
          onClick={() => {
            if (window.flutter_inappwebview) {
              window.flutter_inappwebview.callHandler('onSuperLike', {
                cardId: currentCard.id,
              });
            }
          }}
        >
          ⭐
        </button>
        <button
          className="action-btn like"
          onClick={() => handleButtonSwipe('right')}
        >
          ❤️
        </button>
      </div>

      {/* 진행 상황 */}
      <div className="swipe-progress">
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${((currentIndex + 1) / cards.length) * 100}%` }}
          />
        </div>
        <p>
          {currentIndex + 1} / {cards.length}
        </p>
      </div>

      {/* 설명 */}
      <div className="swipe-info">
        <p>💡 Tinder 스타일 스와이프 카드</p>
        <ul>
          <li>좌/우 스와이프로 선택</li>
          <li>스택형 카드 프리뷰</li>
          <li>자연스러운 물리 효과</li>
          <li>버튼으로도 제어 가능</li>
        </ul>
      </div>
    </div>
  );
};
