import axios from 'axios';
import { authService } from '@/services/AuthService';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const url = config.url || "";
  const isExternalApi = 
    url.startsWith('http') || 
    url.includes('amazonaws.com') || 
    url.includes('google');
  
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
  
  if (token && !isExternalApi && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const newAccessToken = await authService.reissue();
        if (newAccessToken) {
          localStorage.setItem('accessToken', newAccessToken);
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return api(originalRequest);
        }
      } catch (reissueError) {
        console.error("Token reissue failed, clearing local storage.");
        localStorage.removeItem('accessToken');
        
        if (typeof window !== 'undefined') {
          window.location.href = '/login'; 
        }
        return Promise.reject(reissueError);
      }
    }

    if (error.response?.status === 403) {
       localStorage.removeItem('accessToken');
    }

    return Promise.reject(error);
  }
);

export default api;