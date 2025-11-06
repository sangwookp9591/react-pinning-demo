# StickyTabs - Next.js 16 App Router 사용 가이드

## 📋 목차
1. [컴포넌트 개요](#컴포넌트-개요)
2. [설치 및 설정](#설치-및-설정)
3. [TypeScript 버전](#typescript-버전)
4. [사용 예제](#사용-예제)
5. [Props API](#props-api)
6. [Flutter WebView 통신](#flutter-webview-통신)
7. [고급 사용법](#고급-사용법)

---

## 🎯 컴포넌트 개요

**StickyTabs**는 Next.js 16 App Router, React 19.2, Vanilla Extract 환경에서 사용 가능한 **Flutter WebView 최적화 공통 스티키 탭 컴포넌트**입니다.

### 주요 특징

- ✅ **Flutter WebView 자동 통신** - `window.flutter_inappwebview.callHandler` 내장
- ✅ **자동 스크롤** - 활성 탭이 화면 중앙에 오도록 부드럽게 스크롤
- ✅ **아이콘 + 배지 지원** - 탭에 아이콘과 배지(숫자, 텍스트) 표시
- ✅ **다양한 Variant** - default, primary, secondary, success, danger 색상
- ✅ **컨테이너 스타일** - default, transparent, glass, dark 모드
- ✅ **TypeScript 완벽 지원** - Props 타입 안정성 보장
- ✅ **Vanilla Extract** - Zero-runtime CSS, SSR 안전
- ✅ **접근성** - disabled 상태, 키보드 네비게이션 지원

---

## ⚙️ 설치 및 설정

### 1. 패키지 설치 (이미 완료했다면 스킵)

```bash
npm install @vanilla-extract/css @vanilla-extract/next-plugin
```

### 2. 파일 구조

```
my-nextjs-app/
├── components/
│   └── StickyTabs/
│       ├── StickyTabs.tsx
│       └── StickyTabs.css.ts
└── app/
    └── page.tsx
```

---

## 📝 TypeScript 버전

### StickyTabs.tsx

```typescript
'use client';

import React, { useRef, useEffect, ReactNode } from 'react';
import * as styles from './StickyTabs.css';

interface Tab {
  label: string;
  value: string;
  icon?: ReactNode;
  badge?: string | number;
  active?: boolean;
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'danger';
  disabled?: boolean;
}

interface StickyTabsProps {
  tabs: Tab[];
  onTabChange?: (value: string, tab: Tab, index: number) => void;
  top?: number | string;
  variant?: 'default' | 'transparent' | 'glass' | 'dark';
  activeColor?: string;
  containerStyles?: React.CSSProperties;
  autoScroll?: boolean;
  onTabClick?: (tab: Tab, index: number) => void;
}

export const StickyTabs: React.FC<StickyTabsProps> = ({
  tabs = [],
  onTabChange,
  top = 0,
  variant = 'default',
  activeColor = '#667eea',
  containerStyles = {},
  autoScroll = true,
  onTabClick,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const activeTabRef = useRef<HTMLButtonElement>(null);

  // 활성 탭으로 자동 스크롤
  useEffect(() => {
    if (autoScroll && activeTabRef.current && containerRef.current) {
      const container = containerRef.current;
      const activeTab = activeTabRef.current;

      const containerWidth = container.offsetWidth;
      const activeTabLeft = activeTab.offsetLeft;
      const activeTabWidth = activeTab.offsetWidth;

      const scrollPosition = activeTabLeft - (containerWidth / 2) + (activeTabWidth / 2);

      container.scrollTo({
        left: scrollPosition,
        behavior: 'smooth',
      });
    }
  }, [tabs, autoScroll]);

  const handleTabClick = (tab: Tab, index: number) => {
    if (tab.disabled) return;

    // Flutter WebView 통신
    if (typeof window !== 'undefined' && (window as any).flutter_inappwebview) {
      (window as any).flutter_inappwebview.callHandler('onTabClick', {
        tab: {
          label: tab.label,
          value: tab.value,
          index,
        },
        timestamp: Date.now(),
      });
    }

    // 커스텀 콜백
    if (onTabClick) {
      onTabClick(tab, index);
    }

    // 탭 변경 콜백
    if (onTabChange) {
      onTabChange(tab.value, tab, index);
    }
  };

  const getTabClassName = (tab: Tab) => {
    if (tab.active) {
      return styles.tab.active;
    }
    if (tab.variant) {
      return styles.tab[tab.variant] || styles.tab.default;
    }
    return styles.tab.default;
  };

  const getContainerClassName = () => {
    const baseClass = styles.container;
    const variantClass = styles.containerVariants[variant] || styles.containerVariants.default;
    return \`\${baseClass} \${variantClass}\`;
  };

  return (
    <div
      ref={containerRef}
      className={getContainerClassName()}
      style={{
        top: typeof top === 'number' ? \`\${top}px\` : top,
        ...containerStyles,
      }}
    >
      {tabs.map((tab, index) => {
        const isActive = tab.active;
        const hasIcon = !!tab.icon;
        const hasBadge = tab.badge !== undefined && tab.badge !== null;

        return (
          <button
            key={tab.value || index}
            ref={isActive ? activeTabRef : null}
            className={hasIcon ? \`\${getTabClassName(tab)} \${styles.tabWithIcon}\` : getTabClassName(tab)}
            onClick={() => handleTabClick(tab, index)}
            disabled={tab.disabled}
            style={{
              ...(isActive && activeColor && {
                background: activeColor,
                borderColor: activeColor
              }),
              ...(tab.disabled && {
                opacity: 0.5,
                cursor: 'not-allowed'
              }),
            }}
          >
            {hasIcon && <span className={styles.tabIcon}>{tab.icon}</span>}
            <span>{tab.label}</span>
            {hasBadge && (
              <span className={styles.badge}>
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
```

### StickyTabs.css.ts

```typescript
import { style, styleVariants } from '@vanilla-extract/css';

export const container = style({
  position: 'sticky',
  zIndex: 90,
  display: 'flex',
  gap: '8px',
  padding: '12px 16px',
  background: 'white',
  borderBottom: '1px solid #e5e5e5',
  overflowX: 'auto',
  WebkitOverflowScrolling: 'touch',
  scrollbarWidth: 'none',
  transition: 'top 0.1s ease-out, background 0.2s',
  '::-webkit-scrollbar': {
    display: 'none',
  },
});

const tabBase = style({
  padding: '8px 16px',
  border: '1px solid #e5e5e5',
  borderRadius: '20px',
  fontSize: '14px',
  fontWeight: 500,
  cursor: 'pointer',
  whiteSpace: 'nowrap',
  transition: 'all 0.2s',
  flexShrink: 0,
  ':active': {
    transform: 'scale(0.95)',
  },
});

export const tab = styleVariants({
  default: [tabBase, {
    background: 'transparent',
    color: '#666',
    borderColor: '#e5e5e5',
    ':hover': { background: '#f5f5f5' },
  }],
  active: [tabBase, {
    background: '#667eea',
    color: 'white',
    borderColor: '#667eea',
    ':hover': { background: '#5568d3' },
  }],
  primary: [tabBase, {
    background: 'transparent',
    color: '#667eea',
    borderColor: '#667eea',
    ':hover': { background: 'rgba(102, 126, 234, 0.1)' },
  }],
  secondary: [tabBase, {
    background: 'transparent',
    color: '#764ba2',
    borderColor: '#764ba2',
    ':hover': { background: 'rgba(118, 75, 162, 0.1)' },
  }],
  success: [tabBase, {
    background: 'transparent',
    color: '#10b981',
    borderColor: '#10b981',
    ':hover': { background: 'rgba(16, 185, 129, 0.1)' },
  }],
  danger: [tabBase, {
    background: 'transparent',
    color: '#ef4444',
    borderColor: '#ef4444',
    ':hover': { background: 'rgba(239, 68, 68, 0.1)' },
  }],
});

export const tabWithIcon = style({
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
});

export const tabIcon = style({
  fontSize: '16px',
  lineHeight: 1,
});

export const badge = style({
  marginLeft: '6px',
  padding: '2px 6px',
  fontSize: '11px',
  fontWeight: 600,
  borderRadius: '10px',
  background: 'rgba(255, 255, 255, 0.3)',
});

export const containerVariants = styleVariants({
  default: {},
  transparent: {
    background: 'transparent',
    borderBottom: 'none',
    backdropFilter: 'blur(10px)',
  },
  glass: {
    background: 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(10px)',
  },
  dark: {
    background: '#1a1a1a',
    borderBottom: '1px solid #333',
  },
});
```

---

## 💡 사용 예제

### 예제 1: 기본 사용법

```typescript
'use client';

import { useState } from 'react';
import { StickyTabs } from '@/components/StickyTabs/StickyTabs';

export default function Page() {
  const [activeTab, setActiveTab] = useState('all');

  const tabs = [
    { label: '전체', value: 'all', active: activeTab === 'all' },
    { label: '인기', value: 'popular', active: activeTab === 'popular' },
    { label: '신상품', value: 'new', active: activeTab === 'new' },
    { label: '할인', value: 'sale', active: activeTab === 'sale', badge: '30%' },
  ];

  return (
    <div>
      <StickyTabs
        tabs={tabs}
        onTabChange={(value) => setActiveTab(value)}
      />

      <div style={{ padding: '20px' }}>
        <h2>현재 선택: {activeTab}</h2>
        {/* 컨텐츠 */}
      </div>
    </div>
  );
}
```

### 예제 2: 아이콘 + 배지

```typescript
'use client';

import { useState } from 'react';
import { StickyTabs } from '@/components/StickyTabs/StickyTabs';

export default function NavigationPage() {
  const [activeTab, setActiveTab] = useState('home');

  const tabs = [
    { label: '홈', value: 'home', icon: '🏠', active: activeTab === 'home' },
    { label: '탐색', value: 'explore', icon: '🔍', active: activeTab === 'explore' },
    { label: '알림', value: 'notifications', icon: '🔔', active: activeTab === 'notifications', badge: 5 },
    { label: '메시지', value: 'messages', icon: '💬', active: activeTab === 'messages', badge: 12 },
    { label: '프로필', value: 'profile', icon: '👤', active: activeTab === 'profile' },
  ];

  return (
    <div style={{ height: '100vh', overflowY: 'auto' }}>
      <header style={{ height: '60px', background: '#667eea' }}>
        {/* 헤더 */}
      </header>

      <StickyTabs
        tabs={tabs}
        onTabChange={(value) => setActiveTab(value)}
        top={60}
        variant="glass"
        activeColor="#667eea"
      />

      <main style={{ padding: '20px' }}>
        {/* 컨텐츠 */}
      </main>
    </div>
  );
}
```

### 예제 3: 색상 Variant

```typescript
'use client';

import { useState } from 'react';
import { StickyTabs } from '@/components/StickyTabs/StickyTabs';

export default function OrderStatusPage() {
  const [activeTab, setActiveTab] = useState('pending');

  const tabs = [
    { label: '대기중', value: 'pending', active: activeTab === 'pending', variant: 'default' as const, badge: 5 },
    { label: '처리중', value: 'processing', active: activeTab === 'processing', variant: 'primary' as const, badge: 3 },
    { label: '배송중', value: 'shipping', active: activeTab === 'shipping', variant: 'secondary' as const, badge: 2 },
    { label: '완료', value: 'completed', active: activeTab === 'completed', variant: 'success' as const, badge: 24 },
    { label: '취소', value: 'canceled', active: activeTab === 'canceled', variant: 'danger' as const, badge: 1 },
  ];

  return (
    <div>
      <StickyTabs
        tabs={tabs}
        onTabChange={(value) => setActiveTab(value)}
        autoScroll={true}
      />

      <div style={{ padding: '20px' }}>
        <h2>주문 상태: {tabs.find(t => t.value === activeTab)?.label}</h2>
        {/* 주문 목록 */}
      </div>
    </div>
  );
}
```

### 예제 4: Dark 모드

```typescript
'use client';

import { StickyTabs } from '@/components/StickyTabs/StickyTabs';

export default function DarkModePage() {
  const tabs = [
    { label: '전체', value: 'all', active: true },
    { label: '영화', value: 'movie', icon: '🎬' },
    { label: '드라마', value: 'drama', icon: '📺' },
    { label: '예능', value: 'variety', icon: '🎭' },
  ];

  return (
    <div style={{ background: '#1a1a1a', minHeight: '100vh', color: 'white' }}>
      <StickyTabs
        tabs={tabs}
        variant="dark"
        activeColor="#667eea"
      />

      <main style={{ padding: '20px' }}>
        {/* Dark 모드 컨텐츠 */}
      </main>
    </div>
  );
}
```

---

## 📚 Props API

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `tabs` | `Tab[]` | **required** | 탭 배열 |
| `onTabChange` | `(value, tab, index) => void` | - | 탭 변경 콜백 |
| `top` | `number \| string` | `0` | 상단 고정 위치 |
| `variant` | `'default' \| 'transparent' \| 'glass' \| 'dark'` | `'default'` | 컨테이너 스타일 |
| `activeColor` | `string` | `'#667eea'` | 활성 탭 색상 |
| `containerStyles` | `CSSProperties` | `{}` | 커스텀 스타일 |
| `autoScroll` | `boolean` | `true` | 활성 탭 자동 스크롤 |
| `onTabClick` | `(tab, index) => void` | - | 탭 클릭 콜백 |

### Tab 인터페이스

```typescript
interface Tab {
  label: string;           // 탭 라벨 (필수)
  value: string;           // 탭 값 (필수)
  icon?: ReactNode;        // 아이콘 (선택)
  badge?: string | number; // 배지 (선택)
  active?: boolean;        // 활성 상태 (선택)
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'danger'; // 색상 (선택)
  disabled?: boolean;      // 비활성 상태 (선택)
}
```

---

## 📱 Flutter WebView 통신

### Next.js → Flutter

```typescript
// StickyTabs 컴포넌트 내부에서 자동으로 호출됨
window.flutter_inappwebview.callHandler('onTabClick', {
  tab: {
    label: '전체',
    value: 'all',
    index: 0
  },
  timestamp: 1234567890
});
```

### Flutter 측 핸들러

```dart
import 'package:flutter/material.dart';
import 'package:flutter_inappwebview/flutter_inappwebview.dart';

class WebViewScreen extends StatefulWidget {
  @override
  _WebViewScreenState createState() => _WebViewScreenState();
}

class _WebViewScreenState extends State<WebViewScreen> {
  InAppWebViewController? webViewController;
  String currentTab = '';

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: Column(
          children: [
            // Flutter UI - 현재 탭 표시
            Container(
              padding: EdgeInsets.all(16),
              color: Colors.blue,
              child: Text(
                'Current Tab: $currentTab',
                style: TextStyle(color: Colors.white, fontSize: 18),
              ),
            ),

            // WebView
            Expanded(
              child: InAppWebView(
                initialUrlRequest: URLRequest(
                  url: Uri.parse('http://localhost:3000'),
                ),
                onWebViewCreated: (controller) {
                  webViewController = controller;

                  // StickyTabs 핸들러 등록
                  controller.addJavaScriptHandler(
                    handlerName: 'onTabClick',
                    callback: (args) {
                      final data = args[0] as Map;
                      final tab = data['tab'] as Map;

                      setState(() {
                        currentTab = tab['label'] ?? '';
                      });

                      print('Tab clicked: ${tab['label']}');
                      print('Tab value: ${tab['value']}');
                      print('Tab index: ${tab['index']}');
                      print('Timestamp: ${data['timestamp']}');

                      // 진동 피드백
                      HapticFeedback.lightImpact();

                      // 탭 변경에 따른 추가 로직
                      _handleTabChange(tab['value']);
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

  void _handleTabChange(String tabValue) {
    // 탭 변경 시 Flutter 로직 처리
    switch (tabValue) {
      case 'notifications':
        // 알림 화면 업데이트
        break;
      case 'messages':
        // 메시지 화면 업데이트
        break;
      default:
        break;
    }
  }
}
```

### Flutter → Next.js (탭 변경 명령)

```dart
// Flutter에서 Next.js로 탭 변경 명령 전송
await webViewController?.evaluateJavascript(source: """
  // React state 업데이트 이벤트 트리거
  window.dispatchEvent(new CustomEvent('flutter-change-tab', {
    detail: { value: 'notifications' }
  }));
""");
```

```typescript
// Next.js에서 Flutter 명령 수신
'use client';

import { useEffect } from 'react';

export default function Page() {
  useEffect(() => {
    const handleFlutterCommand = (event: any) => {
      const { value } = event.detail;
      setActiveTab(value);
    };

    window.addEventListener('flutter-change-tab', handleFlutterCommand);
    return () => window.removeEventListener('flutter-change-tab', handleFlutterCommand);
  }, []);

  // ...
}
```

---

## 🚀 고급 사용법

### 1. 동적 탭 생성

```typescript
const [categories, setCategories] = useState([]);

useEffect(() => {
  // API에서 카테고리 fetch
  fetch('/api/categories')
    .then(res => res.json())
    .then(data => {
      const tabs = data.map((cat: any) => ({
        label: cat.name,
        value: cat.id,
        icon: cat.icon,
        badge: cat.count,
        active: activeTab === cat.id
      }));
      setCategories(tabs);
    });
}, [activeTab]);

return <StickyTabs tabs={categories} onTabChange={setActiveTab} />;
```

### 2. CollapsingToolbar와 결합

```typescript
import { CollapsingToolbarLayout } from '@/components/CollapsingToolbarLayout/CollapsingToolbarLayout';
import { StickyTabs } from '@/components/StickyTabs/StickyTabs';

export default function Page() {
  const [toolbarHeight, setToolbarHeight] = useState(300);
  const [activeTab, setActiveTab] = useState('all');

  return (
    <CollapsingToolbarLayout
      title={<h1>제주도 여행</h1>}
      maxHeight={300}
      minHeight={60}
      onScroll={(data) => {
        const height = 300 - (300 - 60) * data.progress;
        setToolbarHeight(height);
      }}
    >
      <StickyTabs
        tabs={tabs}
        onTabChange={setActiveTab}
        top={toolbarHeight}
        variant="glass"
      />

      {/* 컨텐츠 */}
    </CollapsingToolbarLayout>
  );
}
```

### 3. 무한 스크롤 + 탭

```typescript
'use client';

import { useState, useEffect, useRef } from 'react';
import { StickyTabs } from '@/components/StickyTabs/StickyTabs';

export default function InfiniteScrollPage() {
  const [items, setItems] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [activeTab, setActiveTab] = useState('all');
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setPage(prev => prev + 1);
        }
      },
      { threshold: 1.0 }
    );

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }

    return () => observerRef.current?.disconnect();
  }, []);

  useEffect(() => {
    // 탭 변경 시 데이터 리셋
    setItems([]);
    setPage(1);

    // 새 데이터 fetch
    fetch(\`/api/items?category=\${activeTab}&page=\${page}\`)
      .then(res => res.json())
      .then(data => setItems(prev => [...prev, ...data]));
  }, [activeTab, page]);

  const tabs = [
    { label: '전체', value: 'all', active: activeTab === 'all' },
    { label: '인기', value: 'popular', active: activeTab === 'popular' },
    { label: '신상품', value: 'new', active: activeTab === 'new' },
  ];

  return (
    <div>
      <StickyTabs tabs={tabs} onTabChange={setActiveTab} />

      <div style={{ padding: '20px' }}>
        {items.map((item, i) => (
          <div key={i}>{item.name}</div>
        ))}
        <div ref={loadMoreRef}>Loading...</div>
      </div>
    </div>
  );
}
```

---

## ⚠️ 주의사항

1. **'use client' 필수**: Next.js App Router에서 클라이언트 컴포넌트로 사용
2. **SSR 안전**: `typeof window !== 'undefined'` 체크로 서버 렌더링 안전
3. **자동 스크롤 성능**: 탭이 많을 경우 `autoScroll={false}` 고려
4. **배지 업데이트**: 탭 배열 전체를 새로 생성해야 리렌더링됨
5. **Flutter 통신**: WebView 준비 완료 후 핸들러 등록 필수

---

## 🎯 요약

**StickyTabs**는 Next.js 16 + React 19.2 + Vanilla Extract 환경에서 **Flutter WebView와 완벽하게 통합**되는 공통 탭 컴포넌트입니다.

- 📦 간단한 설치와 설정
- 🎨 다양한 스타일 옵션
- 📱 Flutter WebView 자동 통신
- ⚡ 고성능 + Zero-runtime CSS
- 🔒 TypeScript 타입 안정성

지금 바로 프로젝트에 적용해보세요! 🚀
