console.info('firebase-messaging-sw.js')

importScripts('https://www.gstatic.com/firebasejs/10.7.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.0/firebase-messaging-compat.js');

console.info('firebase-messaging-sw.js is loaded');
// Listen for notification clicks
self.addEventListener('notificationclick', function (event) {
  // Handle the notification click
  console.log('Notification click received:', event);
  // You can add logic to open a specific URL or handle the event in other ways
});


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
  measurementId: "G-XSGFFBXM9X"
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();

messaging.onMessage(function (payload) {
  try {
    // Customize notification here
    if (!payload.data) throw new Error('no data');
    console.log('Message received. ', payload);


  } catch (error) {
    console.error(error)
  }
});

console.info('version 1.0.4');

messaging.onMessage(function (payload) {
  console.log('foreground Message received. ', payload);
});

if(navigator.setAppBadge){
  console.log('navigator.setAppBadge is supported');
}

messaging.onBackgroundMessage(function (payload) {
  console.log('background Message received. ', payload);
  navigator.setAppBadge(1).then(()=>{
    console.log('setAppBadge success');
  }).catch((err)=>{
    console.log('setAppBadge error',err);
  })


  



  // Customize notification here
  if (!payload.data) throw new Error('no data');
  const { title, body, url } = payload.data;
  const notificationTitle = title || 'Background Message Title';
  const notificationOptions = {
    body,
    icon: 'https://delib-5.web.app/assets/logo-128px-a9e7b0f8.png',
    data: { url },
    badge: 'https://delib-5.web.app/assets/logo-128px-a9e7b0f8.png',
    dir: 'rtl',
    tag: 'confirm-notification',
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
  navigator.setAppBadge(1);


})



// messaging.onBackgroundMessage(function (payload) {
//   try {
//     console.log('background Message received. ', payload);
//     // Customize notification here
//     if (!payload.data) throw new Error('no data');
//     const { title, body, url } = payload.data;
//     const notificationTitle = title || 'Background Message Title';
//     const notificationOptions = {
//       body,
//       icon: 'https://delib-5.web.app/assets/logo-128px-a9e7b0f8.png',
//       data: { url },
//       badge: 'https://delib-5.web.app/assets/logo-128px-a9e7b0f8.png',
//       dir: 'rtl',
//       tag: 'confirm-notification',


//     };

//     self.registration.showNotification(notificationTitle, notificationOptions);
//     navigator.setAppBadge(1);
   
//   } catch (error) {
//     console.error(error)
//   }
// });