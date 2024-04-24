import { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Pedometer } from 'expo-sensors';
import { Button } from 'react-native';
import {addDoc, collection, firestore} from '../firebase/Config'

export default function StepCounter() {

  const [currentStepCount, setCurrentStepCount] = useState(2524);
  const [stepCount, setStepCount] = useState(0);

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


  useEffect(() => {
    let subscription;
    const subscribeToStepCount = async () => {
      const start = new Date();
      const end = new Date(); 
      start.setHours(0 ,0 ,0 , 0); 
      try {
        const { steps } = await Pedometer.getStepCountAsync(start, end);
        setCurrentStepCount(steps);
        subscription = Pedometer.watchStepCount(result => {
          setCurrentStepCount(result.steps)
        })
      } catch (error) {
        console.error("Error getting step count:", error);
      }
     subscribeToStepCount();
      return () => {
        if (subscription) {
          subscription.remove()
        }
      };
    };

  }, []);

  const save = async ( ) => {
    try {
      const docRef = await addDoc(collection(firestore, 'STEPS'), {
        timestamp: formatDate(new Date()),
        steps: currentStepCount
      });
      console.log('Steps saved');
    } catch (error) {
      console.error('Error saving steps', error);
    }
  };

return (
  <View style={styles.container}>
    <Text style={styles.text}>Steps counted: {currentStepCount}</Text>
    <Button title="Save" type="button" onPress={save} />
  </View>
);
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    textShadowColor: '#385E72',
    color: '#385E72',
    textAlign: 'auto',
    textTransform: 'uppercase',
    textDecorationColor: '#385E72',
  },
});