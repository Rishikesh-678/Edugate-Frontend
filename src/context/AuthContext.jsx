import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import api from '../services/apiService.js';

export const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
  };

  const fetchLatestUserProfile = async () => {
    try {
      const response = await api.get('/user/profile/me');
      if (response && response.data) {
        const profileData = response.data;
        setUser((prevUser) => ({
          ...prevUser,
          fullName: profileData.fullName,
          phoneNumber: profileData.phoneNumber,
        }));
      }
    } catch (error) {
      console.error('Failed to fetch latest user profile:', error);
      // Don't log out, just continue with what we have from the token
    }
  };

  const updateUserProfile = (updatedUserData) => {
    setUser((prevUser) => ({
      ...prevUser,
      ...updatedUserData,
    }));
  };

  useEffect(() => {
    try {
      if (token) {
        const decoded = jwtDecode(token);
        // Check if token is expired
        if (decoded.exp * 1000 > Date.now()) {
          // Re-populate user state from token
          const userData = {
            id: decoded.id,
            email: decoded.sub,
            fullName: decoded.fullName,
            role: decoded.roles[0], // Assuming one role from your backend
          };
          setUser(userData);
          // Set auth header for all future api requests
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          // Fetch the latest user profile from the backend to get updated fullName
          fetchLatestUserProfile();
        } else {
          // Token is expired
          logout();
        }
      }
    } catch (error) {
      console.error('Failed to decode token:', error);
      logout();
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    try {
      // api interceptor returns response.data (the ApiResponse wrapper)
      // Full structure: { success, status, timestamp, path, message, data: { token, id, email, fullName, role } }
      const response = await api.post('/auth/login', { email, password });
      
      // response here is the unwrapped axios response.data which is the ApiResponse wrapper
      // Extract from nested data object (response.data contains { token, id, email, fullName, role })
      if (response && response.data && response.data.token) {
        const { token, ...userData } = response.data; 

        setToken(token);
        setUser(userData);
        localStorage.setItem('token', token);
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        return { success: true };
      } else {
        return { 
          success: false, 
          message: response.message || 'Invalid username or password.' 
        };
      }
    } catch (error) {
      console.error('Login failed:', error);
      return {
        success: false,
        message:
          error.response?.data?.message || 'Invalid username or password.',
      };
    }
  };

  const register = async ({ fullName, email, password, phoneNumber }) => {
    try {
      // api interceptor returns response.data (the ApiResponse wrapper)
      // Structure: { success, status, timestamp, path, message, data: { token, id, email, fullName, role } }
      const response = await api.post('/auth/register', {
        fullName,
        email,
        password,
        phoneNumber,
      });

      // Extract from nested data object
      if (response && response.data && response.data.token) {
        const { token, ...userData } = response.data;

        setToken(token);
        setUser(userData);
        localStorage.setItem('token', token);
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        return { success: true };
      } else {
        return { 
          success: false, 
          message: response.message || 'Registration failed.' 
        };
      }
    } catch (error) {
      console.error('Registration failed:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed.',
      };
    }
  };

  const value = {
    user,
    token,
    login,
    register,
    logout,
    updateUserProfile,
    isAuthenticated: !!user,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};