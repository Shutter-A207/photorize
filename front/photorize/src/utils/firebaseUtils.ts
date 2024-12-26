import { requestFcmToken } from "../firebaseConfig";
import { onMessageListener } from "../firebaseConfig";

export const initializeFirebaseService = (showToast: Function) => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/firebase-messaging-sw.js")
        .then((registration) => {
          console.log("Service Worker registered with scope:", registration.scope);
          requestFcmToken();
        })
        .catch((error) => {
          console.error("Service Worker registration failed:", error);
        });
    }
  
    onMessageListener((payload) => {
      showToast(
        `${payload.notification?.title || "알림"} 알림함에서 확인해보세요.`,
        "info"
      );
    });
  };
  