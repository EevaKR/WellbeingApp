import { View, Text } from 'react-native'
import React from 'react'
import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import {collection, addDoc} from 'firebase/firestore'


const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_API_KEY,
  authDomain: process.env.EXPO_PUBLIC__AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_APP_ID
};

// Initialize Firebase
initializeApp(firebaseConfig);

const firestore = getFirestore();

const STEPS = 'steps'

const PICTURES = 'pictures'

export {
    firestore,
    collection,
    addDoc,
    STEPS,
    PICTURES
}; 
