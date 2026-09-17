import React, { useEffect, useState } from 'react';
import {
  LayoutDashboard,
  Palette,
  Layers,
  Users,
  GitBranch,
  Settings,
  Plus,
  Trash2,
  Edit2,
  RefreshCw,
  Search,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Heart,
  Dice5,
  Trophy,
  Shield,
  ArrowLeft,
  X,
  ExternalLink,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { User, AdminSubTab } from '../types';
import { ApiClient } from '../services/api';

interface AdminDashboardPageProps {
  currentUser: User;
  onNavigateTab: (tab: any) => void;
  onNotify: (msg: string) => void;
}

const PIE_COLORS = ['#FF69B4', '#87CEEB', '#C8A2C8', '#98FF98', '#FDE047', '#1E3A8A'];

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({
  currentUser,
  onNavigateTab,
  onNotify,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<AdminSubTab>('dashboard');
  const [stats, setStats] = useState<any>(null);
  const [colors, setColors] = useState<any[]>([]);
  const [pairs, setPairs] = useState<any[]>([]);
  const [members, setMembers] = useState<any[]>([]);
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [githubData, setGithubData] = useState<any>(null);
  const [githubLoading, setGithubLoading] = useState(false);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [colorModalOpen, setColorModalOpen] = useState(false);
  const [editingColor, setEditingColor] = useState<any | null>(null);
  const [colorForm, setColorForm] = useState({
    name: '',
    english_name: '',
    hex: '#FF69B4',
    tone: 'pastel',
    mood: 'cheerful',
    style: 'cute',
    description: '',
  });

  const [pairModalOpen, setPairModalOpen] = useState(false);
  const [editingPair, setEditingPair] = useState<any | null>(null);
  const [pairForm, setPairForm] = useState({
    name: '',
    color_1: '#FF69B4',
    color_2: '#87CEEB',
    compatibility_score: 95,
    popularity: 90,
    tags: 'หวานละมุน, ยอดนิยม',
    description: '',
  });

  const [memberSearch, setMemberSearch] = useState('');
  const [colorSearch, setColorSearch] = useState('');

  // Fetch initial data
  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [dashRes, colorsRes, pairsRes, membersRes, settingsRes] = await Promise.all([
        ApiClient.getAdminDashboard(),
        ApiClient.getColors(),
        ApiClient.getColorPairs(),
        ApiClient.getAdminMembers(),
        ApiClient.getAdminSettings(),
      ]);

      setStats(dashRes);
      setColors(colorsRes);
      setPairs(pairsRes);
      setMembers(membersRes);

      const settingsMap: Record<string, string> = {};
      (settingsRes || []).forEach((s: any) => {
        settingsMap[s.setting_name] = s.setting_value;
      });
      setSettings(settingsMap);
    } catch (err) {
      console.error('Error loading admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  // GitHub sync fetch
  const handleFetchGitHub = async () => {
    setGithubLoading(true);
    try {
      const res = await ApiClient.getGitHubData();
      setGithubData(res);
      onNotify('ดึงข้อมูลจาก GitHub Repository สำเร็จ');
    } catch (err: any) {
      onNotify(err.message || 'ดึงข้อมูลไม่สำเร็จ');
    } finally {
      setGithubLoading(false);
    }
  };

  const handleTriggerGitHubSync = async () => {
    setGithubLoading(true);
    try {
      const res = await ApiClient.syncGitHub();
      onNotify(res.message || 'ซิงค์ข้อมูลเข้า Database สำเร็จ');
      loadDashboardData();
      handleFetchGitHub();
    } catch (err: any) {
      onNotify(err.message || 'เกิดข้อผิดพลาดในการซิงค์ข้อมูล');
    } finally {
      setGithubLoading(false);
    }
  };

  // Color CRUD
  const handleSaveColor = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...colorForm,
        mood: [colorForm.mood],
        style: [colorForm.style],
      };
      if (editingColor) {
        await ApiClient.updateColor(editingColor.id, payload);
        onNotify(`อัปเดตสี "${colorForm.name}" สำเร็จ`);
      } else {
        await ApiClient.createColor(payload);
        onNotify(`เพิ่มสีใหม่ "${colorForm.name}" สำเร็จ`);
      }
      setColorModalOpen(false);
      setEditingColor(null);
      const res = await ApiClient.getColors();
      setColors(res);
    } catch (err: any) {
      onNotify(err.message || 'บันทึกสีไม่สำเร็จ');
    }
  };

  const handleDeleteColor = async (id: string, name: string) => {
    if (!window.confirm(`ยืนยันการลบสี "${name}" หรือไม่?`)) return;
    try {
      await ApiClient.deleteColor(id);
      onNotify(`ลบสี "${name}" แล้ว`);
      setColors(colors.filter((c) => c.id !== id));
    } catch (err: any) {
      onNotify(err.message || 'ลบไม่สำเร็จ');
    }
  };

  // Pair CRUD
  const handleSavePair = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...pairForm,
        tags: pairForm.tags.split(',').map((t) => t.trim()),
      };
      if (editingPair) {
        await ApiClient.updateColorPair(editingPair.id, payload);
        onNotify(`อัปเดตคู่สี "${pairForm.name}" สำเร็จ`);
      } else {
        await ApiClient.createColorPair(payload);
        onNotify(`เพิ่มคู่สี "${pairForm.name}" สำเร็จ`);
      }
      setPairModalOpen(false);
      setEditingPair(null);
      const res = await ApiClient.getColorPairs();
      setPairs(res);
    } catch (err: any) {
      onNotify(err.message || 'บันทึกคู่สีไม่สำเร็จ');
    }
  };

  const handleDeletePair = async (id: string, name: string) => {
    if (!window.confirm(`ยืนยันการลบคู่สี "${name}" หรือไม่?`)) return;
    try {
      await ApiClient.deleteColorPair(id);
      onNotify(`ลบคู่สี "${name}" แล้ว`);
      setPairs(pairs.filter((p) => p.id !== id));
    } catch (err: any) {
      onNotify(err.message || 'ลบคู่สีไม่สำเร็จ');
    }
  };

  // Member Status Toggle
  const handleToggleMemberStatus = async (user: any) => {
    const nextStatus = user.status === 'active' ? 'suspended' : 'active';
    try {
      await ApiClient.updateMemberStatus(user.id, nextStatus);
      setMembers(
        members.map((m) => (m.id === user.id ? { ...m, status: nextStatus } : m))
      );
      onNotify(`เปลี่ยนสถานะของ ${user.name} เป็น ${nextStatus} แล้ว`);
    } catch (err: any) {
      onNotify(err.message || 'เปลี่ยนสถานะไม่สำเร็จ');
    }
  };

  // Settings Save
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await ApiClient.updateAdminSettings(settings);
      onNotify('บันทึกการตั้งค่าระบบเรียบร้อยแล้ว');
    } catch (err: any) {
      onNotify(err.message || 'บันทึกการตั้งค่าไม่สำเร็จ');
    }
  };

  const filteredColors = colors.filter((c) =>
    (c.name || '').toLowerCase().includes(colorSearch.toLowerCase()) ||
    (c.english_name || '').toLowerCase().includes(colorSearch.toLowerCase()) ||
    (c.hex || '').toLowerCase().includes(colorSearch.toLowerCase())
  );

  const filteredMembers = members.filter((m) =>
    (m.name || '').toLowerCase().includes(memberSearch.toLowerCase()) ||
    (m.email || '').toLowerCase().includes(memberSearch.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-purple-100">
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigateTab('home')}
            className="p-2 rounded-xl bg-slate-100 hover:bg-purple-100 text-slate-600 hover:text-purple-700 transition-colors cursor-pointer"
            title="กลับสู่หน้าบ้าน"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl">👑</span>
              <h1 className="text-xl sm:text-2xl font-black text-slate-800">
                ระบบจัดการหลังบ้าน (BraceMood Admin)
              </h1>
            </div>
            <p className="text-xs text-slate-500">
              จัดการข้อมูลสียาง คู่สี สมาชิก สถิติ และการซิงค์ข้อมูลกับ GitHub
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold rounded-xl flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Database Online</span>
          </span>
          <button
            onClick={loadDashboardData}
            className="p-2 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-xl text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
            title="รีเฟรชข้อมูล"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Sub-tab Navigation */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-6 border-b border-slate-100">
        {[
          { id: 'dashboard' as AdminSubTab, label: 'แดชบอร์ดภาพรวม', icon: LayoutDashboard },
          { id: 'colors' as AdminSubTab, label: `จัดการสี (${colors.length})`, icon: Palette },
          { id: 'pairs' as AdminSubTab, label: `คู่สีแนะนำ (${pairs.length})`, icon: Layers },
          { id: 'members' as AdminSubTab, label: `จัดการสมาชิก (${members.length})`, icon: Users },
          { id: 'github' as AdminSubTab, label: 'เชื่อมต่อ GitHub', icon: GitBranch },
          { id: 'settings' as AdminSubTab, label: 'ตั้งค่าระบบ', icon: Settings },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              className={`px-3.5 py-2 rounded-2xl text-xs font-bold flex items-center gap-2 shrink-0 transition-all cursor-pointer ${
                isActive
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-200 scale-[1.02]'
                  : 'bg-white text-slate-600 hover:bg-purple-50 hover:text-purple-600 border border-slate-200/70'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ==================================================== */}
      {/* 1. DASHBOARD OVERVIEW TAB (METRICS & RECHARTS) */}
      {/* ==================================================== */}
      {activeSubTab === 'dashboard' && stats && (
        <div className="space-y-6 animate-in fade-in">
          {/* Key Metric Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-6 gap-3">
            <div className="bg-white p-4 rounded-3xl border border-purple-100 shadow-xs">
              <div className="text-xs font-bold text-slate-400">สมาชิกทั้งหมด</div>
              <div className="text-2xl font-black text-purple-600 mt-1">
                {stats.metrics?.totalMembers || 0}
              </div>
              <div className="text-[10px] text-emerald-600 font-semibold mt-1">↑ +15% เดือนนี้</div>
            </div>

            <div className="bg-white p-4 rounded-3xl border border-pink-100 shadow-xs">
              <div className="text-xs font-bold text-slate-400">จำนวนการสุ่มสี</div>
              <div className="text-2xl font-black text-pink-600 mt-1">
                {stats.metrics?.totalRandomSpins || 0}
              </div>
              <div className="text-[10px] text-pink-500 font-semibold mt-1">Spins สะสม</div>
            </div>

            <div className="bg-white p-4 rounded-3xl border border-rose-100 shadow-xs">
              <div className="text-xs font-bold text-slate-400">สีที่ผู้ใช้บันทึก</div>
              <div className="text-2xl font-black text-rose-500 mt-1">
                {stats.metrics?.totalFavorites || 0}
              </div>
              <div className="text-[10px] text-rose-400 font-semibold mt-1">Favorites</div>
            </div>

            <div className="bg-white p-4 rounded-3xl border border-blue-100 shadow-xs">
              <div className="text-xs font-bold text-slate-400">คลังเฉดสีทั้งหมด</div>
              <div className="text-2xl font-black text-blue-600 mt-1">
                {stats.metrics?.totalColors || colors.length}
              </div>
              <div className="text-[10px] text-blue-400 font-semibold mt-1">Colors Active</div>
            </div>

            <div className="bg-white p-4 rounded-3xl border border-indigo-100 shadow-xs">
              <div className="text-xs font-bold text-slate-400">คู่สียอดนิยม</div>
              <div className="text-2xl font-black text-indigo-600 mt-1">
                {stats.metrics?.popularPairsCount || pairs.length}
              </div>
              <div className="text-[10px] text-indigo-400 font-semibold mt-1">Curated Pairs</div>
            </div>

            <div className="bg-white p-4 rounded-3xl border border-amber-100 shadow-xs">
              <div className="text-xs font-bold text-slate-400">เหรียญ Badge ที่แจก</div>
              <div className="text-2xl font-black text-amber-500 mt-1">
                {stats.metrics?.completedChallenges || 0}
              </div>
              <div className="text-[10px] text-amber-400 font-semibold mt-1">Badges Earned</div>
            </div>
          </div>

          {/* Recharts Visualizations */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Chart 1: Monthly Usage Growth */}
            <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-extrabold text-slate-800">
                    📈 สถิติการใช้งานรายเดือน (Monthly Activity)
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    เปรียบเทียบการสุ่มสีและจำนวนสมาชิกใหม่
                  </p>
                </div>
                <span className="text-xs px-2.5 py-1 bg-purple-50 text-purple-700 font-bold rounded-xl">
                  Recharts
                </span>
              </div>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={stats.charts?.monthlyActivity || []}>
                    <defs>
                      <linearGradient id="colorSpins" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#EC4899" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#EC4899" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorMembers" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
                    <YAxis stroke="#94a3b8" fontSize={11} />
                    <Tooltip
                      contentStyle={{
                        borderRadius: '16px',
                        border: '1px solid #f1f5f9',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                        fontSize: '12px',
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="spins"
                      name="การสุ่มสี (ครั้ง)"
                      stroke="#EC4899"
                      fillOpacity={1}
                      fill="url(#colorSpins)"
                    />
                    <Area
                      type="monotone"
                      dataKey="members"
                      name="สมาชิกใหม่"
                      stroke="#8B5CF6"
                      fillOpacity={1}
                      fill="url(#colorMembers)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 2: Color Tone Distribution */}
            <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-extrabold text-slate-800">
                    🎨 การกระจายตัวของโทนสี (Tone Distribution)
                  </h3>
                  <p className="text-[11px] text-slate-400">สัดส่วนหมวดหมู่สียางในระบบ</p>
                </div>
                <span className="text-xs px-2.5 py-1 bg-pink-50 text-pink-700 font-bold rounded-xl">
                  {colors.length} เฉดสี
                </span>
              </div>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats.charts?.toneDistribution || []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} />
                    <YAxis stroke="#94a3b8" fontSize={11} />
                    <Tooltip
                      contentStyle={{
                        borderRadius: '16px',
                        border: '1px solid #f1f5f9',
                        fontSize: '12px',
                      }}
                    />
                    <Bar dataKey="count" name="จำนวนสี" fill="#8B5CF6" radius={[8, 8, 0, 0]}>
                      {(stats.charts?.toneDistribution || []).map((_: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* 2. COLORS MANAGEMENT TAB */}
      {/* ==================================================== */}
      {activeSubTab === 'colors' && (
        <div className="space-y-4 animate-in fade-in">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-4 rounded-3xl border border-slate-100 shadow-xs">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="ค้นหาชื่อสี, ภาษาอังกฤษ หรือ HEX..."
                value={colorSearch}
                onChange={(e) => setColorSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-purple-500"
              />
            </div>
            <button
              onClick={() => {
                setEditingColor(null);
                setColorForm({
                  name: '',
                  english_name: '',
                  hex: '#FF69B4',
                  tone: 'pastel',
                  mood: 'cheerful',
                  style: 'cute',
                  description: '',
                });
                setColorModalOpen(true);
              }}
              className="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>เพิ่มสียางใหม่</span>
            </button>
          </div>

          <div className="bg-white rounded-3xl border border-slate-100 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-100">
                  <tr>
                    <th className="p-3.5">ตัวอย่างสี</th>
                    <th className="p-3.5">ชื่อภาษาไทย</th>
                    <th className="p-3.5">ชื่อภาษาอังกฤษ</th>
                    <th className="p-3.5">รหัส HEX</th>
                    <th className="p-3.5">โทนสี (Tone)</th>
                    <th className="p-3.5">คำอธิบาย</th>
                    <th className="p-3.5 text-right">จัดการ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredColors.map((color) => (
                    <tr key={color.id} className="hover:bg-purple-50/30 transition-colors">
                      <td className="p-3.5">
                        <div className="flex items-center gap-2">
                          <span
                            className="w-7 h-7 rounded-xl border border-black/10 shadow-xs shrink-0"
                            style={{ backgroundColor: color.hex }}
                          />
                        </div>
                      </td>
                      <td className="p-3.5 font-bold text-slate-800">{color.name}</td>
                      <td className="p-3.5 text-slate-600">{color.english_name}</td>
                      <td className="p-3.5 font-mono text-purple-700">{color.hex}</td>
                      <td className="p-3.5">
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md font-semibold text-[10px] capitalize">
                          {color.tone}
                        </span>
                      </td>
                      <td className="p-3.5 text-slate-500 max-w-xs truncate">
                        {color.description}
                      </td>
                      <td className="p-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => {
                              setEditingColor(color);
                              setColorForm({
                                name: color.name,
                                english_name: color.english_name || '',
                                hex: color.hex,
                                tone: color.tone || 'pastel',
                                mood: color.mood?.[0] || 'cheerful',
                                style: color.style?.[0] || 'cute',
                                description: color.description || '',
                              });
                              setColorModalOpen(true);
                            }}
                            className="p-1.5 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors cursor-pointer"
                            title="แก้ไข"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteColor(color.id, color.name)}
                            className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                            title="ลบ"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* 3. PAIRS MANAGEMENT TAB */}
      {/* ==================================================== */}
      {activeSubTab === 'pairs' && (
        <div className="space-y-4 animate-in fade-in">
          <div className="flex justify-between items-center bg-white p-4 rounded-3xl border border-slate-100 shadow-xs">
            <div>
              <h3 className="text-sm font-bold text-slate-800">คู่สียางแนะนำ (Curated Pairs)</h3>
              <p className="text-xs text-slate-400">คู่สีที่ผ่านการแมตช์และให้คะแนนความเข้ากัน</p>
            </div>
            <button
              onClick={() => {
                setEditingPair(null);
                setPairForm({
                  name: '',
                  color_1: '#FF69B4',
                  color_2: '#87CEEB',
                  compatibility_score: 95,
                  popularity: 90,
                  tags: 'หวานละมุน, ยอดนิยม',
                  description: '',
                });
                setPairModalOpen(true);
              }}
              className="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>เพิ่มคู่สีใหม่</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {pairs.map((pair) => (
              <div
                key={pair.id}
                className="bg-white p-4 rounded-3xl border border-slate-100 shadow-xs hover:border-purple-200 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5">
                      <span
                        className="w-6 h-6 rounded-full border border-black/10 shadow-xs"
                        style={{ backgroundColor: pair.color_1 }}
                      />
                      <span
                        className="w-6 h-6 rounded-full border border-black/10 shadow-xs"
                        style={{ backgroundColor: pair.color_2 }}
                      />
                      {pair.color_3 && (
                        <span
                          className="w-6 h-6 rounded-full border border-black/10 shadow-xs"
                          style={{ backgroundColor: pair.color_3 }}
                        />
                      )}
                    </div>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                      คะแนน {pair.compatibility_score || 95}%
                    </span>
                  </div>

                  <h4 className="font-extrabold text-sm text-slate-800">{pair.name}</h4>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                    {pair.description || 'คู่สีจัดฟันยอดนิยม'}
                  </p>

                  <div className="flex flex-wrap gap-1 mt-2.5">
                    {pair.tags?.map((tag: string, i: number) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 bg-purple-50 text-purple-700 rounded-md text-[10px] font-medium"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 mt-4 pt-3 border-t border-slate-100">
                  <button
                    onClick={() => {
                      setEditingPair(pair);
                      setPairForm({
                        name: pair.name,
                        color_1: pair.color_1,
                        color_2: pair.color_2,
                        compatibility_score: pair.compatibility_score,
                        popularity: pair.popularity,
                        tags: Array.isArray(pair.tags) ? pair.tags.join(', ') : '',
                        description: pair.description || '',
                      });
                      setPairModalOpen(true);
                    }}
                    className="p-1.5 text-purple-600 hover:bg-purple-50 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeletePair(pair.id, pair.name)}
                    className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* 4. MEMBERS MANAGEMENT TAB */}
      {/* ==================================================== */}
      {activeSubTab === 'members' && (
        <div className="space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between bg-white p-4 rounded-3xl border border-slate-100 shadow-xs">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="ค้นหาชื่อ หรืออีเมลสมาชิก..."
                value={memberSearch}
                onChange={(e) => setMemberSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-purple-500"
              />
            </div>
            <div className="text-xs font-bold text-slate-500">
              พบสมาชิกทั้งหมด {filteredMembers.length} คน
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-100 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-100">
                  <tr>
                    <th className="p-3.5">ผู้ใช้</th>
                    <th className="p-3.5">อีเมล</th>
                    <th className="p-3.5">สไตล์ที่ชอบ</th>
                    <th className="p-3.5">บทบาท (Role)</th>
                    <th className="p-3.5">สถานะ</th>
                    <th className="p-3.5">วันที่เข้าร่วม</th>
                    <th className="p-3.5 text-right">ดำเนินการ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredMembers.map((member) => (
                    <tr key={member.id} className="hover:bg-purple-50/30 transition-colors">
                      <td className="p-3.5">
                        <div className="flex items-center gap-2.5">
                          <span className="w-8 h-8 rounded-xl bg-purple-100 flex items-center justify-center text-sm shadow-inner">
                            {member.profile || '😊'}
                          </span>
                          <span className="font-bold text-slate-800">{member.name}</span>
                        </div>
                      </td>
                      <td className="p-3.5 text-slate-600 font-mono text-[11px]">{member.email}</td>
                      <td className="p-3.5 text-slate-600">{member.style || '-'}</td>
                      <td className="p-3.5">
                        <span
                          className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${
                            member.role === 'admin'
                              ? 'bg-purple-100 text-purple-700'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {member.role}
                        </span>
                      </td>
                      <td className="p-3.5">
                        <span
                          className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${
                            member.status === 'active'
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-rose-100 text-rose-700'
                          }`}
                        >
                          {member.status === 'active' ? 'ปกติ (Active)' : 'ระงับการใช้งาน'}
                        </span>
                      </td>
                      <td className="p-3.5 text-slate-400 text-[11px]">
                        {new Date(member.created_at).toLocaleDateString('th-TH')}
                      </td>
                      <td className="p-3.5 text-right">
                        {member.role !== 'admin' && (
                          <button
                            onClick={() => handleToggleMemberStatus(member)}
                            className={`px-3 py-1 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                              member.status === 'active'
                                ? 'bg-rose-50 text-rose-600 hover:bg-rose-100'
                                : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                            }`}
                          >
                            {member.status === 'active' ? 'ระงับสิทธิ์' : 'เปิดใช้งาน'}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* 5. GITHUB DATA INTEGRATION & SYNC TAB */}
      {/* ==================================================== */}
      {activeSubTab === 'github' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xs">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center">
                <GitBranch className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-extrabold text-slate-800">
                  ระบบเชื่อมต่อข้อมูลจาก GitHub Repository
                </h2>
                <p className="text-xs text-slate-500">
                  ซิงค์ข้อมูลสี, คู่สีแนะนำ, Mood, Style และ Challenges จากไฟล์ JSON บน GitHub
                </p>
              </div>
            </div>

            {/* Sync Status Banner */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <div className="text-xs font-bold text-slate-700">สถานะการซิงค์ปัจจุบัน:</div>
                <div className="text-xs text-slate-600 mt-0.5">
                  {settings.github_sync_status || 'พร้อมใช้งาน (Fallback & Live Sync Active)'}
                </div>
                <div className="text-[10px] text-slate-400 mt-1">
                  Repository URL: {settings.github_raw_url || 'Default Bundled Repository'}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleFetchGitHub}
                  disabled={githubLoading}
                  className="px-3 py-2 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${githubLoading ? 'animate-spin' : ''}`} />
                  <span>ทดสอบเชื่อมต่อ</span>
                </button>
                <button
                  onClick={handleTriggerGitHubSync}
                  disabled={githubLoading}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${githubLoading ? 'animate-spin' : ''}`} />
                  <span>สั่ง Sync ข้อมูลเดี๋ยวนี้</span>
                </button>
              </div>
            </div>

            {/* Architecture Details Box */}
            <div className="p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100 text-xs text-indigo-900 space-y-1.5">
              <div className="font-bold flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-indigo-600" />
                <span>คุณสมบัติความปลอดภัยและการกู้คืนข้อมูล (Fault Tolerance):</span>
              </div>
              <ul className="list-disc list-inside text-indigo-800 space-y-1 pl-2">
                <li>มีการตรวจสอบ Schema และชนิดข้อมูลก่อนนำเข้าฐานข้อมูลเสมอ</li>
                <li>กรณี GitHub ล่ม หรือ Timeout (เกิน 4 วินาที) ระบบจะ Fallback ใช้ Local Repository Bundle ทันทีโดยไม่ทำให้เว็บล่ม</li>
                <li>ข้อมูลสำคัญและบัญชีสมาชิก (Member Data) ถูกแยกเก็บใน Online Database ปลอดภัย ไม่ผ่าน GitHub</li>
              </ul>
            </div>

            {/* JSON Inspector Preview */}
            {githubData && (
              <div className="mt-6 pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-700">
                    ข้อมูล Raw JSON ที่ตรวจพบ ({githubData.source}):
                  </span>
                  <span className="text-[10px] px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded-md">
                    Verified Schema ✓
                  </span>
                </div>
                <pre className="p-4 bg-slate-900 text-emerald-400 font-mono text-[11px] rounded-2xl max-h-64 overflow-y-auto">
                  {JSON.stringify(githubData.data, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* 6. SYSTEM SETTINGS TAB */}
      {/* ==================================================== */}
      {activeSubTab === 'settings' && (
        <div className="max-w-2xl bg-white p-6 rounded-3xl border border-slate-100 shadow-xs animate-in fade-in">
          <h2 className="text-base font-extrabold text-slate-800 mb-4 pb-2 border-b border-slate-100">
            การตั้งค่าระบบ (General Settings)
          </h2>

          <form onSubmit={handleSaveSettings} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">ชื่อเว็บไซต์ (Website Name)</label>
              <input
                type="text"
                value={settings.website_name || 'BraceMood'}
                onChange={(e) => setSettings({ ...settings, website_name: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">คำขวัญ (Slogan)</label>
              <input
                type="text"
                value={settings.website_slogan || 'ค้นหาสียางที่ใช่ ในสไตล์ของคุณ'}
                onChange={(e) => setSettings({ ...settings, website_slogan: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">คำอธิบายเว็บไซต์ (Description)</label>
              <textarea
                rows={2}
                value={settings.website_description || ''}
                onChange={(e) => setSettings({ ...settings, website_description: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">GitHub Raw Content Data URL</label>
              <input
                type="text"
                value={settings.github_raw_url || ''}
                onChange={(e) => setSettings({ ...settings, github_raw_url: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-[11px] focus:outline-none focus:border-purple-500"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold shadow-xs cursor-pointer transition-colors"
              >
                บันทึกการตั้งค่า
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ==================================================== */}
      {/* COLOR MODAL (ADD / EDIT) */}
      {/* ==================================================== */}
      {colorModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-purple-100 relative">
            <button
              onClick={() => setColorModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-base font-extrabold text-slate-800 mb-4">
              {editingColor ? 'แก้ไขข้อมูลสียาง' : 'เพิ่มสียางจัดฟันใหม่'}
            </h3>

            <form onSubmit={handleSaveColor} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">ชื่อสีภาษาไทย</label>
                <input
                  type="text"
                  required
                  placeholder="เช่น ชมพูนมพาสเทล"
                  value={colorForm.name}
                  onChange={(e) => setColorForm({ ...colorForm, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">ชื่อภาษาอังกฤษ</label>
                <input
                  type="text"
                  placeholder="เช่น Baby Pink"
                  value={colorForm.english_name}
                  onChange={(e) => setColorForm({ ...colorForm, english_name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">รหัส HEX</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={colorForm.hex}
                      onChange={(e) => setColorForm({ ...colorForm, hex: e.target.value })}
                      className="w-8 h-8 rounded-lg cursor-pointer border border-slate-200"
                    />
                    <input
                      type="text"
                      required
                      value={colorForm.hex}
                      onChange={(e) => setColorForm({ ...colorForm, hex: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-[11px]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">โทนสี (Tone)</label>
                  <select
                    value={colorForm.tone}
                    onChange={(e) => setColorForm({ ...colorForm, tone: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer"
                  >
                    <option value="pastel">Pastel (พาสเทล)</option>
                    <option value="vibrant">Vibrant (สดใส)</option>
                    <option value="deep">Deep (เข้ม ขับฟันขาว)</option>
                    <option value="metallic">Metallic (เมทัลลิก)</option>
                    <option value="neon">Neon (นีออน)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">คำอธิบายสั้นๆ</label>
                <textarea
                  rows={2}
                  placeholder="ช่วยขับรอยยิ้มให้อ่อนหวาน น่ารักสดใส"
                  value={colorForm.description}
                  onChange={(e) => setColorForm({ ...colorForm, description: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setColorModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 rounded-xl font-bold text-slate-600 cursor-pointer"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold cursor-pointer"
                >
                  บันทึก
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* PAIR MODAL (ADD / EDIT) */}
      {/* ==================================================== */}
      {pairModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-purple-100 relative">
            <button
              onClick={() => setPairModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-base font-extrabold text-slate-800 mb-4">
              {editingPair ? 'แก้ไขคู่สีแนะนำ' : 'เพิ่มคู่สีแนะนำใหม่'}
            </h3>

            <form onSubmit={handleSavePair} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">ชื่อคู่สี</label>
                <input
                  type="text"
                  required
                  placeholder="เช่น Pink + Blue (คอตตอนแคนดี้)"
                  value={pairForm.name}
                  onChange={(e) => setPairForm({ ...pairForm, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">สีที่ 1 (HEX)</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={pairForm.color_1}
                      onChange={(e) => setPairForm({ ...pairForm, color_1: e.target.value })}
                      className="w-8 h-8 rounded-lg cursor-pointer border border-slate-200"
                    />
                    <input
                      type="text"
                      required
                      value={pairForm.color_1}
                      onChange={(e) => setPairForm({ ...pairForm, color_1: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-[11px]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">สีที่ 2 (HEX)</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={pairForm.color_2}
                      onChange={(e) => setPairForm({ ...pairForm, color_2: e.target.value })}
                      className="w-8 h-8 rounded-lg cursor-pointer border border-slate-200"
                    />
                    <input
                      type="text"
                      required
                      value={pairForm.color_2}
                      onChange={(e) => setPairForm({ ...pairForm, color_2: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-[11px]"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  แท็ก (คั่นด้วยจุลภาค)
                </label>
                <input
                  type="text"
                  placeholder="หวานละมุน, ขับฟันขาว, ยอดนิยม"
                  value={pairForm.tags}
                  onChange={(e) => setPairForm({ ...pairForm, tags: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">คำอธิบายคู่สี</label>
                <textarea
                  rows={2}
                  placeholder="ความเข้ากันและฟีลลิ่งของคู่สีนี้"
                  value={pairForm.description}
                  onChange={(e) => setPairForm({ ...pairForm, description: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setPairModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 rounded-xl font-bold text-slate-600 cursor-pointer"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold cursor-pointer"
                >
                  บันทึก
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
