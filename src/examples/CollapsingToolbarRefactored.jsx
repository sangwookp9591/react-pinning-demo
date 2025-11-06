import { useState } from 'react';
import { CollapsingToolbarLayout } from '../components/CollapsingToolbarLayout';
import './CollapsingToolbar.css';

// CollapsingToolbar를 공통 컴포넌트로 리팩토링한 예제
export const CollapsingToolbarRefactored = () => {
  const [activeTab, setActiveTab] = useState('전체');

  // 타이틀 콘텐츠
  const titleContent = (
    <>
      <h1 style={{ margin: '0 0 8px 0', fontSize: '36px', fontWeight: 'bold', textShadow: '0 2px 8px rgba(0, 0, 0, 0.3)' }}>
        제주도 여행 가이드
      </h1>
      <p style={{ margin: '0 0 12px 0', fontSize: '16px', opacity: 0.95, textShadow: '0 1px 4px rgba(0, 0, 0, 0.3)' }}>
        최고의 관광지와 맛집을 소개합니다
      </p>
      <div style={{ display: 'flex', gap: '8px', fontSize: '14px', opacity: 0.9 }}>
        <span>⭐ 4.8</span>
        <span>•</span>
        <span>리뷰 1,234개</span>
        <span>•</span>
        <span>방문자 수 50만+</span>
      </div>
    </>
  );

  // 액션 버튼
  const actions = [
    { icon: '🔍', onClick: () => console.log('Search') },
    { icon: '❤️', onClick: () => console.log('Favorite') },
    { icon: '⋮', onClick: () => console.log('More') },
  ];

  // 탭 설정
  const tabs = [
    { label: '전체', value: '전체', active: activeTab === '전체' },
    { label: '관광지', value: '관광지', active: activeTab === '관광지' },
    { label: '맛집', value: '맛집', active: activeTab === '맛집' },
    { label: '숙소', value: '숙소', active: activeTab === '숙소' },
    { label: '교통', value: '교통', active: activeTab === '교통' },
  ];

  return (
    <CollapsingToolbarLayout
      title={titleContent}
      backgroundGradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
      actions={actions}
      tabs={tabs}
      onTabChange={setActiveTab}
      maxHeight={300}
      minHeight={60}
    >
      {/* 메인 콘텐츠 */}
      <section className="content-section">
        <h2>🏝️ 인기 관광지</h2>
        {Array.from({ length: 5 }, (_, i) => (
          <div key={i} className="place-card">
            <div className="place-image">
              {['🌊', '🗻', '🌴', '🏖️', '🌅'][i]}
            </div>
            <div className="place-info">
              <h3>명소 {i + 1}</h3>
              <p>제주도의 아름다운 풍경을 감상하세요</p>
              <div className="place-meta">
                <span>⭐ 4.{9 - i}</span>
                <span>📍 제주시</span>
              </div>
            </div>
          </div>
        ))}
      </section>

      <section className="content-section">
        <h2>🍜 추천 맛집</h2>
        {Array.from({ length: 5 }, (_, i) => (
          <div key={i} className="place-card">
            <div className="place-image">
              {['🍲', '🍜', '🍱', '🍛', '🥘'][i]}
            </div>
            <div className="place-info">
              <h3>맛집 {i + 1}</h3>
              <p>제주도 특산물로 만든 전통 요리</p>
              <div className="place-meta">
                <span>⭐ 4.{8 - i}</span>
                <span>💰 15,000원~</span>
              </div>
            </div>
          </div>
        ))}
      </section>

      <section className="content-section">
        <h2>🏨 숙소 추천</h2>
        {Array.from({ length: 5 }, (_, i) => (
          <div key={i} className="place-card">
            <div className="place-image">
              {['🏨', '🏠', '🏡', '🏘️', '🏢'][i]}
            </div>
            <div className="place-info">
              <h3>숙소 {i + 1}</h3>
              <p>편안한 휴식을 위한 최고의 선택</p>
              <div className="place-meta">
                <span>⭐ 4.{7 - i}</span>
                <span>💰 ₩80,000/박</span>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* 기술 설명 */}
      <div className="tech-info-collapse">
        <h3>🛠️ CollapsingToolbarLayout 컴포넌트 사용 예제</h3>
        <ul>
          <li>
            <strong>재사용 가능한 레이아웃:</strong> title, actions, tabs, children props로 콘텐츠 주입
          </li>
          <li>
            <strong>Flutter WebView 최적화:</strong> window.flutter_inappwebview.callHandler('onToolbarCollapse') 자동 통신
          </li>
          <li>
            <strong>Material Design 스타일:</strong> 부드러운 툴바 축소 애니메이션
          </li>
          <li>
            <strong>Parallax 효과:</strong> 배경 이미지 확대로 입체감 제공
          </li>
          <li>
            <strong>커스터마이징 가능:</strong> maxHeight, minHeight, backgroundGradient 등 자유롭게 설정
          </li>
          <li>
            <strong>Vanilla Extract:</strong> Zero-runtime, 타입 안전한 CSS
          </li>
          <li>
            <strong>성능 최적화:</strong> will-change, contain으로 GPU 가속
          </li>
        </ul>
      </div>
    </CollapsingToolbarLayout>
  );
};
