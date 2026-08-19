"use client";
import { createContext, useContext, useEffect, useState } from "react";
import type { Member } from "@/types";

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
      const res = await fetch("/api/auth/guest", { method: "POST" });
      const data = await res.json();
      setUser(data.user);
      localStorage.setItem("tm-user", JSON.stringify(data.user));
      localStorage.setItem("tm-token", data.token);
    } catch {
      // fallback guest user if backend unavailable
      const guest: Member = {
        _id: "guest-" + Date.now(),
        name: "Dexter",
        email: "dexter@gmail.com",
        initials: "DX",
        isGuest: true,
      };
      setUser(guest);
      localStorage.setItem("tm-user", JSON.stringify(guest));
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
