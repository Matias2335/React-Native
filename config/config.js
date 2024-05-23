// Import the functions you need from the SDKs you need
import firebase from "firebase";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBgTUoP98GVfT6hMchXmGnomEufhanpNgY",
  authDomain: "projeto-cm-4aac5.firebaseapp.com",
  databaseURL: "https://projeto-cm-4aac5-default-rtdb.firebaseio.com",
  projectId: "projeto-cm-4aac5",
  storageBucket: "projeto-cm-4aac5.appspot.com",
  messagingSenderId: "314399960553",
  appId: "1:314399960553:web:a2c74f9d34248cf62aaf78",
  measurementId: "G-H0YGKD71YY"
};

// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export default firebase;