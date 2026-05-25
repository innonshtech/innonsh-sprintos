export type Role =
  | 'SUPER_ADMIN'
  | 'ADMIN'
  | 'PRODUCT_MANAGER'
  | 'TEAM_LEAD'
  | 'DEVELOPER'
  | 'HR';

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  avatarUrl?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: User, token: string, rememberMe: boolean) => void;
  logout: () => void;
  setUser: (user: User) => void;
}
