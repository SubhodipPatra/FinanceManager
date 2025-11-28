import axios from 'axios';

// LOGIC: If Vercel provides a URL, use it. Otherwise, use Localhost.
const API_URL = import.meta.env.VITE_API_URL 
  ? `${import.meta.env.VITE_API_URL}/api`
  : 'http://localhost:4000/api';

console.log("Connecting to API at:", API_URL); // Debugging log

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true // Important for secure cookies if used
});

// Interceptor: Automatically attach the token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;