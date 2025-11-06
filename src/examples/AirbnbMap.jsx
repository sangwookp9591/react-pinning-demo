import './AirbnbMap.css';

// 1. Airbnb - 검색 결과 + 지도 고정
export const AirbnbMap = () => {
  const listings = Array.from({ length: 20 }, (_, i) => ({
    id: i + 1,
    title: `Cozy Apartment ${i + 1}`,
    price: Math.floor(Math.random() * 200) + 50,
    rating: (Math.random() * 2 + 3).toFixed(1),
  }));

  return (
    <div className="airbnb-container">
      {/* 검색 결과 리스트 */}
      <div className="airbnb-listings">
        <div className="airbnb-header">
          <h2>서울 숙소 300개+</h2>
          <div className="filters">
            <button>가격</button>
            <button>숙소 유형</button>
            <button>필터</button>
          </div>
        </div>

        <div className="listing-grid">
          {listings.map((listing) => (
            <div key={listing.id} className="listing-card">
              <div className="listing-image" />
              <div className="listing-info">
                <h3>{listing.title}</h3>
                <p>⭐ {listing.rating} · 슈퍼호스트</p>
                <p className="price">₩{listing.price.toLocaleString()} / 박</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 고정된 지도 */}
      <aside className="airbnb-map">
        <div className="map-placeholder">
          <h3>🗺️ 지도</h3>
          <p>스크롤해도 고정됨</p>
        </div>
      </aside>
    </div>
  );
};
