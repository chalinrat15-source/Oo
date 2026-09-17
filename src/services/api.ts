// Frontend API client communicating with backend /api endpoints
import { User } from '../types';

const TOKEN_STORAGE_KEY = 'bracemood_auth_token';

export function getToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_STORAGE_KEY);
  } catch {
    return null;
  }
}

export function setToken(token: string | null) {
  try {
    if (token) {
      localStorage.setItem(TOKEN_STORAGE_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
    }
  } catch {
    // Ignore
  }
}

export async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  const token = getToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(endpoint, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || 'เกิดข้อผิดพลาดในการเชื่อมต่อเครือข่าย');
  }

  return data as T;
}

export const ApiClient = {
  getToken,
  setToken,
  request: apiRequest,

  // Auth
  async register(body: { name: string; email: string; password: string; profile?: string; style?: string }) {
    const res = await apiRequest<{ token: string; user: User; message: string }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(body),
    });
    setToken(res.token);
    return res;
  },

  async login(body: { email: string; password: string }) {
    const res = await apiRequest<{ token: string; user: User; message: string }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(body),
    });
    setToken(res.token);
    return res;
  },

  async adminLogin(body: { email: string; password: string }) {
    const res = await apiRequest<{ token: string; user: User; message: string }>('/api/auth/admin-login', {
      method: 'POST',
      body: JSON.stringify(body),
    });
    setToken(res.token);
    return res;
  },

  async getMe() {
    return apiRequest<{ user: User }>('/api/auth/me');
  },

  async getCurrentUser(): Promise<User | null> {
    const token = getToken();
    if (!token) return null;
    try {
      const res = await apiRequest<{ user: User }>('/api/auth/me');
      return res.user || null;
    } catch {
      return null;
    }
  },

  logout() {
    setToken(null);
  },

  async updateProfile(body: { name?: string; profile?: string; style?: string }) {
    return apiRequest<{ user: User; message: string }>('/api/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(body),
    });
  },

  // Colors
  async getColors(params?: { tone?: string; mood?: string; style?: string; search?: string }) {
    const query = new URLSearchParams(params as any).toString();
    return apiRequest<any[]>(`/api/colors${query ? `?${query}` : ''}`);
  },

  async createColor(body: any) {
    return apiRequest<any>('/api/colors', {
      method: 'POST',
      body: JSON.stringify(body),
    });
  },

  async updateColor(id: string, body: any) {
    return apiRequest<any>(`/api/colors/${id}`, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
  },

  async deleteColor(id: string) {
    return apiRequest<{ success: boolean; message: string }>(`/api/colors/${id}`, {
      method: 'DELETE',
    });
  },

  // Color Pairs
  async getColorPairs() {
    return apiRequest<any[]>('/api/color-pairs');
  },

  async createColorPair(body: any) {
    return apiRequest<any>('/api/color-pairs', {
      method: 'POST',
      body: JSON.stringify(body),
    });
  },

  async updateColorPair(id: string, body: any) {
    return apiRequest<any>(`/api/color-pairs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
  },

  async deleteColorPair(id: string) {
    return apiRequest<{ success: boolean; message: string }>(`/api/color-pairs/${id}`, {
      method: 'DELETE',
    });
  },

  // Favorites
  async getFavorites() {
    return apiRequest<any[]>('/api/favorites');
  },

  async saveFavorite(body: any) {
    return apiRequest<any>('/api/favorites', {
      method: 'POST',
      body: JSON.stringify(body),
    });
  },

  async addFavorite(body: any) {
    return apiRequest<any>('/api/favorites', {
      method: 'POST',
      body: JSON.stringify(body),
    });
  },

  async removeFavorite(id: string) {
    return apiRequest<{ success: boolean }>(`/api/favorites/${id}`, {
      method: 'DELETE',
    });
  },

  // History
  async getHistory() {
    return apiRequest<any[]>('/api/history');
  },

  async saveHistory(body: any) {
    return apiRequest<any>('/api/history', {
      method: 'POST',
      body: JSON.stringify(body),
    });
  },

  async addHistory(body: any) {
    return apiRequest<any>('/api/history', {
      method: 'POST',
      body: JSON.stringify(body),
    });
  },

  async clearHistory() {
    return apiRequest<{ success: boolean; message: string }>('/api/history', {
      method: 'DELETE',
    });
  },

  // Challenges & Badges
  async getChallenges() {
    return apiRequest<{ challenges: any[]; badges: any[] }>('/api/challenges');
  },

  async claimBadge(body: { badge_id: string; badge_name?: string; badge_icon?: string }) {
    return apiRequest<{ success: boolean; awarded: any; message: string }>('/api/challenges/claim', {
      method: 'POST',
      body: JSON.stringify(body),
    });
  },

  async getBadges() {
    return apiRequest<any[]>('/api/badges');
  },

  async submitQuiz(body: { style: string; answers?: any }) {
    return apiRequest<{ success: boolean; style: string; message: string }>('/api/quiz/submit', {
      method: 'POST',
      body: JSON.stringify(body),
    });
  },

  // Admin Dashboard & Members
  async getAdminDashboard() {
    return apiRequest<{
      metrics: any;
      charts: any;
      recentUsers: any[];
      recentPairs: any[];
    }>('/api/admin/dashboard');
  },

  async getAdminMembers(params?: { search?: string; status?: string }) {
    const query = new URLSearchParams(params as any).toString();
    return apiRequest<any[]>(`/api/admin/members${query ? `?${query}` : ''}`);
  },

  async updateMemberStatus(id: string, status: 'active' | 'suspended') {
    return apiRequest<{ success: boolean; user: any; message: string }>(`/api/admin/members/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  },

  async getAdminSettings() {
    return apiRequest<any[]>('/api/admin/settings');
  },

  async updateAdminSettings(settings: Record<string, string>) {
    return apiRequest<{ success: boolean; message: string }>('/api/admin/settings', {
      method: 'PUT',
      body: JSON.stringify({ settings }),
    });
  },

  // GitHub Integration
  async getGitHubData() {
    return apiRequest<{
      success: boolean;
      source: string;
      data: any;
      message: string;
    }>('/api/github/data');
  },

  async syncGitHub(customUrl?: string) {
    return apiRequest<{
      success: boolean;
      source: string;
      data: any;
      message: string;
      stats?: any;
    }>('/api/github/sync', {
      method: 'POST',
      body: JSON.stringify({ customUrl }),
    });
  },
};
