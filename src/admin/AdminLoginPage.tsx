import React, { useState } from 'react';
import { ShieldCheck, Lock, Mail, ArrowLeft, AlertCircle, CheckCircle2 } from 'lucide-react';
import { ApiClient } from '../services/api';
import { User, AppTab } from '../types';

interface AdminLoginPageProps {
  onSuccess: (user: User) => void;
  onNavigateTab: (tab: AppTab) => void;
}

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({
  onSuccess,
  onNavigateTab,
}) => {
  const [email, setEmail] = useState('admin@bracemood.com');
  const [password, setPassword] = useState('admin123456');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await ApiClient.adminLogin({ email, password });
      onSuccess(res.user);
      onNavigateTab('admin-dashboard');
    } catch (err: any) {
      setError(err.message || 'เข้าสู่ระบบผู้ดูแลระบบไม่สำเร็จ ตรวจสอบอีเมลและรหัสผ่าน');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border border-purple-100 relative">
        <button
          onClick={() => onNavigateTab('home')}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-purple-600 mb-6 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>กลับสู่หน้าหลัก BraceMood</span>
        </button>

        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-200 mb-3">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h1 className="text-xl font-black text-slate-800">
            ระบบจัดการหลังบ้าน (Admin Portal)
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            เข้าสู่ระบบเพื่อจัดการข้อมูลสี สมาชิก สถิติ และการเชื่อมต่อ GitHub
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              อีเมลผู้ดูแลระบบ (Admin Email)
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              รหัสผ่าน (Password)
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-2xl text-xs font-bold shadow-md shadow-purple-200 flex items-center justify-center gap-2 cursor-pointer transition-transform active:scale-95 disabled:opacity-50 mt-2"
          >
            {loading ? (
              <span>กำลังตรวจสอบสิทธิ์...</span>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>เข้าสู่ระบบหลังบ้าน</span>
              </>
            )}
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-slate-100 text-center">
          <div className="text-[11px] text-slate-400 mb-2">บัญชีทดสอบเริ่มต้น (Default Credentials):</div>
          <div className="p-2.5 bg-purple-50/70 rounded-xl border border-purple-100 text-[11px] text-purple-900 font-mono text-left space-y-0.5">
            <div>Email: <span className="font-bold">admin@bracemood.com</span></div>
            <div>Password: <span className="font-bold">admin123456</span></div>
          </div>
        </div>
      </div>
    </div>
  );
};
