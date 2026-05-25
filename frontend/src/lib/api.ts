import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  try {
    const authStorageStr = localStorage.getItem('sprintos-auth-storage');
    if (authStorageStr) {
      const authStorage = JSON.parse(authStorageStr);
      const user = authStorage?.state?.user;
      if (user) {
        config.headers['x-user-id'] = user.id;
        config.headers['x-user-role'] = user.role;
      }
    }
  } catch (error) {
    console.error('Failed to attach auth headers', error);
  }
  return config;
});

export default api;
