"use client";

import { ReactNode } from "react";
import { AuthProvider as FirebaseAuthProvider } from "../lib/auth-context"; // Legacy Firebase
import { AuthProvider as SupabaseAuthProvider } from "../lib/auth"; // New Supabase

export default function ClientProviders({ children }: { children: ReactNode }) {
  return (
    <SupabaseAuthProvider>
      <FirebaseAuthProvider>
        {children}
      </FirebaseAuthProvider>
    </SupabaseAuthProvider>
  );
}
