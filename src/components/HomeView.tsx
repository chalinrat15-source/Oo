import React from 'react';
import { motion } from 'motion/react';
import {
  Sparkles,
  Dice5,
  Palette,
  Heart,
  Shirt,
  Smile,
  ArrowRight,
  CheckCircle2,
  Star,
  User as UserIcon,
  Flame,
  Clock,
  ThumbsUp,
} from 'lucide-react';
import { SmileSimulator } from './SmileSimulator';
import { ActiveCombination } from '../types';
import { CURATED_PALETTES, BRACE_COLORS } from '../data/colorsData';

interface HomeViewProps {
  currentCombination: ActiveCombination;
  onStartChoosing: () => void;
  onNavigateToStudio: () => void;
  onNavigateToCurated: () => void;
  onNavigateToMyStyle: () => void;
  onApplyPreset: (colors: string[], name: string) => void;
  onOpenAuth: () => void;
  isLoggedIn: boolean;
  recentPairs?: ActiveCombination[];
}

export const HomeView: React.FC<HomeViewProps> = ({
  currentCombination,
  onStartChoosing,
  onNavigateToStudio,
  onNavigateToCurated,
  onNavigateToMyStyle,
  onApplyPreset,
  onOpenAuth,
  isLoggedIn,
  recentPairs = [],
}) => {
  // Featured colors today
  const featuredColorsToday = [
    BRACE_COLORS.find((c) => c.id === 'baby-pink') || BRACE_COLORS[0],
    BRACE_COLORS.find((c) => c.id === 'sky-blue') || BRACE_COLORS[1],
    BRACE_COLORS.find((c) => c.id === 'lavender') || BRACE_COLORS[2],
    BRACE_COLORS.find((c) => c.id === 'mint-green') || BRACE_COLORS[3],
  ];

  // Popular moods
  const popularMoods = [
    { id: 'cheerful', label: 'สดใสเปี่ยมพลัง', emoji: '⚡', color: 'from-amber-400 to-pink-500' },
    { id: 'sweet', label: 'หวานละมุน', emoji: '🌸', color: 'from-pink-400 to-rose-400' },
    { id: 'cool', label: 'เท่คูล ขับฟันขาว', emoji: '😎', color: 'from-blue-600 to-indigo-700' },
    { id: 'cute', label: 'น่ารักน่าเอ็นดู', emoji: '🧸', color: 'from-purple-400 to-pink-400' },
    { id: 'calm', label: 'สบายตา คลีนๆ', emoji: '☁️', color: 'from-teal-400 to-cyan-500' },
  ];

  return (
    <div className="space-y-10 max-w-5xl mx-auto pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-white/95 via-pink-50/60 to-purple-50/40 rounded-3xl sm:rounded-[36px] p-6 sm:p-10 border border-pink-100 shadow-sm">
        {/* Floating decorative gradient orbs */}
        <div className="absolute -top-10 -right-10 w-48 h-48 bg-pink-300/20 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-purple-300/20 rounded-full blur-2xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          {/* Hero Left Content */}
          <div className="lg:col-span-6 text-center lg:text-left space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-pink-100/90 backdrop-blur-xs rounded-full text-xs font-bold text-pink-700 border border-pink-200/60 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-pink-500" />
              <span>ผู้ช่วยเลือกสียางจัดฟันสำหรับวัยรุ่น 💖</span>
            </div>

            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                Brace<span className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent">Mood</span>
              </h1>
              <p className="text-base sm:text-xl text-pink-600 font-extrabold mt-1">
                “ค้นหาสียางที่ใช่ ในสไตล์ของคุณ”
              </p>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-md mx-auto lg:mx-0 font-medium">
              มากกว่าการสุ่มสี เพราะเราช่วยค้นหาคู่สีที่เหมาะกับ{' '}
              <span className="text-pink-600 font-bold">Mood</span>,{' '}
              <span className="text-purple-600 font-bold">สไตล์</span>,{' '}
              <span className="text-indigo-600 font-bold">เสื้อผ้า</span> และ{' '}
              <span className="text-emerald-600 font-bold">โอกาสของคุณ</span> พร้อมระบบจำลองรอยยิ้ม สมาชิก และ Cloud Data
            </p>

            {/* 3 Main Required Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-2.5">
              {/* Button 1: สุ่มสีให้ฉัน */}
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={onStartChoosing}
                className="w-full sm:w-auto px-5 py-3.5 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 hover:opacity-95 text-white font-extrabold text-xs sm:text-sm rounded-2xl shadow-lg shadow-pink-200 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Dice5 className="w-4 h-4" />
                <span>🎲 สุ่มสีให้ฉัน</span>
              </motion.button>

              {/* Button 2: ทดลองสียาง */}
              <button
                onClick={onNavigateToStudio}
                className="w-full sm:w-auto px-5 py-3.5 bg-white hover:bg-pink-50 text-slate-700 font-bold text-xs sm:text-sm rounded-2xl border border-pink-200 shadow-2xs transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Palette className="w-4 h-4 text-pink-500" />
                <span>🎨 ทดลองสียาง</span>
              </button>

              {/* Button 3: ค้นหาสีที่เหมาะกับฉัน */}
              <button
                onClick={onNavigateToMyStyle}
                className="w-full sm:w-auto px-4 py-3.5 bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold text-xs sm:text-sm rounded-2xl border border-purple-200 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-purple-600" />
                <span>✨ ค้นหาสีที่เหมาะกับฉัน</span>
              </button>
            </div>

            {/* User status info or CTA */}
            {!isLoggedIn && (
              <div className="pt-2 flex items-center justify-center lg:justify-start gap-2 text-xs text-slate-500">
                <span>มีบัญชีสมาชิกแล้วหรือยัง?</span>
                <button
                  onClick={onOpenAuth}
                  className="font-bold text-pink-600 hover:text-pink-700 underline cursor-pointer"
                >
                  เข้าสู่ระบบ / สมัครสมาชิก
                </button>
              </div>
            )}
          </div>

          {/* Hero Right: Interactive Smile Preview Graphic */}
          <div className="lg:col-span-6 flex flex-col items-center">
            <div className="w-full bg-white/90 p-3 rounded-3xl border border-pink-100 shadow-md">
              <SmileSimulator
                upperColors={currentCombination.upperTeethColors}
                lowerColors={currentCombination.lowerTeethColors}
                isInteractive={false}
              />
              <div className="p-3 bg-gradient-to-r from-pink-50 via-purple-50 to-blue-50 rounded-2xl border border-pink-100/70 mt-2 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="flex -space-x-1.5">
                    {currentCombination.colors.map((c) => (
                      <span
                        key={c.id}
                        className="w-5 h-5 rounded-full border border-white shadow-2xs"
                        style={{ backgroundColor: c.hex }}
                      />
                    ))}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-800">{currentCombination.name}</div>
                    <div className="text-[10px] text-pink-600 font-medium">
                      ความน่ารัก {currentCombination.score.cuteness}/10 · ขับฟันขาว {currentCombination.score.skinCompliment}/10
                    </div>
                  </div>
                </div>
                <button
                  onClick={onStartChoosing}
                  className="px-3 py-1.5 bg-white text-pink-600 text-xs font-semibold rounded-xl border border-pink-200 hover:bg-pink-50 transition-colors cursor-pointer"
                >
                  สุ่มสีอื่น
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 1: สีแนะนำวันนี้ (Featured Colors Today) */}
      <section className="bg-white rounded-3xl p-6 sm:p-7 border border-pink-100 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">🌟</span>
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-800">
                สีแนะนำวันนี้ (Daily Pick)
              </h2>
              <p className="text-[11px] text-slate-400">เฉดสียอดนิยมที่หมอฟันและวัยรุ่นแนะนำมากที่สุดวันนี้</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {featuredColorsToday.map((color) => (
            <div
              key={color.id}
              onClick={() => {
                onApplyPreset([color.hex, color.hex], color.nameTh);
              }}
              className="p-3.5 bg-pink-50/30 hover:bg-pink-50/70 border border-pink-100/70 rounded-2xl transition-all hover:scale-[1.02] cursor-pointer flex items-center gap-3 group"
            >
              <span
                className="w-8 h-8 rounded-xl border border-black/10 shadow-xs group-hover:scale-110 transition-transform shrink-0"
                style={{ backgroundColor: color.hex }}
              />
              <div className="overflow-hidden">
                <div className="text-xs font-bold text-slate-800 truncate">{color.nameTh}</div>
                <div className="text-[10px] text-slate-400 truncate">{color.nameEn}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Section 2: คู่สียอดนิยม (Popular Pairs) */}
      <section className="bg-white rounded-3xl p-6 sm:p-7 border border-pink-100 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-rose-500" />
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-800">
                คู่สียอดนิยม (Popular Pairs)
              </h2>
              <p className="text-[11px] text-slate-400">คู่สีที่ได้รับคะแนนความเข้ากันและการบันทึกสูงสุด</p>
            </div>
          </div>
          <button
            onClick={onNavigateToCurated}
            className="text-xs font-bold text-pink-600 hover:text-pink-700 flex items-center gap-1 cursor-pointer"
          >
            <span>ดูทั้งหมด</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          {CURATED_PALETTES.slice(0, 3).map((palette) => (
            <div
              key={palette.id}
              className="p-4 bg-slate-50/60 hover:bg-pink-50/40 rounded-2xl border border-slate-200/60 transition-all flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex -space-x-1.5">
                    {palette.colors.map((c) => (
                      <span
                        key={c.id}
                        className="w-6 h-6 rounded-full border-2 border-white shadow-2xs"
                        style={{ backgroundColor: c.hex }}
                      />
                    ))}
                  </div>
                  <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-md">
                    คะแนน {palette.score.harmony * 10}%
                  </span>
                </div>
                <h3 className="text-xs sm:text-sm font-bold text-slate-800">{palette.titleTh}</h3>
                <p className="text-xs text-slate-500 line-clamp-2">{palette.descriptionTh}</p>
              </div>

              <button
                onClick={() => {
                  onApplyPreset(
                    [palette.colors[0].hex, palette.colors[1]?.hex || palette.colors[0].hex],
                    palette.titleTh
                  );
                }}
                className="mt-3 w-full py-1.5 bg-white hover:bg-pink-500 hover:text-white text-slate-700 text-xs font-bold rounded-xl border border-slate-200 transition-colors text-center cursor-pointer shadow-2xs"
              >
                ลองคู่นี้ในสตูดิโอ
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Section 3: Mood ยอดนิยม (Popular Moods) */}
      <section className="bg-white rounded-3xl p-6 sm:p-7 border border-pink-100 shadow-xs">
        <div className="mb-4">
          <h2 className="text-base sm:text-lg font-black text-slate-800 flex items-center gap-2">
            <span>🎭</span>
            <span>Mood ยอดนิยม (Match by Emotion)</span>
          </h2>
          <p className="text-[11px] text-slate-400">เลือกมู้ดที่ต้องการ แล้วระบบจะคัดกรองสีที่ตรงใจให้ทันที</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
          {popularMoods.map((m) => (
            <button
              key={m.id}
              onClick={onStartChoosing}
              className="p-3.5 rounded-2xl border border-pink-100 bg-gradient-to-b from-white to-pink-50/30 hover:border-pink-300 hover:scale-105 transition-all text-center cursor-pointer group shadow-2xs"
            >
              <div className="text-2xl mb-1 group-hover:scale-110 transition-transform">
                {m.emoji}
              </div>
              <div className="text-xs font-extrabold text-slate-800 group-hover:text-pink-600">
                {m.label}
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Section 4: คู่สีล่าสุด (Recent Combinations) */}
      <section className="bg-white rounded-3xl p-6 sm:p-7 border border-pink-100 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-indigo-500" />
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-800">
                คู่สีล่าสุด (Recent Combinations)
              </h2>
              <p className="text-[11px] text-slate-400">คู่สีที่เพิ่งได้รับการสุ่มและออกแบบในสตูดิโอ</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {(recentPairs.length > 0
            ? recentPairs.slice(0, 3)
            : [
                {
                  id: 'demo-1',
                  name: 'Baby Pink + Sky Blue (พาสเทลคู่ใจ)',
                  colors: [featuredColorsToday[0], featuredColorsToday[1]],
                },
                {
                  id: 'demo-2',
                  name: 'Lavender + Fresh Mint (ทไวไลท์มิ้นต์)',
                  colors: [featuredColorsToday[2], featuredColorsToday[3]],
                },
                {
                  id: 'demo-3',
                  name: 'Midnight Navy + Ruby Wine (ดาร์กสตรีท)',
                  colors: [
                    BRACE_COLORS.find((c) => c.id === 'midnight-navy') || BRACE_COLORS[0],
                    BRACE_COLORS.find((c) => c.id === 'ruby-wine') || BRACE_COLORS[1],
                  ],
                },
              ]
          ).map((item: any, idx) => (
            <div
              key={item.id || idx}
              className="p-3 bg-pink-50/20 border border-pink-100 rounded-2xl flex items-center justify-between gap-2"
            >
              <div className="flex items-center gap-2.5 overflow-hidden">
                <div className="flex -space-x-1.5 shrink-0">
                  {item.colors?.map((c: any, i: number) => (
                    <span
                      key={i}
                      className="w-6 h-6 rounded-full border border-white shadow-xs"
                      style={{ backgroundColor: c.hex }}
                    />
                  ))}
                </div>
                <div className="truncate">
                  <div className="text-xs font-bold text-slate-800 truncate">{item.name}</div>
                  <div className="text-[10px] text-slate-400">สลับซี่แบบ Alternate</div>
                </div>
              </div>

              <button
                onClick={() => {
                  onApplyPreset(
                    [item.colors[0].hex, item.colors[1]?.hex || item.colors[0].hex],
                    item.name
                  );
                }}
                className="px-2.5 py-1 bg-white hover:bg-pink-50 border border-pink-200 text-pink-600 rounded-lg text-[11px] font-bold shrink-0 cursor-pointer"
              >
                ลองสีนี้
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Member CTA Banner */}
      {!isLoggedIn && (
        <section className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-5 text-center sm:text-left">
          <div>
            <span className="px-3 py-1 bg-white/20 text-white rounded-full text-xs font-bold uppercase tracking-wider">
              BraceMood Member
            </span>
            <h2 className="text-xl sm:text-2xl font-black mt-2">
              สมัครสมาชิกฟรี เพื่อเก็บคอลเลกชันคู่สียางในฝัน
            </h2>
            <p className="text-xs sm:text-sm text-pink-100 mt-1 max-w-lg">
              บันทึกคู่สียางไว้เปิดให้หมอฟันดู ทำแบบทดสอบ My Style และสะสม Badge พิชิตความน่ารัก
            </p>
          </div>

          <button
            onClick={onOpenAuth}
            className="px-6 py-3 bg-white hover:bg-pink-50 text-pink-600 rounded-2xl text-xs sm:text-sm font-bold shadow-lg transition-transform hover:scale-105 active:scale-95 cursor-pointer shrink-0"
          >
            เข้าสู่ระบบ / สมัครสมาชิก
          </button>
        </section>
      )}
    </div>
  );
};
