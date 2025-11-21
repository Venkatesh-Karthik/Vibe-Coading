import * as admin from "firebase-admin";

let adminApp: admin.app.App | null = null;

/**
 * Initialize and return the Firebase Admin SDK app instance.
 * Supports two modes:
 * 1. FIREBASE_SERVICE_ACCOUNT: JSON string of service account
 * 2. FIREBASE_SERVICE_ACCOUNT_B64: Base64-encoded JSON string (useful for Vercel env vars)
 * Falls back to Application Default Credentials if neither is set.
 */
export function getAdminApp(): admin.app.App {
  if (adminApp) {
    return adminApp;
  }

  // Check if already initialized
  if (admin.apps.length > 0) {
    adminApp = admin.apps[0]!;
    return adminApp;
  }

  let credential: admin.credential.Credential;

  // Try FIREBASE_SERVICE_ACCOUNT_B64 first (base64-encoded JSON)
  if (process.env.FIREBASE_SERVICE_ACCOUNT_B64) {
    try {
      const serviceAccountJson = Buffer.from(
        process.env.FIREBASE_SERVICE_ACCOUNT_B64,
        "base64"
      ).toString("utf-8");
      const serviceAccount = JSON.parse(serviceAccountJson);
      credential = admin.credential.cert(serviceAccount);
    } catch (error) {
      console.error("Failed to parse FIREBASE_SERVICE_ACCOUNT_B64:", error);
      throw new Error("Invalid FIREBASE_SERVICE_ACCOUNT_B64 environment variable");
    }
  }
  // Try FIREBASE_SERVICE_ACCOUNT (plain JSON string)
  else if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    try {
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
      credential = admin.credential.cert(serviceAccount);
    } catch (error) {
      console.error("Failed to parse FIREBASE_SERVICE_ACCOUNT:", error);
      throw new Error("Invalid FIREBASE_SERVICE_ACCOUNT environment variable");
    }
  }
  // Fall back to Application Default Credentials (for local dev with GOOGLE_APPLICATION_CREDENTIALS)
  else {
    credential = admin.credential.applicationDefault();
  }

  adminApp = admin.initializeApp({
    credential,
  });

  return adminApp;
}

/**
 * Get Firestore instance from Admin SDK
 */
export function getFirestore(): admin.firestore.Firestore {
  const app = getAdminApp();
  return admin.firestore(app);
}

/**
 * Get Auth instance from Admin SDK
 */
export function getAuth(): admin.auth.Auth {
  const app = getAdminApp();
  return admin.auth(app);
}
