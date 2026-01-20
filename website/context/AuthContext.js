"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import api from '../lib/api';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkUserLoggedIn();
  }, []);

  const checkUserLoggedIn = async () => {
    const token = Cookies.get('token');
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      console.log('Fetching user data...');
      const { data } = await api.get('/auth/me');
      console.log('User data fetched:', data);
      setUser(data.data || data); // Handle both {data: user} or {user} depending on backend
    } catch (error) {
      console.error('Failed to fetch user:', error);
      // Cookies.remove('token'); // TEMPORARILY COMMENTED OUT to see if token persists
      // setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      console.log('Attempting login...');
      const { data } = await api.post('/auth/login', { email, password });
      console.log('Login response:', data);
      
      Cookies.set('token', data.token, { expires: 30 }); // 30 days
      console.log('Token set in cookie:', data.token);
      
      // Fetch user data after successful login
      await checkUserLoggedIn();
      
      console.log('Navigating to dashboard...');
      router.push('/dashboard');
      return { success: true };
    } catch (error) {
       return { success: false, error: error.response?.data?.error || 'Login failed' };
    }
  };

  const signup = async (name, email, password, role = 'PATIENT', department = '', specialization = '') => {
    try {
      // Backend expects: name, email, password, role
      const { data } = await api.post('/auth/register', { name, email, password, role, department, specialization });
       Cookies.set('token', data.token, { expires: 30 });
       await checkUserLoggedIn();
       router.push('/dashboard');
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.error || 'Signup failed' };
    }
  };

  const logout = () => {
    Cookies.remove('token');
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
