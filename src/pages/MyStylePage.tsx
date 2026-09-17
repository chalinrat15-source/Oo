import React, { useState } from 'react';
import { Sparkles, CheckCircle2, RotateCcw, ArrowRight, Heart, Palette } from 'lucide-react';
import { User, ActiveCombination } from '../types';
import { ApiClient } from '../services/api';
import { BRACE_COLORS } from '../data/colorsData';

interface MyStylePageProps {
  currentUser: User | null;
  onApplyCombination: (combo: ActiveCombination) => void;
  onOpenAuth: () => void;
  onNotify: (msg: string) => void;
}

interface Question {
  id: number;
  title: string;
  subtitle: string;
  options: {
    text: string;
    emoji: string;
    styleTag: 'sweet' | 'cute' | 'cool' | 'minimal' | 'bright' | 'dark';
    desc: string;
  }[];
}

const QUESTIONS: Question[] = [
  {
    id: 1,
    title: 'วันสบายๆ คุณชอบแต่งตัวโทนไหนมากที่สุด?',
    subtitle: 'เลือกสไตล์ที่บ่งบอกความเป็นคุณได้อย่างมั่นใจ',
    options: [
      { text: 'เสื้อโอเวอร์ไซส์ พาสเทล ละมุนตา', emoji: '🌸', styleTag: 'sweet', desc: 'ชมพู ม่วง ฟ้า อ่อนหวานฟรุ้งฟริ้ง' },
      { text: 'เสื้อยืด กางเกงยีนส์ สนีกเกอร์เท่ๆ', emoji: '👟', styleTag: 'cool', desc: 'สตรีทแฟชั่น ลุยๆ คูลๆ' },
      { text: 'สไตล์มินิมอล เอิร์ธโทน เรียบง่ายแต่ดูแพง', emoji: '☁️', styleTag: 'minimal', desc: 'ขาว ครีม เทา คลีนตา' },
      { text: 'เสื้อผ้าสีสดใส ป๊อปสะดุดตา ลายกราฟิก', emoji: '⚡', styleTag: 'bright', desc: 'เหลือง ส้ม เขียวนีออน มีชีวิตชีวา' },
    ],
  },
  {
    id: 2,
    title: 'เวลาเลือกฟังเพลง คุณชอบเปิดเพลย์ลิสต์ฟีลไหน?',
    subtitle: 'เสียงเพลงสะท้อนคลื่นพลังบวกในใจคุณ',
    options: [
      { text: 'T-Pop / K-Pop บับเบิ้ลกัม ร้องเต้นตามได้', emoji: '🧸', styleTag: 'cute', desc: 'สดใส น่ารัก ชวนยิ้มตลอดเวลา' },
      { text: 'Acoustic / Lo-fi ชิลๆ สบายอารมณ์', emoji: '☕', styleTag: 'minimal', desc: 'ผ่อนคลาย สุขุม เรียบง่าย' },
      { text: 'R&B / Hip-hop / Rock บีทหนักๆ คมชัด', emoji: '🎧', styleTag: 'cool', desc: 'มั่นใจ เท่ มีเสน่ห์เฉพาะตัว' },
      { text: 'เพลงรักหวานซึ้ง ซีรีส์โรแมนติก', emoji: '💖', styleTag: 'sweet', desc: 'ใจฟู อบอุ่น นุ่มนวล' },
    ],
  },
  {
    id: 3,
    title: 'คุณอยากให้คนรอบข้างสังเกตรอยยิ้มของคุณแบบไหน?',
    subtitle: 'พลังของสียางจัดฟันช่วยขับออร่าความประทับใจ',
    options: [
      { text: 'ยิ้มแล้วดูน่ารัก น่าเอ็นดู อยากเข้าหา', emoji: '🥰', styleTag: 'cute', desc: 'น่ารัก เป็นมิตร โลกสดใส' },
      { text: 'ฟันดูขาวสว่าง ผิวดูผ่อง ออร่าจับ', emoji: '✨', styleTag: 'dark', desc: 'สีกรม แดงเข้ม ขับฟันขาววิ้ง' },
      { text: 'ยิ้มแล้วดูเรียบร้อย สุภาพ สะอาดตา ถูกระเบียบ', emoji: '🤍', styleTag: 'minimal', desc: 'สะอาด คลีน ถูกกาลเทศะ' },
      { text: 'ยิ้มแล้วโลกสว่างสดใส เปี่ยมพลังงานบวก', emoji: '☀️', styleTag: 'bright', desc: 'เอนเนอร์จี้ล้น ดึงดูดความสุข' },
    ],
  },
];

const STYLE_PROFILES: Record<
  string,
  {
    title: string;
    badge: string;
    desc: string;
    recommendedColors: string[]; // IDs
    pairName: string;
    advice: string;
  }
> = {
  sweet: {
    title: 'Sweet Princess (เจ้าหญิงสายหวาน)',
    badge: '🌸 Sweet Princess',
    desc: 'คุณเป็นคนอ่อนหวาน นุ่มนวล ละมุนตา รอยยิ้มชวนฝัน มีเสน่ห์ให้คนรอบข้างรู้สึกอบอุ่น',
    recommendedColors: ['baby-pink', 'lavender', 'peach', 'sky-blue'],
    pairName: 'Baby Pink + Lavender Bliss (ชมพูนม + ม่วงชวนฝัน)',
    advice: 'เลือกสียางโทน Pastel อ่อนๆ จะช่วยขับผิวให้ดูละมุนและใบหน้าดูอ่อนเยาว์ยิ่งขึ้น',
  },
  cute: {
    title: 'Cute Bubble Pop (สายคิ้วท์สดใส)',
    badge: '🧸 Cute Idol',
    desc: 'ร่าเริง ขี้เล่น สดใสเป็นธรรมชาติ ยิ้มทีไรโลกสว่างสดใสจนใครๆ ก็ต้องยิ้มตาม',
    recommendedColors: ['bubblegum-pink', 'sky-blue', 'fresh-mint', 'lemon-yellow'],
    pairName: 'Cotton Candy Duo (ชมพูบับเบิ้ล + ฟ้าสดใส)',
    advice: 'เหมาะมากกับการใส่แบบสลับซี่ (Alternate) หรือฟันบนสีชมพู ฟันล่างสีฟ้า สดใสคูณสอง!',
  },
  cool: {
    title: 'Street Cool Chic (สายเท่สตรีท)',
    badge: '🕶️ Street Cool',
    desc: 'มั่นใจ มีสไตล์เป็นตัวของตัวเอง ไม่ชอบความซ้ำซาก ชอบลุคที่ดูคมชัดและมีพลัง',
    recommendedColors: ['midnight-navy', 'ruby-wine', 'silver-gray', 'emerald-green'],
    pairName: 'Midnight Navy + Ruby Wine (น้ำเงินลึก + แดงไวน์)',
    advice: 'สียางโทนเข้มจะช่วยขับเนื้อฟันให้แลดูขาวขึ้นอย่างเห็นได้ชัด และไม่ติดคราบอาหารง่าย',
  },
  minimal: {
    title: 'Clean Minimalist (สายคลีนมินิมอล)',
    badge: '☁️ Clean Minimal',
    desc: 'รักความเรียบง่าย สบายตา ดูดีมีคลาส ใส่ใจในรายละเอียดและความกลมกลืน',
    recommendedColors: ['fresh-mint', 'silver-gray', 'sky-blue', 'lavender'],
    pairName: 'Fresh Mint + Sky Blue (มิ้นต์คลีน + ฟ้าพาสเทล)',
    advice: 'โทนสีสะอาดและสบายตา กลมกลืนกับแบร็กเก็ต เหมาะกับทุกโอกาส ทั้งไปเรียนและทำงาน',
  },
  bright: {
    title: 'Vibrant Sunshine (สายพลังบวกสว่างวาบ)',
    badge: '⚡ Vibrant Sunshine',
    desc: 'เปี่ยมไปด้วยพลังความคิดสร้างสรรค์ มั่นใจในตัวเอง ชอบความสดใสโดดเด่น',
    recommendedColors: ['lemon-yellow', 'bubblegum-pink', 'fresh-mint', 'peach'],
    pairName: 'Lemon Sunshine + Bubble Pink (เหลืองสดใส + ชมพูป๊อป)',
    advice: 'อย่ากลัวการลองสีสันสดใส! สีจัดจ้านจะเพิ่มความสนุกและความโดดเด่นให้กับทุกรอยยิ้มของคุณ',
  },
  dark: {
    title: 'Dark Elegant (ดาร์กหรูหราขับฟันขาว)',
    badge: '🖤 Dark Elegant',
    desc: 'สุขุม มีเสน่ห์ลึกลับ มีรสนิยมที่ดูแพงและโดดเด่นแบบไม่ต้องพยายาม',
    recommendedColors: ['midnight-navy', 'ruby-wine', 'emerald-green', 'silver-gray'],
    pairName: 'Deep Ruby + Midnight Navy (แดงทับทิม + น้ำเงินมิดไนท์)',
    advice: 'นี่คือคู่สีลับของคนจัดฟันที่ฟันจะดูขาวสะอาดโดดเด่นที่สุดในรูปถ่าย!',
  },
};

export const MyStylePage: React.FC<MyStylePageProps> = ({
  currentUser,
  onApplyCombination,
  onOpenAuth,
  onNotify,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [resultKey, setResultKey] = useState<string | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSelectOption = (styleTag: string) => {
    const nextAnswers = [...answers, styleTag];
    setAnswers(nextAnswers);

    if (currentStep + 1 < QUESTIONS.length) {
      setCurrentStep(currentStep + 1);
    } else {
      // Calculate outcome (most frequent or default)
      const countMap: Record<string, number> = {};
      nextAnswers.forEach((tag) => {
        countMap[tag] = (countMap[tag] || 0) + 1;
      });

      let topStyle = nextAnswers[0] || 'sweet';
      let maxCount = 0;
      for (const [tag, cnt] of Object.entries(countMap)) {
        if (cnt > maxCount) {
          maxCount = cnt;
          topStyle = tag;
        }
      }

      setResultKey(topStyle);

      // Submit to backend if member
      if (currentUser) {
        ApiClient.submitQuiz({
          style: STYLE_PROFILES[topStyle]?.title || topStyle,
          answers: nextAnswers,
        })
          .then(() => {
            setSavedSuccess(true);
            onNotify('บันทึกสไตล์ลงในโปรไฟล์และปลดล็อก Badge เรียบร้อยแล้ว! 🦄');
          })
          .catch(() => {});
      }
    }
  };

  const handleReset = () => {
    setCurrentStep(0);
    setAnswers([]);
    setResultKey(null);
    setSavedSuccess(false);
  };

  const profile = resultKey ? STYLE_PROFILES[resultKey] || STYLE_PROFILES.sweet : null;

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 sm:py-10">
      {/* Header Banner */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-pink-100 text-pink-700 rounded-full text-xs font-bold mb-3 shadow-2xs">
          <Sparkles className="w-3.5 h-3.5" />
          <span>My Style Quiz & Finder</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-800">
          ค้นหาสไตล์สียางจัดฟันที่เป็นตัวคุณ ✨
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-2 max-w-lg mx-auto">
          ตอบคำถามสั้นๆ 3 ข้อ เพื่อค้นหาคู่สียางที่ขับบุคลิก อารมณ์ และเสริมความมั่นใจให้รอยยิ้มของคุณ
        </p>
      </div>

      {!resultKey ? (
        /* Quiz Active Step */
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-pink-100 transition-all">
          {/* Progress bar */}
          <div className="mb-6">
            <div className="flex justify-between text-xs font-bold text-slate-500 mb-2">
              <span>คำถามข้อที่ {currentStep + 1} จาก {QUESTIONS.length}</span>
              <span>{Math.round(((currentStep + 1) / QUESTIONS.length) * 100)}%</span>
            </div>
            <div className="w-full h-2.5 bg-pink-50 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-pink-500 to-purple-500 transition-all duration-300"
                style={{ width: `${((currentStep + 1) / QUESTIONS.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Question Title */}
          <div className="mb-6 text-center sm:text-left">
            <h2 className="text-lg sm:text-xl font-black text-slate-800">
              {QUESTIONS[currentStep].title}
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              {QUESTIONS[currentStep].subtitle}
            </p>
          </div>

          {/* Options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {QUESTIONS[currentStep].options.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectOption(opt.styleTag)}
                className="p-4 rounded-2xl border-2 border-slate-100 hover:border-pink-300 bg-slate-50/50 hover:bg-pink-50/40 text-left transition-all hover:scale-[1.01] active:scale-[0.99] flex items-start gap-3.5 group cursor-pointer"
              >
                <span className="text-3xl group-hover:scale-110 transition-transform">
                  {opt.emoji}
                </span>
                <div>
                  <div className="font-bold text-xs sm:text-sm text-slate-800 group-hover:text-pink-600 transition-colors">
                    {opt.text}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">
                    {opt.desc}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      ) : (
        /* Result Screen */
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-pink-100 text-center animate-in zoom-in-95">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-gradient-to-tr from-pink-500 to-purple-500 text-white text-3xl shadow-lg shadow-pink-200 mb-4">
            ✨
          </div>

          <div className="inline-block px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-xs font-bold mb-2">
            สไตล์ของคุณคือ
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-slate-800 mb-3">
            {profile?.title}
          </h2>

          <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto mb-6 leading-relaxed">
            {profile?.desc}
          </p>

          {/* Advice Box */}
          <div className="p-4 bg-purple-50/60 border border-purple-100 rounded-2xl text-xs text-purple-900 mb-6 text-left">
            <span className="font-bold">💡 เคล็ดลับจากผู้เชี่ยวชาญ: </span>
            {profile?.advice}
          </div>

          {/* Recommended Colors Palette */}
          <div className="p-5 bg-pink-50/50 rounded-2xl border border-pink-100 mb-6 text-left">
            <div className="text-xs font-bold text-slate-700 mb-3 flex items-center justify-between">
              <span>คู่สียางแนะนำสำหรับสไตล์นี้:</span>
              <span className="text-[11px] text-pink-600 font-semibold">{profile?.pairName}</span>
            </div>

            <div className="flex flex-wrap gap-2.5 items-center justify-center sm:justify-start">
              {profile?.recommendedColors.map((colId) => {
                const col = BRACE_COLORS.find((c) => c.id === colId);
                if (!col) return null;
                return (
                  <div
                    key={col.id}
                    className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-xl shadow-xs border border-pink-100"
                  >
                    <span
                      className="w-5 h-5 rounded-full border border-black/10 shadow-2xs"
                      style={{ backgroundColor: col.hex }}
                    />
                    <span className="text-xs font-bold text-slate-700">{col.nameTh}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => {
                // Apply first two colors to studio simulator
                const colorObjs = profile?.recommendedColors
                  .map((id) => BRACE_COLORS.find((c) => c.id === id))
                  .filter(Boolean) as any[];

                if (colorObjs.length >= 2) {
                  const combo: ActiveCombination = {
                    id: `style-${Date.now()}`,
                    name: profile?.pairName || 'คู่สีตามสไตล์คุณ',
                    colors: colorObjs.slice(0, 2),
                    patternMode: 'alternate',
                    style: profile?.title,
                    score: {
                      harmony: 98,
                      vibrancy: 92,
                      cuteness: 95,
                      skinCompliment: 94,
                      overallFeeling: profile?.desc || 'สมบูรณ์แบบ',
                    },
                    upperTeethColors: Array.from({ length: 10 }, (_, i) =>
                      i % 2 === 0 ? colorObjs[0].hex : colorObjs[1].hex
                    ),
                    lowerTeethColors: Array.from({ length: 10 }, (_, i) =>
                      i % 2 === 0 ? colorObjs[1].hex : colorObjs[0].hex
                    ),
                  };
                  onApplyCombination(combo);
                }
              }}
              className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white rounded-2xl text-xs font-bold shadow-md shadow-pink-200 flex items-center justify-center gap-2 cursor-pointer transition-transform hover:scale-105 active:scale-95"
            >
              <Palette className="w-4 h-4" />
              <span>ทดลองสียางชุดนี้ในสตูดิโอ</span>
            </button>

            <button
              onClick={handleReset}
              className="w-full sm:w-auto px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>ทำแบบทดสอบใหม่</span>
            </button>
          </div>

          {!currentUser && (
            <div className="mt-6 pt-4 border-t border-slate-100">
              <p className="text-xs text-slate-500 mb-2">
                สมัครสมาชิกหรือเข้าสู่ระบบเพื่อบันทึกสไตล์นี้ลงในโปรไฟล์ถาวร และรับเหรียญรางวัล Style Master 🦄
              </p>
              <button
                onClick={onOpenAuth}
                className="text-xs font-bold text-pink-600 hover:text-pink-700 underline cursor-pointer"
              >
                เข้าสู่ระบบ / สมัครสมาชิกตอนนี้
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
