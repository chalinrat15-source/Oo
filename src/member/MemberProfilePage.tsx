import React, { useEffect, useState } from 'react';
import { User, UserBadge, FavoriteItem, ActiveCombination } from '../types';
import { ApiClient } from '../services/api';
import {
  User as UserIcon,
  Heart,
  History,
  Trophy,
  Sparkles,
  Calendar,
  Settings,
  Smile,
  LogOut,
  Palette,
  ExternalLink,
} from 'lucide-react';

interface MemberProfilePageProps {
  currentUser: User;
  onNavigateTab: (tab: any) => void;
  onApplyCombination: (combo: ActiveCombination) => void;
  onLogout: () => void;
  onNotify: (msg: string) => void;
}

export const MemberProfilePage: React.FC<MemberProfilePageProps> = ({
  currentUser,
  onNavigateTab,
  onApplyCombination,
  onLogout,
  onNotify,
}) => {
  const [badges, setBadges] = useState<UserBadge[]>([]);
  const [favorites, setFavorites] = useState<any[]>([]);
  const [historyCount, setHistoryCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfileData = async () => {
      try {
        setLoading(true);
        const [badgesData, favsData, histData] = await Promise.all([
          ApiClient.getBadges(),
          ApiClient.getFavorites(),
          ApiClient.getHistory(),
        ]);
        setBadges(badgesData || []);
        setFavorites(favsData || []);
        setHistoryCount((histData || []).length);
      } catch (e) {
        console.error('Error fetching member profile data:', e);
      } finally {
        setLoading(false);
      }
    };
    loadProfileData();
  }, [currentUser]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 sm:py-10">
      {/* Profile Header Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-pink-100 mb-8 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
          {/* Avatar */}
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-pink-400 via-purple-400 to-indigo-400 flex items-center justify-center text-4xl shadow-md shadow-pink-200 border-4 border-white shrink-0">
            {currentUser.profile || '🌸'}
          </div>

          {/* User Info */}
          <div className="text-center sm:text-left flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-slate-800">
                  {currentUser.name}
                </h1>
                <p className="text-xs text-slate-500 mt-0.5">{currentUser.email}</p>
              </div>

              <div className="flex items-center justify-center gap-2">
                <button
                  onClick={() => onNavigateTab('member-settings')}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-pink-50 text-slate-700 hover:text-pink-600 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Settings className="w-3.5 h-3.5" />
                  <span>แก้ไขโปรไฟล์</span>
                </button>
                <button
                  onClick={onLogout}
                  className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
                  title="ออกจากระบบ"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>ออก</span>
                </button>
              </div>
            </div>

            {/* Badges & Tags */}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-4">
              <span className="px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-xs font-bold flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                <span>สไตล์: {currentUser.style || 'ยังไม่ได้ระบุ'}</span>
              </span>
              <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-bold flex items-center gap-1">
                <Smile className="w-3 h-3" />
                <span>สมาชิกจัดฟันตัวยง</span>
              </span>
              <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-[11px] font-medium flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span>เข้าร่วมเมื่อ {new Date(currentUser.created_at).toLocaleDateString('th-TH')}</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Counter Grid */}
      <div className="grid grid-cols-3 gap-3 sm:gap-5 mb-8">
        <div
          onClick={() => onNavigateTab('favorites')}
          className="bg-white p-4 sm:p-5 rounded-3xl border border-pink-100 shadow-xs text-center cursor-pointer hover:border-pink-300 transition-all hover:scale-[1.02]"
        >
          <div className="w-10 h-10 rounded-2xl bg-pink-50 text-pink-600 flex items-center justify-center mx-auto mb-2 text-lg">
            <Heart className="w-5 h-5 fill-pink-500 text-pink-500" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-800">{favorites.length}</div>
          <div className="text-[11px] text-slate-500 font-semibold mt-0.5">คู่สีที่บันทึกไว้</div>
        </div>

        <div
          onClick={() => onNavigateTab('history')}
          className="bg-white p-4 sm:p-5 rounded-3xl border border-purple-100 shadow-xs text-center cursor-pointer hover:border-purple-300 transition-all hover:scale-[1.02]"
        >
          <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mx-auto mb-2 text-lg">
            <History className="w-5 h-5" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-800">{historyCount}</div>
          <div className="text-[11px] text-slate-500 font-semibold mt-0.5">ประวัติการสุ่มสี</div>
        </div>

        <div
          onClick={() => onNavigateTab('challenges')}
          className="bg-white p-4 sm:p-5 rounded-3xl border border-amber-100 shadow-xs text-center cursor-pointer hover:border-amber-300 transition-all hover:scale-[1.02]"
        >
          <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-2 text-lg">
            <Trophy className="w-5 h-5 text-amber-500" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-800">{badges.length}</div>
          <div className="text-[11px] text-slate-500 font-semibold mt-0.5">เหรียญ Badge</div>
        </div>
      </div>

      {/* Badges Showcase Section */}
      <div className="bg-white rounded-3xl p-6 shadow-xl border border-pink-100 mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">🎖️</span>
            <h2 className="font-extrabold text-base sm:text-lg text-slate-800">
              เหรียญรางวัลของคุณ (Badges Collection)
            </h2>
          </div>
          <button
            onClick={() => onNavigateTab('challenges')}
            className="text-xs font-bold text-pink-600 hover:text-pink-700 flex items-center gap-1 cursor-pointer"
          >
            <span>ดูภารกิจทั้งหมด</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>

        {badges.length === 0 ? (
          <div className="p-6 text-center text-xs text-slate-400 bg-pink-50/40 rounded-2xl border border-pink-100/60">
            ยังไม่มีเหรียญรางวัล เริ่มทำภารกิจหรือสุ่มสีเพื่อปลดล็อกเหรียญแรกของคุณ!
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {badges.map((b) => (
              <div
                key={b.id || b.badge_id}
                className="p-3.5 bg-gradient-to-b from-white to-pink-50/40 border border-pink-100 rounded-2xl flex items-center gap-3 shadow-2xs hover:scale-105 transition-transform"
              >
                <span className="text-2xl">{b.badge_icon || '🏆'}</span>
                <div>
                  <div className="text-xs font-extrabold text-slate-800">{b.badge_name}</div>
                  <div className="text-[9px] text-slate-400">
                    ปลดล็อกเมื่อ {new Date(b.earned_at).toLocaleDateString('th-TH')}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent Favorites Preview */}
      <div className="bg-white rounded-3xl p-6 shadow-xl border border-pink-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">💖</span>
            <h2 className="font-extrabold text-base sm:text-lg text-slate-800">
              คู่สียางล่าสุดที่คุณบันทึกไว้
            </h2>
          </div>
          <button
            onClick={() => onNavigateTab('favorites')}
            className="text-xs font-bold text-pink-600 hover:text-pink-700 flex items-center gap-1 cursor-pointer"
          >
            <span>ดูทั้งหมด ({favorites.length})</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>

        {favorites.length === 0 ? (
          <div className="p-6 text-center text-xs text-slate-400 bg-pink-50/40 rounded-2xl border border-pink-100/60">
            ยังไม่ได้บันทึกคู่สียาง ลองกดสุ่มสีแล้วกดปุ่มหัวใจดูสิ!
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {favorites.slice(0, 4).map((fav) => (
              <div
                key={fav.id}
                className="p-3.5 bg-pink-50/30 border border-pink-100 rounded-2xl flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-1.5">
                    {fav.colors?.map((c: any, i: number) => (
                      <span
                        key={i}
                        className="w-6 h-6 rounded-full border-2 border-white shadow-xs"
                        style={{ backgroundColor: c.hex }}
                      />
                    ))}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-800 truncate max-w-[150px]">
                      {fav.name}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      บันทึกเมื่อ {new Date(fav.created_at).toLocaleDateString('th-TH')}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    const activeCombo: ActiveCombination = {
                      id: fav.id,
                      name: fav.name,
                      colors: fav.colors,
                      patternMode: fav.pattern_mode || 'alternate',
                      score: {
                        harmony: 95,
                        vibrancy: 90,
                        cuteness: 95,
                        skinCompliment: 92,
                        overallFeeling: 'คู่สีโปรดของคุณ',
                      },
                      upperTeethColors: fav.upper_colors || Array.from({ length: 10 }, (_, i) => fav.colors[i % fav.colors.length]?.hex || '#FF69B4'),
                      lowerTeethColors: fav.lower_colors || Array.from({ length: 10 }, (_, i) => fav.colors[(i + 1) % fav.colors.length]?.hex || '#87CEEB'),
                    };
                    onApplyCombination(activeCombo);
                    onNotify(`นำคู่สี "${fav.name}" ไปสวมในสตูดิโอแล้ว!`);
                  }}
                  className="px-3 py-1.5 bg-white hover:bg-pink-50 border border-pink-200 text-pink-600 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors shrink-0"
                >
                  <Palette className="w-3.5 h-3.5" />
                  <span>ลองสีนี้</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
