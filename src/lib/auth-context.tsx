"use client";

import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from "react";
import { auth, googleProvider } from "./firebase";
import {
  onAuthStateChanged,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  User,
  signOut,
} from "firebase/auth";

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

  // Complete redirect flow if we came back from signInWithRedirect
  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }
    (async () => {
      try {
        await getRedirectResult(auth);
      } catch (err) {
        console.warn("Redirect result error:", err);
      }
    })();
  }, []);

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  async function loginWithGoogle() {
    if (!auth) {
      console.warn("Firebase auth not initialized. Check environment variables.");
      return;
    }
    if (authing) return;
    setAuthing(true);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (e: unknown) {
      const error = e as { code?: string };
      const code = error?.code || "";
      if (code === "auth/popup-blocked" || code === "auth/cancelled-popup-request") {
        await signInWithRedirect(auth, googleProvider);
      } else {
        console.warn("Google login failed:", e);
      }
    } finally {
      setAuthing(false);
    }
  }

  async function logout() {
    if (!auth) return;
    await signOut(auth);
  }

  const value = useMemo(
    () => ({ user, loading, authing, loginWithGoogle, logout }),
    [user, loading, authing]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useAuth = () => useContext(Ctx);
