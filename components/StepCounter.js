import { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';


export default function StepCounter() {

  
  const [currentStepCount, setCurrentStepCount] = useState(0);

  return (
    <View style={styles.container}>
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
