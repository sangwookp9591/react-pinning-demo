import { useState } from 'react';
import * as styles from './VanillaExtractDemo.css';

// 9. Vanilla Extract - 타입 안전한 CSS-in-JS
// 기술: @vanilla-extract/css + TypeScript + Zero-runtime CSS
export const VanillaExtractDemo = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [showSidebar, setShowSidebar] = useState(true);

  const products = Array.from({ length: 12 }, (_, i) => ({
    id: i + 1,
    name: `상품 ${i + 1}`,
    price: (i + 1) * 15000,
    emoji: ['🎮', '📱', '💻', '🎧', '📷', '⌚', '👟', '👕', '📚', '🎨', '🎵', '🎬'][i],
    featured: i % 4 === 0,
  }));

  const categories = ['전체', '인기', '신상품', '할인'];

  return (
    <div className={styles.container}>
      {/* 스티키 헤더 */}
      <header className={styles.stickyHeader}>
        <div className={styles.headerContent}>
          <h1 className={styles.headerTitle}>🎨 Vanilla Extract Shop</h1>
          <div className={styles.headerActions}>
            <button className={styles.button.ghost}>검색</button>
            <button className={styles.button.secondary}>로그인</button>
            <button className={styles.button.primary}>장바구니</button>
          </div>
        </div>
      </header>

      {/* 스티키 탭바 */}
      <div className={styles.stickyTabs}>
        {categories.map((category) => (
          <button
            key={category}
            className={`${styles.tab.base} ${activeTab === category ? styles.tab.active : ''}`}
            onClick={() => setActiveTab(category)}
          >
            {category}
          </button>
        ))}
      </div>

      {/* 사이드바 + 메인 콘텐츠 */}
      <div className={styles.sidebarContainer}>
        {/* 스티키 사이드바 */}
        {showSidebar && (
          <aside className={styles.sidebar}>
            <h3 className={styles.sidebarTitle}>카테고리</h3>
            <ul className={styles.sidebarList}>
              {['전자기기', '패션', '도서', '스포츠', '뷰티', '식품'].map((item) => (
                <li key={item} className={styles.sidebarItem}>
                  {item}
                </li>
              ))}
            </ul>

            <h3 className={styles.sidebarTitle} style={{ marginTop: '24px' }}>
              필터
            </h3>
            <ul className={styles.sidebarList}>
              <li className={styles.sidebarItem}>무료배송</li>
              <li className={styles.sidebarItem}>당일배송</li>
              <li className={styles.sidebarItem}>할인중</li>
            </ul>
          </aside>
        )}

        {/* 메인 콘텐츠 */}
        <div className={styles.mainContent}>
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>
              추천 상품 <span className={styles.badge}>{products.length}개</span>
            </h2>

            <div className={styles.cardGrid}>
              {products.map((product) => (
                <article
                  key={product.id}
                  className={
                    product.featured
                      ? styles.card.featured
                      : styles.card.default
                  }
                >
                  <div className={styles.cardImage}>{product.emoji}</div>
                  <h3
                    className={styles.cardTitle}
                    style={product.featured ? { color: 'white' } : {}}
                  >
                    {product.name}
                  </h3>
                  <p
                    className={styles.cardDescription}
                    style={product.featured ? { color: 'rgba(255,255,255,0.9)' } : {}}
                  >
                    최고 품질의 제품을 만나보세요
                  </p>
                  <div
                    className={styles.cardPrice}
                    style={product.featured ? { color: 'white' } : {}}
                  >
                    ₩{product.price.toLocaleString()}
                  </div>
                </article>
              ))}
            </div>
          </section>

          {/* 추가 섹션 */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>할인 상품</h2>
            <div className={styles.cardGrid}>
              {products.slice(0, 6).map((product, i) => (
                <article key={product.id} className={styles.card.outlined}>
                  <div className={styles.cardImage}>
                    {['🎁', '🎉', '💝', '🎊', '🎀', '🎈'][i]}
                  </div>
                  <h3 className={styles.cardTitle}>세일 {i + 1}</h3>
                  <p className={styles.cardDescription}>
                    최대 50% 할인 중
                  </p>
                  <div className={styles.cardPrice}>
                    ₩{((i + 1) * 10000).toLocaleString()}
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>
      </div>

      {/* Floating Action Button */}
      <button
        className={styles.fab}
        onClick={() => setShowSidebar(!showSidebar)}
        title={showSidebar ? '사이드바 숨기기' : '사이드바 표시'}
      >
        {showSidebar ? '←' : '→'}
      </button>

      {/* 기술 설명 */}
      <div className={styles.techInfo}>
        <h3 className={styles.techTitle}>🛠️ Vanilla Extract 특징</h3>
        <ul className={styles.techList}>
          <li className={styles.techItem}>
            <span className={styles.techHighlight}>Zero-runtime CSS-in-JS:</span>{' '}
            빌드 타임에 CSS 파일로 추출 (런타임 오버헤드 없음)
          </li>
          <li className={styles.techItem}>
            <span className={styles.techHighlight}>TypeScript 완벽 지원:</span>{' '}
            타입 안전한 스타일, 자동완성, 오타 방지
          </li>
          <li className={styles.techItem}>
            <span className={styles.techHighlight}>Style Variants:</span>{' '}
            컴포넌트 상태별 스타일 변형 쉽게 관리
          </li>
          <li className={styles.techItem}>
            <span className={styles.techHighlight}>Themes & Design Tokens:</span>{' '}
            일관된 디자인 시스템 구축
          </li>
          <li className={styles.techItem}>
            <span className={styles.techHighlight}>CSS Modules 호환:</span>{' '}
            로컬 스코프, 클래스명 충돌 방지
          </li>
          <li className={styles.techItem}>
            <span className={styles.techHighlight}>번들 최적화:</span>{' '}
            사용하지 않는 스타일 자동 제거 (Tree-shaking)
          </li>
          <li className={styles.techItem}>
            <span className={styles.techHighlight}>Keyframes & Animations:</span>{' '}
            타입 안전한 애니메이션 정의
          </li>
        </ul>
      </div>
    </div>
  );
};
