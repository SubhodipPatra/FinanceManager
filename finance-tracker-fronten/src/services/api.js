import axios from 'axios';

// Create the axios instance
const api = axios.create({
  // ✅ This connects your Vercel Frontend to your Render Backend
  baseURL: 'https://financemanager-api.onrender.com/api', 
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to add the token to every request automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;