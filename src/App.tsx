/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  AppTab,
  ActiveCombination,
  FavoriteItem,
  HistoryItem,
  CuratedPalette,
  User,
} from './types';
import {
  BRACE_COLORS,
  CURATED_PALETTES,
  calculateColorScore,
  getColorById,
} from './data/colorsData';
import { ApiClient } from './services/api';

// Components
import { HeaderNav } from './components/HeaderNav';
import { MobileBottomNav } from './components/MobileBottomNav';
import { HomeView } from './components/HomeView';
import { RandomizerView } from './components/RandomizerView';
import { StudioView } from './components/StudioView';
import { CuratedView } from './components/CuratedView';
import { FavoritesView } from './components/FavoritesView';
import { HistoryView } from './components/HistoryView';
import { ShareModal } from './components/ShareModal';
import { Toast } from './components/Toast';

// Member & Feature Pages
import { MyStylePage } from './pages/MyStylePage';
import { ChallengesPage } from './pages/ChallengesPage';
import { AuthModal } from './pages/AuthModal';
import { MemberProfilePage } from './member/MemberProfilePage';
import { MemberSettingsPage } from './member/MemberSettingsPage';

// Admin Pages
import { AdminLoginPage } from './admin/AdminLoginPage';
import { AdminDashboardPage } from './admin/AdminDashboardPage';

const STORAGE_FAVORITES_KEY = 'bracemood_favorites_v2';
const STORAGE_HISTORY_KEY = 'bracemood_history_v2';

export default function App() {
  const [activeTab, setActiveTab] = useState<AppTab>('home');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [shareTargetComb, setShareTargetComb] = useState<ActiveCombination | null>(null);

  // Initial combination (Classic Bubblegum Pink + Sky Blue)
  const defaultColors = [getColorById('bubblegum-pink')!, getColorById('sky-blue')!];
  const [currentCombination, setCurrentCombination] = useState<ActiveCombination>(() => ({
    id: 'init-combo',
    name: 'ชมพูบับเบิ้ลกัม + ฟ้าพาสเทล',
    colors: defaultColors,
    patternMode: 'alternate',
    score: calculateColorScore(defaultColors),
    upperTeethColors: Array.from({ length: 10 }, (_, i) =>
      i % 2 === 0 ? defaultColors[0].hex : defaultColors[1].hex
    ),
    lowerTeethColors: Array.from({ length: 10 }, (_, i) =>
      i % 2 === 0 ? defaultColors[1].hex : defaultColors[0].hex
    ),
    timestamp: Date.now(),
  }));

  // Favorites state with localStorage & API sync
  const [favorites, setFavorites] = useState<FavoriteItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_FAVORITES_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // Ignore storage read errors
    }
    return [
      {
        id: 'seed-fav-1',
        name: 'Pink + Blue (คอตตอนแคนดี้)',
        colors: [getColorById('bubblegum-pink')!, getColorById('sky-blue')!],
        patternMode: 'alternate',
        score: calculateColorScore([getColorById('bubblegum-pink')!, getColorById('sky-blue')!]),
        upperTeethColors: Array.from({ length: 10 }, (_, i) => (i % 2 === 0 ? '#FF69B4' : '#87CEEB')),
        lowerTeethColors: Array.from({ length: 10 }, (_, i) => (i % 2 === 0 ? '#87CEEB' : '#FF69B4')),
        savedAt: Date.now() - 3600000,
      },
    ];
  });

  // History state with localStorage & API sync
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_HISTORY_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // Ignore
    }
    return [
      {
        id: 'seed-hist-1',
        name: 'ม่วงลาเวนเดอร์ + เขียวมิ้นต์',
        colors: [getColorById('lavender')!, getColorById('mint-green')!],
        patternMode: 'duo',
        score: calculateColorScore([getColorById('lavender')!, getColorById('mint-green')!]),
        upperTeethColors: Array(10).fill('#C8A2C8'),
        lowerTeethColors: Array(10).fill('#98FF98'),
        randomType: 'สุ่มคู่สี',
        timestamp: Date.now() - 7200000,
      },
    ];
  });

  // Check current user session on mount
  useEffect(() => {
    const fetchSession = async () => {
      try {
        const user = await ApiClient.getCurrentUser();
        if (user) {
          setCurrentUser(user);
          // If user is logged in, fetch remote favorites and history
          try {
            const [remFavs, remHist] = await Promise.all([
              ApiClient.getFavorites(),
              ApiClient.getHistory(),
            ]);
            if (remFavs && remFavs.length > 0) {
              const mappedFavs: FavoriteItem[] = remFavs.map((f: any) => {
                const cols = (f.combination?.colors || []).map((c: any) => ({
                  id: c.id || `c-${c.hex}`,
                  nameTh: c.nameTh || c.name || 'สียางจัดฟัน',
                  nameEn: c.nameEn || '',
                  hex: c.hex,
                  category: c.category || 'pastel',
                  description: '',
                  styleTags: [],
                  moodTags: [],
                }));
                return {
                  id: f.id,
                  name: f.name,
                  colors: cols,
                  patternMode: f.combination?.patternMode || 'duo',
                  score: f.score || {
                    harmony: 9,
                    vibrancy: 9,
                    cuteness: 9,
                    skinCompliment: 9,
                    overallFeeling: 'สวยงามเข้ากัน',
                  },
                  upperTeethColors: f.upper_teeth_colors || [],
                  lowerTeethColors: f.lower_teeth_colors || [],
                  savedAt: new Date(f.created_at).getTime(),
                };
              });
              setFavorites(mappedFavs);
            }

            if (remHist && remHist.length > 0) {
              const mappedHist: HistoryItem[] = remHist.map((h: any) => {
                const cols = (h.combination?.colors || []).map((c: any) => ({
                  id: c.id || `c-${c.hex}`,
                  nameTh: c.nameTh || c.name || 'สียางจัดฟัน',
                  nameEn: c.nameEn || '',
                  hex: c.hex,
                  category: c.category || 'pastel',
                  description: '',
                  styleTags: [],
                  moodTags: [],
                }));
                return {
                  id: h.id,
                  name: h.combination_name || 'สียางที่สุ่ม',
                  colors: cols,
                  patternMode: h.pattern_mode || 'duo',
                  score: h.score || {
                    harmony: 9,
                    vibrancy: 9,
                    cuteness: 9,
                    skinCompliment: 9,
                    overallFeeling: 'เข้ากัน',
                  },
                  upperTeethColors: h.upper_teeth_colors || [],
                  lowerTeethColors: h.lower_teeth_colors || [],
                  randomType: h.random_type || 'สุ่มสี',
                  timestamp: new Date(h.created_at).getTime(),
                };
              });
              setHistory(mappedHist);
            }
          } catch {
            // Ignore API sync errors for unauthenticated/guest
          }
        }
      } catch {
        // No active user
      }
    };
    fetchSession();
  }, []);

  // Save favorites to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_FAVORITES_KEY, JSON.stringify(favorites));
    } catch {
      // Ignore
    }
  }, [favorites]);

  // Save history to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_HISTORY_KEY, JSON.stringify(history));
    } catch {
      // Ignore
    }
  }, [history]);

  const notify = useCallback((msg: string) => {
    setToastMessage(msg);
  }, []);

  // Handler when a new combination is generated or updated
  const handleUpdateCombination = (newComb: ActiveCombination) => {
    setCurrentCombination(newComb);

    // Append to history if it's a new roll
    const newHistoryItem: HistoryItem = {
      id: `hist-${Date.now()}`,
      name: newComb.name,
      colors: newComb.colors,
      patternMode: newComb.patternMode,
      score: newComb.score,
      upperTeethColors: newComb.upperTeethColors,
      lowerTeethColors: newComb.lowerTeethColors,
      randomType: newComb.patternMode,
      timestamp: Date.now(),
    };

    setHistory((prev) => [newHistoryItem, ...prev.slice(0, 49)]);

    // Sync to backend if logged in
    if (currentUser) {
      ApiClient.saveHistory({
        random_type: newComb.patternMode,
        combination_name: newComb.name,
        combination: {
          colors: newComb.colors,
          patternMode: newComb.patternMode,
        },
        upper_teeth_colors: newComb.upperTeethColors,
        lower_teeth_colors: newComb.lowerTeethColors,
        score: newComb.score,
      }).catch(() => {});
    }
  };

  // Toggle favorite
  const handleSaveFavorite = async (comb: ActiveCombination) => {
    const isAlreadyFavorited = favorites.some((f) => f.name === comb.name);
    if (isAlreadyFavorited) {
      const existing = favorites.find((f) => f.name === comb.name);
      setFavorites((prev) => prev.filter((f) => f.name !== comb.name));
      notify(`นำ "${comb.name}" ออกจากรายการที่ชอบแล้ว`);
      if (currentUser && existing) {
        ApiClient.removeFavorite(existing.id).catch(() => {});
      }
    } else {
      const newFav: FavoriteItem = {
        id: `fav-${Date.now()}`,
        name: comb.name,
        colors: comb.colors,
        patternMode: comb.patternMode,
        score: comb.score,
        upperTeethColors: comb.upperTeethColors,
        lowerTeethColors: comb.lowerTeethColors,
        savedAt: Date.now(),
      };
      setFavorites((prev) => [newFav, ...prev]);
      notify(`บันทึก "${comb.name}" ลงในสีที่ชอบแล้ว 💖`);

      if (currentUser) {
        ApiClient.saveFavorite({
          name: comb.name,
          combination: {
            colors: comb.colors,
            patternMode: comb.patternMode,
          },
          upper_teeth_colors: comb.upperTeethColors,
          lower_teeth_colors: comb.lowerTeethColors,
          score: comb.score,
        }).catch(() => {});
      }
    }
  };

  const handleRemoveFavorite = (id: string) => {
    setFavorites((prev) => prev.filter((f) => f.id !== id));
    if (currentUser) {
      ApiClient.removeFavorite(id).catch(() => {});
    }
    notify('ลบรายการที่ชอบแล้ว');
  };

  const handleClearFavorites = () => {
    if (window.confirm('คุณต้องการลบรายการสีที่ชอบทั้งหมดใช่หรือไม่?')) {
      setFavorites([]);
      notify('ล้างรายการสีที่ชอบทั้งหมดแล้ว');
    }
  };

  const handleClearHistory = () => {
    if (window.confirm('คุณต้องการลบประวัติการสุ่มทั้งหมดใช่หรือไม่?')) {
      setHistory([]);
      notify('ล้างประวัติการสุ่มทั้งหมดแล้ว');
    }
  };

  // Apply a curated palette
  const handleApplyCurated = (palette: CuratedPalette) => {
    const upper = Array(10).fill(palette.colors[0].hex);
    const lower = Array(10).fill(palette.colors[1]?.hex || palette.colors[0].hex);

    const newComb: ActiveCombination = {
      id: `curated-${palette.id}-${Date.now()}`,
      name: palette.titleTh,
      colors: palette.colors,
      patternMode: 'duo',
      score: palette.score,
      upperTeethColors: upper,
      lowerTeethColors: lower,
      timestamp: Date.now(),
    };

    handleUpdateCombination(newComb);
    setActiveTab('studio');
    notify(`เลือกคู่สี "${palette.titleTh}" ในสตูดิโอแล้ว`);
  };

  // Apply favorite item to active simulator
  const handleApplyFavorite = (item: FavoriteItem) => {
    const newComb: ActiveCombination = {
      id: `applied-fav-${Date.now()}`,
      name: item.name,
      colors: item.colors,
      patternMode: item.patternMode,
      score: item.score,
      upperTeethColors: item.upperTeethColors,
      lowerTeethColors: item.lowerTeethColors,
      timestamp: Date.now(),
    };
    setCurrentCombination(newComb);
    setActiveTab('studio');
    notify(`โหลดสี "${item.name}" ในสตูดิโอ`);
  };

  // Apply history item
  const handleApplyHistory = (item: HistoryItem) => {
    const newComb: ActiveCombination = {
      id: `applied-hist-${Date.now()}`,
      name: item.name,
      colors: item.colors,
      patternMode: item.patternMode,
      score: item.score,
      upperTeethColors: item.upperTeethColors,
      lowerTeethColors: item.lowerTeethColors,
      timestamp: Date.now(),
    };
    setCurrentCombination(newComb);
    setActiveTab('random');
    notify(`โหลดสี "${item.name}" ในหน้าสุ่มสี`);
  };

  // Quick Preset from Home
  const handleApplyPreset = (colors: string[], name: string) => {
    const braceCols = colors
      .map((hex) => BRACE_COLORS.find((c) => c.hex.toLowerCase() === hex.toLowerCase()))
      .filter((c): c is (typeof BRACE_COLORS)[0] => Boolean(c));

    const upper = Array(10).fill(colors[0]);
    const lower = Array(10).fill(colors[1] || colors[0]);

    const newComb: ActiveCombination = {
      id: `preset-${Date.now()}`,
      name,
      colors: braceCols.length > 0 ? braceCols : [
        {
          id: 'custom-1',
          nameTh: name,
          nameEn: name,
          hex: colors[0],
          category: 'pastel',
          description: '',
          styleTags: [],
          moodTags: [],
        },
        {
          id: 'custom-2',
          nameTh: name,
          nameEn: name,
          hex: colors[1] || colors[0],
          category: 'pastel',
          description: '',
          styleTags: [],
          moodTags: [],
        },
      ],
      patternMode: 'duo',
      score: calculateColorScore(braceCols),
      upperTeethColors: upper,
      lowerTeethColors: lower,
      timestamp: Date.now(),
    };

    handleUpdateCombination(newComb);
    setActiveTab('studio');
    notify(`เลือกโทนสี "${name}" แล้ว`);
  };

  // Logout
  const handleLogout = () => {
    ApiClient.logout();
    setCurrentUser(null);
    notify('ออกจากระบบเรียบร้อยแล้ว');
    if (activeTab === 'admin-dashboard' || activeTab === 'profile' || activeTab === 'member-settings') {
      setActiveTab('home');
    }
  };

  const isCurrentFavorited = favorites.some((f) => f.name === currentCombination.name);

  return (
    <div className="min-h-screen flex flex-col justify-between text-slate-800 bg-[#FAF9FD]">
      {/* Toast Notification */}
      <Toast message={toastMessage} onClose={() => setToastMessage(null)} />

      {/* Header Navigation */}
      <HeaderNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        onOpenAuth={() => {
          setAuthModalMode('login');
          setIsAuthModalOpen(true);
        }}
        onLogout={handleLogout}
        favoritesCount={favorites.length}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 pt-6 pb-24 lg:pb-12">
        {activeTab === 'home' && (
          <HomeView
            currentCombination={currentCombination}
            onStartChoosing={() => setActiveTab('random')}
            onNavigateToStudio={() => setActiveTab('studio')}
            onNavigateToCurated={() => setActiveTab('curated')}
            onNavigateToMyStyle={() => setActiveTab('my-style')}
            onApplyPreset={handleApplyPreset}
            onOpenAuth={() => {
              setAuthModalMode('login');
              setIsAuthModalOpen(true);
            }}
            isLoggedIn={Boolean(currentUser)}
            recentPairs={history.slice(0, 3).map((h) => ({
              id: h.id,
              name: h.name,
              colors: h.colors,
              patternMode: h.patternMode,
              score: h.score,
              upperTeethColors: h.upperTeethColors,
              lowerTeethColors: h.lowerTeethColors,
              timestamp: h.timestamp,
            }))}
          />
        )}

        {activeTab === 'random' && (
          <RandomizerView
            currentCombination={currentCombination}
            onUpdateCombination={handleUpdateCombination}
            onSaveFavorite={handleSaveFavorite}
            isFavorited={isCurrentFavorited}
            onOpenShare={() => {
              setShareTargetComb(currentCombination);
              setIsShareModalOpen(true);
            }}
            onNavigateToStudio={() => setActiveTab('studio')}
          />
        )}

        {activeTab === 'studio' && (
          <StudioView
            currentCombination={currentCombination}
            onUpdateCombination={handleUpdateCombination}
            onSaveFavorite={handleSaveFavorite}
            isFavorited={isCurrentFavorited}
            onOpenShare={() => {
              setShareTargetComb(currentCombination);
              setIsShareModalOpen(true);
            }}
          />
        )}

        {activeTab === 'my-style' && (
          <MyStylePage
            currentUser={currentUser}
            onNavigateTab={setActiveTab}
            onApplyCombination={(comb) => {
              handleUpdateCombination(comb);
              setActiveTab('studio');
              notify(`เลือกสไตล์ "${comb.name}" ในสตูดิโอแล้ว`);
            }}
            onOpenAuth={() => {
              setAuthModalMode('login');
              setIsAuthModalOpen(true);
            }}
            onNotify={notify}
          />
        )}

        {activeTab === 'curated' && (
          <CuratedView
            onApplyPalette={handleApplyCurated}
            onSaveFavorite={handleSaveFavorite}
            favoritedIds={favorites.map((f) => f.name)}
          />
        )}

        {activeTab === 'challenges' && (
          <ChallengesPage
            currentUser={currentUser}
            onNavigateTab={setActiveTab}
            onOpenAuth={() => {
              setAuthModalMode('login');
              setIsAuthModalOpen(true);
            }}
            onNotify={notify}
          />
        )}

        {activeTab === 'favorites' && (
          <FavoritesView
            favorites={favorites}
            onRemoveFavorite={handleRemoveFavorite}
            onClearAll={handleClearFavorites}
            onApplyCombination={handleApplyFavorite}
            onOpenShareWith={(comb) => {
              setShareTargetComb(comb);
              setIsShareModalOpen(true);
            }}
            onNavigateToRandom={() => setActiveTab('random')}
          />
        )}

        {activeTab === 'history' && (
          <HistoryView
            history={history}
            onApplyHistory={handleApplyHistory}
            onClearHistory={handleClearHistory}
            onNavigateToRandom={() => setActiveTab('random')}
          />
        )}

        {activeTab === 'profile' && (
          <MemberProfilePage
            currentUser={currentUser}
            favorites={favorites}
            history={history}
            onNavigateTab={setActiveTab}
            onApplyFavorite={handleApplyFavorite}
            onOpenAuth={() => {
              setAuthModalMode('login');
              setIsAuthModalOpen(true);
            }}
            onLogout={handleLogout}
          />
        )}

        {activeTab === 'member-settings' && currentUser && (
          <MemberSettingsPage
            currentUser={currentUser}
            onUpdateUser={(updated) => {
              setCurrentUser(updated);
            }}
            onNavigateTab={setActiveTab}
            onNotify={notify}
          />
        )}

        {activeTab === 'admin-login' && (
          <AdminLoginPage
            onSuccess={(user) => {
              setCurrentUser(user);
              notify('ยินดีต้อนรับผู้ดูแลระบบสู่ BraceMood Admin');
            }}
            onNavigateTab={setActiveTab}
          />
        )}

        {activeTab === 'admin-dashboard' && (
          <AdminDashboardPage
            currentUser={currentUser || {
              id: 'admin-temp',
              name: 'Admin',
              email: 'admin@bracemood.com',
              profile: '👑',
              role: 'admin',
              status: 'active',
              created_at: new Date().toISOString(),
            }}
            onNavigateTab={setActiveTab}
            onNotify={notify}
          />
        )}
      </main>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        onOpenAuth={() => {
          setAuthModalMode('login');
          setIsAuthModalOpen(true);
        }}
        favoritesCount={favorites.length}
      />

      {/* Auth Modal (Member Login / Register) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authModalMode}
        onSuccess={(user) => {
          setCurrentUser(user);
          notify(`ยินดีต้อนรับคุณ ${user.name} 💖`);
        }}
        onNavigateAdmin={() => {
          setActiveTab('admin-login');
        }}
      />

      {/* Share Modal */}
      {shareTargetComb && (
        <ShareModal
          isOpen={isShareModalOpen}
          onClose={() => setIsShareModalOpen(false)}
          combination={shareTargetComb}
        />
      )}
    </div>
  );
}
