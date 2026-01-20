"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check for existing session
    const storedUser = localStorage.getItem('user');
    const token = Cookies.get('auth-token');
    
    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      // Get stored credentials from localStorage for validation
      const storedUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
      
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email, 
          password,
          storedCredentials: storedUsers 
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      // Store user data
      setUser(data.user);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      // If this is a new user (credentials returned), add to registered users
      if (data.credentials) {
        const updatedUsers = [...storedUsers, data.user];
        localStorage.setItem('registeredUsers', JSON.stringify(updatedUsers));
      }
      
      router.push('/');
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const signup = async (name, email, password, department) => {
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, department }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Signup failed');
      }

      // Store user data
      setUser(data.user);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      // Add to registered users in localStorage for demo
      const storedUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
      storedUsers.push(data.user);
      localStorage.setItem('registeredUsers', JSON.stringify(storedUsers));
      
      router.push('/');
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
    localStorage.removeItem('user');
    // Note: We keep registeredUsers in localStorage so credentials persist
    // To fully reset demo, user can clear browser data
    Cookies.remove('auth-token');
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
