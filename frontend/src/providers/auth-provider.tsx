import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import type { AuthToken, Citizen, LoginPayload, RegisterPayload } from '@/types';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://127.0.0.1:8000/api';
const STORAGE_KEY = 'auth_token';

type AuthContextShape = {
  citizen: Citizen | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  register: (payload: RegisterPayload) => Promise<AuthToken>;
  login: (payload: LoginPayload) => Promise<AuthToken>;
  logout: () => void;
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextShape | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [citizen, setCitizen] = useState<Citizen | null>(() => {
    try {
      const raw = localStorage.getItem('auth_citizen');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState<string | null>(() => localStorage.getItem(STORAGE_KEY));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) setToken(e.newValue);
      if (e.key === 'auth_citizen') setCitizen(e.newValue ? JSON.parse(e.newValue) : null);
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const parseError = async (res: Response) => {
    try {
      const body = await res.json();
      if (!body) return res.statusText || 'Request failed';
      if (typeof body.detail === 'string') return body.detail;
      if (Array.isArray(body.detail) && body.detail.length) {
        // FastAPI validation errors come as list
        return body.detail.map((d: any) => d.msg || JSON.stringify(d)).join(', ');
      }
      if (body.message) return body.message;
      return JSON.stringify(body);
    } catch {
      return res.statusText || 'Request failed';
    }
  };

  const register = useCallback(async (payload: RegisterPayload) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const msg = await parseError(res);
        setError(msg);
        throw new Error(msg);
      }
      const data: AuthToken = await res.json();
      localStorage.setItem(STORAGE_KEY, data.access_token);
      localStorage.setItem('auth_citizen', JSON.stringify(data.citizen));
      setToken(data.access_token);
      setCitizen(data.citizen);
      return data;
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (payload: LoginPayload) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const msg = await parseError(res);
        setError(msg);
        throw new Error(msg);
      }
      const data: AuthToken = await res.json();
      localStorage.setItem(STORAGE_KEY, data.access_token);
      localStorage.setItem('auth_citizen', JSON.stringify(data.citizen));
      setToken(data.access_token);
      setCitizen(data.citizen);
      return data;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem('auth_citizen');
    setToken(null);
    setCitizen(null);
    setError(null);
  }, []);

  const value = useMemo(
    () => ({ citizen, token, loading, error, register, login, logout, isAuthenticated: !!token && !!citizen }),
    [citizen, token, loading, error, register, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  const ctx = React.useContext(AuthContext);
  if (!ctx) throw new Error('useAuthContext must be used within AuthProvider');
  return ctx;
};

export default AuthContext;
