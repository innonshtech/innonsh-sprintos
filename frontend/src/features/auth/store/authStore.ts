import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { TeamMember } from '../../../types/user';

export interface AuthState {
  user: TeamMember | null;
  token: string | null;
  isAuthenticated: boolean;
  loginTimestamp: number | null;
  rememberSession: boolean;
  login: (user: TeamMember, token: string, rememberMe: boolean) => void;
  logout: () => void;
  setUser: (user: TeamMember) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      loginTimestamp: null,
      rememberSession: false,
      login: (user: TeamMember, token: string, rememberSession: boolean) =>
        set({ 
          user, 
          token, 
          isAuthenticated: true, 
          loginTimestamp: Date.now(),
          rememberSession 
        }),
      logout: () => set({ 
        user: null, 
        token: null, 
        isAuthenticated: false,
        loginTimestamp: null,
        rememberSession: false
      }),
      setUser: (user: TeamMember) => set({ user }),
    }),
    {
      name: 'sprintos-auth-storage',
      // Persist only if rememberSession is true, else we could clear on mount if false.
      // But standard zustand persist stores it. We will handle session clearing logic in app initialization if needed.
    }
  )
);
