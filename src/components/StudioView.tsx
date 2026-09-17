import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Palette,
  Heart,
  Share2,
  RefreshCw,
  Sparkles,
  Sliders,
  Check,
  Wand2,
  Layers,
} from 'lucide-react';
import { SmileSimulator } from './SmileSimulator';
import { ScoreCard } from './ScoreCard';
import { BRACE_COLORS, calculateColorScore } from '../data/colorsData';
import { ActiveCombination, BraceColor, PatternMode } from '../types';

interface StudioViewProps {
  currentCombination: ActiveCombination;
  onUpdateCombination: (comb: ActiveCombination) => void;
  onSaveFavorite: (comb: ActiveCombination) => void;
  isFavorited: boolean;
  onOpenShare: () => void;
}

export const StudioView: React.FC<StudioViewProps> = ({
  currentCombination,
  onUpdateCombination,
  onSaveFavorite,
  isFavorited,
  onOpenShare,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedPrimaryColor, setSelectedPrimaryColor] = useState<BraceColor>(
    currentCombination.colors[0] || BRACE_COLORS[0]
  );
  const [selectedSecondaryColor, setSelectedSecondaryColor] = useState<BraceColor>(
    currentCombination.colors[1] || BRACE_COLORS[3]
  );
  const [bracketType, setBracketType] = useState<'metal' | 'ceramic' | 'gold'>('metal');
  const [bandStyle, setBandStyle] = useState<'oring' | 'chain' | 'flower'>('oring');
  const [savedAlert, setSavedAlert] = useState(false);

  const categories = [
    { id: 'all', label: 'ทั้งหมด (30 สี)' },
    { id: 'pastel', label: '🌸 พาสเทลหวาน' },
    { id: 'vibrant', label: '⚡ สดใสคัลเลอร์ฟูล' },
    { id: 'dark', label: '🖤 เข้มขับฟันขาว' },
    { id: 'metallic', label: '✨ เมทัลลิก' },
    { id: 'neutral', label: '☁️ คลีนมินิมอล' },
  ];

  const filteredColors =
    activeCategory === 'all'
      ? BRACE_COLORS
      : BRACE_COLORS.filter((c) => c.category === activeCategory);

  // Apply single color to entire mouth
  const handleApplyAll = (color: BraceColor) => {
    const upper = Array(10).fill(color.hex);
    const lower = Array(10).fill(color.hex);
    const score = calculateColorScore([color]);

    onUpdateCombination({
      ...currentCombination,
      id: `studio-${Date.now()}`,
      name: `สีเดียวทั้งปาก: ${color.nameTh}`,
      colors: [color],
      patternMode: 'all',
      score,
      upperTeethColors: upper,
      lowerTeethColors: lower,
    });
  };

  // Apply Upper / Lower split
  const handleApplySplit = (upperCol: BraceColor, lowerCol: BraceColor) => {
    const upper = Array(10).fill(upperCol.hex);
    const lower = Array(10).fill(lowerCol.hex);
    const colors = [upperCol, lowerCol];
    const score = calculateColorScore(colors);

    onUpdateCombination({
      ...currentCombination,
      id: `studio-${Date.now()}`,
      name: `บน ${upperCol.nameTh} + ล่าง ${lowerCol.nameTh}`,
      colors,
      patternMode: 'split-arch',
      score,
      upperTeethColors: upper,
      lowerTeethColors: lower,
    });
  };

  // Apply Alternate pattern (สลับซี่)
  const handleApplyAlternate = (c1: BraceColor, c2: BraceColor) => {
    const upper = Array.from({ length: 10 }, (_, i) => (i % 2 === 0 ? c1.hex : c2.hex));
    const lower = Array.from({ length: 10 }, (_, i) => (i % 2 === 0 ? c2.hex : c1.hex));
    const colors = [c1, c2];
    const score = calculateColorScore(colors);

    onUpdateCombination({
      ...currentCombination,
      id: `studio-${Date.now()}`,
      name: `สลับซี่: ${c1.nameTh} x ${c2.nameTh}`,
      colors,
      patternMode: 'alternate',
      score,
      upperTeethColors: upper,
      lowerTeethColors: lower,
    });
  };

  // Custom individual tooth click
  const handleToothColorChange = (isUpper: boolean, index: number, colorHex: string) => {
    const foundColor = BRACE_COLORS.find((c) => c.hex.toLowerCase() === colorHex.toLowerCase());
    const newUpper = [...currentCombination.upperTeethColors];
    const newLower = [...currentCombination.lowerTeethColors];

    if (isUpper) {
      newUpper[index] = colorHex;
    } else {
      newLower[index] = colorHex;
    }

    // Collect distinct colors used
    const distinctHexes = Array.from(new Set([...newUpper, ...newLower]));
    const distinctColors = distinctHexes
      .map((hex) => BRACE_COLORS.find((c) => c.hex.toLowerCase() === hex.toLowerCase()))
      .filter((c): c is BraceColor => Boolean(c));

    const score = calculateColorScore(distinctColors);

    onUpdateCombination({
      ...currentCombination,
      id: `studio-custom-${Date.now()}`,
      name: `ปรับแต่งเอง (${distinctColors.map((c) => c.nameTh).join(', ')})`,
      colors: distinctColors,
      patternMode: 'custom',
      score,
      upperTeethColors: newUpper,
      lowerTeethColors: newLower,
    });
  };

  const handleSave = () => {
    onSaveFavorite(currentCombination);
    setSavedAlert(true);
    setTimeout(() => setSavedAlert(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Top Header */}
      <div className="bg-white/80 backdrop-blur-md p-4 sm:p-5 rounded-3xl border border-pink-100 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Palette className="w-5 h-5 text-pink-500" />
            <h2 className="text-lg sm:text-xl font-bold text-slate-800">
              สตูดิโอทดลองสี (Smile Simulator Studio)
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-600">
            ลองแต้มสีและเปลี่ยนทรงยางจัดฟันได้อิสระ คลิกที่ฟันแต่ละซี่เพื่อเปลี่ยนสีเฉพาะจุดได้เลย!
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleSave}
            className={`px-3.5 py-2 rounded-2xl border transition-all flex items-center gap-1.5 text-xs font-semibold ${
              isFavorited
                ? 'bg-rose-50 border-rose-200 text-rose-600'
                : 'bg-white hover:bg-pink-50 border-slate-200 text-slate-700'
            }`}
          >
            <Heart className={`w-4 h-4 ${isFavorited ? 'fill-rose-500 text-rose-500' : ''}`} />
            <span>{isFavorited ? 'บันทึกแล้ว' : 'บันทึกสีนี้'}</span>
          </button>

          <button
            onClick={onOpenShare}
            className="px-3.5 py-2 rounded-2xl border border-slate-200 bg-white hover:bg-purple-50 text-slate-700 hover:text-purple-600 transition-colors flex items-center gap-1.5 text-xs font-semibold"
          >
            <Share2 className="w-4 h-4" />
            <span>แชร์การ์ด</span>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {savedAlert && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-4 py-2 rounded-2xl text-xs font-medium flex items-center justify-center gap-2 shadow-xs"
          >
            <Check className="w-4 h-4 text-emerald-600" />
            <span>บันทึกรอยยิ้มนี้ไปยัง “สีที่ชอบ” แล้ว!</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Studio Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Smile Simulator Canvas */}
        <div className="lg:col-span-7 flex flex-col items-center gap-4">
          <SmileSimulator
            upperColors={currentCombination.upperTeethColors}
            lowerColors={currentCombination.lowerTeethColors}
            onToothColorChange={handleToothColorChange}
            bracketType={bracketType}
            bandStyle={bandStyle}
            isInteractive={true}
            className="w-full"
          />

          {/* Bracket & Band Style Controls */}
          <div className="w-full bg-white/90 backdrop-blur-md p-4 rounded-3xl border border-pink-100 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-pink-500" />
                <span>ประเภทแบร็กเก็ต & รูปแบบยาง</span>
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {/* Bracket Type */}
              <div>
                <label className="text-slate-600 block mb-1">วัสดุแบร็กเก็ต (Bracket)</label>
                <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-xl">
                  <button
                    onClick={() => setBracketType('metal')}
                    className={`py-1.5 px-2 rounded-lg font-medium transition-all ${
                      bracketType === 'metal' ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-600 hover:text-slate-800'
                    }`}
                  >
                    โลหะเงิน
                  </button>
                  <button
                    onClick={() => setBracketType('ceramic')}
                    className={`py-1.5 px-2 rounded-lg font-medium transition-all ${
                      bracketType === 'ceramic' ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-600 hover:text-slate-800'
                    }`}
                  >
                    เซรามิกใส
                  </button>
                  <button
                    onClick={() => setBracketType('gold')}
                    className={`py-1.5 px-2 rounded-lg font-medium transition-all ${
                      bracketType === 'gold' ? 'bg-white text-amber-800 shadow-xs' : 'text-slate-600 hover:text-slate-800'
                    }`}
                  >
                    สีทอง
                  </button>
                </div>
              </div>

              {/* Band Style */}
              <div>
                <label className="text-slate-600 block mb-1">รูปทรงยางจัดฟัน (Band Style)</label>
                <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-xl">
                  <button
                    onClick={() => setBandStyle('oring')}
                    className={`py-1.5 px-2 rounded-lg font-medium transition-all ${
                      bandStyle === 'oring' ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-600 hover:text-slate-800'
                    }`}
                  >
                    โอริงกลม
                  </button>
                  <button
                    onClick={() => setBandStyle('chain')}
                    className={`py-1.5 px-2 rounded-lg font-medium transition-all ${
                      bandStyle === 'chain' ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-600 hover:text-slate-800'
                    }`}
                  >
                    เชนต่อกัน
                  </button>
                  <button
                    onClick={() => setBandStyle('flower')}
                    className={`py-1.5 px-2 rounded-lg font-medium transition-all ${
                      bandStyle === 'flower' ? 'bg-white text-pink-700 shadow-xs' : 'text-slate-600 hover:text-slate-800'
                    }`}
                  >
                    ดอกไม้ 🌸
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Real-time Score Card */}
          <div className="w-full">
            <ScoreCard score={currentCombination.score} />
          </div>
        </div>

        {/* Color Palette & Pattern Applier */}
        <div className="lg:col-span-5 space-y-4">
          {/* Quick Pattern Preset Appliers */}
          <div className="bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 p-4 rounded-3xl border border-pink-100 shadow-xs">
            <h3 className="text-xs font-bold text-slate-800 mb-2 flex items-center gap-1.5">
              <Wand2 className="w-4 h-4 text-pink-500" />
              <span>ใช้คู่สีที่เลือก ({selectedPrimaryColor.nameTh} + {selectedSecondaryColor.nameTh})</span>
            </h3>

            {/* Selected Two Swatches */}
            <div className="flex items-center gap-2 mb-3 bg-white/80 p-2.5 rounded-2xl border border-pink-100">
              <div className="flex-1 flex items-center gap-2">
                <span
                  className="w-6 h-6 rounded-full border border-black/10 shrink-0"
                  style={{ backgroundColor: selectedPrimaryColor.hex }}
                />
                <div className="truncate text-xs">
                  <div className="font-semibold text-slate-800 truncate">{selectedPrimaryColor.nameTh}</div>
                  <div className="text-[10px] text-slate-600 font-mono">{selectedPrimaryColor.hex}</div>
                </div>
              </div>
              <span className="text-slate-300 font-bold">x</span>
              <div className="flex-1 flex items-center gap-2">
                <span
                  className="w-6 h-6 rounded-full border border-black/10 shrink-0"
                  style={{ backgroundColor: selectedSecondaryColor.hex }}
                />
                <div className="truncate text-xs">
                  <div className="font-semibold text-slate-800 truncate">{selectedSecondaryColor.nameTh}</div>
                  <div className="text-[10px] text-slate-600 font-mono">{selectedSecondaryColor.hex}</div>
                </div>
              </div>
            </div>

            {/* Application Modes */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                onClick={() => handleApplyAll(selectedPrimaryColor)}
                className="p-2.5 bg-white hover:bg-pink-100/50 rounded-2xl border border-pink-100 text-slate-700 font-medium transition-all text-left flex items-center gap-2"
              >
                <Layers className="w-4 h-4 text-pink-500" />
                <span>สี {selectedPrimaryColor.nameTh} ทั้งปาก</span>
              </button>

              <button
                onClick={() => handleApplyAll(selectedSecondaryColor)}
                className="p-2.5 bg-white hover:bg-purple-100/50 rounded-2xl border border-purple-100 text-slate-700 font-medium transition-all text-left flex items-center gap-2"
              >
                <Layers className="w-4 h-4 text-purple-500" />
                <span>สี {selectedSecondaryColor.nameTh} ทั้งปาก</span>
              </button>

              <button
                onClick={() => handleApplyAlternate(selectedPrimaryColor, selectedSecondaryColor)}
                className="p-2.5 bg-white hover:bg-blue-100/50 rounded-2xl border border-blue-100 text-slate-700 font-medium transition-all text-left flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4 text-blue-500" />
                <span>สลับซี่ฟัน (A-B-A-B)</span>
              </button>

              <button
                onClick={() => handleApplySplit(selectedPrimaryColor, selectedSecondaryColor)}
                className="p-2.5 bg-white hover:bg-emerald-100/50 rounded-2xl border border-emerald-100 text-slate-700 font-medium transition-all text-left flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-emerald-500" />
                <span>ฟันบน-ล่าง คนละสี</span>
              </button>
            </div>
          </div>

          {/* Full Dental Color Tray */}
          <div className="bg-white/95 backdrop-blur-md rounded-3xl p-4 border border-pink-100 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Palette className="w-4 h-4 text-pink-500" />
                <span>แผงสียางจัดฟันทั้งหมด (เลือกสีที่ 1 หรือ 2)</span>
              </h3>
            </div>

            {/* Category Filter Chips */}
            <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`shrink-0 px-2.5 py-1 rounded-xl text-xs font-medium transition-all ${
                    activeCategory === cat.id
                      ? 'bg-pink-500 text-white shadow-xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Color Swatches Grid */}
            <div className="grid grid-cols-5 sm:grid-cols-6 gap-2 max-h-72 overflow-y-auto pr-1 scrollbar-thin">
              {filteredColors.map((color) => {
                const isSelectedPrimary = selectedPrimaryColor.id === color.id;
                const isSelectedSecondary = selectedSecondaryColor.id === color.id;

                return (
                  <div key={color.id} className="flex flex-col items-center">
                    <button
                      onClick={() => {
                        // Click to cycle setting primary then secondary
                        if (!isSelectedPrimary) {
                          setSelectedPrimaryColor(color);
                        } else {
                          setSelectedSecondaryColor(color);
                        }
                      }}
                      className={`relative w-10 h-10 rounded-2xl border-2 transition-transform hover:scale-110 flex items-center justify-center shadow-xs ${
                        isSelectedPrimary
                          ? 'border-pink-500 ring-2 ring-pink-300 scale-105'
                          : isSelectedSecondary
                          ? 'border-purple-500 ring-2 ring-purple-300 scale-105'
                          : 'border-white hover:border-pink-200'
                      }`}
                      style={{ backgroundColor: color.hex }}
                      title={`${color.nameTh} (${color.nameEn})`}
                    >
                      {isSelectedPrimary && (
                        <span className="text-[10px] font-bold text-slate-900 bg-white/80 rounded-full px-1">
                          1
                        </span>
                      )}
                      {isSelectedSecondary && !isSelectedPrimary && (
                        <span className="text-[10px] font-bold text-slate-900 bg-white/80 rounded-full px-1">
                          2
                        </span>
                      )}
                    </button>
                    <span className="text-[10px] text-slate-600 text-center truncate w-full mt-1">
                      {color.nameTh}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="text-[11px] text-slate-600 bg-slate-50 p-2 rounded-xl text-center">
              💡 คลิกสีแรกเพื่อตั้งเป็น <span className="text-pink-600 font-semibold">สีที่ 1</span> หรือคลิกซ้ำเพื่อตั้งเป็น <span className="text-purple-600 font-semibold">สีที่ 2</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
