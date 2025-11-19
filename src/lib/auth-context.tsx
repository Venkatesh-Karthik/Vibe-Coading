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
    (async () => {
      try {
        await getRedirectResult(auth); // will set user via onAuthStateChanged
      } catch (err) {
        // ignore; we'll fall back to popup below if needed
      }
    })();
  }, []);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  async function loginWithGoogle() {
    if (authing) return;         // prevent concurrent popups
    setAuthing(true);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (e: any) {
      // Common popup problems: use redirect as safe fallback
      const code = e?.code || "";
      if (code === "auth/popup-blocked" || code === "auth/cancelled-popup-request") {
        await signInWithRedirect(auth, googleProvider);
      } else {
        // Optional: surface other errors
        console.error("Google login failed:", e);
      }
    } finally {
      setAuthing(false);
    }
  }

  async function logout() {
    await signOut(auth);
  }

  const value = useMemo(
    () => ({ user, loading, authing, loginWithGoogle, logout }),
    [user, loading, authing]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useAuth = () => useContext(Ctx);
