import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Heart, ArrowRight, Smile, Check } from 'lucide-react';
import { CURATED_PALETTES } from '../data/colorsData';
import { CuratedPalette, ActiveCombination } from '../types';

interface CuratedViewProps {
  onApplyPalette: (palette: CuratedPalette) => void;
  onSaveFavorite: (comb: ActiveCombination) => void;
  favoritedIds: string[];
}

export const CuratedView: React.FC<CuratedViewProps> = ({
  onApplyPalette,
  onSaveFavorite,
  favoritedIds,
}) => {
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [appliedId, setAppliedId] = useState<string | null>(null);

  const filterTabs = [
    { id: 'all', label: 'ทั้งหมด' },
    { id: 'sweet', label: '🌸 หวานละมุน' },
    { id: 'cool', label: '😎 เท่/ขับฟันขาว' },
    { id: 'bright', label: '⚡ สดใสป๊อป' },
    { id: 'minimal', label: '☁️ คลีนมินิมอล' },
    { id: 'dark', label: '🖤 ดาร์กสตรีท' },
  ];

  const filtered =
    filterCategory === 'all'
      ? CURATED_PALETTES
      : CURATED_PALETTES.filter((p) => p.category === filterCategory);

  const handleApply = (palette: CuratedPalette) => {
    onApplyPalette(palette);
    setAppliedId(palette.id);
    setTimeout(() => setAppliedId(null), 2000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-pink-100/80 via-purple-100/70 to-blue-100/80 p-6 rounded-3xl border border-pink-200/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-1.5 px-3 py-1 bg-white/90 rounded-full w-fit mb-2 text-xs font-semibold text-pink-600 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-pink-500" />
            <span>คอลเลกชันคู่สียอดนิยม</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800">
            หน้าแนะนำคู่สี (Recommended Pairs)
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-xl">
            รวมสูตรคู่สีที่วัยรุ่นจัดฟันโหวตว่าเข้ากันที่สุด พร้อมบอกฟีลลิ่งและคะแนนความเข้ากัน คลิกเพื่อลองสวมบนรอยยิ้มได้ทันที
          </p>
        </div>
      </div>

      {/* Filter Chips */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
        {filterTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilterCategory(tab.id)}
            className={`shrink-0 px-4 py-2 rounded-2xl text-xs sm:text-sm font-medium transition-all ${
              filterCategory === tab.id
                ? 'bg-pink-500 text-white shadow-xs scale-[1.02]'
                : 'bg-white hover:bg-pink-50 text-slate-700 border border-slate-200/80'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Grid of Curated Combinations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
        {filtered.map((palette) => {
          const isFavorited = favoritedIds.includes(palette.id);
          const isJustApplied = appliedId === palette.id;

          return (
            <motion.div
              key={palette.id}
              whileHover={{ y: -3 }}
              className="bg-white/90 backdrop-blur-md rounded-3xl p-5 border border-pink-100 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                {/* Top Bar: Color Swatches & Tags */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-2">
                      {palette.colors.map((c) => (
                        <span
                          key={c.id}
                          className="w-8 h-8 rounded-full border-2 border-white shadow-xs"
                          style={{ backgroundColor: c.hex }}
                        />
                      ))}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800 text-base">{palette.titleTh}</h3>
                      <span className="text-xs text-slate-600 font-mono">{palette.titleEn}</span>
                    </div>
                  </div>

                  <div className="flex gap-1">
                    {palette.tags.map((t) => (
                      <span
                        key={t}
                        className="text-[10px] bg-pink-50 text-pink-600 font-medium px-2 py-0.5 rounded-full border border-pink-100"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                  {palette.descriptionTh}
                </p>

                {/* Score Snippet */}
                <div className="grid grid-cols-3 gap-2 bg-slate-50/80 p-2.5 rounded-2xl text-xs mb-4">
                  <div className="text-center">
                    <span className="text-slate-600 block text-[11px]">ความเข้ากัน</span>
                    <span className="font-bold text-emerald-600">{palette.score.harmony}/10</span>
                  </div>
                  <div className="text-center border-x border-slate-200">
                    <span className="text-slate-600 block text-[11px]">ความสดใส</span>
                    <span className="font-bold text-amber-600">{palette.score.vibrancy}/10</span>
                  </div>
                  <div className="text-center">
                    <span className="text-slate-600 block text-[11px]">ความน่ารัก</span>
                    <span className="font-bold text-pink-600">{palette.score.cuteness}/10</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                <button
                  onClick={() => handleApply(palette)}
                  className={`flex-1 py-2.5 px-4 rounded-2xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-1.5 transition-all ${
                    isJustApplied
                      ? 'bg-emerald-500 text-white shadow-xs'
                      : 'bg-pink-500 hover:bg-pink-600 text-white shadow-xs'
                  }`}
                >
                  {isJustApplied ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>สวมบนรอยยิ้มแล้ว!</span>
                    </>
                  ) : (
                    <>
                      <Smile className="w-4 h-4" />
                      <span>ลองคู่นี้บนรอยยิ้ม</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>

                <button
                  onClick={() => {
                    const upper = Array(10).fill(palette.colors[0].hex);
                    const lower = Array(10).fill(palette.colors[1]?.hex || palette.colors[0].hex);
                    onSaveFavorite({
                      id: palette.id,
                      name: palette.titleTh,
                      colors: palette.colors,
                      patternMode: 'duo',
                      score: palette.score,
                      upperTeethColors: upper,
                      lowerTeethColors: lower,
                    });
                  }}
                  className={`p-2.5 rounded-2xl border transition-all ${
                    isFavorited
                      ? 'bg-rose-50 border-rose-200 text-rose-600'
                      : 'bg-slate-50 hover:bg-pink-50 border-slate-200 text-slate-500 hover:text-pink-600'
                  }`}
                  title={isFavorited ? 'บันทึกในสีที่ชอบแล้ว' : 'บันทึกเป็นสีที่ชอบ'}
                >
                  <Heart className={`w-4 h-4 ${isFavorited ? 'fill-rose-500 text-rose-500' : ''}`} />
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
