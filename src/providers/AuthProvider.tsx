import React, { useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { User } from '../types/auth';
import { authService } from '../services/authService';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = authService.getToken();
    if (token) {
        // In a real app, validate token here
        console.log("Token found, initializing session")
    }
  }, []);

  const login = (user: User, token: string) => {
    authService.setToken(token);
    setUser(user);
  };

  const logout = () => {
    authService.clearToken();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
