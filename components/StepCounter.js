import { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Pedometer } from 'expo-sensors';


export default function StepCounter() {

  const [pastStepCount, setPastStepCount] = useState(0);
  const [currentStepCount, setCurrentStepCount] = useState(0);

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



return (
  <View style={styles.container}>
    <Text style={styles.text}>Steps taken yesterday: {pastStepCount}</Text>
    <Text style={styles.text}>Current step counts: {currentStepCount}</Text>
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


//<Text style={styles.text}>Pedometer.isAvailableAsync(): {isPedometerAvailable}</Text>