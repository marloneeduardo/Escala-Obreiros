import { useState, useCallback } from 'react';
import { Obreiro } from '../types';
import { getLast4Digits } from '../lib/masks';

const ADMIN_PASSWORD = 'sede26';

export function useAuth() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  const login = useCallback((password: string): boolean => {
    if (password === ADMIN_PASSWORD) {
      setIsAdmin(true);
      setShowLogin(false);
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setIsAdmin(false);
  }, []);

  const toggleAdmin = useCallback(() => {
    if (isAdmin) {
      logout();
    } else {
      setShowLogin(true);
    }
  }, [isAdmin, logout]);

  const validateWorkerAuth = useCallback((
    workerName: string,
    last4: string,
    obreiros: Obreiro[]
  ): boolean => {
    const worker = obreiros.find(o => o.name === workerName);
    if (!worker?.tel) return false;
    return getLast4Digits(worker.tel) === last4;
  }, []);

  return {
    isAdmin,
    showLogin,
    setShowLogin,
    login,
    logout,
    toggleAdmin,
    validateWorkerAuth,
  };
}
