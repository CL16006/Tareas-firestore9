import firebase from "firebase/compat/app";
import { getFirestore, collection, query, where, getDocs,addDoc,doc, deleteDoc,updateDoc,Timestamp  } from "firebase/firestore";


// Agregar configuración firebase:
var firebaseConfig = {
  apiKey: "AIzaSyBBNJmjq89epHeXVlMfzsi7gLmmryRlo9g",
  authDomain: "quasar-project1-4017b.firebaseapp.com",
  projectId: "quasar-project1-4017b",
  storageBucket: "quasar-project1-4017b.appspot.com",
  messagingSenderId: "175781501293",
  appId: "1:175781501293:web:36c7918e44fcfcea486264"
};

let firebaseApp = firebase.initializeApp(firebaseConfig);

const db = getFirestore(firebaseApp);

export { db, firebase,collection,query,where,getDocs,addDoc,doc, deleteDoc,updateDoc,Timestamp  };
