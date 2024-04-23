import React, { useState, useRef } from 'react';
import { Camera } from 'expo-camera';
import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { serverTimestamp, addDoc, firestore, PICTURES, collection } from 'firebase/firestore';
import { encode } from 'base-64'; // Import the Base64 encoding function




export default function AppCamera() {
  const [type, setType] = useState(Camera.Constants.Type.back);
  const cameraRef = useRef(null);

  const savePicture = async (pictureURI) => {
    try {
      const base64Image = await convertToBase64(pictureURI);
      const pictureData = {
        base64: base64Image,
        timestamp: serverTimestamp()
      };
      const docRef = await addDoc(collection(firestore, 'PICTURES'), pictureData);
      console.log('Picture saved', docRef.id);
    } catch (error) {
      console.error('Error saving picture', error);
    }
  }
  
  const convertToBase64 = async (uri) => {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      const base64String = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
      return base64String.split(',')[1]; // Extract base64 string without data URI prefix
    } catch (error) {
      console.error('Error converting to Base64:', error);
      throw error;
    }
  }


  const takePicture = async () => {
    if (cameraRef.current) {
      const { uri } = await cameraRef.current.takePictureAsync();
      console.log('Picture URI:', uri);
      await savePicture(uri);
    }
  };


  return (
    <View style={styles.container}>
      <Camera style={styles.camera} type={type} ref={cameraRef}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={takePicture}>
            <Text style={styles.text}>Take Picture</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => setType(
            type === Camera.Constants.Type.back
              ? Camera.Constants.Type.front
              : Camera.Constants.Type.back
          )}>
            <Text style={styles.text}>Flip Camera</Text>
          </TouchableOpacity>
        </View>
      </Camera>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    marginBottom: 20,
  },
  button: {
    flex: 1,
    alignSelf: 'flex-end',
    alignItems: 'center',
    paddingVertical: 10,
  },
  text: {
    fontSize: 18,
    color: 'white',
  },
});
