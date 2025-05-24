import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';


const firebaseConfig = {
  apiKey: "AIzaSyBUYjjHS8gNNSaayE_tWWDNcAwpGaTTf1U",
  authDomain: "adv-final-project-bdcde.firebaseapp.com",
  projectId: "adv-final-project-bdcde",
  storageBucket: "adv-final-project-bdcde.firebasestorage.app",
  messagingSenderId: "999063093734",
  appId: "1:999063093734:web:e56a8730ed7eb07aa79627",
  measurementId: "G-1KZ4E2JLYS"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);