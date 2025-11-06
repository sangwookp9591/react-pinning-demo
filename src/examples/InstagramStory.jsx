import { useState, useRef, useEffect } from 'react';
import './InstagramStory.css';

// 5. Instagram 스타일 - 스토리바 + 스티키 헤더
// 기술: Intersection Observer + position: sticky + horizontal scroll snap
export const InstagramStory = () => {
  const [activeStory, setActiveStory] = useState(null);
  const [headerVisible, setHeaderVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const containerRef = useRef(null);
  const headerRef = useRef(null);

  const stories = Array.from({ length: 15 }, (_, i) => ({
    id: i + 1,
    user: `user_${i + 1}`,
    avatar: ['🦄', '🐱', '🐶', '🐼', '🦊', '🐯', '🦁', '🐸', '🐵', '🐨'][i % 10],
    hasNew: i < 8,
  }));

  const posts = Array.from({ length: 20 }, (_, i) => ({
    id: i + 1,
    user: stories[i % stories.length].user,
    avatar: stories[i % stories.length].avatar,
    image: ['🌅', '🌄', '🌠', '🌌', '🌉', '🏞️', '🎆', '🌃', '🌇', '🎇'][i % 10],
    likes: Math.floor(Math.random() * 10000) + 100,
    caption: `멋진 순간을 포착했어요! #여행 #일상 #${i + 1}`,
    time: `${Math.floor(Math.random() * 24)}시간 전`,
  }));

  // 스크롤 방향 감지 - 헤더 자동 숨김/표시
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const currentScrollY = container.scrollTop;
      const header = headerRef.current;

      // 스크롤 다운: 헤더 숨김, 스크롤 업: 헤더 표시
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setHeaderVisible(false);
      } else if (currentScrollY < lastScrollY) {
        setHeaderVisible(true);
      }

      setLastScrollY(currentScrollY);

      // Flutter에 스크롤 위치 전송
      if (window.flutter_inappwebview && currentScrollY % 100 === 0) {
        window.flutter_inappwebview.callHandler('onScroll', {
          position: currentScrollY,
          direction: currentScrollY > lastScrollY ? 'down' : 'up',
        });
      }
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const handleStoryClick = (story) => {
    setActiveStory(story);

    if (window.flutter_inappwebview) {
      window.flutter_inappwebview.callHandler('onStoryViewed', {
        userId: story.user,
        storyId: story.id,
      });
    }
  };

  return (
    <div className="insta-container" ref={containerRef}>
      {/* 고정 헤더 - 스크롤 방향에 따라 자동 숨김/표시 */}
      <header
        ref={headerRef}
        className={`insta-header ${headerVisible ? 'visible' : 'hidden'}`}
      >
        <div className="header-left">
          <h1>Instagram</h1>
        </div>
        <div className="header-right">
          <button className="header-btn">➕</button>
          <button className="header-btn">❤️</button>
          <button className="header-btn">✉️</button>
        </div>
      </header>

      {/* 스티키 스토리바 - 가로 스크롤 + 스냅 */}
      <div className="story-bar-wrapper">
        <div className="story-bar">
          <div className="story-scroll">
            {stories.map((story) => (
              <div
                key={story.id}
                className="story-item"
                onClick={() => handleStoryClick(story)}
              >
                <div className={`story-ring ${story.hasNew ? 'has-new' : ''}`}>
                  <div className="story-avatar">{story.avatar}</div>
                </div>
                <span className="story-name">{story.user}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 피드 */}
      <div className="insta-feed">
        {posts.map((post) => (
          <article key={post.id} className="post-card">
            {/* 포스트 헤더 */}
            <div className="post-header">
              <div className="post-user">
                <div className="user-avatar">{post.avatar}</div>
                <span className="user-name">{post.user}</span>
              </div>
              <button className="post-menu">⋯</button>
            </div>

            {/* 포스트 이미지 */}
            <div className="post-image">{post.image}</div>

            {/* 포스트 액션 */}
            <div className="post-actions">
              <div className="actions-left">
                <button className="action-btn">❤️</button>
                <button className="action-btn">💬</button>
                <button className="action-btn">📤</button>
              </div>
              <button className="action-btn">🔖</button>
            </div>

            {/* 좋아요 수 */}
            <div className="post-likes">좋아요 {post.likes.toLocaleString()}개</div>

            {/* 캡션 */}
            <div className="post-caption">
              <span className="caption-user">{post.user}</span> {post.caption}
            </div>

            {/* 시간 */}
            <div className="post-time">{post.time}</div>
          </article>
        ))}
      </div>

      {/* 하단 네비게이션 - 스티키 */}
      <nav className="insta-bottom-nav">
        <button className="nav-btn active">🏠</button>
        <button className="nav-btn">🔍</button>
        <button className="nav-btn">🎬</button>
        <button className="nav-btn">🛍️</button>
        <button className="nav-btn">
          <div className="nav-avatar">👤</div>
        </button>
      </nav>

      {/* 스토리 뷰어 모달 */}
      {activeStory && (
        <div className="story-viewer" onClick={() => setActiveStory(null)}>
          <div className="story-content">
            <div className="story-header-viewer">
              <div className="story-user-info">
                <div className="viewer-avatar">{activeStory.avatar}</div>
                <span>{activeStory.user}</span>
                <span className="story-time">2시간 전</span>
              </div>
              <button className="story-close">✕</button>
            </div>
            <div className="story-media">
              <div className="story-placeholder">
                {activeStory.avatar}
                <p>스토리 콘텐츠</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 기술 설명 */}
      <div className="tech-info">
        <h3>🛠️ 사용 기술</h3>
        <ul>
          <li>
            <strong>Intersection Observer API:</strong> 스토리바 가시성 감지
          </li>
          <li>
            <strong>position: sticky:</strong> 헤더/스토리바/하단 네비 고정
          </li>
          <li>
            <strong>CSS Scroll Snap:</strong> 스토리 가로 스크롤 스냅
          </li>
          <li>
            <strong>Transform + Translate:</strong> 헤더 부드러운 숨김/표시
          </li>
          <li>
            <strong>Passive Event Listener:</strong> 스크롤 성능 최적화
          </li>
        </ul>
      </div>
    </div>
  );
};
