import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import api from '../services/apiService.js';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      try {
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
        } else {
          // Token is expired
          logout();
        }
      } catch (error) {
        console.error('Failed to decode token:', error);
        logout();
      }
    }
    setLoading(false);
  }, [token]);

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      if (response && response.token) {
        const { token, ...userData } = response;

        setToken(token);
        setUser(userData);
        localStorage.setItem('token', token);
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        return { success: true };
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
      const response = await api.post('/auth/register', {
        fullName,
        email,
        password,
        phoneNumber,
      });
      if (response && response.token) {
        const { token, ...userData } = response;

        setToken(token);
        setUser(userData);
        localStorage.setItem('token', token);
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        return { success: true };
      }
    } catch (error) {
      console.error('Registration failed:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed.',
      };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
  };

  const value = {
    user,
    token,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};