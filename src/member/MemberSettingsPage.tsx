import React, { useState } from 'react';
import { User, AppTab } from '../types';
import { ApiClient } from '../services/api';
import { Settings, Save, CheckCircle2, AlertCircle, ArrowLeft, Shield } from 'lucide-react';

interface MemberSettingsPageProps {
  currentUser: User;
  onUpdateUser: (updated: User) => void;
  onNavigateTab: (tab: AppTab) => void;
  onNotify: (msg: string) => void;
}

const AVATARS = ['🌸', '✨', '🧸', '⚡', '👑', '🦄', '🍓', '😎', '🎀', '🥑', '🧁', '💎'];
const STYLES = [
  'Sweet Pastel (หวานละมุนสายเกา)',
  'Street Cool (เท่ มั่นใจ สายสตรีท)',
  'Clean Minimal (เรียบง่าย สบายตา)',
  'Cute Bubble Pop (น่ารักป๊อปๆ)',
  'Dark Elegant (ดาร์กหรูหรา ขับฟันขาว)',
  'Vibrant Sunshine (สดใสเปี่ยมพลัง)',
];

export const MemberSettingsPage: React.FC<MemberSettingsPageProps> = ({
  currentUser,
  onUpdateUser,
  onNavigateTab,
  onNotify,
}) => {
  const [name, setName] = useState(currentUser.name);
  const [profile, setProfile] = useState(currentUser.profile || '🌸');
  const [style, setStyle] = useState(currentUser.style || STYLES[0]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      const res = await ApiClient.updateProfile({
        name,
        profile,
        style,
      });
      onUpdateUser(res.user);
      setMessage('บันทึกการเปลี่ยนแปลงโปรไฟล์สำเร็จ');
      onNotify('อัปเดตข้อมูลโปรไฟล์เรียบร้อยแล้ว');
    } catch (err: any) {
      setError(err.message || 'บันทึกไม่สำเร็จ โปรดลองใหม่อีกครั้ง');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 sm:py-10">
      <button
        onClick={() => onNavigateTab('profile')}
        className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-pink-600 mb-4 transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>กลับไปที่โปรไฟล์</span>
      </button>

      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-pink-100">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
          <div className="w-10 h-10 rounded-2xl bg-pink-50 text-pink-600 flex items-center justify-center">
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-slate-800">ตั้งค่าโปรไฟล์และบัญชี</h1>
            <p className="text-xs text-slate-500">ปรับแต่งชื่อ รูปประจำตัว และสไตล์ของคุณ</p>
          </div>
        </div>

        {message && (
          <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-700 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{message}</span>
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              ชื่อที่แสดง (Display Name)
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:border-pink-400"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              อีเมลที่ลงทะเบียน
            </label>
            <input
              type="text"
              disabled
              value={currentUser.email}
              className="w-full px-4 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-xs text-slate-500 cursor-not-allowed"
            />
            <span className="text-[10px] text-slate-400 mt-1 block">
              อีเมลใช้เป็นบัญชีผู้ใช้หลัก ไม่สามารถเปลี่ยนแปลงได้
            </span>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              เลือกรูปประจำตัว Avatar
            </label>
            <div className="grid grid-cols-6 gap-2">
              {AVATARS.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => setProfile(emoji)}
                  className={`h-11 rounded-2xl flex items-center justify-center text-xl border transition-all cursor-pointer ${
                    profile === emoji
                      ? 'border-pink-500 bg-pink-50 scale-105 shadow-xs font-bold'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              สไตล์สียางที่ชอบ (My Style Archetype)
            </label>
            <select
              value={style}
              onChange={(e) => setStyle(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:border-pink-400 cursor-pointer"
            >
              {STYLES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white rounded-2xl text-xs font-bold shadow-md shadow-pink-200 flex items-center justify-center gap-2 cursor-pointer transition-transform active:scale-95 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{loading ? 'กำลังบันทึก...' : 'บันทึกการเปลี่ยนแปลง'}</span>
            </button>
          </div>
        </form>

        {/* Security / Role Info */}
        <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-600" />
            <span>สถานะบัญชี: ปกติ (Active)</span>
          </div>
          <span className="text-[11px] text-slate-400">
            Role: {currentUser.role}
          </span>
        </div>
      </div>
    </div>
  );
};
