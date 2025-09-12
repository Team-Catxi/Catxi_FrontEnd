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
  console.log('백그라운드 메시지 수신:', payload);
  
  // 중복 방지: preventDuplicate 플래그가 있으면 수동 알림을 생성하지 않음
  if (payload.data?.preventDuplicate === "true") {
    console.log('중복 방지: 백그라운드에서 수동 알림 생성 스킵');
    return; // OS의 notification 페이로드 알림만 표시
  }
  
  // 기존 로직 (preventDuplicate가 없는 경우에만 실행)
  const notificationTitle = payload.data?.title || payload.notification?.title || "새 알림";
  const notificationBody = payload.data?.body || payload.notification?.body || "";
  
  const notificationOptions = {
    body: notificationBody,
    icon: "/favicon.ico",
    data: payload.data,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});