import React from 'react';
import { motion } from 'motion/react';
import { Heart, Sparkles, Flame, Smile, CheckCircle } from 'lucide-react';
import { ColorScore } from '../types';

interface ScoreCardProps {
  score: ColorScore;
  className?: string;
  compact?: boolean;
}

export const ScoreCard: React.FC<ScoreCardProps> = ({ score, className = '', compact = false }) => {
  const metrics = [
    {
      label: 'ความเข้ากัน',
      value: score.harmony,
      color: 'bg-emerald-500',
      textColor: 'text-emerald-600',
      bgLight: 'bg-emerald-50',
      icon: CheckCircle,
    },
    {
      label: 'ความสดใส',
      value: score.vibrancy,
      color: 'bg-amber-500',
      textColor: 'text-amber-600',
      bgLight: 'bg-amber-50',
      icon: Flame,
    },
    {
      label: 'ความน่ารัก',
      value: score.cuteness,
      color: 'bg-pink-500',
      textColor: 'text-pink-600',
      bgLight: 'bg-pink-50',
      icon: Heart,
    },
    {
      label: 'ขับฟันดูขาว',
      value: score.skinCompliment,
      color: 'bg-indigo-500',
      textColor: 'text-indigo-600',
      bgLight: 'bg-indigo-50',
      icon: Sparkles,
    },
  ];

  if (compact) {
    return (
      <div className={`bg-white/80 backdrop-blur-xs rounded-2xl p-3 border border-pink-100 shadow-xs ${className}`}>
        <div className="grid grid-cols-2 gap-2 text-xs">
          {metrics.slice(0, 3).map((m) => (
            <div key={m.label} className="flex items-center justify-between bg-slate-50 px-2.5 py-1.5 rounded-xl">
              <span className="text-slate-600">{m.label}</span>
              <span className={`font-semibold ${m.textColor}`}>{m.value}/10</span>
            </div>
          ))}
          <div className="flex items-center justify-between bg-slate-50 px-2.5 py-1.5 rounded-xl">
            <span className="text-slate-600">ขับฟันขาว</span>
            <span className="font-semibold text-indigo-600">{score.skinCompliment}/10</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white/90 backdrop-blur-md rounded-3xl p-5 border border-pink-100 shadow-sm ${className}`}>
      <div className="flex items-center gap-2 mb-3">
        <Smile className="w-5 h-5 text-pink-500" />
        <h3 className="font-bold text-slate-800 text-sm sm:text-base">คะแนนและการวิเคราะห์คู่สี</h3>
      </div>

      {/* Metric Bars */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
        {metrics.map((m) => {
          const Icon = m.icon;
          return (
            <div key={m.label} className="bg-slate-50/80 p-3 rounded-2xl border border-slate-100">
              <div className="flex items-center justify-between mb-1.5 text-xs sm:text-sm">
                <div className="flex items-center gap-1.5 text-slate-600">
                  <Icon className={`w-3.5 h-3.5 ${m.textColor}`} />
                  <span>{m.label}</span>
                </div>
                <span className={`font-bold ${m.textColor}`}>{m.value}/10</span>
              </div>
              <div className="w-full h-2 bg-slate-200/80 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(m.value / 10) * 100}%` }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                  className={`h-full rounded-full ${m.color}`}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Description quote box */}
      <div className="bg-gradient-to-r from-pink-50 via-purple-50 to-blue-50 p-3.5 rounded-2xl border border-pink-100/60 text-xs sm:text-sm text-slate-700 flex items-start gap-2.5">
        <Sparkles className="w-4 h-4 text-pink-500 shrink-0 mt-0.5" />
        <p className="leading-relaxed italic">{score.overallFeeling}</p>
      </div>
    </div>
  );
};
