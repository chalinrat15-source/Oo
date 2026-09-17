import React, { useEffect, useState } from 'react';
import { Trophy, CheckCircle2, Award, Sparkles, Lock, ArrowRight } from 'lucide-react';
import { User, Challenge } from '../types';
import { ApiClient } from '../services/api';

interface ChallengesPageProps {
  currentUser: User | null;
  onOpenAuth: () => void;
  onNavigateTab: (tab: any) => void;
  onNotify: (msg: string) => void;
}

export const ChallengesPage: React.FC<ChallengesPageProps> = ({
  currentUser,
  onOpenAuth,
  onNavigateTab,
  onNotify,
}) => {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [badges, setBadges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadChallenges = async () => {
    try {
      setLoading(true);
      const res = await ApiClient.getChallenges();
      setChallenges(res.challenges || []);
      setBadges(res.badges || []);
    } catch (e) {
      console.error('Error fetching challenges:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadChallenges();
  }, [currentUser]);

  const handleClaim = async (ch: Challenge) => {
    if (!currentUser) {
      onOpenAuth();
      return;
    }
    try {
      await ApiClient.claimBadge({
        badge_id: ch.badge_id,
        badge_name: ch.reward.replace(/[^\w\s\u0E00-\u0E7F]/g, '').trim(),
        badge_icon: ch.reward.slice(-2).trim() || '🏆',
      });
      onNotify(`🎉 ปลดล็อกความสำเร็จ: ${ch.title} สำเร็จแล้ว!`);
      loadChallenges();
    } catch (e: any) {
      onNotify(e.message || 'เคลมรางวัลไม่สำเร็จ');
    }
  };

  const completedCount = challenges.filter((c) => c.is_completed).length;

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 sm:py-10">
      {/* Header Banner */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-amber-100 text-amber-800 rounded-full text-xs font-bold mb-3 shadow-2xs">
          <Trophy className="w-3.5 h-3.5 text-amber-600" />
          <span>BraceMood Badges & Challenges</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-800">
          ภารกิจพิชิตเหรียญตรา (Challenges) 🏆
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-2 max-w-lg mx-auto">
          ร่วมสนุกกับกิจกรรมสะสมสียางจัดฟัน ลองสไตล์ใหม่ๆ แล้วปลดล็อก Badge ประจำตัวสุดคิ้วท์
        </p>
      </div>

      {/* Progress Card */}
      <div className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 rounded-3xl p-6 text-white shadow-xl mb-8 relative overflow-hidden">
        <div className="absolute -right-6 -bottom-6 w-36 h-36 rounded-full bg-white/10 blur-xl pointer-events-none" />
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 relative z-10">
          <div className="text-center sm:text-left">
            <span className="text-xs font-semibold uppercase tracking-wider text-pink-200">
              สถานะความสำเร็จของคุณ
            </span>
            <div className="text-2xl sm:text-3xl font-black mt-1">
              ปลดล็อกแล้ว {completedCount} จาก {challenges.length} ภารกิจ
            </div>
            <p className="text-xs text-pink-100 mt-1">
              {currentUser
                ? `ยินดีด้วยคุณ ${currentUser.name}! สะสมครบทุกภารกิจเพื่อเลื่อนระดับเป็น Smile Legend`
                : 'เข้าสู่ระบบเพื่อเริ่มบันทึกและปลดล็อกเหรียญรางวัลในบัญชีของคุณ'}
            </p>
          </div>

          {!currentUser ? (
            <button
              onClick={onOpenAuth}
              className="px-5 py-2.5 bg-white text-pink-600 hover:bg-pink-50 rounded-2xl text-xs font-bold shadow-md cursor-pointer transition-all hover:scale-105 shrink-0"
            >
              เข้าสู่ระบบเพื่อสะสมเหรียญ
            </button>
          ) : (
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/20">
              <span className="text-2xl">🎖️</span>
              <div className="text-left">
                <div className="text-[10px] text-pink-200 font-bold">เหรียญที่ได้</div>
                <div className="text-sm font-black">{badges.length} เหรียญตรา</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Challenges List */}
      <div className="space-y-4">
        {loading ? (
          <div className="p-8 text-center text-xs text-slate-400">กำลังโหลดภารกิจ...</div>
        ) : (
          challenges.map((ch) => {
            const isCompleted = ch.is_completed;
            return (
              <div
                key={ch.id}
                className={`p-5 rounded-3xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  isCompleted
                    ? 'bg-emerald-50/40 border-emerald-200/80 shadow-xs'
                    : 'bg-white border-pink-100/80 shadow-xs hover:border-pink-300'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0 shadow-xs ${
                      isCompleted
                        ? 'bg-emerald-100 border border-emerald-200 text-emerald-700'
                        : 'bg-pink-50 border border-pink-200/70 text-slate-400'
                    }`}
                  >
                    {isCompleted ? '⭐' : <Lock className="w-5 h-5 text-slate-400" />}
                  </div>

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-extrabold text-sm sm:text-base text-slate-800">
                        {ch.title}
                      </h3>
                      {isCompleted && (
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded-md flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> สำเร็จแล้ว
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">{ch.description}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-[11px] font-bold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-lg border border-purple-100">
                        🎁 รางวัล: {ch.reward}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action button */}
                <div className="shrink-0 flex items-center gap-2 self-end sm:self-center">
                  {isCompleted ? (
                    <div className="text-xs font-bold text-emerald-600 flex items-center gap-1 bg-white px-3 py-1.5 rounded-xl border border-emerald-200">
                      <CheckCircle2 className="w-4 h-4" /> ได้รับแล้ว
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        if (ch.type === 'random') onNavigateTab('random');
                        else if (ch.type === 'favorite') onNavigateTab('random');
                        else if (ch.type === 'quiz') onNavigateTab('my-style');
                        else if (ch.type === 'studio') onNavigateTab('studio');
                        else handleClaim(ch);
                      }}
                      className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer flex items-center gap-1.5 transition-transform hover:scale-105 active:scale-95"
                    >
                      <span>เริ่มทำภารกิจ</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
