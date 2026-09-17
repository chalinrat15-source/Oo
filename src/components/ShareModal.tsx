import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Copy, Check, Share2, Sparkles, Heart } from 'lucide-react';
import { SmileSimulator } from './SmileSimulator';
import { ActiveCombination } from '../types';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  combination: ActiveCombination;
}

export const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, combination }) => {
  const [copiedHex, setCopiedHex] = useState(false);
  const [copiedText, setCopiedText] = useState(false);

  if (!isOpen) return null;

  const hexList = combination.colors.map((c) => `${c.nameTh} (${c.hex})`).join(', ');

  const handleCopyHex = () => {
    const text = combination.colors.map((c) => c.hex).join(' ');
    navigator.clipboard.writeText(text);
    setCopiedHex(true);
    setTimeout(() => setCopiedHex(false), 2000);
  };

  const handleCopyShareText = () => {
    const text = `✨ สียางจัดฟันแนะนำจาก Braces Color Studio ✨\nธีม: ${combination.name}\nสี: ${hexList}\nความเข้ากัน: ${combination.score.harmony}/10 | ความน่ารัก: ${combination.score.cuteness}/10\nความรู้สึก: ${combination.score.overallFeeling}\nลองจัดคู่สีรอยยิ้มของคุณเองได้ที่ Braces Color Studio!`;
    navigator.clipboard.writeText(text);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  const handleWebShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Braces Color Studio - ${combination.name}`,
          text: `ฉันลองสุ่มสียางจัดฟัน: ${combination.name} (${hexList}) ได้คะแนนความน่ารัก ${combination.score.cuteness}/10!`,
          url: window.location.href,
        });
      } catch {
        // Fallback to copy
        handleCopyShareText();
      }
    } else {
      handleCopyShareText();
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 15 }}
          className="relative w-full max-w-lg bg-white rounded-3xl p-5 sm:p-6 shadow-2xl border border-pink-100 max-h-[90vh] overflow-y-auto"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Share Card Container (Designed to look like a collectible cute aesthetic card) */}
          <div className="bg-gradient-to-b from-pink-50/80 via-purple-50/40 to-blue-50/70 p-5 rounded-3xl border border-pink-200/80 shadow-xs mb-5">
            {/* Header Badge */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-1.5 px-3 py-1 bg-white/90 rounded-full shadow-xs border border-pink-100">
                <Sparkles className="w-3.5 h-3.5 text-pink-500" />
                <span className="text-xs font-bold text-pink-600">Braces Color Studio</span>
              </div>
              <span className="text-[11px] text-slate-500 bg-white/80 px-2.5 py-0.5 rounded-full">
                {new Date().toLocaleDateString('th-TH', { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
            </div>

            <h3 className="text-lg sm:text-xl font-bold text-slate-800 mb-1">{combination.name}</h3>
            <p className="text-xs text-slate-600 mb-3">{combination.score.overallFeeling}</p>

            {/* Smile Graphic Preview */}
            <div className="w-full mb-3 rounded-2xl overflow-hidden shadow-xs bg-white/90 p-2 border border-pink-100">
              <SmileSimulator
                upperColors={combination.upperTeethColors}
                lowerColors={combination.lowerTeethColors}
                isInteractive={false}
              />
            </div>

            {/* Color Swatch Pill List */}
            <div className="flex flex-wrap gap-2 mb-3">
              {combination.colors.map((col) => (
                <div
                  key={col.id}
                  className="flex items-center gap-2 bg-white/90 px-3 py-1.5 rounded-xl border border-slate-200/80 shadow-xs text-xs"
                >
                  <span
                    className="w-4 h-4 rounded-full border border-black/10 shadow-xs"
                    style={{ backgroundColor: col.hex }}
                  />
                  <div>
                    <div className="font-semibold text-slate-800">{col.nameTh}</div>
                    <div className="text-[10px] text-slate-600 font-mono">{col.hex}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Score Highlight Badges */}
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="bg-white/80 p-2 rounded-xl border border-pink-100/80">
                <div className="text-[11px] text-slate-500">ความเข้ากัน</div>
                <div className="font-bold text-emerald-600">{combination.score.harmony}/10</div>
              </div>
              <div className="bg-white/80 p-2 rounded-xl border border-pink-100/80">
                <div className="text-[11px] text-slate-500">ความน่ารัก</div>
                <div className="font-bold text-pink-600">{combination.score.cuteness}/10</div>
              </div>
              <div className="bg-white/80 p-2 rounded-xl border border-pink-100/80">
                <div className="text-[11px] text-slate-500">ขับฟันขาว</div>
                <div className="font-bold text-indigo-600">{combination.score.skinCompliment}/10</div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-2.5">
            <button
              onClick={handleCopyHex}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl text-xs sm:text-sm font-medium transition-colors"
            >
              {copiedHex ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-700 font-semibold">คัดลอกโค้ด HEX แล้ว!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>คัดลอกโค้ดสี HEX</span>
                </>
              )}
            </button>

            <button
              onClick={handleWebShare}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white rounded-2xl text-xs sm:text-sm font-medium shadow-md shadow-pink-200 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              {copiedText ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>คัดลอกข้อความแชร์แล้ว!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4" />
                  <span>แชร์การ์ดนี้ให้เพื่อนหรือคุณหมอ</span>
                </>
              )}
            </button>
          </div>

          <div className="mt-3 text-center">
            <p className="text-[11px] text-slate-600">
              💡 ทริค: เซฟหน้าจอนี้ไว้ให้คุณหมอจัดฟันดูตอนเปลี่ยนยางประจำเดือนได้เลย!
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
