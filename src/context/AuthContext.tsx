"use client";
import { createContext, useContext, useEffect, useState } from "react";
import type { Member } from "@/types";
import { api } from "@/lib/api";

interface AuthContextType {
  user: Member | null;
  isLoading: boolean;
  loginAsGuest: () => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  loginAsGuest: async () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Member | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("tm-user");
    if (saved) {
      try {
        setUser(JSON.parse(saved));
      } catch {
        localStorage.removeItem("tm-user");
      }
    }
    setIsLoading(false);
  }, []);

  const loginAsGuest = async () => {
    try {
      const data = await api.auth.guest();
      setUser(data.user as Member);
      localStorage.setItem("tm-user", JSON.stringify(data.user));
      localStorage.setItem("tm-token", data.token);
    } catch (error: any) {
      throw new Error(error.message || "Backend / Database connection failed");
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("tm-user");
    localStorage.removeItem("tm-token");
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, loginAsGuest, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
