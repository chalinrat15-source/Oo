export type ColorCategory = 'pastel' | 'vibrant' | 'dark' | 'neutral' | 'metallic' | 'neon';

export interface BraceColor {
  id: string;
  nameTh: string;
  nameEn: string;
  hex: string;
  category: ColorCategory;
  description: string;
  styleTags: ('cute' | 'sweet' | 'cool' | 'bright' | 'minimal' | 'dark')[];
  moodTags: ('cheerful' | 'sweet' | 'cool' | 'mysterious' | 'cute' | 'calm')[];
  popularRank?: number;
}

export interface ColorScore {
  harmony: number; // 1-10 ความเข้ากัน
  vibrancy: number; // 1-10 ความสดใส
  cuteness: number; // 1-10 ความน่ารัก
  skinCompliment: number; // 1-10 ช่วยขับผิว/ฟันดูขาว
  overallFeeling: string; // คำอธิบายสั้นๆ
}

export type PatternMode = 'single' | 'duo' | 'trio' | 'all' | 'alternate' | 'split-arch' | 'custom';

export interface ActiveCombination {
  id: string;
  name: string;
  colors: BraceColor[];
  patternMode: PatternMode;
  style?: string;
  mood?: string;
  occasion?: string;
  matchedShirt?: string;
  score: ColorScore;
  timestamp?: number;
  upperTeethColors: string[]; // 10 upper teeth
  lowerTeethColors: string[]; // 10 lower teeth
}

export interface FavoriteItem {
  id: string;
  name: string;
  colors: BraceColor[];
  patternMode: PatternMode;
  score: ColorScore;
  upperTeethColors: string[];
  lowerTeethColors: string[];
  note?: string;
  savedAt: number;
}

export interface HistoryItem {
  id: string;
  name: string;
  colors: BraceColor[];
  patternMode: PatternMode;
  score: ColorScore;
  upperTeethColors: string[];
  lowerTeethColors: string[];
  randomType: string;
  timestamp: number;
}

export interface CuratedPalette {
  id: string;
  titleTh: string;
  titleEn: string;
  category: string;
  colors: BraceColor[];
  descriptionTh: string;
  tags: string[];
  score: ColorScore;
  recommendedFor: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  profile: string; // Avatar emoji or URL
  role: 'member' | 'admin';
  status: 'active' | 'suspended';
  style?: string;
  created_at: string;
}

export interface UserBadge {
  id: string;
  user_id: string;
  badge_id: string;
  badge_name: string;
  badge_icon: string;
  earned_at: string;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  requirement: string;
  reward: string;
  badge_id: string;
  target_count: number;
  type: 'random' | 'favorite' | 'quiz' | 'studio' | 'share';
  is_completed?: boolean;
  user_earned_at?: string;
}

export type AppTab =
  | 'home'
  | 'random'
  | 'studio'
  | 'curated'
  | 'favorites'
  | 'history'
  | 'challenges'
  | 'my-style'
  | 'profile'
  | 'member-settings'
  | 'admin-dashboard'
  | 'admin-login';

export type AdminSubTab =
  | 'dashboard'
  | 'members'
  | 'colors'
  | 'pairs'
  | 'content'
  | 'github'
  | 'settings';

export type StyleOption = 'cute' | 'sweet' | 'cool' | 'bright' | 'minimal' | 'dark';
export type MoodOption = 'cheerful' | 'sweet' | 'cool' | 'mysterious' | 'cute' | 'calm';
export type OccasionOption = 'birthday' | 'school' | 'christmas' | 'valentine' | 'halloween' | 'newyear' | 'graduation' | 'concert';
export type ShirtColorOption = 'pink' | 'blue' | 'yellow' | 'green' | 'purple' | 'red' | 'black' | 'white' | 'navy' | 'beige';
