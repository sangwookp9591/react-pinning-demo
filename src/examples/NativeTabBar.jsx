import { useState, useRef, useEffect } from 'react';
import './NativeTabBar.css';

// 4. Native 탭바 - 부드러운 인디케이터 + 자동 스크롤
export const NativeTabBar = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [indicatorStyle, setIndicatorStyle] = useState({});
  const tabsRef = useRef([]);
  const containerRef = useRef(null);

  const tabs = [
    { id: 0, label: '홈', icon: '🏠', color: '#3b82f6' },
    { id: 1, label: '인기', icon: '🔥', color: '#ef4444' },
    { id: 2, label: '새로운', icon: '✨', color: '#8b5cf6' },
    { id: 3, label: '카테고리', icon: '📚', color: '#10b981' },
    { id: 4, label: '추천', icon: '⭐', color: '#f59e0b' },
    { id: 5, label: '이벤트', icon: '🎉', color: '#ec4899' },
    { id: 6, label: '공지사항', icon: '📢', color: '#06b6d4' },
    { id: 7, label: '설정', icon: '⚙️', color: '#64748b' },
  ];

  useEffect(() => {
    updateIndicator(activeTab);
  }, [activeTab]);

  const updateIndicator = (index) => {
    const tab = tabsRef.current[index];
    if (tab) {
      setIndicatorStyle({
        left: tab.offsetLeft,
        width: tab.offsetWidth,
      });

      // 탭바 자동 스크롤 (선택된 탭이 화면 중앙으로)
      const container = containerRef.current;
      if (container) {
        const tabCenter = tab.offsetLeft + tab.offsetWidth / 2;
        const containerCenter = container.offsetWidth / 2;
        const scrollPosition = tabCenter - containerCenter;

        container.scrollTo({
          left: scrollPosition,
          behavior: 'smooth',
        });
      }
    }
  };

  const handleTabClick = (index) => {
    setActiveTab(index);

    // Flutter에 탭 변경 알림
    if (window.flutter_inappwebview) {
      window.flutter_inappwebview.callHandler('onTabChanged', {
        tabId: tabs[index].id,
        tabLabel: tabs[index].label,
      });
    }
  };

  // 탭 컨텐츠 생성
  const getTabContent = (tabId) => {
    const items = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      title: `${tabs[tabId].label} 아이템 ${i + 1}`,
      subtitle: `${tabs[tabId].icon} 관련 콘텐츠입니다`,
    }));

    return (
      <div className="tab-content" key={tabId}>
        <div className="content-header" style={{ background: tabs[tabId].color }}>
          <h2>
            {tabs[tabId].icon} {tabs[tabId].label}
          </h2>
          <p>최신 {tabs[tabId].label} 콘텐츠를 확인하세요</p>
        </div>

        <div className="content-list">
          {items.map((item) => (
            <div key={item.id} className="content-item">
              <div className="item-icon" style={{ background: tabs[tabId].color }}>
                {tabs[tabId].icon}
              </div>
              <div className="item-info">
                <h3>{item.title}</h3>
                <p>{item.subtitle}</p>
              </div>
              <div className="item-arrow">›</div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="native-tab-container">
      {/* 고정 탭바 */}
      <div className="native-tab-bar">
        <div ref={containerRef} className="tab-bar-scroll">
          <div className="tab-buttons">
            {tabs.map((tab, index) => (
              <button
                key={tab.id}
                ref={(el) => (tabsRef.current[index] = el)}
                className={`native-tab ${activeTab === index ? 'active' : ''}`}
                onClick={() => handleTabClick(index)}
              >
                <span className="tab-icon">{tab.icon}</span>
                <span className="tab-label">{tab.label}</span>
              </button>
            ))}
          </div>

          {/* 애니메이션 인디케이터 */}
          <div
            className="tab-indicator"
            style={{
              ...indicatorStyle,
              background: tabs[activeTab].color,
              transition: 'all 0.3s cubic-bezier(0.4, 0.0, 0.2, 1)',
            }}
          />
        </div>
      </div>

      {/* 탭 컨텐츠 */}
      <div className="native-tab-content">{getTabContent(activeTab)}</div>

      {/* 설명 */}
      <div className="native-info">
        <h3>💡 Native 탭바 특징</h3>
        <ul>
          <li>부드러운 인디케이터 애니메이션</li>
          <li>선택된 탭 자동 중앙 정렬</li>
          <li>무한 스크롤 가능한 탭</li>
          <li>터치 제스처 최적화</li>
          <li>Flutter와 실시간 동기화</li>
          <li>각 탭마다 고유한 색상 테마</li>
        </ul>
      </div>
    </div>
  );
};
