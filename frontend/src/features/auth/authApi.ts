import api from '../../lib/api';

export class AuthApi {
  static async login(credentials: Record<string, any>) {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  }

  static async refresh() {
    const response = await api.post('/auth/refresh');
    return response.data;
  }

  static async logout() {
    const response = await api.post('/auth/logout');
    return response.data;
  }

  static async getMe() {
    const response = await api.get('/auth/me');
    return response.data;
  }

  static async getSessions() {
    const response = await api.get('/security/sessions');
    return response.data;
  }

  static async revokeSession(sessionId: string) {
    const response = await api.delete(`/security/sessions/${sessionId}`);
    return response.data;
  }

  static async logoutAll() {
    const response = await api.delete('/security/logout-all');
    return response.data;
  }

  static async forgotPassword(email: string) {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  }

  static async resetPassword(token: string, newPassword: string) {
    const response = await api.post('/auth/reset-password', { token, newPassword });
    return response.data;
  }

  static async changePassword(oldPassword: string, newPassword: string) {
    const response = await api.post('/auth/change-password', { oldPassword, newPassword });
    return response.data;
  }

  static async uploadAvatar(file: File) {
    const formData = new FormData();
    formData.append('avatar', file);
    const response = await api.post('/auth/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  }

  static async updateProfile(data: { name?: string; department?: string }) {
    const response = await api.put('/auth/profile', data);
    return response.data;
  }
}
