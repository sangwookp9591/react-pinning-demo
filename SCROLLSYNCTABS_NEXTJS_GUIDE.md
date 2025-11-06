# ScrollSyncTabs - Next.js 16 + React 19.2 + Vanilla Extract 가이드

## 🎯 개요

**ScrollSyncTabs**는 스크롤과 탭이 양방향으로 동기화되는 컴포넌트입니다. 섹션이 화면에 나타나면 자동으로 해당 탭이 포커스되고, 탭을 클릭하면 해당 섹션으로 부드럽게 스크롤됩니다.

### 핵심 기능

- ✅ **스크롤 → 탭 자동 포커스** - IntersectionObserver로 섹션 감지
- ✅ **탭 → 섹션 스크롤** - smooth scroll로 부드러운 이동
- ✅ **NativeTabBar 스타일** - 부드러운 인디케이터 애니메이션
- ✅ **Flutter WebView 최적화** - 자동 callHandler 통신
- ✅ **Next.js 16 완벽 지원** - App Router + React 19.2
- ✅ **Vanilla Extract** - Zero-runtime, 타입 안전

---

## 📦 설치 및 설정

### 1. 파일 구조

```
my-nextjs-app/
├── components/
│   └── ScrollSyncTabs/
│       ├── ScrollSyncTabs.tsx
│       └── ScrollSyncTabs.css.ts
└── app/
    └── page.tsx
```

### 2. TypeScript 버전

#### ScrollSyncTabs.tsx

```typescript
'use client';

import React, { useState, useRef, useEffect, ReactNode } from 'react';
import * as styles from './ScrollSyncTabs.css';

interface Section {
  id: string | number;
  label: string;
  icon?: ReactNode;
  color?: string;
  content: ReactNode;
}

interface ScrollSyncTabsProps {
  sections: Section[];
  enableSnap?: boolean;
  threshold?: number;
  showProgress?: boolean;
  containerStyles?: React.CSSProperties;
  onSectionChange?: (section: Section, index: number) => void;
}

export const ScrollSyncTabs: React.FC<ScrollSyncTabsProps> = ({
  sections = [],
  enableSnap = false,
  threshold = 0.5,
  showProgress = true,
  containerStyles = {},
  onSectionChange,
}) => {
  const [activeSection, setActiveSection] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [indicatorStyle, setIndicatorStyle] = useState<React.CSSProperties>({});

  const containerRef = useRef<HTMLDivElement>(null);
  const tabsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const sectionsRef = useRef<(HTMLDivElement | null)[]>([]);
  const tabScrollRef = useRef<HTMLDivElement>(null);
  const isUserScrolling = useRef(true);

  // IntersectionObserver로 현재 보이는 섹션 감지
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!isUserScrolling.current) {
          console.log('🚫 Ignoring scroll (programmatic)');
          return;
        }

        // 가장 많이 보이는 섹션 찾기
        let mostVisibleEntry: IntersectionObserverEntry | null = null;
        let maxRatio = 0;

        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > maxRatio) {
            maxRatio = entry.intersectionRatio;
            mostVisibleEntry = entry;
          }
        });

        if (mostVisibleEntry) {
          const index = parseInt(mostVisibleEntry.target.getAttribute('data-index') || '0');
          console.log(\`✅ Section \${index} is most visible (\${(maxRatio * 100).toFixed(0)}%)\`);
          setActiveSection(index);

          // Flutter WebView 통신
          if (typeof window !== 'undefined' && (window as any).flutter_inappwebview) {
            (window as any).flutter_inappwebview.callHandler('onSectionChange', {
              sectionId: sections[index].id,
              sectionLabel: sections[index].label,
              sectionIndex: index,
              timestamp: Date.now(),
            });
          }

          // 커스텀 콜백
          if (onSectionChange) {
            onSectionChange(sections[index], index);
          }
        }
      },
      {
        root: container,
        threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0],
        rootMargin: '-80px 0px -20% 0px',
      }
    );

    sectionsRef.current.forEach((section) => {
      if (section) observer.observe(section);
    });

    return () => observer.disconnect();
  }, [sections, threshold, onSectionChange]);

  // 스크롤 진행도 계산
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollHeight = container.scrollHeight - container.clientHeight;
      const scrollTop = container.scrollTop;
      const progress = (scrollTop / scrollHeight) * 100;
      setScrollProgress(progress);
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  // 탭 인디케이터 업데이트
  useEffect(() => {
    updateIndicator(activeSection);
  }, [activeSection]);

  const updateIndicator = (index: number) => {
    const tab = tabsRef.current[index];
    if (tab) {
      setIndicatorStyle({
        left: tab.offsetLeft,
        width: tab.offsetWidth,
      });

      const tabScroll = tabScrollRef.current;
      if (tabScroll) {
        const tabCenter = tab.offsetLeft + tab.offsetWidth / 2;
        const containerCenter = tabScroll.offsetWidth / 2;
        const scrollPosition = tabCenter - containerCenter;

        tabScroll.scrollTo({
          left: scrollPosition,
          behavior: 'smooth',
        });
      }
    }
  };

  const handleTabClick = (index: number) => {
    // 프로그램적 스크롤 시작
    isUserScrolling.current = false;
    setActiveSection(index);

    // 해당 섹션으로 스크롤
    const container = containerRef.current;
    const section = sectionsRef.current[index];

    if (container && section) {
      // 섹션의 컨테이너 내부 위치 계산
      const sectionTop = section.offsetTop;

      // 탭바 높이만큼 오프셋 (60px)
      const scrollTop = sectionTop - 60;

      container.scrollTo({
        top: scrollTop,
        behavior: 'smooth',
      });

      // 스크롤 완료 후 다시 사용자 스크롤 감지 활성화
      setTimeout(() => {
        isUserScrolling.current = true;
      }, 1000);
    }
  };

  return (
    <div
      ref={containerRef}
      className={styles.container}
      style={{
        scrollSnapType: enableSnap ? 'y mandatory' : 'none',
        ...containerStyles,
      }}
    >
      {/* 진행도 바 */}
      {showProgress && (
        <div className={styles.progressBar}>
          <div className={styles.progressFill} style={{ width: \`\${scrollProgress}%\` }} />
        </div>
      )}

      {/* 스티키 탭바 */}
      <div className={styles.tabBar}>
        <div ref={tabScrollRef} className={styles.tabScroll}>
          <div className={styles.tabButtons}>
            {sections.map((section, index) => (
              <button
                key={section.id || index}
                ref={(el) => { tabsRef.current[index] = el; }}
                className={\`\${styles.tab} \${activeSection === index ? styles.tabActive : ''}\`}
                onClick={() => handleTabClick(index)}
              >
                {section.icon && <span className={styles.tabIcon}>{section.icon}</span>}
                <span className={styles.tabLabel}>{section.label}</span>
              </button>
            ))}

            {/* 애니메이션 인디케이터 */}
            <div
              className={styles.indicator}
              style={{
                ...indicatorStyle,
                background: sections[activeSection]?.color || '#667eea',
              }}
            />
          </div>
        </div>
      </div>

      {/* 섹션들 */}
      {sections.map((section, index) => (
        <div
          key={section.id || index}
          ref={(el) => { sectionsRef.current[index] = el; }}
          data-index={index}
          className={\`\${styles.section} \${enableSnap ? styles.sectionVariants.snap : styles.sectionVariants.default}\`}
        >
          {section.content}
        </div>
      ))}
    </div>
  );
};
```

---

## 💡 사용 예제

### 예제 1: 기본 사용 (쇼핑몰 상품 상세)

```typescript
'use client';

import { ScrollSyncTabs } from '@/components/ScrollSyncTabs/ScrollSyncTabs';

export default function ProductDetailPage() {
  const sections = [
    {
      id: 'info',
      label: '상품정보',
      icon: '📦',
      color: '#667eea',
      content: (
        <div style={{ minHeight: '100vh', padding: '40px 20px' }}>
          <h2>상품 정보</h2>
          <p>상세한 상품 설명...</p>
          {/* 상품 이미지, 가격, 옵션 등 */}
        </div>
      ),
    },
    {
      id: 'reviews',
      label: '리뷰',
      icon: '⭐',
      color: '#f5576c',
      content: (
        <div style={{ minHeight: '100vh', padding: '40px 20px' }}>
          <h2>고객 리뷰</h2>
          {/* 리뷰 목록 */}
        </div>
      ),
    },
    {
      id: 'recommendations',
      label: '추천',
      icon: '🎁',
      color: '#00f2fe',
      content: (
        <div style={{ minHeight: '100vh', padding: '40px 20px' }}>
          <h2>추천 상품</h2>
          {/* 추천 상품 그리드 */}
        </div>
      ),
    },
  ];

  return (
    <ScrollSyncTabs
      sections={sections}
      threshold={0.5}
      showProgress={true}
      onSectionChange={(section, index) => {
        console.log('Section:', section.label);
      }}
    />
  );
}
```

### 예제 2: Snap Scroll 활성화

```typescript
'use client';

import { ScrollSyncTabs } from '@/components/ScrollSyncTabs/ScrollSyncTabs';

export default function FullPageSections() {
  const sections = [
    {
      id: 'intro',
      label: '소개',
      icon: '👋',
      color: '#667eea',
      content: (
        <div style={{
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white'
        }}>
          <h1>Welcome</h1>
        </div>
      ),
    },
    // ... more sections
  ];

  return (
    <ScrollSyncTabs
      sections={sections}
      enableSnap={true}  // CSS scroll-snap 활성화
      threshold={0.6}
      showProgress={true}
    />
  );
}
```

### 예제 3: 뉴스 기사

```typescript
'use client';

import { ScrollSyncTabs } from '@/components/ScrollSyncTabs/ScrollSyncTabs';

export default function ArticlePage() {
  const sections = [
    {
      id: 'summary',
      label: '요약',
      icon: '📝',
      content: (
        <div style={{ padding: '40px 20px' }}>
          <h1>기사 제목</h1>
          <p>이 기사의 주요 내용은...</p>
        </div>
      ),
    },
    {
      id: 'content',
      label: '본문',
      icon: '📄',
      content: (
        <div style={{ padding: '40px 20px', minHeight: '150vh' }}>
          <p>전체 기사 내용...</p>
        </div>
      ),
    },
    {
      id: 'related',
      label: '관련기사',
      icon: '📰',
      content: (
        <div style={{ padding: '40px 20px' }}>
          <h2>관련 기사</h2>
          {/* 관련 기사 목록 */}
        </div>
      ),
    },
  ];

  return <ScrollSyncTabs sections={sections} />;
}
```

---

## 📚 Props API

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `sections` | `Section[]` | **required** | 섹션 배열 |
| `enableSnap` | `boolean` | `false` | CSS scroll-snap 활성화 |
| `threshold` | `number` | `0.5` | IntersectionObserver threshold (0~1) |
| `showProgress` | `boolean` | `true` | 진행도 바 표시 |
| `containerStyles` | `CSSProperties` | `{}` | 컨테이너 커스텀 스타일 |
| `onSectionChange` | `(section, index) => void` | - | 섹션 변경 콜백 |

### Section 인터페이스

```typescript
interface Section {
  id: string | number;   // 섹션 ID (필수)
  label: string;         // 탭 라벨 (필수)
  icon?: ReactNode;      // 탭 아이콘 (선택)
  color?: string;        // 인디케이터 색상 (선택)
  content: ReactNode;    // 섹션 콘텐츠 (필수)
}
```

---

## 📱 Flutter WebView 통신

### Next.js → Flutter

```typescript
// ScrollSyncTabs 내부에서 자동 호출
window.flutter_inappwebview.callHandler('onSectionChange', {
  sectionId: 'reviews',
  sectionLabel: '리뷰',
  sectionIndex: 1,
  timestamp: 1234567890
});
```

### Flutter 측 핸들러

```dart
import 'package:flutter/material.dart';
import 'package:flutter_inappwebview/flutter_inappwebview.dart';

class ProductPage extends StatefulWidget {
  @override
  _ProductPageState createState() => _ProductPageState();
}

class _ProductPageState extends State<ProductPage> {
  InAppWebViewController? webViewController;
  String currentSection = '';

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: Column(
          children: [
            // Flutter Native UI - 현재 섹션 표시
            Container(
              padding: EdgeInsets.all(16),
              color: Colors.blue,
              child: Row(
                children: [
                  Icon(Icons.location_on, color: Colors.white),
                  SizedBox(width: 8),
                  Text(
                    'Current: $currentSection',
                    style: TextStyle(color: Colors.white, fontSize: 16),
                  ),
                ],
              ),
            ),

            // WebView
            Expanded(
              child: InAppWebView(
                initialUrlRequest: URLRequest(
                  url: Uri.parse('http://localhost:3000/product/123'),
                ),
                onWebViewCreated: (controller) {
                  webViewController = controller;

                  // ScrollSyncTabs 섹션 변경 핸들러
                  controller.addJavaScriptHandler(
                    handlerName: 'onSectionChange',
                    callback: (args) {
                      final data = args[0] as Map;

                      setState(() {
                        currentSection = data['sectionLabel'] ?? '';
                      });

                      print('Section ID: ${data['sectionId']}');
                      print('Section Label: ${data['sectionLabel']}');
                      print('Section Index: ${data['sectionIndex']}');

                      // 섹션별 Flutter 로직
                      _handleSectionChange(data['sectionId']);
                    },
                  );
                },
              ),
            ),
          ],
        ),
      ),
    );
  }

  void _handleSectionChange(String sectionId) {
    switch (sectionId) {
      case 'reviews':
        // 리뷰 섹션 - 네이티브 광고 로드
        print('Load native ads for reviews');
        break;
      case 'recommendations':
        // 추천 섹션 - 추천 알고리즘 실행
        print('Run recommendation algorithm');
        break;
      default:
        break;
    }
  }
}
```

---

## 🎨 스타일 커스터마이징

### 인디케이터 색상 변경

```typescript
const sections = [
  {
    id: 'section1',
    label: '섹션 1',
    color: '#ff6b6b',  // 빨간색 인디케이터
    content: <div>...</div>
  },
  {
    id: 'section2',
    label: '섹션 2',
    color: '#51cf66',  // 초록색 인디케이터
    content: <div>...</div>
  },
];
```

### 탭바 스타일 변경

```typescript
// ScrollSyncTabs.css.ts 수정
export const tabBar = style({
  position: 'sticky',
  top: 0,
  zIndex: 100,
  background: '#1a1a1a',  // 다크 모드
  borderBottom: '1px solid #333',
});

export const tab = style({
  color: '#fff',  // 흰색 텍스트
  // ...
});
```

---

## ⚙️ 고급 설정

### threshold 조정

```typescript
// ⚠️ 주의: 컴포넌트 내부에서 다중 threshold 사용 중
// [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0]
// 가장 많이 보이는 섹션(intersectionRatio 최대)을 자동 선택

// threshold prop은 현재 사용되지 않음 (다중 threshold가 더 정확함)
<ScrollSyncTabs sections={sections} />
```

### 섹션 감지 알고리즘

**개선된 알고리즘 (v2.0):**

1. **다중 threshold 사용** - [0, 0.1, ..., 1.0] 11단계로 세밀하게 감지
2. **가장 많이 보이는 섹션 선택** - `intersectionRatio`가 최대인 섹션을 활성화
3. **프로그램 스크롤 무시** - 탭 클릭 시 `isUserScrolling = false`로 중복 감지 방지
4. **디버그 로그** - 브라우저 콘솔에서 실시간 확인 가능

```typescript
// 가장 많이 보이는 섹션 찾기
let mostVisibleEntry = null;
let maxRatio = 0;

entries.forEach((entry) => {
  if (entry.isIntersecting && entry.intersectionRatio > maxRatio) {
    maxRatio = entry.intersectionRatio;
    mostVisibleEntry = entry;
  }
});
```

### rootMargin 설정

```typescript
// 현재 설정: '-80px 0px -20% 0px'
// - 상단 80px: 탭바 높이 + 여유 공간
// - 하단 20%: 섹션 하단이 화면의 80% 지점에 도달하면 다음 섹션으로 전환

// 커스터마이징 예시
rootMargin: '-100px 0px -30% 0px'  // 더 늦게 전환
rootMargin: '-60px 0px -10% 0px'   // 더 빨리 전환
```

---

## 🚀 실제 사용 사례

### 1. 쇼핑몰 상품 상세 페이지
- 상품정보 → 리뷰 → Q&A → 배송정보 → 추천상품
- 각 섹션 진입 시 관련 광고 노출

### 2. 부동산 매물 상세
- 매물정보 → 사진 → 위치 → 주변시설 → 유사매물
- 지도 섹션 진입 시 네이티브 지도 API 호출

### 3. 온라인 강의 상세
- 강의소개 → 커리큘럼 → 수강생리뷰 → 강사소개
- 커리큘럼 섹션에서 강의 미리보기 비디오 자동 재생

### 4. 뉴스 기사
- 요약 → 본문 → 사진/영상 → 관련기사
- 본문 섹션 진입 시 읽기 시간 측정 시작

---

## 💡 팁 & 트릭

### 1. 긴 섹션 처리
```typescript
// 매우 긴 섹션은 minHeight 대신 실제 콘텐츠 높이 사용
content: (
  <div style={{ padding: '40px 20px' }}>
    {/* 실제 콘텐츠 */}
    {articles.map(article => <Article key={article.id} {...article} />)}
  </div>
)
```

### 2. 로딩 상태 처리
```typescript
const [isLoading, setIsLoading] = useState(true);
const [sections, setSections] = useState([]);

useEffect(() => {
  fetch('/api/sections')
    .then(res => res.json())
    .then(data => {
      setSections(data);
      setIsLoading(false);
    });
}, []);

if (isLoading) return <LoadingSpinner />;

return <ScrollSyncTabs sections={sections} />;
```

### 3. 동적 섹션 추가
```typescript
const [sections, setSections] = useState(initialSections);

const loadMoreSections = () => {
  const newSections = fetchMoreSections();
  setSections(prev => [...prev, ...newSections]);
};
```

---

## ⚠️ 주의사항

1. **'use client' 필수** - Next.js App Router에서 클라이언트 컴포넌트로 사용
2. **섹션 높이** - 각 섹션은 충분한 높이를 가져야 IntersectionObserver가 정확히 감지
3. **threshold 값** - 너무 높으면 (>0.8) 긴 섹션에서 감지가 늦어질 수 있음
4. **스크롤 충돌** - 다른 스크롤 관련 라이브러리와 함께 사용 시 주의
5. **성능** - 섹션이 100개 이상이면 가상화(virtualization) 고려

---

## 🎯 요약

**ScrollSyncTabs**는 NativeTabBar의 부드러운 탭 전환과 Snap Scroll의 섹션 감지를 결합한 컴포넌트입니다.

- 📱 **Flutter WebView 완벽 통합**
- ⚡ **IntersectionObserver로 고성능**
- 🎨 **NativeTabBar 스타일 탭**
- 🔄 **양방향 스크롤 동기화**
- 📦 **Next.js 16 + React 19.2 최적화**

지금 바로 프로젝트에 적용해보세요! 🚀
