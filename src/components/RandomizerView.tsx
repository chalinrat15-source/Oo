import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Dice5,
  RefreshCw,
  Heart,
  Share2,
  Sparkles,
  Shirt,
  Calendar,
  Smile,
  Palette,
  Check,
  Zap,
} from 'lucide-react';
import { SmileSimulator } from './SmileSimulator';
import { ScoreCard } from './ScoreCard';
import {
  BRACE_COLORS,
  STYLE_OPTIONS,
  MOOD_OPTIONS,
  OCCASION_OPTIONS,
  SHIRT_COLOR_OPTIONS,
  calculateColorScore,
  getColorById,
} from '../data/colorsData';
import {
  ActiveCombination,
  BraceColor,
  PatternMode,
} from '../types';

interface RandomizerViewProps {
  currentCombination: ActiveCombination;
  onUpdateCombination: (comb: ActiveCombination) => void;
  onSaveFavorite: (comb: ActiveCombination) => void;
  isFavorited: boolean;
  onOpenShare: () => void;
  onNavigateToStudio: () => void;
}

export const RandomizerView: React.FC<RandomizerViewProps> = ({
  currentCombination,
  onUpdateCombination,
  onSaveFavorite,
  isFavorited,
  onOpenShare,
  onNavigateToStudio,
}) => {
  // Filter states
  const [selectedStyle, setSelectedStyle] = useState<string>('all');
  const [selectedMood, setSelectedMood] = useState<string>('all');
  const [selectedOccasion, setSelectedOccasion] = useState<string>('all');
  const [selectedShirt, setSelectedShirt] = useState<string>('all');

  // Random Mode: single, duo, trio, alternate
  const [randomMode, setRandomMode] = useState<'single' | 'duo' | 'trio' | 'alternate'>('duo');
  const [isSpinning, setIsSpinning] = useState(false);
  const [lastRandomIds, setLastRandomIds] = useState<string[]>([]);
  const [savedAlert, setSavedAlert] = useState(false);

  // Filter available colors based on active controls
  const getFilteredColorPool = (): BraceColor[] => {
    let pool = [...BRACE_COLORS];

    if (selectedStyle !== 'all') {
      pool = pool.filter((c) => c.styleTags.includes(selectedStyle as any));
    }

    if (selectedMood !== 'all') {
      pool = pool.filter((c) => c.moodTags.includes(selectedMood as any));
    }

    if (selectedOccasion !== 'all') {
      const occasionObj = OCCASION_OPTIONS.find((o) => o.id === selectedOccasion);
      if (occasionObj && occasionObj.suggestedColorIds) {
        const occasionColors = occasionObj.suggestedColorIds
          .map((id) => getColorById(id))
          .filter((c): c is BraceColor => Boolean(c));
        if (occasionColors.length > 0) {
          pool = occasionColors;
        }
      }
    }

    if (selectedShirt !== 'all') {
      const shirtObj = SHIRT_COLOR_OPTIONS.find((s) => s.id === selectedShirt);
      if (shirtObj && shirtObj.recommendedBraceColorIds) {
        const shirtColors = shirtObj.recommendedBraceColorIds
          .map((id) => getColorById(id))
          .filter((c): c is BraceColor => Boolean(c));
        if (shirtColors.length > 0) {
          pool = shirtColors;
        }
      }
    }

    // Fallback to all colors if filters yielded none
    return pool.length > 0 ? pool : BRACE_COLORS;
  };

  const handleRandomize = (overrideMode?: 'single' | 'duo' | 'trio' | 'alternate') => {
    const activeMode = overrideMode || randomMode;
    setIsSpinning(true);

    setTimeout(() => {
      const pool = getFilteredColorPool();

      let count = 2;
      if (activeMode === 'single') count = 1;
      else if (activeMode === 'trio') count = 3;
      else if (activeMode === 'alternate') count = 2;

      // Select without duplicate consecutive combination
      let picked: BraceColor[] = [];
      let attempts = 0;

      while (attempts < 15) {
        const shuffled = [...pool].sort(() => Math.random() - 0.5);
        const candidate = shuffled.slice(0, Math.min(count, shuffled.length));

        // Check against last picked
        const candidateKey = candidate.map((c) => c.id).sort().join('-');
        const lastKey = lastRandomIds.slice().sort().join('-');

        if (candidateKey !== lastKey || pool.length <= count) {
          picked = candidate;
          break;
        }
        attempts++;
      }

      if (picked.length === 0) {
        picked = [...pool].slice(0, count);
      }

      setLastRandomIds(picked.map((c) => c.id));

      // Calculate Teeth Array
      let upper: string[] = [];
      let lower: string[] = [];

      if (activeMode === 'single') {
        const hex = picked[0].hex;
        upper = Array(10).fill(hex);
        lower = Array(10).fill(hex);
      } else if (activeMode === 'alternate') {
        const [c1, c2] = picked;
        upper = Array.from({ length: 10 }, (_, i) => (i % 2 === 0 ? c1.hex : c2.hex));
        lower = Array.from({ length: 10 }, (_, i) => (i % 2 === 0 ? c2.hex : c1.hex));
      } else if (activeMode === 'duo') {
        const [c1, c2] = picked;
        // Half-half or upper/lower
        upper = Array(10).fill(c1.hex);
        lower = Array(10).fill(c2.hex);
      } else {
        // Trio
        const [c1, c2, c3] = picked;
        upper = Array.from({ length: 10 }, (_, i) => [c1.hex, c2.hex, c3.hex][i % 3]);
        lower = Array.from({ length: 10 }, (_, i) => [c2.hex, c3.hex, c1.hex][i % 3]);
      }

      const score = calculateColorScore(picked);

      const styleTitle =
        selectedStyle !== 'all'
          ? STYLE_OPTIONS.find((s) => s.id === selectedStyle)?.label
          : '';
      const moodTitle =
        selectedMood !== 'all'
          ? MOOD_OPTIONS.find((m) => m.id === selectedMood)?.label
          : '';
      const occasionTitle =
        selectedOccasion !== 'all'
          ? OCCASION_OPTIONS.find((o) => o.id === selectedOccasion)?.label
          : '';

      let comboName = picked.map((c) => c.nameTh).join(' + ');
      if (occasionTitle) comboName = `${comboName} (${occasionTitle})`;
      else if (moodTitle) comboName = `${comboName} (Mood: ${moodTitle})`;
      else if (styleTitle) comboName = `${comboName} (สไตล์: ${styleTitle})`;

      const newComb: ActiveCombination = {
        id: `rand-${Date.now()}`,
        name: comboName,
        colors: picked,
        patternMode: activeMode as PatternMode,
        style: selectedStyle !== 'all' ? selectedStyle : undefined,
        mood: selectedMood !== 'all' ? selectedMood : undefined,
        occasion: selectedOccasion !== 'all' ? selectedOccasion : undefined,
        matchedShirt: selectedShirt !== 'all' ? selectedShirt : undefined,
        score,
        upperTeethColors: upper,
        lowerTeethColors: lower,
        timestamp: Date.now(),
      };

      onUpdateCombination(newComb);
      setIsSpinning(false);
    }, 450);
  };

  const handleSave = () => {
    onSaveFavorite(currentCombination);
    setSavedAlert(true);
    setTimeout(() => setSavedAlert(false), 2000);
  };

  const activeShirt = SHIRT_COLOR_OPTIONS.find((s) => s.id === selectedShirt);

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Top Banner & Smile Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Smile Simulator Display Area */}
        <div className="lg:col-span-7 flex flex-col items-center">
          <div className="w-full relative">
            <SmileSimulator
              upperColors={currentCombination.upperTeethColors}
              lowerColors={currentCombination.lowerTeethColors}
              className="w-full"
            />
          </div>

          {/* Quick Result Badge & Color Swatches */}
          <div className="w-full mt-4 bg-white/95 backdrop-blur-md p-4 rounded-3xl border border-pink-100 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                {currentCombination.colors.map((c) => (
                  <span
                    key={c.id}
                    className="w-8 h-8 rounded-full border-2 border-white shadow-sm"
                    style={{ backgroundColor: c.hex }}
                    title={c.nameTh}
                  />
                ))}
              </div>
              <div>
                <h4 className="font-bold text-slate-800 text-sm sm:text-base leading-tight">
                  {currentCombination.name}
                </h4>
                <p className="text-xs text-slate-600 font-mono">
                  {currentCombination.colors.map((c) => `${c.nameTh} (${c.hex})`).join(' · ')}
                </p>
              </div>
            </div>

            {/* Quick Actions (Favorite, Share, Studio) */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleSave}
                className={`p-2.5 rounded-2xl border transition-all flex items-center gap-1 text-xs font-semibold ${
                  isFavorited
                    ? 'bg-rose-50 border-rose-200 text-rose-600 shadow-xs'
                    : 'bg-slate-50 hover:bg-pink-50 border-slate-200 text-slate-600 hover:text-pink-600'
                }`}
                title={isFavorited ? 'บันทึกในรายการโปรดแล้ว' : 'บันทึกสีนี้'}
              >
                <Heart className={`w-4 h-4 ${isFavorited ? 'fill-rose-500 text-rose-500' : ''}`} />
                <span>{isFavorited ? 'บันทึกแล้ว' : 'บันทึก'}</span>
              </button>

              <button
                onClick={onOpenShare}
                className="p-2.5 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-purple-50 text-slate-600 hover:text-purple-600 transition-colors flex items-center gap-1 text-xs font-semibold"
                title="แชร์สีนี้"
              >
                <Share2 className="w-4 h-4" />
                <span>แชร์</span>
              </button>

              <button
                onClick={onNavigateToStudio}
                className="p-2.5 rounded-2xl border border-pink-200 bg-pink-50 hover:bg-pink-100 text-pink-700 transition-colors flex items-center gap-1 text-xs font-semibold"
                title="เปิดในสตูดิโอเพื่อแต้มสีแยกซี่"
              >
                <Palette className="w-4 h-4" />
                <span className="hidden sm:inline">ปรับแต่ง</span>
              </button>
            </div>
          </div>

          {/* Toast Notification when saved */}
          <AnimatePresence>
            {savedAlert && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-2 bg-emerald-50 text-emerald-700 border border-emerald-200 px-4 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 shadow-sm"
              >
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>บันทึกไปยัง “สีที่ชอบ” เรียบร้อยแล้ว!</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Color Score Breakdown */}
          <div className="w-full mt-4">
            <ScoreCard score={currentCombination.score} />
          </div>
        </div>

        {/* Control Panel (Randomizer controls, Style, Mood, Occasion, Shirt) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Main Giant Randomize Button */}
          <div className="bg-gradient-to-br from-pink-400 via-rose-400 to-purple-500 p-5 rounded-3xl text-white shadow-lg shadow-pink-200">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider bg-white/20 px-2.5 py-0.5 rounded-full">
                ระบบสุ่มอัจฉริยะ ไม่ซ้ำชุดเดิม
              </span>
              <Sparkles className="w-4 h-4 text-pink-200 animate-spin" />
            </div>

            <h3 className="text-xl font-bold mb-1">สุ่มสีที่ใช่สำหรับคุณ</h3>
            <p className="text-xs text-white/85 mb-4">
              คลิกปุ่มเพื่อสุ่มคู่สียางจัดฟันตามฟิลเตอร์ที่คุณกำหนดได้ทันที!
            </p>

            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={() => handleRandomize()}
              disabled={isSpinning}
              className="w-full py-4 bg-white text-pink-600 font-bold text-base rounded-2xl shadow-md hover:bg-pink-50 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Dice5 className={`w-5 h-5 ${isSpinning ? 'animate-spin' : ''}`} />
              <span>{isSpinning ? 'กำลังสุ่มสีน่ารักๆ...' : 'สุ่มสีให้ฉันเลย! 🎲'}</span>
            </motion.button>

            {/* Quick Random Sub-buttons */}
            <div className="grid grid-cols-4 gap-1.5 mt-3 text-xs">
              <button
                onClick={() => {
                  setRandomMode('single');
                  handleRandomize('single');
                }}
                className={`py-1.5 px-2 rounded-xl text-center transition-all ${
                  randomMode === 'single'
                    ? 'bg-white text-pink-600 font-bold shadow-xs'
                    : 'bg-white/15 text-white hover:bg-white/25'
                }`}
              >
                สีเดี่ยว
              </button>
              <button
                onClick={() => {
                  setRandomMode('duo');
                  handleRandomize('duo');
                }}
                className={`py-1.5 px-2 rounded-xl text-center transition-all ${
                  randomMode === 'duo'
                    ? 'bg-white text-pink-600 font-bold shadow-xs'
                    : 'bg-white/15 text-white hover:bg-white/25'
                }`}
              >
                คู่สี
              </button>
              <button
                onClick={() => {
                  setRandomMode('alternate');
                  handleRandomize('alternate');
                }}
                className={`py-1.5 px-2 rounded-xl text-center transition-all ${
                  randomMode === 'alternate'
                    ? 'bg-white text-pink-600 font-bold shadow-xs'
                    : 'bg-white/15 text-white hover:bg-white/25'
                }`}
              >
                สลับซี่
              </button>
              <button
                onClick={() => {
                  setRandomMode('trio');
                  handleRandomize('trio');
                }}
                className={`py-1.5 px-2 rounded-xl text-center transition-all ${
                  randomMode === 'trio'
                    ? 'bg-white text-pink-600 font-bold shadow-xs'
                    : 'bg-white/15 text-white hover:bg-white/25'
                }`}
              >
                3 สี
              </button>
            </div>
          </div>

          {/* Style Selector (น่ารัก, หวาน, เท่, สดใส, มินิมอล, สีเข้ม) */}
          <div className="bg-white/90 backdrop-blur-md rounded-3xl p-4 border border-pink-100 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <span>เลือกสไตล์ก่อนสุ่ม</span>
                <span className="text-pink-500 font-normal">
                  ({STYLE_OPTIONS.find((s) => s.id === selectedStyle)?.label})
                </span>
              </label>
              {selectedStyle !== 'all' && (
                <button
                  onClick={() => setSelectedStyle('all')}
                  className="text-[11px] text-pink-600 hover:underline"
                >
                  รีเซ็ต
                </button>
              )}
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-4 gap-1.5">
              {STYLE_OPTIONS.map((style) => (
                <button
                  key={style.id}
                  onClick={() => setSelectedStyle(style.id)}
                  className={`px-2 py-2 rounded-2xl border text-xs font-medium flex flex-col items-center gap-0.5 transition-all ${
                    selectedStyle === style.id
                      ? 'bg-pink-500 text-white border-pink-500 shadow-xs scale-[1.02]'
                      : 'bg-slate-50 hover:bg-pink-50/50 text-slate-700 border-slate-200/80'
                  }`}
                >
                  <span className="text-base">{style.emoji}</span>
                  <span className="truncate">{style.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Mood Selector (😊 สดใส, 🌸 หวาน, 😎 เท่, 💜 ลึกลับ, 🧸 น่ารัก, ☁️ สบายตา) */}
          <div className="bg-white/90 backdrop-blur-md rounded-3xl p-4 border border-pink-100 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Smile className="w-4 h-4 text-purple-500" />
                <span>เลือกตามอารมณ์ (Mood)</span>
                <span className="text-purple-600 font-normal">
                  ({MOOD_OPTIONS.find((m) => m.id === selectedMood)?.label})
                </span>
              </label>
              {selectedMood !== 'all' && (
                <button
                  onClick={() => setSelectedMood('all')}
                  className="text-[11px] text-purple-600 hover:underline"
                >
                  รีเซ็ต
                </button>
              )}
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
              {MOOD_OPTIONS.map((mood) => (
                <button
                  key={mood.id}
                  onClick={() => setSelectedMood(mood.id)}
                  className={`p-2 rounded-2xl border text-xs font-medium flex flex-col items-center gap-1 transition-all ${
                    selectedMood === mood.id
                      ? 'bg-purple-500 text-white border-purple-500 shadow-xs scale-[1.03]'
                      : 'bg-slate-50 hover:bg-purple-50/50 text-slate-700 border-slate-200/80'
                  }`}
                >
                  <span className="text-lg">{mood.emoji}</span>
                  <span className="text-[11px]">{mood.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Occasion Selector (วันเกิด, วันเปิดเทอม, คริสต์มาส, วาเลนไทน์, ฮาโลวีน, ปีใหม่) */}
          <div className="bg-white/90 backdrop-blur-md rounded-3xl p-4 border border-pink-100 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-indigo-500" />
                <span>เลือกตามโอกาส / เทศกาล</span>
              </label>
              {selectedOccasion !== 'all' && (
                <button
                  onClick={() => setSelectedOccasion('all')}
                  className="text-[11px] text-indigo-600 hover:underline"
                >
                  รีเซ็ต
                </button>
              )}
            </div>

            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
              {OCCASION_OPTIONS.map((occ) => (
                <button
                  key={occ.id}
                  onClick={() => setSelectedOccasion(selectedOccasion === occ.id ? 'all' : occ.id)}
                  className={`shrink-0 px-3 py-1.5 rounded-2xl border text-xs font-medium flex items-center gap-1.5 transition-all ${
                    selectedOccasion === occ.id
                      ? 'bg-indigo-500 text-white border-indigo-500 shadow-xs'
                      : 'bg-slate-50 hover:bg-indigo-50/50 text-slate-700 border-slate-200/80'
                  }`}
                >
                  <span>{occ.emoji}</span>
                  <span>{occ.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Shirt Color Matcher (ชมพู, ฟ้า, เหลือง, เขียว, ม่วง, แดง, ดำ, ขาว, กรมท่า, เบจ) */}
          <div className="bg-white/90 backdrop-blur-md rounded-3xl p-4 border border-pink-100 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Shirt className="w-4 h-4 text-rose-500" />
                <span>จับคู่กับสีเสื้อที่ใส่</span>
              </label>
              {selectedShirt !== 'all' && (
                <button
                  onClick={() => setSelectedShirt('all')}
                  className="text-[11px] text-rose-600 hover:underline"
                >
                  รีเซ็ต
                </button>
              )}
            </div>

            <div className="flex gap-1.5 overflow-x-auto pb-1.5 scrollbar-thin">
              {SHIRT_COLOR_OPTIONS.map((shirt) => (
                <button
                  key={shirt.id}
                  onClick={() => setSelectedShirt(selectedShirt === shirt.id ? 'all' : shirt.id)}
                  className={`shrink-0 px-2.5 py-1.5 rounded-xl border text-xs font-medium flex items-center gap-1.5 transition-all ${
                    selectedShirt === shirt.id
                      ? 'ring-2 ring-rose-400 bg-rose-50/80 border-rose-300 font-semibold'
                      : 'bg-slate-50 hover:bg-slate-100 border-slate-200/80 text-slate-700'
                  }`}
                >
                  <span
                    className="w-3.5 h-3.5 rounded-full border border-black/15 shadow-xs"
                    style={{ backgroundColor: shirt.hex }}
                  />
                  <span>{shirt.label}</span>
                </button>
              ))}
            </div>

            {/* Smart Matching Advice Box */}
            {activeShirt && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-2.5 p-2.5 bg-rose-50/70 rounded-2xl border border-rose-100 text-xs text-rose-900 flex items-start gap-2"
              >
                <Zap className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold">คำแนะนำสำหรับเสื้อสี{activeShirt.label}: </span>
                  <span>{activeShirt.adviceTh}</span>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
