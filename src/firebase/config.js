import { getApp, getApps, initializeApp } from "firebase/app";
import { getFirestore, initializeFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCarQvH_bgBAc3bcEM3fzw7RxTMGlI8reE",
  authDomain: "pokedex-1edfc.firebaseapp.com",
  projectId: "pokedex-1edfc",
  storageBucket: "pokedex-1edfc.firebasestorage.app",
  messagingSenderId: "65144924255",
  appId: "1:65144924255:web:d6f373f005674a3d7f13ea",
  measurementId: "G-TTXBPZ813T",
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

let db;

try {
  db = initializeFirestore(app, {
    experimentalForceLongPolling: true,
  });
} catch (error) {
  db = getFirestore(app);
}

export { db };
