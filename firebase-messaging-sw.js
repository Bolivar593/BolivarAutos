// Firebase Messaging Service Worker — BolivarAutos
// bolivarautos.ca/firebase-messaging-sw.js

importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyBuRACKx_I-WLsCmmquAH9eWwkubwsdmUQ",
  authDomain: "bolivarautos-919e4.firebaseapp.com",
  projectId: "bolivarautos-919e4",
  storageBucket: "bolivarautos-919e4.firebasestorage.app",
  messagingSenderId: "397354528397",
  appId: "1:397354528397:web:52fd2ec53984af7aaa7cc4"
});

const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage(function(payload) {
  console.log('Background message received:', payload);

  const title = payload.notification?.title || '🚗 BolivarAutos — New Car!';
  const body  = payload.notification?.body  || 'Check our latest inventory at bolivarautos.ca';

  self.registration.showNotification(title, {
    body:  body,
    icon:  '/preview.jpg',
    badge: '/preview.jpg',
    data:  { url: 'https://bolivarautos.ca' }
  });
});

// Click on notification opens the site
self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data?.url || 'https://bolivarautos.ca')
  );
});
