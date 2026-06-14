import { create } from 'zustand';
import { UserProfile } from '@/types';
import { authApi } from '@/api/authApi';

interface AuthState {
  user: UserProfile | null;
  token: string | null;
  isLoading: boolean;
  login: (credentials: any) => Promise<void>;
  logout: () => void;
  fetchProfile: () => Promise<void>;
  isProfileOpen: boolean;
  setProfileOpen: (isOpen: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: localStorage.getItem('token'),
  isLoading: false,
  isProfileOpen: false,
  setProfileOpen: (isOpen) => set({ isProfileOpen: isOpen }),

  login: async (credentials) => {
    try {
      set({ isLoading: true });
      const res = await authApi.login(credentials) as any;
      localStorage.setItem('token', res.token);
      set({ token: res.token, user: res.user, isLoading: false });
    } catch (err) {
      set({ isLoading: false });
      throw err;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, token: null });
  },

  fetchProfile: async () => {
    try {
      const user = await authApi.me() as any;
      set({ user });
    } catch (err) {
      localStorage.removeItem('token');
      set({ user: null, token: null });
    }
  }
}));
