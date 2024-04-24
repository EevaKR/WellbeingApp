import React, { useState, useRef, useEffect } from 'react';
import { Camera } from 'expo-camera';
import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { serverTimestamp, addDoc, firestore, collection, query, onSnapshot, doc } from '../firebase/Config'; // Import firestore-related functions
import * as FileSystem from 'expo-file-system';
import * as ImageManipulator from 'expo-image-manipulator';
import { convertFirebaseTimeStampToJS } from '../helpers/Functions';

export default function AppCamera() {
  const [type, setType] = useState(Camera.Constants.Type.back);
  const cameraRef = useRef(null);
  const [pictures, setPictures] = useState([])

  const formatDate = (date) => {
    if (!date) {
      return null;
    }
    if (date instanceof Date) {
      const year = date.getFullYear();
      let month = date.getMonth() + 1;
      if (month < 10) {
        month = '0' + month;
      }
      let day = date.getDate();
      if (day < 10) {
        day = '0' + day;
      }
      return `${year}-${month}-${day}`;
    } else if (date.toDate instanceof Function) {
      return formatDate(date.toDate());
    }
    return date;
  };

  const compressImage = async (uri) => {
    try {
      const manipulatedImage = await ImageManipulator.manipulateAsync(
        uri,
        [{ resize: { width: 800, height: 800 } }],
        { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
      );
      return manipulatedImage.uri;
    } catch (error) {
      console.error('Error compressing image:', error);
      throw error;
    }
  };

  const takePicture = async () => {
    if (cameraRef.current) {
      const { uri } = await cameraRef.current.takePictureAsync();
      console.log('Original Picture URI:', uri);
      const compressedUri = await compressImage(uri);
      console.log('Compressed Picture URI:', compressedUri);
      await savePicture(compressedUri);
    }
  };

  const savePicture = async (base64, date, createdDate, newDate ) => {
    try {

       const base64Image = await FileSystem.readAsStringAsync(base64, {
        encoding: FileSystem.EncodingType.Base64,
      });
      const createdDate = convertFirebaseTimeStampToJS(newDate); 
      const docRef = await addDoc(collection(firestore, 'PICTURES'), {
        timestamp: formatDate(new Date()),
        base64: base64Image
      });
      console.log('Picture saved', docRef.id);
    } catch (error) {
      console.error('Error saving picture', error);
    }
  };

  
  
  return (
    <View style={styles.container}>
      <Camera style={styles.camera} type={type} ref={cameraRef}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={takePicture}>
            <Text style={styles.text}>Take Picture</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() =>
              setType(
                type === Camera.Constants.Type.back
                  ? Camera.Constants.Type.front
                  : Camera.Constants.Type.back
              )
            }>
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
