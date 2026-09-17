import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { Database, UserRecord, ColorRecord, ColorPairRecord } from './server/db';
import { fetchFromGitHub, syncGitHubIntoDatabase } from './server/githubSync';

const app = express();
const PORT = 3000;

app.use(express.json());

// Simple Bearer token parser (token is encoded userId)
function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next();
  }
  const token = authHeader.split(' ')[1];
  try {
    // For standalone production, tokens are base64-encoded userId:role
    const decoded = Buffer.from(token, 'base64').toString('utf-8');
    const [userId, role] = decoded.split(':');
    const user = Database.getUserById(userId);
    if (user && user.status === 'active') {
      (req as any).user = user;
    }
  } catch (e) {
    // Ignore invalid tokens
  }
  next();
}

app.use(authMiddleware);

// Helper for required auth
function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!(req as any).user) {
    return res.status(401).json({ error: 'กรุณาเข้าสู่ระบบก่อนทำรายการ' });
  }
  next();
}

// Helper for admin only
function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const user = (req as any).user as UserRecord;
  if (!user || user.role !== 'admin') {
    return res.status(403).json({ error: 'สงวนสิทธิ์สำหรับผู้ดูแลระบบ (Admin) เท่านั้น' });
  }
  next();
}

// ==========================================
// 1. AUTHENTICATION & PROFILE APIS
// ==========================================

// Register
app.post('/api/auth/register', (req: Request, res: Response) => {
  const { name, email, password, profile, style } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'กรุณากรอกชื่อ อีเมล และรหัสผ่าน' });
  }

  const existing = Database.getUserByEmail(email);
  if (existing) {
    return res.status(400).json({ error: 'อีเมลนี้ถูกใช้งานในระบบแล้ว' });
  }

  const newUser: UserRecord = {
    id: `usr-${Date.now()}`,
    name,
    email: email.trim(),
    passwordHash: password,
    profile: profile || '😊',
    role: 'member',
    status: 'active',
    style: style || 'ยังไม่ได้ระบุ',
    created_at: new Date().toISOString(),
  };

  Database.createUser(newUser);
  const token = Buffer.from(`${newUser.id}:${newUser.role}`).toString('base64');
  const { passwordHash, ...safeUser } = newUser;
  res.json({ token, user: safeUser, message: 'สมัครสมาชิกสำเร็จ ยินดีต้อนรับสู่ BraceMood' });
});

// Login (Member & Admin)
app.post('/api/auth/login', (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'กรุณากรอกอีเมลและรหัสผ่าน' });
  }

  const user = Database.getUserByEmail(email);
  if (!user || user.passwordHash !== password) {
    return res.status(401).json({ error: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' });
  }

  if (user.status === 'suspended') {
    return res.status(403).json({ error: 'บัญชีนี้ถูกระงับการใช้งานชั่วคราว กรุณาติดต่อผู้ดูแลระบบ' });
  }

  const token = Buffer.from(`${user.id}:${user.role}`).toString('base64');
  const { passwordHash, ...safeUser } = user;
  res.json({ token, user: safeUser, message: `ยินดีต้อนรับกลับมา, ${user.name}` });
});

// Admin Login Specific Endpoint
app.post('/api/auth/admin-login', (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = Database.getUserByEmail(email);
  if (!user || user.passwordHash !== password) {
    return res.status(401).json({ error: 'อีเมลหรือรหัสผ่านผู้ดูแลระบบไม่ถูกต้อง' });
  }
  if (user.role !== 'admin') {
    return res.status(403).json({ error: 'บัญชีนี้ไม่มีสิทธิ์เข้าถึงระบบหลังบ้าน Admin' });
  }

  const token = Buffer.from(`${user.id}:${user.role}`).toString('base64');
  const { passwordHash, ...safeUser } = user;
  res.json({ token, user: safeUser, message: 'เข้าสู่ระบบผู้ดูแลระบบสำเร็จ' });
});

// Get Current User (Me)
app.get('/api/auth/me', (req: Request, res: Response) => {
  const user = (req as any).user;
  if (!user) {
    return res.status(401).json({ error: 'ไม่ได้เข้าสู่ระบบ' });
  }
  const { passwordHash, ...safeUser } = user;
  res.json({ user: safeUser });
});

// Update Profile
app.put('/api/auth/profile', requireAuth, (req: Request, res: Response) => {
  const user = (req as any).user as UserRecord;
  const { name, profile, style } = req.body;

  const updated = Database.updateUser(user.id, {
    ...(name ? { name } : {}),
    ...(profile ? { profile } : {}),
    ...(style ? { style } : {}),
  });

  if (!updated) return res.status(404).json({ error: 'ไม่พบผู้ใช้' });
  const { passwordHash, ...safeUser } = updated;
  res.json({ user: safeUser, message: 'อัปเดตข้อมูลโปรไฟล์เรียบร้อยแล้ว' });
});

// ==========================================
// 2. COLORS & COLOR PAIRS APIS
// ==========================================

// Get all colors
app.get('/api/colors', (req: Request, res: Response) => {
  const { tone, mood, style, search } = req.query;
  let colors = Database.getColors();

  if (tone && typeof tone === 'string') {
    colors = colors.filter((c) => c.tone === tone);
  }
  if (mood && typeof mood === 'string') {
    colors = colors.filter((c) => c.mood.includes(mood));
  }
  if (style && typeof style === 'string') {
    colors = colors.filter((c) => c.style.includes(style));
  }
  if (search && typeof search === 'string') {
    const q = search.toLowerCase();
    colors = colors.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.english_name.toLowerCase().includes(q) ||
        c.hex.toLowerCase().includes(q)
    );
  }

  res.json(colors);
});

// Admin Add Color
app.post('/api/colors', requireAdmin, (req: Request, res: Response) => {
  const { name, english_name, hex, tone, mood, style, description } = req.body;
  if (!name || !hex) {
    return res.status(400).json({ error: 'กรุณาระบุชื่อสีและรหัส HEX' });
  }

  const id = req.body.id || `col-${Date.now()}`;
  const newColor: ColorRecord = {
    id,
    name,
    english_name: english_name || name,
    hex,
    tone: tone || 'pastel',
    mood: Array.isArray(mood) ? mood : ['cheerful'],
    style: Array.isArray(style) ? style : ['cute'],
    description: description || '',
    popular_rank: Database.getColors().length + 1,
  };

  Database.createColor(newColor);
  res.status(201).json(newColor);
});

// Admin Update Color
app.put('/api/colors/:id', requireAdmin, (req: Request, res: Response) => {
  const { id } = req.params;
  const updated = Database.updateColor(id, req.body);
  if (!updated) {
    return res.status(404).json({ error: 'ไม่พบรหัสสีนี้' });
  }
  res.json(updated);
});

// Admin Delete Color
app.delete('/api/colors/:id', requireAdmin, (req: Request, res: Response) => {
  const { id } = req.params;
  const success = Database.deleteColor(id);
  if (!success) {
    return res.status(404).json({ error: 'ไม่พบรหัสสีนี้' });
  }
  res.json({ success: true, message: 'ลบสีเรียบร้อยแล้ว' });
});

// Get Color Pairs
app.get('/api/color-pairs', (req: Request, res: Response) => {
  res.json(Database.getColorPairs());
});

// Admin Add Pair
app.post('/api/color-pairs', requireAdmin, (req: Request, res: Response) => {
  const { name, color_1, color_2, color_3, compatibility_score, popularity, tags, description } =
    req.body;
  if (!name || !color_1 || !color_2) {
    return res.status(400).json({ error: 'กรุณาระบุชื่อและอย่างน้อย 2 สี' });
  }

  const newPair: ColorPairRecord = {
    id: req.body.id || `pair-${Date.now()}`,
    name,
    color_1,
    color_2,
    color_3,
    compatibility_score: Number(compatibility_score) || 90,
    popularity: Number(popularity) || 80,
    tags: Array.isArray(tags) ? tags : ['คู่สีแนะนำ'],
    description: description || '',
  };

  Database.createColorPair(newPair);
  res.status(201).json(newPair);
});

// Admin Update Pair
app.put('/api/color-pairs/:id', requireAdmin, (req: Request, res: Response) => {
  const { id } = req.params;
  const updated = Database.updateColorPair(id, req.body);
  if (!updated) return res.status(404).json({ error: 'ไม่พบคู่สีนี้' });
  res.json(updated);
});

// Admin Delete Pair
app.delete('/api/color-pairs/:id', requireAdmin, (req: Request, res: Response) => {
  const { id } = req.params;
  const success = Database.deleteColorPair(id);
  if (!success) return res.status(404).json({ error: 'ไม่พบคู่สีนี้' });
  res.json({ success: true, message: 'ลบคู่สีเรียบร้อยแล้ว' });
});

// ==========================================
// 3. FAVORITES & HISTORY APIS
// ==========================================

// Get user favorites
app.get('/api/favorites', requireAuth, (req: Request, res: Response) => {
  const user = (req as any).user as UserRecord;
  const favorites = Database.getFavoritesByUserId(user.id);
  res.json(favorites);
});

// Add favorite
app.post('/api/favorites', requireAuth, (req: Request, res: Response) => {
  const user = (req as any).user as UserRecord;
  const { name, colors, color_pair_id, pattern_mode, upper_colors, lower_colors } = req.body;

  const newFav = Database.addFavorite({
    id: `fav-${Date.now()}`,
    user_id: user.id,
    color_pair_id,
    name: name || 'คู่สีจัดฟัน',
    colors: colors || [],
    pattern_mode,
    upper_colors,
    lower_colors,
    created_at: new Date().toISOString(),
  });

  // Check Challenge #2: Sweet Collector
  const userFavs = Database.getFavoritesByUserId(user.id);
  if (userFavs.length >= 2) {
    Database.awardBadge({
      id: `ub-${Date.now()}`,
      user_id: user.id,
      badge_id: 'badge-sweet-collector',
      badge_name: 'Sweet Collector',
      badge_icon: '💖',
      earned_at: new Date().toISOString(),
    });
  }

  res.status(201).json(newFav);
});

// Remove favorite
app.delete('/api/favorites/:id', requireAuth, (req: Request, res: Response) => {
  const user = (req as any).user as UserRecord;
  const { id } = req.params;
  const success = Database.removeFavorite(id, user.id);
  res.json({ success });
});

// Get user history
app.get('/api/history', requireAuth, (req: Request, res: Response) => {
  const user = (req as any).user as UserRecord;
  res.json(Database.getHistoryByUserId(user.id));
});

// Add history record (Supports guest or member)
app.post('/api/history', (req: Request, res: Response) => {
  const user = (req as any).user as UserRecord | undefined;
  const userId = user ? user.id : 'guest';
  const { name, colors, color_pair_id, pattern_mode, score } = req.body;

  const record = Database.addHistory({
    id: `hist-${Date.now()}`,
    user_id: userId,
    color_pair_id,
    name: name || 'ผลการสุ่มสี',
    colors: colors || [],
    pattern_mode,
    score,
    created_at: new Date().toISOString(),
  });

  // Check Challenge #1: Rookie Spinner if logged in
  if (user) {
    const userHistory = Database.getHistoryByUserId(user.id);
    if (userHistory.length >= 3) {
      Database.awardBadge({
        id: `ub-${Date.now()}`,
        user_id: user.id,
        badge_id: 'badge-rookie-spinner',
        badge_name: 'Rookie Spinner',
        badge_icon: '🎲',
        earned_at: new Date().toISOString(),
      });
    }
  }

  res.status(201).json(record);
});

// Clear history
app.delete('/api/history', requireAuth, (req: Request, res: Response) => {
  const user = (req as any).user as UserRecord;
  Database.clearHistory(user.id);
  res.json({ success: true, message: 'ล้างประวัติการสุ่มสีแล้ว' });
});

// ==========================================
// 4. CHALLENGES & BADGES APIS
// ==========================================

app.get('/api/challenges', (req: Request, res: Response) => {
  const user = (req as any).user as UserRecord | undefined;
  const challenges = Database.getChallenges();
  const userBadges = user ? Database.getUserBadges(user.id) : [];

  const enriched = challenges.map((ch) => {
    const earned = userBadges.some((ub) => ub.badge_id === ch.badge_id);
    return {
      ...ch,
      is_completed: earned,
      user_earned_at: userBadges.find((ub) => ub.badge_id === ch.badge_id)?.earned_at,
    };
  });

  res.json({ challenges: enriched, badges: userBadges });
});

// Claim badge/reward manually
app.post('/api/challenges/claim', requireAuth, (req: Request, res: Response) => {
  const user = (req as any).user as UserRecord;
  const { badge_id, badge_name, badge_icon } = req.body;

  const awarded = Database.awardBadge({
    id: `ub-${Date.now()}`,
    user_id: user.id,
    badge_id,
    badge_name: badge_name || 'Achiever',
    badge_icon: badge_icon || '🏆',
    earned_at: new Date().toISOString(),
  });

  res.json({ success: true, awarded, message: 'ยินดีด้วย! คุณได้รับเหรียญรางวัลใหม่แล้ว' });
});

// Get user badges
app.get('/api/badges', requireAuth, (req: Request, res: Response) => {
  const user = (req as any).user as UserRecord;
  res.json(Database.getUserBadges(user.id));
});

// Quiz submission
app.post('/api/quiz/submit', (req: Request, res: Response) => {
  const user = (req as any).user as UserRecord | undefined;
  const { style, answers } = req.body;

  if (user && style) {
    Database.updateUser(user.id, { style });
    Database.awardBadge({
      id: `ub-${Date.now()}`,
      user_id: user.id,
      badge_id: 'badge-style-master',
      badge_name: 'Style Master',
      badge_icon: '🦄',
      earned_at: new Date().toISOString(),
    });
  }

  res.json({
    success: true,
    style,
    message: `สไตล์ที่เหมาะกับคุณที่สุดคือ "${style}"`,
  });
});

// ==========================================
// 5. ADMIN BACK OFFICE & DASHBOARD APIS
// ==========================================

app.get('/api/admin/dashboard', requireAdmin, (req: Request, res: Response) => {
  const users = Database.getUsers();
  const colors = Database.getColors();
  const pairs = Database.getColorPairs();
  const favorites = Database.getDb().favorites;
  const history = Database.getDb().random_history;
  const badges = Database.getDb().user_badges;
  const totalRandomCounter = parseInt(Database.getSetting('total_random_counter') || '1428', 10);

  // Time-series mock / calculated for Recharts
  const monthlyActivity = [
    { month: 'ม.ค.', members: 45, spins: 320, favorites: 85 },
    { month: 'ก.พ.', members: 78, spins: 540, favorites: 140 },
    { month: 'มี.ค.', members: 112, spins: 780, favorites: 210 },
    { month: 'เม.ย.', members: 165, spins: 960, favorites: 290 },
    { month: 'พ.ค.', members: 210, spins: 1180, favorites: 380 },
    { month: 'มิ.ย.', members: users.length * 15, spins: totalRandomCounter, favorites: favorites.length * 20 },
  ];

  const toneDistribution = [
    { name: 'Pastel (พาสเทล)', count: colors.filter((c) => c.tone === 'pastel').length },
    { name: 'Vibrant (สดใส)', count: colors.filter((c) => c.tone === 'vibrant').length },
    { name: 'Deep (สีเข้ม)', count: colors.filter((c) => c.tone === 'deep').length },
    { name: 'Metallic (เมทัลลิก)', count: colors.filter((c) => c.tone === 'metallic').length },
  ];

  const moodPopularity = [
    { mood: 'สดใสเปี่ยมพลัง', value: 38 },
    { mood: 'หวานละมุน', value: 32 },
    { mood: 'เท่ ขับฟันขาว', value: 24 },
    { mood: 'น่ารักน่าเอ็นดู', value: 18 },
    { mood: 'สบายตา คลีนๆ', value: 14 },
  ];

  res.json({
    metrics: {
      totalMembers: users.filter((u) => u.role === 'member').length,
      totalColors: colors.length,
      totalFavorites: favorites.length,
      totalRandomSpins: totalRandomCounter,
      popularPairsCount: pairs.length,
      completedChallenges: badges.length,
    },
    charts: {
      monthlyActivity,
      toneDistribution,
      moodPopularity,
    },
    recentUsers: users.slice(-5).reverse(),
    recentPairs: pairs.slice(0, 4),
  });
});

// Member management
app.get('/api/admin/members', requireAdmin, (req: Request, res: Response) => {
  const { search, status } = req.query;
  let members = Database.getUsers();

  if (search && typeof search === 'string') {
    const q = search.toLowerCase();
    members = members.filter(
      (m) => m.name.toLowerCase().includes(q) || m.email.toLowerCase().includes(q)
    );
  }
  if (status && typeof status === 'string' && status !== 'all') {
    members = members.filter((m) => m.status === status);
  }

  // Remove passwordHash
  const safeMembers = members.map(({ passwordHash, ...m }) => m);
  res.json(safeMembers);
});

// Toggle member status
app.put('/api/admin/members/:id/status', requireAdmin, (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;
  if (!['active', 'suspended'].includes(status)) {
    return res.status(400).json({ error: 'สถานะไม่ถูกต้อง' });
  }

  const updated = Database.updateUser(id, { status });
  if (!updated) return res.status(404).json({ error: 'ไม่พบสมาชิกนี้' });
  res.json({ success: true, user: updated, message: `เปลี่ยนสถานะเป็น ${status} เรียบร้อยแล้ว` });
});

// Admin System Settings
app.get('/api/admin/settings', requireAdmin, (req: Request, res: Response) => {
  res.json(Database.getSettings());
});

app.put('/api/admin/settings', requireAdmin, (req: Request, res: Response) => {
  const { settings } = req.body as { settings: Record<string, string> };
  if (settings && typeof settings === 'object') {
    for (const [key, val] of Object.entries(settings)) {
      Database.updateSetting(key, String(val));
    }
  }
  res.json({ success: true, message: 'บันทึกการตั้งค่าระบบสำเร็จ' });
});

// ==========================================
// 6. GITHUB DATA INTEGRATION & SYNC APIS
// ==========================================

// Fetch GitHub data with schema check & fallback
app.get('/api/github/data', async (req: Request, res: Response) => {
  try {
    const result = await fetchFromGitHub();
    res.json(result);
  } catch (err: any) {
    res.status(500).json({
      success: false,
      error: 'เกิดข้อผิดพลาดในการเรียกข้อมูล GitHub',
      message: err?.message,
    });
  }
});

// Trigger GitHub Synchronization into Database
app.post('/api/github/sync', requireAdmin, async (req: Request, res: Response) => {
  try {
    const { customUrl } = req.body;
    const result = await syncGitHubIntoDatabase(customUrl);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({
      success: false,
      error: 'ซิงค์ข้อมูลไม่สำเร็จ',
      message: err?.message,
    });
  }
});

// Public health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    appName: 'BraceMood',
    version: '2.0.0',
    timestamp: new Date().toISOString(),
  });
});

// ==========================================
// 7. VITE DEV / PRODUCTION MIDDLEWARE
// ==========================================

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 BraceMood Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
