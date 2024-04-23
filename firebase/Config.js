import { View, Text } from 'react-native'
import React from 'react'
import { initializeApp } from 'firebase/app'
import {collection, addDoc, serverTimestamp, getFirestore, query, onSnapshot, where, getDocs} from 'firebase/firestore'


const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_API_KEY,
  authDomain: process.env.EXPO_PUBLIC__AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_APP_ID
};

// Initialize Firebase
//initializeApp(firebaseConfig);
const app = initializeApp(firebaseConfig);
const firestore = getFirestore();

const STEPS = 'steps'

const PICTURES = 'pictures'

export {
    app,
    firestore,
    collection,
    addDoc,
    STEPS,
    PICTURES,
    serverTimestamp,
    query,
    onSnapshot,
    where, 
    getDocs
}; 