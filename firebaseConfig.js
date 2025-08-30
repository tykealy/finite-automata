// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from "firebase/app";
import {
  initializeAppCheck,
  ReCaptchaV3Provider,
  getToken,
} from "firebase/app-check";

// Your web app's Firebase configuration
// Support both NEXT_PUBLIC_* and non-prefixed env vars for flexibility
const firebaseConfig = {
  apiKey:
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY || process.env.FIREBASE_API_KEY,
  authDomain:
    process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ||
    process.env.FIREBASE_AUTH_DOMAIN,
  databaseURL:
    process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL ||
    process.env.FIREBASE_DATABASE_URL,
  projectId:
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID,
  storageBucket:
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ||
    process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId:
    process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ||
    process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || process.env.FIREBASE_APP_ID,
  measurementId:
    process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID ||
    process.env.FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase app once
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// Initialize App Check in the browser only
let appCheckReadyPromise = Promise.resolve(false);
if (typeof window !== "undefined") {
  // Avoid initializing multiple times across module imports
  if (!window.__FIREBASE_APPCHECK_INITIALIZED__) {
    window.__FIREBASE_APPCHECK_INITIALIZED__ = true;

    // Optional debug token support for local dev (set to a string token or "true")
    if (process.env.NEXT_PUBLIC_FIREBASE_APPCHECK_DEBUG_TOKEN) {
      // eslint-disable-next-line no-undef
      self.FIREBASE_APPCHECK_DEBUG_TOKEN =
        process.env.NEXT_PUBLIC_FIREBASE_APPCHECK_DEBUG_TOKEN;
    }

    const siteKey =
      process.env.NEXT_PUBLIC_FIREBASE_APPCHECK_SITE_KEY ||
      process.env.FIREBASE_APPCHECK_SITE_KEY;
    if (siteKey) {
      const appCheckInstance = initializeAppCheck(app, {
        provider: new ReCaptchaV3Provider(siteKey),
        isTokenAutoRefreshEnabled: true,
      });
      // eslint-disable-next-line no-console
      if (process.env.NODE_ENV === "development") {
        console.log("Firebase App Check initialized (reCAPTCHA v3)");
      }

      // Resolve when a token is available (avoids race conditions on first call)
      appCheckReadyPromise = getToken(appCheckInstance)
        .then(() => true)
        .catch(() => false);
    } else if (process.env.NODE_ENV === "development") {
      // Helpful warning in dev if site key isn't set
      // eslint-disable-next-line no-console
      console.warn(
        "Firebase App Check site key not set. Define NEXT_PUBLIC_FIREBASE_APPCHECK_SITE_KEY."
      );
    }
  }
}

export default app;
export { appCheckReadyPromise };
