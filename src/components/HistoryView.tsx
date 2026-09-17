import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { History, RefreshCw, Smile, Trash2, Clock, Sparkles } from 'lucide-react';
import { HistoryItem } from '../types';

interface HistoryViewProps {
  history: HistoryItem[];
  onApplyHistory: (item: HistoryItem) => void;
  onClearHistory: () => void;
  onNavigateToRandom: () => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  history,
  onApplyHistory,
  onClearHistory,
  onNavigateToRandom,
}) => {
  const formatTime = (ts: number) => {
    const d = new Date(ts);
    return `${d.toLocaleDateString('th-TH', { day: 'numeric', month: 'short' })} ${d.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })}`;
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md p-5 rounded-3xl border border-pink-100 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 bg-purple-50 rounded-2xl text-purple-500">
            <History className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-800">
              ประวัติการสุ่ม ({history.length})
            </h2>
            <p className="text-xs text-slate-600">
              คู่สีที่คุณเคยกดสุ่มไว้ล่าสุด สามารถกดเพื่อนำกลับมาลองใหม่ได้เสมอ
            </p>
          </div>
        </div>

        {history.length > 0 && (
          <button
            onClick={onClearHistory}
            className="text-xs text-slate-600 hover:text-rose-600 px-3 py-1.5 rounded-xl hover:bg-rose-50 transition-colors flex items-center gap-1"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>ล้างประวัติ</span>
          </button>
        )}
      </div>

      {/* Empty State */}
      {history.length === 0 ? (
        <div className="bg-white/60 backdrop-blur-md rounded-3xl p-12 text-center border border-pink-100/60 max-w-md mx-auto space-y-4">
          <div className="w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center mx-auto text-purple-400">
            <History className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-slate-700">ยังไม่มีประวัติการสุ่มสี</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            เมื่อคุณกดปุ่มสุ่มสีในหน้าระบบสุ่มสี รายการสีจะถูกบันทึกไว้ที่นี่อัตโนมัติ
          </p>
          <button
            onClick={onNavigateToRandom}
            className="px-5 py-2.5 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white rounded-2xl text-xs font-semibold shadow-md shadow-pink-200 transition-all inline-flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>ไปสุ่มสีกันเลย!</span>
          </button>
        </div>
      ) : (
        /* History Timeline List */
        <div className="space-y-3">
          <AnimatePresence>
            {history.map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white/90 backdrop-blur-md rounded-2xl p-4 border border-pink-100 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-pink-200 transition-all"
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-500 font-bold text-xs flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>

                  {/* Swatches */}
                  <div className="flex -space-x-1.5 shrink-0">
                    {item.colors.map((c) => (
                      <span
                        key={c.id}
                        className="w-7 h-7 rounded-full border-2 border-white shadow-xs"
                        style={{ backgroundColor: c.hex }}
                        title={c.nameTh}
                      />
                    ))}
                  </div>

                  <div>
                    <h4 className="font-semibold text-slate-800 text-sm">{item.name}</h4>
                    <div className="flex items-center gap-2 text-[11px] text-slate-600">
                      <Clock className="w-3 h-3" />
                      <span>{formatTime(item.timestamp)}</span>
                      <span>·</span>
                      <span className="text-pink-600 font-medium">
                        ความน่ารัก {item.score.cuteness}/10
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 sm:self-center">
                  <button
                    onClick={() => onApplyHistory(item)}
                    className="flex-1 sm:flex-none px-4 py-2 bg-pink-50 hover:bg-pink-100 text-pink-700 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Smile className="w-3.5 h-3.5" />
                    <span>ลองสีนี้</span>
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
