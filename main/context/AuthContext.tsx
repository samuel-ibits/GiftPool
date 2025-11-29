"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { getCookie, deleteCookie } from "cookies-next";

interface User {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  [key: string]: any;
}

interface AuthContextType {
  token: string | null;
  user: User | null;
  setUser: (u: User | null) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  token: null,
  user: null,
  setUser: () => {},
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  // Load token on mount
  useEffect(() => {
    const _token = getCookie("access-token") as string | undefined;
    if (_token) setToken(_token);
  }, []);

  // Optional: Fetch user profile with token
  useEffect(() => {
    const fetchUser = async () => {
      if (!token) return;

      try {
        const res = await fetch("/api/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
          console.log("Auto logged in user:", data.user);
        }
      } catch (err) {
        console.error("Auto login failed:", err);
      }
    };

    fetchUser();
  }, [token]);

  const logout = () => {
    deleteCookie("access-token");
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
