import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAvPykRpJu8l-8K26wLIaRzJhIIqvGpH_M",
  authDomain: "arq-microservicios-f5474.firebaseapp.com",
  projectId: "arq-microservicios-f5474",
  storageBucket: "arq-microservicios-f5474.firebasestorage.app",
  messagingSenderId: "828045790640",
  appId: "1:828045790640:web:aca1b28e8b01663ff29a75",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;