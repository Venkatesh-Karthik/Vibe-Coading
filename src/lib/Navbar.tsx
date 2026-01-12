"use client";

import Link from "next/link";
import { useAuth } from "../lib/auth-context"; // ✅ fixed import

export default function Navbar() {
  const { user, loading, loginWithGoogle, logout } = useAuth();

  return (
    <nav className="flex items-center justify-between p-4 bg-white shadow">
      <Link href="/" className="text-xl font-bold text-blue-600">
        TripMosaic+
      </Link>
      <div>
        {loading ? (
          <span>Loading...</span>
        ) : user ? (
          <>
            <span className="mr-4">Hi, {user.user_metadata?.name || user.email || "User"}</span>
            <button
              onClick={logout}
              className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
            >
              Logout
            </button>
          </>
        ) : (
          <button
            onClick={loginWithGoogle}
            className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Login with Google
          </button>
        )}
      </div>
    </nav>
  );
}
