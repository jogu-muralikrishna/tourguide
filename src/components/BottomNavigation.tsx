import React from 'react';
import { Home, Compass, Sparkles, Luggage, User } from 'lucide-react';

interface BottomNavigationProps {
  currentTab: 'home' | 'explore' | 'planner' | 'trips' | 'profile';
  onSelectTab: (tab: 'home' | 'explore' | 'planner' | 'trips' | 'profile') => void;
  confirmedCount?: number;
}

interface TabItem {
  id: 'home' | 'explore' | 'planner' | 'trips' | 'profile';
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  highlight?: boolean;
  badge?: number;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  currentTab,
  onSelectTab,
  confirmedCount = 0,
}) => {
  const tabs: TabItem[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'explore', label: 'Explore', icon: Compass },
    { id: 'planner', label: 'AI Planner', icon: Sparkles, highlight: true },
    { id: 'trips', label: 'Trips', icon: Luggage, badge: confirmedCount },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-[var(--bg-surface)]/95 backdrop-blur-lg border-t border-[var(--border-color)] px-2 py-1.5 no-print shadow-lg">
      <div className="flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all cursor-pointer relative ${
                isActive
                  ? 'text-sky-600 dark:text-sky-400 font-semibold'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              }`}
            >
              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-transform ${
                    isActive ? 'scale-110' : ''
                  } ${tab.highlight && isActive ? 'text-sky-500' : ''}`}
                />
                {!!tab.badge && tab.badge > 0 && (
                  <span className="absolute -top-1 -right-2 w-4 h-4 bg-sky-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
