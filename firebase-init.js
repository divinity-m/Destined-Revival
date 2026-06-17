import { initializeApp } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-analytics.js";

// The web app's Firebase configuration | LEAKED API KEY AIzaSyDuPa2yeylf967Z2c6ZyUi5CGn8pTO0Qn4
const firebaseConfig = JSON.parse(process.env.FIREBASE_CONFIG);

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export { app };
const analytics = getAnalytics(app);

window.firebaseApp = app;
window.firebaseAnalytics = analytics;
