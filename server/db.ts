import fs from 'fs';
import path from 'path';

// Schema types matching exact specifications
export interface UserRecord {
  id: string;
  name: string;
  email: string;
  passwordHash: string; // SHA-256 or plaintext for demo simplicity
  profile: string; // Avatar URL or emoji identifier
  role: 'member' | 'admin';
  status: 'active' | 'suspended';
  style?: string;
  created_at: string;
}

export interface ColorRecord {
  id: string;
  name: string;
  english_name: string;
  hex: string;
  tone: 'pastel' | 'vibrant' | 'deep' | 'metallic' | 'neon';
  mood: string[]; // e.g. ['cheerful', 'sweet', 'calm']
  style: string[]; // e.g. ['cute', 'minimal', 'cool']
  description: string;
  popular_rank?: number;
}

export interface ColorPairRecord {
  id: string;
  name: string;
  color_1: string; // hex
  color_2: string; // hex
  color_3?: string; // hex (optional)
  compatibility_score: number; // 0-100 or 1-10
  popularity: number; // 1-100
  tags?: string[];
  description?: string;
}

export interface FavoriteRecord {
  id: string;
  user_id: string;
  color_pair_id?: string;
  name: string;
  colors: { id?: string; nameTh: string; hex: string }[];
  pattern_mode?: string;
  upper_colors?: string[];
  lower_colors?: string[];
  created_at: string;
}

export interface RandomHistoryRecord {
  id: string;
  user_id: string;
  color_pair_id?: string;
  name: string;
  colors: { id?: string; nameTh: string; hex: string }[];
  pattern_mode?: string;
  score?: { harmony: number; vibrancy: number; cuteness: number };
  created_at: string;
}

export interface ChallengeRecord {
  id: string;
  title: string;
  description: string;
  requirement: string;
  reward: string;
  badge_id: string;
  target_count: number;
  type: 'random' | 'favorite' | 'quiz' | 'studio' | 'share';
}

export interface UserBadgeRecord {
  id: string;
  user_id: string;
  badge_id: string;
  badge_name: string;
  badge_icon: string;
  earned_at: string;
}

export interface SettingRecord {
  id: string;
  setting_name: string;
  setting_value: string;
}

export interface DatabaseSchema {
  users: UserRecord[];
  colors: ColorRecord[];
  color_pairs: ColorPairRecord[];
  favorites: FavoriteRecord[];
  random_history: RandomHistoryRecord[];
  challenges: ChallengeRecord[];
  user_badges: UserBadgeRecord[];
  settings: SettingRecord[];
}

const DB_FILE_PATH = path.join(process.cwd(), 'database', 'bracemood_db.json');

// Ensure database directory exists
function ensureDbDir() {
  const dir = path.dirname(DB_FILE_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

// Initial Seed Data
export const INITIAL_SEEDS: DatabaseSchema = {
  users: [
    {
      id: 'usr-admin-01',
      name: 'Admin BraceMood',
      email: 'admin@bracemood.com',
      passwordHash: 'admin123456',
      profile: '👑',
      role: 'admin',
      status: 'active',
      style: 'Minimal Chic',
      created_at: new Date(Date.now() - 30 * 86400000).toISOString(),
    },
    {
      id: 'usr-member-01',
      name: 'น้องมายด์ ยิ้มสวย',
      email: 'member@bracemood.com',
      passwordHash: 'member123456',
      profile: '🌸',
      role: 'member',
      status: 'active',
      style: 'Sweet Pastel',
      created_at: new Date(Date.now() - 7 * 86400000).toISOString(),
    },
    {
      id: 'usr-member-02',
      name: 'กัปตัน ฟันเหล็ก',
      email: 'captain@example.com',
      passwordHash: 'pass123456',
      profile: '⚡',
      role: 'member',
      status: 'active',
      style: 'Cool Dark Street',
      created_at: new Date(Date.now() - 3 * 86400000).toISOString(),
    },
    {
      id: 'usr-member-03',
      name: 'พลอยใส ไอดอล',
      email: 'ploy@example.com',
      passwordHash: 'pass123456',
      profile: '✨',
      role: 'member',
      status: 'active',
      style: 'Vibrant Pop',
      created_at: new Date(Date.now() - 1 * 86400000).toISOString(),
    },
  ],
  colors: [
    {
      id: 'baby-pink',
      name: 'ชมพูพาสเทล',
      english_name: 'Baby Pink',
      hex: '#FFB7D5',
      tone: 'pastel',
      mood: ['cheerful', 'sweet', 'cute'],
      style: ['cute', 'sweet', 'minimal'],
      description: 'ชมพูนมละมุน ยอดฮิตตลอดกาล ให้ลุคหวานน่ารักฟรุ้งฟริ้ง',
      popular_rank: 1,
    },
    {
      id: 'bubblegum-pink',
      name: 'ชมพูบับเบิ้ลกัม',
      english_name: 'Bubblegum Pink',
      hex: '#FF69B4',
      tone: 'vibrant',
      mood: ['cheerful', 'cute'],
      style: ['cute', 'bright'],
      description: 'ชมพูสดใส ชวนให้นึกถึงลูกอม มีเสน่ห์สดใสสุดๆ',
      popular_rank: 2,
    },
    {
      id: 'lavender',
      name: 'ม่วงลาเวนเดอร์',
      english_name: 'Lavender Bliss',
      hex: '#C8A2C8',
      tone: 'pastel',
      mood: ['sweet', 'calm', 'mysterious'],
      style: ['sweet', 'minimal', 'cute'],
      description: 'ม่วงอ่อนนุ่มนวล ชวนฝัน ช่วยขับรอยยิ้มให้อ่อนหวาน',
      popular_rank: 3,
    },
    {
      id: 'sky-blue',
      name: 'ฟ้าพาสเทล',
      english_name: 'Sky Blue',
      hex: '#87CEEB',
      tone: 'pastel',
      mood: ['cheerful', 'calm', 'cute'],
      style: ['cute', 'minimal', 'bright'],
      description: 'ฟ้าสดใสเหมือนท้องฟ้าฤดูร้อน ฟันดูขาวสะอาดตา',
      popular_rank: 4,
    },
    {
      id: 'mint-green',
      name: 'เขียวมิ้นต์',
      english_name: 'Fresh Mint',
      hex: '#98FF98',
      tone: 'pastel',
      mood: ['calm', 'cheerful', 'sweet'],
      style: ['minimal', 'cute', 'sweet'],
      description: 'เขียวสดชื่น สบายตา ยอดฮิตสายมินิมอลและธรรมชาติ',
      popular_rank: 5,
    },
    {
      id: 'navy-blue',
      name: 'น้ำเงินเข้ม',
      english_name: 'Midnight Navy',
      hex: '#1E3A8A',
      tone: 'deep',
      mood: ['cool', 'mysterious', 'standout'],
      style: ['cool', 'dark', 'minimal'],
      description: 'สียอดฮิตตลอดกาล ขับผิวหน้าและฟันให้ดูขาวสว่างขึ้นอย่างเห็นได้ชัด',
      popular_rank: 6,
    },
    {
      id: 'lilac',
      name: 'ม่วงไลแลค',
      english_name: 'Lilac Dream',
      hex: '#DDA0DD',
      tone: 'pastel',
      mood: ['sweet', 'calm', 'cute'],
      style: ['sweet', 'cute'],
      description: 'ม่วงดอกไลแลค อบอุ่นละมุนตา เหมาะกับคนชอบโทนหวานไม่ฉูดฉาด',
      popular_rank: 7,
    },
    {
      id: 'emerald',
      name: 'เขียวมรกต',
      english_name: 'Emerald Green',
      hex: '#059669',
      tone: 'deep',
      mood: ['cool', 'standout'],
      style: ['cool', 'dark'],
      description: 'เขียวหรูหรา ลึกลับ มีระดับ ไม่เปื้อนง่าย',
      popular_rank: 8,
    },
    {
      id: 'ruby-red',
      name: 'แดงทับทิม',
      english_name: 'Ruby Wine',
      hex: '#991B1B',
      tone: 'deep',
      mood: ['cool', 'standout', 'cheerful'],
      style: ['cool', 'dark'],
      description: 'แดงเข้มอมเลือดหมู เซ็กซี่ มั่นใจ ฟันดูขาวสุดพลัง',
      popular_rank: 9,
    },
    {
      id: 'lemon-yellow',
      name: 'เหลืองเลมอน',
      english_name: 'Lemon Sunshine',
      hex: '#FDE047',
      tone: 'vibrant',
      mood: ['cheerful', 'standout'],
      style: ['bright', 'cute'],
      description: 'เหลืองสดใสเปี่ยมพลัง ชวนยิ้มกว้างทุกสถานการณ์',
      popular_rank: 10,
    },
    {
      id: 'peach',
      name: 'ส้มพีช',
      english_name: 'Sweet Peach',
      hex: '#FFDAB9',
      tone: 'pastel',
      mood: ['sweet', 'cheerful', 'calm'],
      style: ['sweet', 'cute'],
      description: 'ส้มอมชมพูละมุน ฟีลเกาหลี หน้าดูสดใสอ่อนวัย',
      popular_rank: 11,
    },
    {
      id: 'silver-gray',
      name: 'เทาเงิน',
      english_name: 'Silver Gray',
      hex: '#94A3B8',
      tone: 'metallic',
      mood: ['calm', 'cool'],
      style: ['minimal', 'cool'],
      description: 'กลมกลืนกับแบร็กเก็ตโลหะ ลุคเรียบหรู ดูแลง่าย',
      popular_rank: 12,
    },
  ],
  color_pairs: [
    {
      id: 'pair-cotton-candy',
      name: 'Pink + Blue (คอตตอนแคนดี้)',
      color_1: '#FF69B4',
      color_2: '#87CEEB',
      compatibility_score: 98,
      popularity: 99,
      tags: ['หวานละมุน', 'สดใสป๊อป', 'ยอดนิยมอันดับ 1'],
      description: 'คู่สีระดับตำนานของวงการจัดฟัน หวานซ่อนเปรี้ยวเหมือนสายไหมในสวนสนุก',
    },
    {
      id: 'pair-twilight',
      name: 'Purple + Blue (ทไวไลท์ดรีม)',
      color_1: '#C8A2C8',
      color_2: '#87CEEB',
      compatibility_score: 95,
      popularity: 92,
      tags: ['ชวนฝัน', 'ขับฟันขาว', 'สบายตา'],
      description: 'โทนสีท้องฟ้าพลบค่ำ ละมุนใจ มีเสน่ห์ลึกลับกำลังดี',
    },
    {
      id: 'pair-mint-cream',
      name: 'Mint + White (คลีนมินต์เฟรช)',
      color_1: '#98FF98',
      color_2: '#FFFFFF',
      compatibility_score: 92,
      popularity: 88,
      tags: ['มินิมอล', 'สบายตา', 'สะอาดสดชื่น'],
      description: 'ความสดชื่นคลีนๆ สไตล์มินิมอล รอยยิ้มดูสะอาดและเป็นมิตร',
    },
    {
      id: 'pair-vampire',
      name: 'Red + Black (ดาร์กสตรีทชิค)',
      color_1: '#991B1B',
      color_2: '#1E293B',
      compatibility_score: 94,
      popularity: 90,
      tags: ['เท่สตรีท', 'ขับฟันขาวสุดๆ', 'ทรงพลัง'],
      description: 'คู่สีสุดเท่ ขับฟันขาวกระจ่างตา มีความมั่นใจสูง เหมาะกับสายสตรีท',
    },
    {
      id: 'pair-sunny-daisy',
      name: 'Yellow + Pink (ซันนี่เดซี่)',
      color_1: '#FDE047',
      color_2: '#FFB7D5',
      compatibility_score: 91,
      popularity: 85,
      tags: ['สดใส', 'น่ารักมาก', 'พลังบวก'],
      description: 'สดใสเหมือนดอกเดซี่กลางแดดอ่อนๆ ยิ้มทีโลกสว่างวาบ',
    },
  ],
  favorites: [
    {
      id: 'fav-demo-01',
      user_id: 'usr-member-01',
      color_pair_id: 'pair-cotton-candy',
      name: 'Pink + Blue (คอตตอนแคนดี้)',
      colors: [
        { id: 'bubblegum-pink', nameTh: 'ชมพูบับเบิ้ลกัม', hex: '#FF69B4' },
        { id: 'sky-blue', nameTh: 'ฟ้าพาสเทล', hex: '#87CEEB' },
      ],
      pattern_mode: 'alternate',
      created_at: new Date(Date.now() - 48 * 3600000).toISOString(),
    },
    {
      id: 'fav-demo-02',
      user_id: 'usr-member-01',
      color_pair_id: 'pair-twilight',
      name: 'Purple + Blue (ทไวไลท์ดรีม)',
      colors: [
        { id: 'lavender', nameTh: 'ม่วงลาเวนเดอร์', hex: '#C8A2C8' },
        { id: 'sky-blue', nameTh: 'ฟ้าพาสเทล', hex: '#87CEEB' },
      ],
      pattern_mode: 'duo',
      created_at: new Date(Date.now() - 24 * 3600000).toISOString(),
    },
  ],
  random_history: [
    {
      id: 'hist-demo-01',
      user_id: 'usr-member-01',
      name: 'ชมพูพาสเทล + ม่วงลาเวนเดอร์',
      colors: [
        { id: 'baby-pink', nameTh: 'ชมพูพาสเทล', hex: '#FFB7D5' },
        { id: 'lavender', nameTh: 'ม่วงลาเวนเดอร์', hex: '#C8A2C8' },
      ],
      pattern_mode: 'duo',
      score: { harmony: 96, vibrancy: 85, cuteness: 98 },
      created_at: new Date(Date.now() - 12 * 3600000).toISOString(),
    },
    {
      id: 'hist-demo-02',
      user_id: 'usr-member-01',
      name: 'เขียวมิ้นต์ + ฟ้าพาสเทล',
      colors: [
        { id: 'mint-green', nameTh: 'เขียวมิ้นต์', hex: '#98FF98' },
        { id: 'sky-blue', nameTh: 'ฟ้าพาสเทล', hex: '#87CEEB' },
      ],
      pattern_mode: 'alternate',
      score: { harmony: 94, vibrancy: 88, cuteness: 92 },
      created_at: new Date(Date.now() - 6 * 3600000).toISOString(),
    },
  ],
  challenges: [
    {
      id: 'ch-01',
      title: 'นักสุ่มสียางมือใหม่',
      description: 'กดสุ่มสีสียางจัดฟันครบ 3 ครั้ง',
      requirement: 'สุ่มสีอย่างน้อย 3 ครั้ง',
      reward: 'เหรียญตรา Rookie Spinner 🎲',
      badge_id: 'badge-rookie-spinner',
      target_count: 3,
      type: 'random',
    },
    {
      id: 'ch-02',
      title: 'นักสะสมคู่สีในฝัน',
      description: 'กดบันทึกคู่สีที่ชอบ (Favorite) ครบ 2 คู่',
      requirement: 'บันทึกสีที่ชอบ 2 รายการขึ้นไป',
      reward: 'เหรียญตรา Sweet Collector 💖',
      badge_id: 'badge-sweet-collector',
      target_count: 2,
      type: 'favorite',
    },
    {
      id: 'ch-03',
      title: 'ค้นหาตัวตน My Style',
      description: 'ทำแบบทดสอบเพื่อค้นหาสไตล์สียางจัดฟันของคุณ',
      requirement: 'ทำแบบทดสอบ My Style สำเร็จ',
      reward: 'เหรียญตรา Style Master 🦄',
      badge_id: 'badge-style-master',
      target_count: 1,
      type: 'quiz',
    },
    {
      id: 'ch-04',
      title: 'จิตรกรแต้มรอยยิ้ม',
      description: 'ปรับแต่งสียางใน Smile Simulator และบันทึกลงโปรไฟล์',
      requirement: 'ทดลองแต้มสีในสตูดิโอ 1 ครั้ง',
      reward: 'เหรียญตรา Smile Designer 🎨',
      badge_id: 'badge-smile-designer',
      target_count: 1,
      type: 'studio',
    },
    {
      id: 'ch-05',
      title: 'แชร์ความมั่นใจให้เพื่อน',
      description: 'เปิดดูการ์ดแชร์และคัดลอกส่งให้เพื่อนหรือหมอฟัน',
      requirement: 'สร้างการ์ดแชร์ 1 ครั้ง',
      reward: 'เหรียญตรา Social Butterfly 🦋',
      badge_id: 'badge-social-butterfly',
      target_count: 1,
      type: 'share',
    },
  ],
  user_badges: [
    {
      id: 'ub-01',
      user_id: 'usr-member-01',
      badge_id: 'badge-rookie-spinner',
      badge_name: 'Rookie Spinner',
      badge_icon: '🎲',
      earned_at: new Date(Date.now() - 40 * 3600000).toISOString(),
    },
    {
      id: 'ub-02',
      user_id: 'usr-member-01',
      badge_id: 'badge-sweet-collector',
      badge_name: 'Sweet Collector',
      badge_icon: '💖',
      earned_at: new Date(Date.now() - 20 * 3600000).toISOString(),
    },
  ],
  settings: [
    { id: 's-01', setting_name: 'website_name', setting_value: 'BraceMood' },
    { id: 's-02', setting_name: 'website_slogan', setting_value: 'ค้นหาสียางที่ใช่ ในสไตล์ของคุณ' },
    {
      id: 's-03',
      setting_name: 'website_description',
      setting_value:
        'มากกว่าการสุ่มสี เพราะเราช่วยค้นหาคู่สีที่เหมาะกับ Mood สไตล์ เสื้อผ้า และโอกาสของคุณ',
    },
    { id: 's-04', setting_name: 'theme_color', setting_value: 'pink-purple' },
    { id: 's-05', setting_name: 'allow_registration', setting_value: 'true' },
    {
      id: 's-06',
      setting_name: 'github_repo',
      setting_value: 'bracemood/bracemood-data',
    },
    { id: 's-07', setting_name: 'github_branch', setting_value: 'main' },
    {
      id: 's-08',
      setting_name: 'github_raw_url',
      setting_value: 'https://raw.githubusercontent.com/bracemood/bracemood-data/main/data.json',
    },
    {
      id: 's-09',
      setting_name: 'github_sync_status',
      setting_value: 'Ready (Local & GitHub Sync Enabled)',
    },
    { id: 's-10', setting_name: 'total_random_counter', setting_value: '1428' },
  ],
};

// Database state in memory
let dbState: DatabaseSchema | null = null;

// Load or initialize DB
export function getDb(): DatabaseSchema {
  if (dbState) {
    return dbState;
  }
  ensureDbDir();
  try {
    if (fs.existsSync(DB_FILE_PATH)) {
      const raw = fs.readFileSync(DB_FILE_PATH, 'utf-8');
      dbState = JSON.parse(raw);
    } else {
      dbState = JSON.parse(JSON.stringify(INITIAL_SEEDS));
      fs.writeFileSync(DB_FILE_PATH, JSON.stringify(dbState, null, 2), 'utf-8');
    }
  } catch (err) {
    console.error('Error loading database file, initializing seeds:', err);
    dbState = JSON.parse(JSON.stringify(INITIAL_SEEDS));
  }
  return dbState!;
}

// Persist database to disk
export function saveDb(): void {
  if (!dbState) return;
  try {
    ensureDbDir();
    fs.writeFileSync(DB_FILE_PATH, JSON.stringify(dbState, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving database to file:', err);
  }
}

// Helper methods for database operations
export const Database = {
  // Users
  getUsers: () => getDb().users,
  getUserById: (id: string) => getDb().users.find((u) => u.id === id),
  getUserByEmail: (email: string) =>
    getDb().users.find((u) => u.email.toLowerCase() === email.toLowerCase().trim()),
  createUser: (user: UserRecord) => {
    getDb().users.push(user);
    saveDb();
    return user;
  },
  updateUser: (id: string, updates: Partial<UserRecord>) => {
    const user = getDb().users.find((u) => u.id === id);
    if (!user) return null;
    Object.assign(user, updates);
    saveDb();
    return user;
  },

  // Colors
  getColors: () => getDb().colors,
  getColorById: (id: string) => getDb().colors.find((c) => c.id === id),
  createColor: (color: ColorRecord) => {
    getDb().colors.push(color);
    saveDb();
    return color;
  },
  updateColor: (id: string, updates: Partial<ColorRecord>) => {
    const color = getDb().colors.find((c) => c.id === id);
    if (!color) return null;
    Object.assign(color, updates);
    saveDb();
    return color;
  },
  deleteColor: (id: string) => {
    const idx = getDb().colors.findIndex((c) => c.id === id);
    if (idx === -1) return false;
    getDb().colors.splice(idx, 1);
    saveDb();
    return true;
  },

  // Color Pairs
  getColorPairs: () => getDb().color_pairs,
  getColorPairById: (id: string) => getDb().color_pairs.find((p) => p.id === id),
  createColorPair: (pair: ColorPairRecord) => {
    getDb().color_pairs.push(pair);
    saveDb();
    return pair;
  },
  updateColorPair: (id: string, updates: Partial<ColorPairRecord>) => {
    const pair = getDb().color_pairs.find((p) => p.id === id);
    if (!pair) return null;
    Object.assign(pair, updates);
    saveDb();
    return pair;
  },
  deleteColorPair: (id: string) => {
    const idx = getDb().color_pairs.findIndex((p) => p.id === id);
    if (idx === -1) return false;
    getDb().color_pairs.splice(idx, 1);
    saveDb();
    return true;
  },

  // Favorites
  getFavoritesByUserId: (userId: string) =>
    getDb().favorites.filter((f) => f.user_id === userId),
  addFavorite: (fav: FavoriteRecord) => {
    getDb().favorites.unshift(fav);
    saveDb();
    return fav;
  },
  removeFavorite: (id: string, userId: string) => {
    const idx = getDb().favorites.findIndex((f) => f.id === id && f.user_id === userId);
    if (idx === -1) return false;
    getDb().favorites.splice(idx, 1);
    saveDb();
    return true;
  },

  // Random History
  getHistoryByUserId: (userId: string) =>
    getDb().random_history.filter((h) => h.user_id === userId),
  addHistory: (hist: RandomHistoryRecord) => {
    getDb().random_history.unshift(hist);
    // Increment global random counter setting
    const counter = getDb().settings.find((s) => s.setting_name === 'total_random_counter');
    if (counter) {
      counter.setting_value = String(parseInt(counter.setting_value || '0', 10) + 1);
    }
    saveDb();
    return hist;
  },
  clearHistory: (userId: string) => {
    dbState = {
      ...getDb(),
      random_history: getDb().random_history.filter((h) => h.user_id !== userId),
    };
    saveDb();
    return true;
  },

  // Challenges & Badges
  getChallenges: () => getDb().challenges,
  getUserBadges: (userId: string) => getDb().user_badges.filter((b) => b.user_id === userId),
  awardBadge: (badge: UserBadgeRecord) => {
    const exists = getDb().user_badges.some(
      (b) => b.user_id === badge.user_id && b.badge_id === badge.badge_id
    );
    if (exists) return null;
    getDb().user_badges.push(badge);
    saveDb();
    return badge;
  },

  // Settings
  getDb: () => getDb(),
  getSettings: () => getDb().settings,
  getSetting: (name: string) =>
    getDb().settings.find((s) => s.setting_name === name)?.setting_value,
  updateSetting: (name: string, value: string) => {
    let setting = getDb().settings.find((s) => s.setting_name === name);
    if (!setting) {
      setting = { id: `s-${Date.now()}`, setting_name: name, setting_value: value };
      getDb().settings.push(setting);
    } else {
      setting.setting_value = value;
    }
    saveDb();
    return setting;
  },
};
