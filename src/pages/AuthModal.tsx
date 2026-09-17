import React, { useState } from 'react';
import { X, Mail, Lock, User, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';
import { ApiClient } from '../services/api';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: any) => void;
  initialMode?: 'login' | 'register';
}

const AVATAR_OPTIONS = ['🌸', '✨', '🧸', '⚡', '👑', '🦄', '🍓', '😎', '🎀', '🥑'];

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  initialMode = 'login',
}) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [profile, setProfile] = useState('🌸');
  const [style, setStyle] = useState('Sweet Pastel');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (mode === 'login') {
        const res = await ApiClient.login({ email, password });
        onSuccess(res.user);
        onClose();
      } else {
        const res = await ApiClient.register({
          name,
          email,
          password,
          profile,
          style,
        });
        onSuccess(res.user);
        onClose();
      }
    } catch (err: any) {
      setError(err.message || 'เข้าสู่ระบบไม่สำเร็จ โปรดลองอีกครั้ง');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (role: 'member' | 'admin') => {
    setError(null);
    setLoading(true);
    try {
      const creds =
        role === 'admin'
          ? { email: 'admin@bracemood.com', password: 'admin123456' }
          : { email: 'member@bracemood.com', password: 'member123456' };

      const res = await ApiClient.login(creds);
      onSuccess(res.user);
      onClose();
    } catch (err: any) {
      setError(err.message || 'เข้าสู่ระบบด่วนไม่สำเร็จ');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-pink-100 relative max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Branding */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-pink-500 to-purple-500 text-white shadow-md shadow-pink-200 mb-2 text-2xl">
            💖
          </div>
          <h2 className="text-xl font-extrabold text-slate-800">
            {mode === 'login' ? 'เข้าสู่ระบบ BraceMood' : 'สมัครสมาชิกใหม่'}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {mode === 'login'
              ? 'บันทึกคู่สียางในดวงใจ เก็บประวัติ และปลดล็อกภารกิจ Badge'
              : 'ร่วมเป็นครอบครัว BraceMood ค้นหาสียางที่ใช่ ในสไตล์คุณ'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-pink-50/80 p-1 rounded-2xl mb-5">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setError(null);
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
              mode === 'login'
                ? 'bg-white text-pink-600 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            เข้าสู่ระบบ (Sign In)
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('register');
              setError(null);
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
              mode === 'register'
                ? 'bg-white text-pink-600 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            สมัครสมาชิก (Register)
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-600 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {mode === 'register' && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                ชื่อ / นามแฝง
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  placeholder="เช่น น้องมายด์ ยิ้มหวาน"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:border-pink-400"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              อีเมล (Email)
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:border-pink-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              รหัสผ่าน (Password)
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="password"
                required
                placeholder="อย่างน้อย 6 ตัวอักษร"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:border-pink-400"
              />
            </div>
          </div>

          {mode === 'register' && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                เลือกรูปประจำตัว Avatar
              </label>
              <div className="flex flex-wrap gap-2 py-1">
                {AVATAR_OPTIONS.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => setProfile(emoji)}
                    className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg border transition-all ${
                      profile === emoji
                        ? 'border-pink-500 bg-pink-50 scale-110 shadow-xs'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 hover:opacity-90 text-white rounded-2xl text-xs font-bold shadow-md shadow-pink-200 flex items-center justify-center gap-2 cursor-pointer transition-transform active:scale-[0.98] mt-2 disabled:opacity-50"
          >
            {loading ? (
              <span>กำลังดำเนินการ...</span>
            ) : mode === 'login' ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>เข้าสู่ระบบ</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>สมัครสมาชิก</span>
              </>
            )}
          </button>
        </form>

        {/* Quick Demo Logins */}
        <div className="mt-5 pt-4 border-t border-slate-100">
          <div className="text-[11px] text-slate-400 text-center font-medium mb-2.5">
            หรือทดสอบเข้าสู่ระบบแบบรวดเร็ว (1-Click Demo):
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickLogin('member')}
              className="px-2.5 py-2 bg-pink-50 hover:bg-pink-100 text-pink-700 border border-pink-200 rounded-xl text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>🌸 บัญชีสมาชิก</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('admin')}
              className="px-2.5 py-2 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 rounded-xl text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>👑 บัญชี Admin</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
