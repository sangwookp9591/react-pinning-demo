import { useState } from 'react';
import { StickyTabs } from '../components/StickyTabs';
import './StickyTabsDemo.css';

// StickyTabs 공통 컴포넌트 데모
export const StickyTabsDemo = () => {
  const [activeTab1, setActiveTab1] = useState('all');
  const [activeTab2, setActiveTab2] = useState('home');
  const [activeTab3, setActiveTab3] = useState('pending');

  // 기본 탭 (쇼핑몰 카테고리)
  const tabs1 = [
    { label: '전체', value: 'all', active: activeTab1 === 'all' },
    { label: '인기', value: 'popular', active: activeTab1 === 'popular' },
    { label: '신상품', value: 'new', active: activeTab1 === 'new' },
    { label: '할인', value: 'sale', active: activeTab1 === 'sale', badge: '30%' },
    { label: '브랜드', value: 'brand', active: activeTab1 === 'brand' },
    { label: '이벤트', value: 'event', active: activeTab1 === 'event', badge: 'HOT' },
  ];

  // 아이콘이 있는 탭 (네비게이션)
  const tabs2 = [
    { label: '홈', value: 'home', icon: '🏠', active: activeTab2 === 'home' },
    { label: '탐색', value: 'explore', icon: '🔍', active: activeTab2 === 'explore' },
    { label: '알림', value: 'notifications', icon: '🔔', active: activeTab2 === 'notifications', badge: 3 },
    { label: '메시지', value: 'messages', icon: '💬', active: activeTab2 === 'messages', badge: 12 },
    { label: '프로필', value: 'profile', icon: '👤', active: activeTab2 === 'profile' },
  ];

  // Variant 탭 (주문 상태)
  const tabs3 = [
    { label: '대기중', value: 'pending', active: activeTab3 === 'pending', variant: 'default', badge: 5 },
    { label: '처리중', value: 'processing', active: activeTab3 === 'processing', variant: 'primary', badge: 3 },
    { label: '배송중', value: 'shipping', active: activeTab3 === 'shipping', variant: 'secondary', badge: 2 },
    { label: '완료', value: 'completed', active: activeTab3 === 'completed', variant: 'success', badge: 24 },
    { label: '취소', value: 'canceled', active: activeTab3 === 'canceled', variant: 'danger', badge: 1 },
  ];

  return (
    <div className="sticky-tabs-demo-container">
      {/* 헤더 */}
      <div className="demo-header">
        <h1>StickyTabs Component Demo</h1>
        <p>Flutter WebView 최적화 공통 스티키 탭 컴포넌트</p>
      </div>

      {/* 예제 1: 기본 탭 */}
      <section className="demo-section">
        <h2>📌 예제 1: 기본 스타일 탭</h2>
        <p className="demo-description">일반적인 쇼핑몰 카테고리 탭 스타일</p>

        <StickyTabs
          tabs={tabs1}
          onTabChange={(value) => setActiveTab1(value)}
          top={0}
          variant="default"
        />

        <div className="demo-content">
          <h3>현재 선택된 탭: {activeTab1}</h3>
          <div className="demo-cards">
            {Array.from({ length: 8 }, (_, i) => (
              <div key={i} className="demo-card">
                <div className="card-image">
                  {['📱', '💻', '⌚', '🎧', '📷', '🎮', '🖥️', '⌨️'][i]}
                </div>
                <h4>상품 {i + 1}</h4>
                <p className="card-price">₩{(i + 1) * 10000}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 예제 2: 아이콘 탭 */}
      <section className="demo-section">
        <h2>🎨 예제 2: 아이콘 + 배지 탭</h2>
        <p className="demo-description">소셜 미디어 스타일 네비게이션</p>

        <StickyTabs
          tabs={tabs2}
          onTabChange={(value) => setActiveTab2(value)}
          top={64}
          variant="glass"
          activeColor="#667eea"
        />

        <div className="demo-content">
          <h3>현재 페이지: {tabs2.find(t => t.value === activeTab2)?.label}</h3>
          <div className="demo-feed">
            {Array.from({ length: 5 }, (_, i) => (
              <div key={i} className="feed-item">
                <div className="feed-avatar">
                  {['👨', '👩', '🧑', '👴', '👵'][i]}
                </div>
                <div className="feed-content">
                  <h4>사용자 {i + 1}</h4>
                  <p>게시물 내용이 여기에 표시됩니다...</p>
                  <div className="feed-meta">
                    <span>❤️ {(i + 1) * 10}</span>
                    <span>💬 {(i + 1) * 5}</span>
                    <span>🔄 {i + 1}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 예제 3: Variant 탭 */}
      <section className="demo-section">
        <h2>🎯 예제 3: 색상 Variant 탭</h2>
        <p className="demo-description">주문 상태별 다른 색상 표시</p>

        <StickyTabs
          tabs={tabs3}
          onTabChange={(value) => setActiveTab3(value)}
          top={128}
          variant="default"
          autoScroll={true}
        />

        <div className="demo-content">
          <h3>주문 상태: {tabs3.find(t => t.value === activeTab3)?.label}</h3>
          <div className="demo-list">
            {Array.from({ length: 6 }, (_, i) => (
              <div key={i} className="list-item">
                <div className="list-icon">📦</div>
                <div className="list-content">
                  <h4>주문 #{1000 + i}</h4>
                  <p>상품명: 제품 {i + 1}</p>
                  <p className="list-meta">
                    <span>₩{(i + 1) * 15000}</span>
                    <span>•</span>
                    <span>2024-01-{15 + i}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 예제 4: Dark 모드 */}
      <section className="demo-section dark-section">
        <h2>🌙 예제 4: Dark 모드</h2>
        <p className="demo-description">다크 테마 환경에 적합한 스타일</p>

        <StickyTabs
          tabs={[
            { label: '전체', value: 'all', active: true },
            { label: '영화', value: 'movie', icon: '🎬' },
            { label: '드라마', value: 'drama', icon: '📺' },
            { label: '예능', value: 'variety', icon: '🎭' },
            { label: '다큐', value: 'documentary', icon: '🎥' },
          ]}
          top={192}
          variant="dark"
        />

        <div className="demo-content dark-content">
          <h3 style={{ color: 'white' }}>컨텐츠 목록</h3>
          <div className="demo-cards">
            {Array.from({ length: 6 }, (_, i) => (
              <div key={i} className="demo-card dark-card">
                <div className="card-image">
                  {['🎬', '📺', '🎭', '🎥', '🎪', '🎨'][i]}
                </div>
                <h4 style={{ color: 'white' }}>컨텐츠 {i + 1}</h4>
                <p style={{ color: '#999' }}>재생 시간: {30 + i * 5}분</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 기술 설명 */}
      <div className="tech-info">
        <h3>🛠️ StickyTabs 컴포넌트 특징</h3>
        <ul>
          <li>
            <strong>Flutter WebView 최적화:</strong> window.flutter_inappwebview.callHandler('onTabClick') 자동 통신
          </li>
          <li>
            <strong>자동 스크롤:</strong> 활성 탭이 화면 중앙에 오도록 자동 스크롤
          </li>
          <li>
            <strong>아이콘 + 배지 지원:</strong> 탭에 아이콘과 배지(숫자, 텍스트) 표시 가능
          </li>
          <li>
            <strong>다양한 Variant:</strong> default, primary, secondary, success, danger 색상 지원
          </li>
          <li>
            <strong>컨테이너 스타일:</strong> default, transparent, glass, dark 모드 지원
          </li>
          <li>
            <strong>커스터마이징:</strong> activeColor, top, containerStyles로 자유롭게 커스터마이징
          </li>
          <li>
            <strong>Vanilla Extract:</strong> Zero-runtime, 타입 안전한 CSS
          </li>
          <li>
            <strong>접근성:</strong> disabled 상태, active 상태 명확히 구분
          </li>
        </ul>
      </div>
    </div>
  );
};
