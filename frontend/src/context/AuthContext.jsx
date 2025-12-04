import { createContext, useState, useEffect, useContext } from 'react'; // <--- Added useContext here
import api from '../api/axiosInstance';
import { jwtDecode } from "jwt-decode"; 

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('accessToken') || null);
  const [loading, setLoading] = useState(true);

  // 1. Check if token exists on load
  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        if (decoded.exp * 1000 < Date.now()) {
          logout();
        } else {
          setUser({ ...decoded, role: decoded.role });
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
      } catch (error) {
        logout();
      }
    }
    setLoading(false);
  }, [token]);

  // 2. Login Action
  const login = async (email, password) => {
    try {
      const { data } = await api.post('/auth/login', { email, password });
      
      setToken(data.accessToken);
      localStorage.setItem('accessToken', data.accessToken);
      
      const decoded = jwtDecode(data.accessToken);
      setUser({ ...data, ...decoded });

      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Login failed' 
      };
    }
  };

  // 3. Logout Action
  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('accessToken');
    delete api.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// <--- THIS WAS MISSING. Add this at the bottom!
export const useAuth = () => {
  return useContext(AuthContext);
};