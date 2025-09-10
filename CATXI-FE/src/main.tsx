import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <>
    <App />
  </>
);

if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/firebase-messaging-sw.js")
    .then(() => {
      console.log("Firebase Service Worker 등록 성공");
    })
    .catch((err) => {
      console.error("Firebase Service Worker 등록 실패:", err);
    });
}
