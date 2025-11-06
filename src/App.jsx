import { useState } from 'react';
import { SimpleSticky } from './SimpleSticky';
import { ComplexSticky } from './ComplexSticky';
import { AirbnbMap } from './examples/AirbnbMap';
import { TossNavigation } from './examples/TossNavigation';
import { NotionSidebar } from './examples/NotionSidebar';
import { ProductDetail } from './examples/ProductDetail';
import { TableOfContents } from './examples/TableOfContents';
import { StickyTabs } from './examples/StickyTabs';
import { PricingTable } from './examples/PricingTable';
import { ChatInterface } from './examples/ChatInterface';
import { AdminDashboard } from './examples/AdminDashboard';
import { RecipeDetail } from './examples/RecipeDetail';
import { StackedSticky } from './examples/StackedSticky';
import { ShrinkingHero } from './examples/ShrinkingHero';
import { PullToRefresh } from './examples/PullToRefresh';
import { BottomSheet } from './examples/BottomSheet';
import { SwipeableCards } from './examples/SwipeableCards';
import { NativeTabBar } from './examples/NativeTabBar';
import './App.css';

function App() {
  const [mode, setMode] = useState('simple');

  const examples = [
    { id: 'simple', label: 'Simple CSS', component: SimpleSticky },
    { id: 'complex', label: 'Complex Tracking', component: ComplexSticky },
    { id: 'airbnb', label: 'Airbnb 지도', component: AirbnbMap },
    { id: 'toss', label: 'Toss 네비', component: TossNavigation },
    { id: 'notion', label: 'Notion 사이드바', component: NotionSidebar },
    { id: 'product', label: '상품 상세', component: ProductDetail },
    { id: 'toc', label: '목차 고정', component: TableOfContents },
    { id: 'tabs', label: 'YouTube 탭', component: StickyTabs },
    { id: 'pricing', label: '가격표', component: PricingTable },
    { id: 'chat', label: 'Chat UI', component: ChatInterface },
    { id: 'admin', label: '관리자', component: AdminDashboard },
    { id: 'recipe', label: '레시피', component: RecipeDetail },
    { id: 'stacked', label: '스택형 고정', component: StackedSticky },
    { id: 'shrinking', label: 'GitHub 히어로', component: ShrinkingHero },
    { id: 'ptr', label: 'Pull to Refresh', component: PullToRefresh },
    { id: 'bottomsheet', label: 'Bottom Sheet', component: BottomSheet },
    { id: 'swipe', label: 'Swipe Cards', component: SwipeableCards },
    { id: 'nativetab', label: 'Native 탭', component: NativeTabBar },
  ];

  const ActiveComponent = examples.find((ex) => ex.id === mode)?.component || SimpleSticky;

  return (
    <div className="app">
      <div className="tab-buttons">
        {examples.map((ex) => (
          <button
            key={ex.id}
            className={mode === ex.id ? 'active' : ''}
            onClick={() => setMode(ex.id)}
          >
            {ex.label}
          </button>
        ))}
      </div>

      <ActiveComponent />
    </div>
  );
}

export default App;
