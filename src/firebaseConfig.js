// src/firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { getAuth } from "firebase/auth";

// Firebase yapılandırma bilgileri
const firebaseConfig = {
    apiKey: "AIzaSyAYyhgUG-88lfQkHShCFG2aysC3ywIAK14",
    authDomain: "kleiding-inventarisatie.firebaseapp.com",
    databaseURL: "https://kleiding-inventarisatie-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "kleiding-inventarisatie",
    storageBucket: "kleiding-inventarisatie.appspot.com",
    messagingSenderId: "142125810173",
    appId: "1:142125810173:web:6205e0ebbd82d2d7c8d994",
    measurementId: "G-5VG2BF5BRF"
};

// Firebase uygulamasını başlat
const app = initializeApp(firebaseConfig);

// Firestore instance'ı oluştur
const db = getFirestore(app);

// Auth instance'ı oluştur
const auth = getAuth(app);

// Gerekli değişkenleri dışa aktar
export { db, auth, collection, addDoc, getDocs, doc, updateDoc, deleteDoc };
