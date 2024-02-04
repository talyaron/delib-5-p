// cypress/support/index.ts

// Import Firebase and Firestore
import * as firebase from 'firebase/app';
import 'firebase/firestore';

// Cypress.Commands.add('seedFirestore', (data) => {
//   cy.log('Seeding Firestore with data', data);
  
//   // Add code to seed Firestore with initial data
//   // For example: firebase.firestore().collection('yourCollection').doc('yourDoc').set(data);
// });

before(() => {
  // Start Firestore Emulator
  cy.exec('firebase emulators:start --only firestore', { timeout: 120000 })
    .its('code')
    .should('eq', 0);

  // Initialize Firebase with emulator settings
  firebase.initializeApp({
    apiKey: "AIzaSyD-117AZU4nEdFo1Z2XRvVZO-_Dj8QQCf4",
    authDomain: "delib-v3-dev.firebaseapp.com",
    databaseURL: "https://delib-v3-dev.firebaseio.com",
    projectId: "delib-v3-dev",
    storageBucket: "delib-v3-dev.appspot.com",
    messagingSenderId: "78129543863",
    appId: "1:78129543863:web:1e4884c2e1f88b0810eb32",
    measurementId: "G-TFEFHKEX4D",
  });
});

after(() => {
  // Stop Firestore Emulator after tests
  cy.exec('firebase emulators:stop', { timeout: 60000 })
    .its('code')
    .should('eq', 0);
});
