import { initializeApp } from "firebase/app";

import {
  getFirestore
} from "firebase/firestore";

const firebaseConfig = {

  apiKey:
    "AIzaSyCOno8DsqETY9QtXDia6fTLdNvgkLofK_g",

  authDomain:
    "challenge-yourself-b6968.firebaseapp.com",

  projectId:
    "challenge-yourself-b6968",

  storageBucket:
    "challenge-yourself-b6968.firebasestorage.app",

  messagingSenderId:
    "842513255500",

  appId:
    "1:842513255500:web:072265a11a1e270f7638e9"
};

const app =
  initializeApp(
    firebaseConfig
  );

export const db =
  getFirestore(app);