import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, // IMPORTANT: Allows cookies (refresh token) to be sent/received
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor: Attach Access Token to every request if we have it
api.interceptors.request.use(
  (config) => {
    // We will store the token in localStorage or Context (memory)
    // For now, let's assume we store it in memory.
    // The AuthContext will inject the token logic here later if needed, 
    // but typically we pass the token from the component or store it.
    
    // A common pattern is to let the AuthContext handle the storage, 
    // but for simplicity in this file, we just return the config.
    // If you use localStorage (easier for MVP):
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;