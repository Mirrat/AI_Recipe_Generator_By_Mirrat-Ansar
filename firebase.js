import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// webFirebase configuration 
const firebaseConfig = {
    apiKey: "AIzaSyDK7nPWrOAHylfjLp_zVeZPuoKeaINNHkc",
    authDomain: "my-rec-auth.firebaseapp.com",
    projectId: "my-rec-auth",
    storageBucket: "my-rec-auth.firebasestorage.app",
    messagingSenderId: "865121014028",
    appId: "1:865121014028:web:f9d408171d1118f14cf929"
};

// Initializing Firebase app
const app = initializeApp(firebaseConfig);

// The Auth instance
const auth = getAuth(app);

export { auth };