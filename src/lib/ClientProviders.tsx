"use client";

import { ReactNode } from "react";
import { AuthProvider } from "../lib/auth-context"; // ✅ fixed import

export default function ClientProviders({ children }: { children: ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}
