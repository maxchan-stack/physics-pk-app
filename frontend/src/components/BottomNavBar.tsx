import React from 'react';
import { Award, BookOpen, BarChart3, Swords } from 'lucide-react';
import { ActiveTab } from '../types/physics-types';

interface BottomNavBarProps {
  /** 目前啟用的分頁 */
  activeTab: ActiveTab;
  /** 切換分頁之回呼函式 */
  onSelectTab: (tab: ActiveTab) => void;
  /** 錯題本未清零數量（顯示提示角標） */
  mistakeCount: number;
}

/**
 * 行動端底部固定導覽列 (Mobile Bottom Tab Bar)
 * 支援 iPhone 底部安全區間距與單手拇指快速切換四大功能頁
 *
 * @param props BottomNavBarProps
 * @returns 底部導覽列元件
 */
export function BottomNavBar({
  activeTab,
  onSelectTab,
  mistakeCount,
}: BottomNavBarProps): React.ReactElement {
  const navItems: {
    id: ActiveTab;
    label: string;
    icon: React.ReactNode;
    badge?: number;
  }[] = [
    {
      id: 'lobby',
      label: '測驗',
      icon: <Swords className="w-5 h-5" />,
    },
    {
      id: 'concepts',
      label: '觀念黑板',
      icon: <BookOpen className="w-5 h-5" />,
    },
    {
      id: 'weakness',
      label: '弱點錯題',
      icon: <BarChart3 className="w-5 h-5" />,
      badge: mistakeCount > 0 ? mistakeCount : undefined,
    },
    {
      id: 'leaderboard',
      label: '排行榜',
      icon: <Award className="w-5 h-5" />,
    },
  ];

  return (
    <nav
      aria-label="行動端主導覽列"
      className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#D5E2E0] shadow-[0_-4px_16px_rgba(36,85,79,0.06)] pb-safe"
    >
      <div className="max-w-[520px] mx-auto grid grid-cols-4 px-1 py-1.5">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              aria-current={isActive ? 'page' : undefined}
              onClick={() => onSelectTab(item.id)}
              className={`relative flex flex-col items-center justify-center py-1.5 rounded-xl transition-colors ${
                isActive
                  ? 'text-[#24554F] font-bold bg-[#E3F3F0]'
                  : 'text-neutral-500 hover:text-[#24554F]'
              }`}
            >
              <div className="relative">
                {item.icon}
                {item.badge !== undefined && (
                  <span className="absolute -top-1.5 -right-2.5 min-w-[16px] h-[16px] px-1 rounded-full bg-[#266461] text-white text-[10px] font-bold flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[11px] mt-0.5 tracking-tight">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
