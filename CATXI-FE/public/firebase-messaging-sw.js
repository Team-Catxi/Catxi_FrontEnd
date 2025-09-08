importScripts("https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.22.0/firebase-messaging-compat.js");

const firebaseConfig = {
  apiKey: "AIzaSyD2z99UX7YyAFs2rAYVADTHsKImEJUgVuU",
  authDomain: "catxi-6cf52.firebaseapp.com",
  projectId: "catxi-6cf52",
  storageBucket: "catxi-6cf52.firebasestorage.app",
  messagingSenderId: "577203056381",
  appId: "1:577203056381:web:1d87640210f4c347c1d894",
  measurementId: "G-GHZW517CZS"
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: "/favicon.ico",
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
