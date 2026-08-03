import { useAuthStore } from './store/authStore';
import { AuthApi } from './authApi';

export class SessionManager {
  static async checkSession() {
    try {
      const data = await AuthApi.getMe();
      if (data.success && data.user) {
        const existingToken = useAuthStore.getState().token || 'cookie-token';
        const tokenToStore = data.token || existingToken;
        useAuthStore.getState().login(data.user, tokenToStore, true);
        return data.user;
      }
    } catch (error) {
      const state = useAuthStore.getState();
      if (!state.isAuthenticated) {
        state.logout();
      }
    }
    return null;
  }

  static async performLogout() {
    try {
      await AuthApi.logout();
    } catch (err) {
      // Continue even if server logout fails
    } finally {
      useAuthStore.getState().logout();
      window.location.href = '/signin';
    }
  }
}
