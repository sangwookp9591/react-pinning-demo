# Next.js 16 App Router에서 공통 컴포넌트 사용 가이드

## 📋 목차
1. [프로젝트 구조](#프로젝트-구조)
2. [Vanilla Extract 설정](#vanilla-extract-설정)
3. [컴포넌트 마이그레이션](#컴포넌트-마이그레이션)
4. [사용 예제](#사용-예제)
5. [Flutter WebView 통신](#flutter-webview-통신)

---

## 🗂️ 프로젝트 구조

```
my-nextjs-app/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   └── examples/
│       ├── hybrid-sticky/
│       │   └── page.tsx
│       └── collapsing-toolbar/
│           └── page.tsx
├── components/
│   ├── ProgressiveStackLayout/
│   │   ├── ProgressiveStackLayout.tsx
│   │   └── ProgressiveStackLayout.css.ts
│   └── CollapsingToolbarLayout/
│       ├── CollapsingToolbarLayout.tsx
│       └── CollapsingToolbarLayout.css.ts
└── package.json
```

---

## ⚙️ Vanilla Extract 설정

### 1. 패키지 설치

```bash
npm install @vanilla-extract/css @vanilla-extract/next-plugin
npm install prop-types  # React PropTypes
```

### 2. next.config.js 설정

```javascript
// next.config.js
const { createVanillaExtractPlugin } = require('@vanilla-extract/next-plugin');

const withVanillaExtract = createVanillaExtractPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Next.js 16 App Router 설정
  experimental: {
    // 필요한 실험적 기능 활성화
  },
};

module.exports = withVanillaExtract(nextConfig);
```

### 3. TypeScript 설정 (선택)

```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

---

## 🔄 컴포넌트 마이그레이션

### ProgressiveStackLayout.tsx

```typescript
'use client';

import React, { useState, useRef, useEffect, ReactNode } from 'react';
import * as styles from './ProgressiveStackLayout.css';

interface Layer {
  content: ReactNode;
  topOffset?: number | string;
  zIndex?: number;
  background?: string;
  style?: React.CSSProperties;
  spacerHeight?: number;
  spacerBackground?: string;
  spacerContent?: ReactNode;
  postSpacerHeight?: number;
  postSpacerBackground?: string;
  postSpacerContent?: ReactNode;
}

interface ProgressiveStackLayoutProps {
  hero: ReactNode;
  heroStyles?: React.CSSProperties;
  layers?: Layer[];
  children?: ReactNode;
  containerStyles?: React.CSSProperties;
  showProgressBar?: boolean;
  showScrollIndicator?: boolean;
  onScroll?: (data: { totalProgress: number; heroProgress: number; scrollTop: number }) => void;
  onHeroProgress?: (progress: number) => void;
}

export const ProgressiveStackLayout: React.FC<ProgressiveStackLayoutProps> = ({
  hero,
  heroStyles = {},
  layers = [],
  children,
  containerStyles = {},
  showProgressBar = true,
  showScrollIndicator = true,
  onScroll,
  onHeroProgress,
}) => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [heroProgress, setHeroProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const hero = heroRef.current;
    if (!container || !hero) return;

    const handleScroll = () => {
      const scrollTop = container.scrollTop;
      const scrollHeight = container.scrollHeight - container.clientHeight;
      const heroHeight = hero.offsetHeight;

      // 전체 스크롤 진행도 (0 ~ 100)
      const totalProgress = (scrollTop / scrollHeight) * 100;
      setScrollProgress(totalProgress);

      // 히어로 축소 진행도 (0 ~ 1)
      const heroShrink = Math.min(scrollTop / heroHeight, 1);
      setHeroProgress(heroShrink);

      // Flutter WebView 통신
      if (typeof window !== 'undefined' && (window as any).flutter_inappwebview) {
        (window as any).flutter_inappwebview.callHandler('onProgressiveScroll', {
          totalProgress,
          heroProgress: heroShrink,
          scrollTop,
        });
      }

      // 커스텀 콜백
      if (onScroll) {
        onScroll({ totalProgress, heroProgress: heroShrink, scrollTop });
      }

      if (onHeroProgress) {
        onHeroProgress(heroShrink);
      }
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, [onScroll, onHeroProgress]);

  // 히어로 스타일 계산
  const heroScale = 1 - heroProgress * 0.3;
  const heroOpacity = 1 - heroProgress;
  const contentOpacity = Math.min(heroProgress * 2, 1);

  return (
    <div className={styles.container} ref={containerRef} style={containerStyles}>
      {/* 진행도 바 */}
      {showProgressBar && (
        <div className={styles.progressBar}>
          <div className={styles.progressFill} style={{ width: \`\${scrollProgress}%\` }} />
        </div>
      )}

      {/* 히어로 섹션 */}
      <section
        ref={heroRef}
        className={styles.hero}
        style={{
          transform: \`scale(\${heroScale})\`,
          opacity: heroOpacity,
          ...heroStyles,
        }}
      >
        {hero}
        {showScrollIndicator && heroProgress < 0.1 && (
          <div className={styles.scrollIndicator}>
            <span>스크롤하여 마법을 경험하세요</span>
            <div className={styles.scrollArrow}>⬇</div>
          </div>
        )}
      </section>

      {/* 레이어들 */}
      {layers.map((layer, index) => (
        <React.Fragment key={index}>
          {/* 스페이서 */}
          {layer.spacerHeight && (
            <div
              className={styles.spacer}
              style={{
                height: \`\${layer.spacerHeight}px\`,
                background: layer.spacerBackground || 'rgba(0, 0, 0, 0.3)',
              }}
            >
              {layer.spacerContent}
            </div>
          )}

          {/* 레이어 */}
          <div
            className={styles.layerBase}
            style={{
              top: layer.topOffset || 0,
              zIndex: layer.zIndex || 100 - index * 10,
              background: layer.background || 'rgba(255, 255, 255, 0.95)',
              ...layer.style,
            }}
          >
            {layer.content}
          </div>

          {/* 레이어 고정 후 스페이서 */}
          {layer.postSpacerHeight && (
            <div
              style={{
                height: \`\${layer.postSpacerHeight}px\`,
                background: layer.postSpacerBackground || 'rgba(0, 0, 0, 0.5)',
                padding: '60px 32px',
              }}
            >
              {layer.postSpacerContent}
            </div>
          )}
        </React.Fragment>
      ))}

      {/* 메인 콘텐츠 */}
      <main className={styles.content} style={{ opacity: contentOpacity }}>
        {children}
      </main>
    </div>
  );
};
```

### CollapsingToolbarLayout.tsx

```typescript
'use client';

import React, { useState, useRef, useEffect, ReactNode } from 'react';
import * as styles from './CollapsingToolbarLayout.css';

interface Action {
  icon: ReactNode;
  onClick?: () => void;
}

interface Tab {
  label: string;
  value: string;
  active?: boolean;
}

interface CollapsingToolbarLayoutProps {
  title: ReactNode;
  backgroundImage?: ReactNode;
  backgroundGradient?: string;
  actions?: Action[];
  backButton?: ReactNode;
  tabs?: Tab[];
  onTabChange?: (value: string) => void;
  children?: ReactNode;
  maxHeight?: number;
  minHeight?: number;
  containerStyles?: React.CSSProperties;
  onScroll?: (data: { progress: number; isCollapsed: boolean; scrollTop: number }) => void;
}

export const CollapsingToolbarLayout: React.FC<CollapsingToolbarLayoutProps> = ({
  title,
  backgroundImage,
  backgroundGradient = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  actions = [],
  backButton,
  tabs = [],
  onTabChange,
  children,
  maxHeight = 300,
  minHeight = 60,
  containerStyles = {},
  onScroll,
}) => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollTop = container.scrollTop;
      const maxScroll = maxHeight - minHeight;
      const progress = Math.min(scrollTop / maxScroll, 1);
      setScrollProgress(progress);

      // Flutter WebView 통신
      if (typeof window !== 'undefined' && (window as any).flutter_inappwebview) {
        (window as any).flutter_inappwebview.callHandler('onToolbarCollapse', {
          progress,
          isCollapsed: progress >= 1,
          scrollTop,
        });
      }

      // 커스텀 콜백
      if (onScroll) {
        onScroll({ progress, isCollapsed: progress >= 1, scrollTop });
      }
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, [maxHeight, minHeight, onScroll]);

  const toolbarHeight = maxHeight - (maxHeight - minHeight) * scrollProgress;
  const titleScale = 1 - scrollProgress * 0.4;
  const titleTranslateY = -scrollProgress * 80;
  const imageOpacity = 1 - scrollProgress * 0.7;
  const imageScale = 1 + scrollProgress * 0.2;
  const backdropBlur = scrollProgress * 10;

  return (
    <div className={styles.container} ref={containerRef} style={containerStyles}>
      <div className={\`\${styles.toolbar} \${styles.optimized}\`} style={{ height: \`\${toolbarHeight}px\` }}>
        <div
          className={\`\${styles.toolbarBackground} \${styles.optimized}\`}
          style={{
            opacity: imageOpacity,
            transform: \`scale(\${imageScale})\`,
            background: backgroundGradient,
          }}
        >
          {backgroundImage}
          <div className={styles.bgGradient} />
        </div>

        <div
          className={styles.toolbarActions}
          style={{
            backdropFilter: \`blur(\${backdropBlur}px)\`,
            background: \`rgba(255, 255, 255, \${scrollProgress * 0.95})\`,
          }}
        >
          {backButton || <button className={styles.actionIcon}>←</button>}
          <div className={styles.actionsRight}>
            {actions.map((action, i) => (
              <button key={i} className={styles.actionIcon} onClick={action.onClick}>
                {action.icon}
              </button>
            ))}
          </div>
        </div>

        <div
          className={\`\${styles.toolbarContent} \${styles.optimized}\`}
          style={{
            transform: \`translateY(\${titleTranslateY}px) scale(\${titleScale})\`,
            opacity: 1 - scrollProgress * 0.3,
          }}
        >
          {title}
        </div>
      </div>

      {tabs.length > 0 && (
        <div className={styles.stickyTabs} style={{ top: \`\${toolbarHeight}px\` }}>
          {tabs.map((tab, i) => (
            <button
              key={i}
              style={{
                padding: '8px 16px',
                background: tab.active ? '#667eea' : 'transparent',
                border: \`1px solid \${tab.active ? '#667eea' : '#e5e5e5'}\`,
                borderRadius: '20px',
                fontSize: '14px',
                fontWeight: 500,
                color: tab.active ? 'white' : '#666',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s',
                flexShrink: 0,
              }}
              onClick={() => onTabChange && onTabChange(tab.value)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}

      <div className={styles.content}>{children}</div>
    </div>
  );
};
```

---

## 💡 사용 예제

### 1. Hybrid Sticky Page

```typescript
// app/examples/hybrid-sticky/page.tsx
'use client';

import { ProgressiveStackLayout } from '@/components/ProgressiveStackLayout/ProgressiveStackLayout';

export default function HybridStickyPage() {
  const heroContent = (
    <>
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(30deg, rgba(255,255,255,0.05) 12%, transparent 12.5%)',
        backgroundSize: '80px 140px',
        opacity: 0.3
      }} />
      <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: '900px' }}>
        <h1 style={{
          fontSize: '72px',
          fontWeight: 'bold',
          margin: '0 0 24px 0',
          background: 'linear-gradient(135deg, #7ee787 0%, #58a6ff 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          Hybrid Sticky Experience
        </h1>
        <p style={{ fontSize: '24px', color: 'rgba(255,255,255,0.9)', margin: '0 0 40px 0' }}>
          GitHub 스타일 히어로 축소 + 스택형 레이어
        </p>
        <button style={{
          padding: '16px 48px',
          background: 'white',
          border: 'none',
          borderRadius: '30px',
          fontSize: '18px',
          fontWeight: 600,
          cursor: 'pointer'
        }}>
          시작하기
        </button>
      </div>
    </>
  );

  const layers = [
    {
      content: (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 600 }}>
            <span style={{ fontSize: '24px', marginRight: '12px' }}>⚡</span>
            Layer 1 - Sticks to Top
          </h2>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button style={{ padding: '8px 16px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.2)', color: 'white' }}>
              Search
            </button>
            <button style={{ padding: '8px 16px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.2)', color: 'white' }}>
              Menu
            </button>
          </div>
        </div>
      ),
      topOffset: 0,
      zIndex: 40,
      background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      spacerHeight: 400,
      spacerBackground: 'rgba(0, 0, 0, 0.3)',
      spacerContent: (
        <div style={{ textAlign: 'center' }}>
          <h3 style={{ fontSize: '32px', margin: '0 0 16px 0' }}>⬇️ 계속 스크롤하세요</h3>
          <p style={{ fontSize: '18px', color: '#8b949e' }}>레이어들이 순차적으로 고정됩니다</p>
        </div>
      ),
      postSpacerHeight: 500,
      postSpacerBackground: 'rgba(0, 0, 0, 0.5)',
      postSpacerContent: (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h3 style={{ fontSize: '28px', marginBottom: '16px' }}>Layer 1이 고정되었습니다!</h3>
          <p style={{ fontSize: '16px', color: '#8b949e' }}>계속 스크롤하면 Layer 2가 고정됩니다.</p>
        </div>
      ),
    },
    // ... 더 많은 레이어
  ];

  return (
    <ProgressiveStackLayout
      hero={heroContent}
      heroStyles={{
        padding: '80px 32px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      }}
      layers={layers}
      containerStyles={{ background: '#0d1117', color: '#ffffff' }}
      showProgressBar={true}
      showScrollIndicator={true}
    >
      <div style={{ padding: '48px 32px' }}>
        <h2 style={{ fontSize: '36px', marginBottom: '24px' }}>🎉 모든 레이어가 고정되었습니다!</h2>
        {/* 메인 콘텐츠 */}
      </div>
    </ProgressiveStackLayout>
  );
}
```

### 2. Collapsing Toolbar Page

```typescript
// app/examples/collapsing-toolbar/page.tsx
'use client';

import { useState } from 'react';
import { CollapsingToolbarLayout } from '@/components/CollapsingToolbarLayout/CollapsingToolbarLayout';

export default function CollapsingToolbarPage() {
  const [activeTab, setActiveTab] = useState('전체');

  const titleContent = (
    <>
      <h1 style={{ margin: '0 0 8px 0', fontSize: '36px', fontWeight: 'bold' }}>
        제주도 여행 가이드
      </h1>
      <p style={{ margin: '0 0 12px 0', fontSize: '16px', opacity: 0.95 }}>
        최고의 관광지와 맛집을 소개합니다
      </p>
      <div style={{ display: 'flex', gap: '8px', fontSize: '14px', opacity: 0.9 }}>
        <span>⭐ 4.8</span>
        <span>•</span>
        <span>리뷰 1,234개</span>
      </div>
    </>
  );

  const actions = [
    { icon: '🔍', onClick: () => console.log('Search') },
    { icon: '❤️', onClick: () => console.log('Favorite') },
    { icon: '⋮', onClick: () => console.log('More') },
  ];

  const tabs = [
    { label: '전체', value: '전체', active: activeTab === '전체' },
    { label: '관광지', value: '관광지', active: activeTab === '관광지' },
    { label: '맛집', value: '맛집', active: activeTab === '맛집' },
    { label: '숙소', value: '숙소', active: activeTab === '숙소' },
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
      <div style={{ padding: '24px 16px' }}>
        <h2 style={{ fontSize: '24px', marginBottom: '16px' }}>🏝️ 인기 관광지</h2>
        {/* 콘텐츠 */}
      </div>
    </CollapsingToolbarLayout>
  );
}
```

---

## 📱 Flutter WebView 통신

### Flutter 측 핸들러 설정

```dart
// lib/screens/webview_screen.dart
import 'package:flutter/material.dart';
import 'package:flutter_inappwebview/flutter_inappwebview.dart';

class WebViewScreen extends StatefulWidget {
  @override
  _WebViewScreenState createState() => _WebViewScreenState();
}

class _WebViewScreenState extends State<WebViewScreen> {
  InAppWebViewController? webViewController;
  double scrollProgress = 0.0;
  bool isToolbarCollapsed = false;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: InAppWebView(
          initialUrlRequest: URLRequest(
            url: Uri.parse('http://localhost:3000/examples/hybrid-sticky'),
          ),
          onWebViewCreated: (controller) {
            webViewController = controller;

            // ProgressiveStackLayout 핸들러
            controller.addJavaScriptHandler(
              handlerName: 'onProgressiveScroll',
              callback: (args) {
                final data = args[0] as Map;
                setState(() {
                  scrollProgress = data['totalProgress'] ?? 0.0;
                });
                print('Hero Progress: ${data['heroProgress']}');
                print('Scroll Top: ${data['scrollTop']}');
              },
            );

            // CollapsingToolbarLayout 핸들러
            controller.addJavaScriptHandler(
              handlerName: 'onToolbarCollapse',
              callback: (args) {
                final data = args[0] as Map;
                setState(() {
                  isToolbarCollapsed = data['isCollapsed'] ?? false;
                });
                print('Toolbar Progress: ${data['progress']}');
              },
            );
          },
        ),
      ),
      // Flutter UI에서 진행도 표시
      floatingActionButton: FloatingActionButton(
        onPressed: () {},
        child: Text('${scrollProgress.toStringAsFixed(0)}%'),
      ),
    );
  }
}
```

### Next.js 측 타입 선언

```typescript
// types/flutter-webview.d.ts
interface FlutterInAppWebView {
  callHandler(handlerName: string, ...args: any[]): Promise<any>;
}

interface Window {
  flutter_inappwebview?: FlutterInAppWebView;
}
```

---

## 🚀 배포 및 테스트

### 로컬 개발

```bash
# Next.js 개발 서버 실행
npm run dev

# Flutter 앱에서 접속
# iOS 시뮬레이터: http://localhost:3000
# Android 에뮬레이터: http://10.0.2.2:3000
# 실제 기기: http://<YOUR_LOCAL_IP>:3000
```

### 프로덕션 빌드

```bash
# Next.js 빌드
npm run build
npm run start

# 또는 정적 export (Flutter asset으로 포함 가능)
npm run build
# out/ 폴더를 Flutter assets에 포함
```

### Flutter Asset으로 포함 (오프라인)

```yaml
# pubspec.yaml
flutter:
  assets:
    - assets/web/
```

```dart
// Flutter에서 로컬 HTML 로드
InAppWebView(
  initialUrlRequest: URLRequest(
    url: Uri.parse('file:///android_asset/flutter_assets/assets/web/index.html'),
  ),
)
```

---

## ⚠️ 주의사항

1. **'use client' 지시어 필수**: 모든 인터랙티브 컴포넌트에 추가
2. **SSR 주의**: `window` 객체 접근 시 `typeof window !== 'undefined'` 체크
3. **CSS-in-JS 성능**: Vanilla Extract는 빌드 타임에 CSS 추출되므로 SSR 안전
4. **Flutter 통신**: WebView 준비 완료 후 핸들러 등록 확인
5. **경로 별칭**: `@/components` 사용 위해 tsconfig paths 설정 필요

---

## 📦 전체 패키지 목록

```json
{
  "dependencies": {
    "next": "^16.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "@vanilla-extract/css": "^1.14.0",
    "prop-types": "^15.8.1"
  },
  "devDependencies": {
    "@vanilla-extract/next-plugin": "^2.3.0",
    "@types/node": "^20.0.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "typescript": "^5.0.0"
  }
}
```

---

## 🎯 요약

1. **컴포넌트를 'use client'로 변환** - App Router의 클라이언트 컴포넌트로 사용
2. **TypeScript 타입 추가** - Props 인터페이스 정의로 타입 안정성 확보
3. **Vanilla Extract 설정** - next.config.js에 플러그인 추가
4. **Flutter 핸들러 등록** - 양방향 통신을 위한 JavaScript Handler 설정
5. **경로 구조화** - components/, app/ 폴더로 명확하게 분리

이제 Next.js 16 App Router 프로젝트에서 바로 사용할 수 있습니다! 🎉
