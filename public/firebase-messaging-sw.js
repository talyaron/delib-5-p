
importScripts(
    "https://www.gstatic.com/firebasejs/9.2.0/firebase-app-compat.js"
);
importScripts(
    "https://www.gstatic.com/firebasejs/9.2.0/firebase-messaging-compat.js"
);

//https://cdnjs.cloudflare.com/ajax/libs/firebase/10.1.0/firebase-messaging-sw.min.js

// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// https://firebase.google.com/docs/web/setup#config-object
firebase.initializeApp({
    apiKey: "AIzaSyBEumZUTCL3Jc9pt7_CjiSVTxmz9aMqSvo",
    authDomain: "synthesistalyaron.firebaseapp.com",
    databaseURL: "https://synthesistalyaron.firebaseio.com",
    projectId: "synthesistalyaron",
    storageBucket: "synthesistalyaron.appspot.com",
    messagingSenderId: "799655218679",
    appId: "1:799655218679:web:1409dd5e3b4154ecb9b2f2",
    measurementId: "G-XSGFFBXM9X",
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
    try {
        // Customize notification here
        if (!payload.notification) throw new Error("no data");
        console.log(payload)
        const { title, body } = payload.notification;
      
        const notificationTitle = title || "Background Message";
        const notificationOptions = {
            body,
            icon: "https://firebasestorage.googleapis.com/v0/b/synthesistalyaron.appspot.com/o/logo%2Flogo-48px.png?alt=media&token=e2d11208-2c1c-4c29-a422-42a4e430f9a0",
            badge: "https://firebasestorage.googleapis.com/v0/b/synthesistalyaron.appspot.com/o/logo%2Flogo-48px.png?alt=media&token=e2d11208-2c1c-4c29-a422-42a4e430f9a0",
            dir: "rtl",
            tag: "confirm-notification",
        };

        self.registration.showNotification(
            notificationTitle,
            notificationOptions
        );
        
        // navigator.setAppBadge(1);
        //play sound

        // const notificationSound = new Audio('https://delib-5.web.app/assets/sound/sweet_notification.mp3');
        // notificationSound.play();

        self.addEventListener("notificationclick", function (event) {
            event.notification.close();
            if (event.action === "explore") {
                clients.openWindow(event.notification.data.url);
            } else if (event.action === "close") {
            } else {
                clients.openWindow(event.notification.data.url);
            }
        });
    } catch (error) {
        console.error(error);
    }
});


