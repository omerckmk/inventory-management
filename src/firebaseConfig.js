import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyAYyhgUG-88lfQkHShCFG2aysC3ywIAK14",
    authDomain: "kleiding-inventarisatie.firebaseapp.com",
    projectId: "kleiding-inventarisatie",
    storageBucket: "kleiding-inventarisatie.appspot.com",
    messagingSenderId: "142125810173",
    appId: "1:142125810173:web:6205e0ebbd82d2d7c8d994",
    measurementId: "G-5VG2BF5BRF"
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp); // Firestore instance'ı oluşturuyoruz

export { db, collection, addDoc, getDocs, doc, updateDoc, deleteDoc };

