import React from 'react';
import { Home, Dice5, Palette, Sparkles, Heart, User as UserIcon } from 'lucide-react';
import { AppTab, User } from '../types';

interface MobileBottomNavProps {
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
  currentUser: User | null;
  onOpenAuth: () => void;
  favoritesCount: number;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  setActiveTab,
  currentUser,
  onOpenAuth,
  favoritesCount,
}) => {
  const items = [
    { id: 'home' as AppTab, label: 'หน้าแรก', icon: Home },
    { id: 'random' as AppTab, label: 'สุ่มสี', icon: Dice5 },
    { id: 'studio' as AppTab, label: 'ทดลองสี', icon: Palette },
    { id: 'my-style' as AppTab, label: 'สไตล์', icon: Sparkles },
    { id: 'favorites' as AppTab, label: 'ที่ชอบ', icon: Heart, badge: favoritesCount },
    {
      id: currentUser ? ('profile' as AppTab) : ('auth' as any),
      label: currentUser ? 'โปรไฟล์' : 'เข้าสู่ระบบ',
      icon: UserIcon,
    },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-pink-100 px-2 py-1 shadow-lg">
      <div className="grid grid-cols-6 gap-0.5 max-w-md mx-auto">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.id === 'auth' ? false : activeTab === item.id;

          const handleClick = () => {
            if (item.id === 'auth') {
              onOpenAuth();
            } else {
              setActiveTab(item.id as AppTab);
            }
          };

          return (
            <button
              key={item.label}
              onClick={handleClick}
              className={`flex flex-col items-center justify-center py-1.5 rounded-xl transition-all relative cursor-pointer ${
                isActive ? 'text-pink-600 font-bold' : 'text-slate-500 hover:text-pink-500'
              }`}
              style={{ minHeight: '52px' }}
            >
              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-transform ${
                    isActive ? 'scale-110 text-pink-600 stroke-[2.4]' : 'text-slate-500'
                  }`}
                />
                {typeof item.badge === 'number' && item.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2.5 px-1 py-0.2 bg-pink-500 text-white rounded-full text-[9px] font-bold min-w-[15px] text-center shadow-xs">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-1 truncate max-w-full font-medium">
                {item.label}
              </span>
              {isActive && (
                <span className="w-1.5 h-1.5 bg-pink-500 rounded-full mt-0.5" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
