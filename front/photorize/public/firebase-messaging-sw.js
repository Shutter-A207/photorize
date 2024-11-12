importScripts(
  "https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging-compat.js"
);

firebase.initializeApp({
  apiKey: "AIzaSyAbkgjryqgud-hRrhkCODh_Oyfllpt5D6A",
  authDomain: "photorize.firebaseapp.com",
  projectId: "photorize",
  storageBucket: "photorize.firebasestorage.app",
  messagingSenderId: "861455849931",
  appId: "1:861455849931:web:afd2902adcaacb75b47e4e",
  measurementId: "G-4F2TP0S4RK",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log("백그라운드 메시지 수신:", payload);
  const { title, body } = payload.notification;
  self.registration.showNotification(title, { body });
});
