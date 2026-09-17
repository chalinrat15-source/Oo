import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Trash2, Smile, Share2, Sparkles, ArrowRight } from 'lucide-react';
import { FavoriteItem, ActiveCombination } from '../types';
import { SmileSimulator } from './SmileSimulator';

interface FavoritesViewProps {
  favorites: FavoriteItem[];
  onRemoveFavorite: (id: string) => void;
  onClearAll: () => void;
  onApplyCombination: (item: FavoriteItem) => void;
  onOpenShareWith: (comb: ActiveCombination) => void;
  onNavigateToRandom: () => void;
}

export const FavoritesView: React.FC<FavoritesViewProps> = ({
  favorites,
  onRemoveFavorite,
  onClearAll,
  onApplyCombination,
  onOpenShareWith,
  onNavigateToRandom,
}) => {
  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md p-5 rounded-3xl border border-pink-100 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 bg-rose-50 rounded-2xl text-rose-500">
            <Heart className="w-5 h-5 fill-rose-500" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-800">
              สีที่ฉันชอบ ({favorites.length})
            </h2>
            <p className="text-xs text-slate-600">
              รวมชุดสียางจัดฟันที่คุณบันทึกไว้ นำไปเปิดให้หมอดูตอนปรับเครื่องมือได้เลย!
            </p>
          </div>
        </div>

        {favorites.length > 0 && (
          <button
            onClick={onClearAll}
            className="text-xs text-slate-600 hover:text-rose-600 px-3 py-1.5 rounded-xl hover:bg-rose-50 transition-colors"
          >
            ล้างทั้งหมด
          </button>
        )}
      </div>

      {/* Empty State */}
      {favorites.length === 0 ? (
        <div className="bg-white/60 backdrop-blur-md rounded-3xl p-12 text-center border border-pink-100/60 max-w-md mx-auto space-y-4">
          <div className="w-16 h-16 bg-pink-50 rounded-full flex items-center justify-center mx-auto text-pink-400">
            <Heart className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-slate-700">ยังไม่มีคู่สีที่บันทึกไว้</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            ลองไปที่หน้าระบบสุ่มสี หรือสตูดิโอ แล้วกดรูปหัวใจ ❤️ เพื่อเซฟคู่สีสุดคิ้วท์ที่คุณชอบไว้ที่นี่ได้เลย
          </p>
          <button
            onClick={onNavigateToRandom}
            className="px-5 py-2.5 bg-pink-500 hover:bg-pink-600 text-white rounded-2xl text-xs font-semibold shadow-md shadow-pink-200 transition-all inline-flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>ไปสุ่มสีแรกกันเถอะ!</span>
          </button>
        </div>
      ) : (
        /* Favorites Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AnimatePresence>
            {favorites.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white/90 backdrop-blur-md rounded-3xl p-4 sm:p-5 border border-pink-100 shadow-xs flex flex-col justify-between hover:shadow-md transition-all"
              >
                <div>
                  {/* Top Header */}
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-slate-800 text-sm sm:text-base truncate">
                      {item.name}
                    </h3>
                    <button
                      onClick={() => onRemoveFavorite(item.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-colors"
                      title="ลบสีนี้"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Micro Smile Simulator preview */}
                  <div className="w-full aspect-[16/8] rounded-2xl overflow-hidden bg-pink-50/40 p-2 border border-pink-100/60 mb-3">
                    <SmileSimulator
                      upperColors={item.upperTeethColors}
                      lowerColors={item.lowerTeethColors}
                      isInteractive={false}
                    />
                  </div>

                  {/* Color tags */}
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {item.colors.map((c) => (
                      <span
                        key={c.id}
                        className="inline-flex items-center gap-1 bg-slate-50 px-2.5 py-1 rounded-xl text-xs border border-slate-200/60 text-slate-700"
                      >
                        <span
                          className="w-3 h-3 rounded-full border border-black/10"
                          style={{ backgroundColor: c.hex }}
                        />
                        <span>{c.nameTh}</span>
                      </span>
                    ))}
                  </div>

                  {/* Score & feeling */}
                  <p className="text-xs text-slate-600 mb-4 line-clamp-2">
                    {item.score.overallFeeling}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                  <button
                    onClick={() => onApplyCombination(item)}
                    className="flex-1 py-2 px-3 bg-pink-500 hover:bg-pink-600 text-white rounded-2xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-xs"
                  >
                    <Smile className="w-3.5 h-3.5" />
                    <span>ลองสวมสีนี้</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>

                  <button
                    onClick={() =>
                      onOpenShareWith({
                        id: item.id,
                        name: item.name,
                        colors: item.colors,
                        patternMode: item.patternMode,
                        score: item.score,
                        upperTeethColors: item.upperTeethColors,
                        lowerTeethColors: item.lowerTeethColors,
                      })
                    }
                    className="p-2 bg-slate-100 hover:bg-purple-50 hover:text-purple-600 text-slate-600 rounded-2xl transition-colors"
                    title="แชร์การ์ด"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};
