import React, { createContext, useContext, useState, useEffect } from 'react';
import { base44 } from '../services/base44Engine';
import { eventBus, initStorage } from '../services/storage';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = () => {
    const current = base44.auth.me();
    setUser(current);
    setLoading(false);
  };

  useEffect(() => {
    refreshUser();
    const unsub = eventBus.subscribe('AUTH_CHANGED', (updated) => {
      setUser(updated);
    });
    const unsubReset = eventBus.subscribe('DATA_RESET', () => {
      refreshUser();
    });
    return () => {
      unsub();
      unsubReset();
    };
  }, []);

  const login = (email, password) => {
    const loggedIn = base44.auth.login(email, password);
    setUser(loggedIn);
    return loggedIn;
  };

  const register = (data) => {
    const registered = base44.auth.register(data);
    setUser(registered);
    return registered;
  };

  const logout = () => {
    base44.auth.logout();
    setUser(null);
  };

  const switchDemoRole = (roleKey) => {
    const switched = base44.auth.switchDemoRole(roleKey);
    if (switched) {
      setUser(switched);
    }
    return switched;
  };

  const updateProfile = (data) => {
    const updated = base44.auth.updateMe(data);
    setUser(updated);
    return updated;
  };

  const resetAllDemoData = () => {
    initStorage(true);
    refreshUser();
  };

  const value = {
    user,
    role: user?.data?.app_role || 'guest',
    loading,
    login,
    register,
    logout,
    switchDemoRole,
    updateProfile,
    resetAllDemoData
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
