import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1',
});

// Add interceptor to include auth headers
api.interceptors.request.use((config) => {
  const authStoreStr = localStorage.getItem('sprintos-auth-storage');
  if (authStoreStr) {
    const { state } = JSON.parse(authStoreStr);
    if (state && state.user) {
      config.headers['x-user-id'] = state.user.id;
      config.headers['x-user-role'] = state.user.role;
    }
  }
  return config;
});

export const getOverview = async () => (await api.get('/admin/overview')).data;
export const getProjects = async () => (await api.get('/admin/projects')).data;
export const getSprints = async () => (await api.get('/admin/sprints')).data;
export const getTeamPerformance = async () => (await api.get('/admin/team-performance')).data;
export const getWorkload = async () => (await api.get('/admin/workload')).data;
export const getBlockers = async () => (await api.get('/admin/blockers')).data;
export const getActivityFeed = async () => (await api.get('/admin/activity-feed')).data;
export const getAuditLogs = async () => (await api.get('/admin/audit-logs')).data;
export const getIntelligence = async () => (await api.get('/admin/intelligence')).data;
