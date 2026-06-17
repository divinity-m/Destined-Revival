import { initializeApp } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-analytics.js";

// Check if running in a CI environment with the injected variable
const configSource = process.env.FIREBASE_CONFIG;

// The web app's Firebase configuration | LEAKED API KEY AIzaSyDuPa2yeylf967Z2c6ZyUi5CGn8pTO0Qn4
const firebaseConfig = configSource
  ? JSON.parse(configSource)
  : {
      apiKey: process.env.FIREBASE_KEY,
      authDomain: "destined-revival.firebaseapp.com",
      projectId: "destined-revival",
      storageBucket: "destined-revival.firebasestorage.app",
      messagingSenderId: "955217871912",
      appId: "1:955217871912:web:2cd980116310e4151de11d",
      measurementId: "G-W3S0BR27TQ"
    };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export { app };
const analytics = getAnalytics(app);

window.firebaseApp = app;
window.firebaseAnalytics = analytics;
