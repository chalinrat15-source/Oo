import React from 'react';
import {
  Home,
  Dice5,
  Palette,
  BookOpen,
  Heart,
  History,
  Sparkles,
  Trophy,
  User as UserIcon,
  ShieldAlert,
  LogOut,
  Settings,
} from 'lucide-react';
import { AppTab, User } from '../types';

interface HeaderNavProps {
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
  currentUser: User | null;
  onOpenAuth: () => void;
  onLogout: () => void;
  favoritesCount: number;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  activeTab,
  setActiveTab,
  currentUser,
  onOpenAuth,
  onLogout,
  favoritesCount,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);

  const navLinks = [
    { id: 'home' as AppTab, label: 'หน้าแรก', icon: Home },
    { id: 'random' as AppTab, label: 'สุ่มสี', icon: Dice5 },
    { id: 'studio' as AppTab, label: 'ทดลองสียาง', icon: Palette },
    { id: 'my-style' as AppTab, label: 'ค้นหาสไตล์ ✨', icon: Sparkles },
    { id: 'curated' as AppTab, label: 'คู่สียอดนิยม', icon: BookOpen },
    { id: 'challenges' as AppTab, label: 'ภารกิจ & Badge', icon: Trophy },
    { id: 'favorites' as AppTab, label: 'สีที่ชอบ', icon: Heart, badge: favoritesCount },
    { id: 'history' as AppTab, label: 'ประวัติ', icon: History },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-pink-100 shadow-2xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 h-16 flex items-center justify-between gap-2">
        {/* Brand Logo & Name */}
        <button
          onClick={() => setActiveTab('home')}
          className="flex items-center gap-2.5 group text-left cursor-pointer shrink-0"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-pink-500 via-purple-500 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-pink-200 group-hover:scale-105 transition-transform">
            <span className="text-xl">💖</span>
          </div>
          <div>
            <div className="font-extrabold text-base sm:text-xl bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent leading-none flex items-center gap-1.5">
              <span>BraceMood</span>
              <span className="text-[10px] px-1.5 py-0.5 bg-pink-100 text-pink-700 font-bold rounded-md uppercase hidden sm:inline-block">
                Online
              </span>
            </div>
            <div className="text-[10px] sm:text-xs text-slate-500 font-medium truncate">
              ค้นหาสียางที่ใช่ ในสไตล์ของคุณ
            </div>
          </div>
        </button>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 bg-pink-50/70 p-1.5 rounded-2xl border border-pink-100/70 overflow-x-auto">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shrink-0 ${
                  isActive
                    ? 'bg-white text-pink-600 shadow-xs scale-[1.02]'
                    : 'text-slate-600 hover:text-pink-600 hover:bg-white/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-pink-600' : 'text-slate-500'}`} />
                <span>{item.label}</span>
                {typeof item.badge === 'number' && item.badge > 0 && (
                  <span className="ml-0.5 px-1.5 py-0.2 bg-pink-500 text-white rounded-full text-[9px] font-bold">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* User / Member Actions & Admin Portal */}
        <div className="flex items-center gap-2">
          {currentUser ? (
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 px-2.5 py-1.5 bg-white hover:bg-pink-50 border border-pink-200 rounded-2xl transition-all cursor-pointer shadow-2xs"
              >
                <div className="w-8 h-8 rounded-xl bg-pink-100 flex items-center justify-center text-base shadow-inner">
                  {currentUser.profile || '😊'}
                </div>
                <div className="text-left hidden sm:block max-w-[110px]">
                  <div className="text-xs font-bold text-slate-800 truncate">{currentUser.name}</div>
                  <div className="text-[10px] text-pink-600 capitalize font-medium">
                    {currentUser.role === 'admin' ? '👑 ผู้ดูแลระบบ' : '⭐ สมาชิก'}
                  </div>
                </div>
              </button>

              {/* Profile Dropdown Menu */}
              {isDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-pink-100 py-2 z-50 animate-in fade-in slide-in-from-top-2"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="text-xs font-bold text-slate-800">{currentUser.name}</p>
                    <p className="text-[10px] text-slate-500 truncate">{currentUser.email}</p>
                  </div>

                  <button
                    onClick={() => setActiveTab('profile')}
                    className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-pink-50 flex items-center gap-2"
                  >
                    <UserIcon className="w-3.5 h-3.5 text-pink-500" />
                    <span>โปรไฟล์ของฉัน</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('member-settings')}
                    className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-pink-50 flex items-center gap-2"
                  >
                    <Settings className="w-3.5 h-3.5 text-slate-500" />
                    <span>ตั้งค่าบัญชี</span>
                  </button>

                  {currentUser.role === 'admin' && (
                    <button
                      onClick={() => setActiveTab('admin-dashboard')}
                      className="w-full text-left px-4 py-2 text-xs text-purple-700 hover:bg-purple-50 font-bold flex items-center gap-2 border-t border-slate-100"
                    >
                      <ShieldAlert className="w-3.5 h-3.5 text-purple-600" />
                      <span>ระบบหลังบ้าน (Admin)</span>
                    </button>
                  )}

                  <div className="border-t border-slate-100 my-1"></div>

                  <button
                    onClick={onLogout}
                    className="w-full text-left px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                  >
                    <LogOut className="w-3.5 h-3.5 text-rose-500" />
                    <span>ออกจากระบบ</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              <button
                onClick={onOpenAuth}
                className="px-3.5 py-2 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white rounded-2xl text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-all hover:scale-105 active:scale-95 cursor-pointer"
              >
                <UserIcon className="w-3.5 h-3.5" />
                <span>เข้าสู่ระบบ / สมัคร</span>
              </button>

              <button
                onClick={() => setActiveTab('admin-login')}
                className="p-2 bg-slate-100 hover:bg-purple-50 hover:text-purple-600 text-slate-500 rounded-2xl transition-colors cursor-pointer"
                title="เข้าสู่ระบบ Admin หลังบ้าน"
              >
                <ShieldAlert className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
