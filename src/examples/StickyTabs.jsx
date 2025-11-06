import { useState } from 'react';
import './StickyTabs.css';

// 6. YouTube/Netflix - 스티키 탭 네비게이션
export const StickyTabs = () => {
  const [activeTab, setActiveTab] = useState('home');

  const tabs = [
    { id: 'home', label: '홈', icon: '🏠' },
    { id: 'trending', label: '인기', icon: '🔥' },
    { id: 'subscriptions', label: '구독', icon: '📺' },
    { id: 'library', label: '보관함', icon: '📚' },
  ];

  const videos = Array.from({ length: 24 }, (_, i) => ({
    id: i + 1,
    title: `영상 제목 ${i + 1}`,
    channel: `채널 ${Math.floor(i / 3) + 1}`,
    views: `${Math.floor(Math.random() * 1000)}만`,
  }));

  return (
    <div className="sticky-tabs-container">
      {/* 고정 헤더 */}
      <header className="youtube-header">
        <h2>YouTube</h2>
        <input type="search" placeholder="검색" className="search-box" />
      </header>

      {/* 고정 탭 */}
      <nav className="sticky-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </nav>

      {/* 스크롤 가능한 컨텐츠 */}
      <div className="video-grid">
        {videos.map((video) => (
          <div key={video.id} className="video-card">
            <div className="video-thumbnail">
              <span className="duration">12:34</span>
            </div>
            <div className="video-info">
              <h3>{video.title}</h3>
              <p>{video.channel}</p>
              <p>조회수 {video.views}회 · 1일 전</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
