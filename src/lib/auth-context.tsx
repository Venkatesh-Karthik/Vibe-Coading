"use client";

import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from "react";
import { supabase } from "./supabase";
import type { User } from "@supabase/supabase-js";

type AuthCtx = {
  user: User | null;
  loading: boolean;
  authing: boolean;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
};

const Ctx = createContext<AuthCtx>({
  user: null,
  loading: true,
  authing: false,
  loginWithGoogle: async () => {},
  logout: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authing, setAuthing] = useState(false);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function loginWithGoogle() {
    if (authing) return;
    setAuthing(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) {
        console.warn("Google login failed:", error);
      }
    } catch (e) {
      console.warn("Google login failed:", e);
    } finally {
      setAuthing(false);
    }
  }

  async function logout() {
    await supabase.auth.signOut();
  }

  const value = useMemo(
    () => ({ user, loading, authing, loginWithGoogle, logout }),
    [user, loading, authing]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useAuth = () => useContext(Ctx);
