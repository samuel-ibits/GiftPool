"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { getCookie } from "cookies-next";
interface AuthContextType {
  token: string | null;
}
const AuthContext = createContext<AuthContextType>({ token: null });

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const token = getCookie("access-token") as string | undefined;
    console.log("Token from cookies:", token);
    if (token) {
      setToken(token);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ token }}>{children}</AuthContext.Provider>
  );
};
