import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Map from './screens/Map';
import { useState, useEffect } from 'react';
import { PaperProvider } from 'react-native-paper';
import Constants from 'expo-constants';
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import Home from './screens/Home'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome';
import { location, getUserPosition, icon } from './screens/Map'
import Tracker from './screens/Tracker';
import { CustomCalendar } from './components/CustomCalendar';
import PeriodCalendar from './components/PeriodCalendar';
import Medicine from './screens/Medicine';
import StepCounter from './components/StepCounter';
import { firestore, addDoc, STEPS, collection, PICTURES, query } from './firebase/Config'
import Camera from './components/Camera';
import { convertFirebaseTimeStampToJS } from './helpers/Functions';
import { QuerySnapshot, onSnapshot, serverTimestamp } from './firebase/Config';
import { useRef } from 'react';


export default function App(props, Location) {

  const Stack = createNativeStackNavigator();
  const [currentStepCount, setCurrentStepCount] = useState('');
  const cameraRef = useRef(null);


  useEffect(() => {
    const q = query(collection(firestore, STEPS));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      querySnapshot.forEach((doc) => {
        setCurrentStepCount(doc.data().number);
      });
    });

    return () => unsubscribe();
  }, []);

  const saveStepCount = async (stepCount) => {
    try {
      const docRef = await addDoc(collection(firestore, STEPS), {
        number: stepCount,
        created: serverTimestamp()
      });
      setCurrentStepCount('');
      console.log('Steps saved');
    } catch (error) {
      console.error('Error saving steps:', error);
    }
  };

  const save = async (stepCount) => {
    try {
      const docRef = await addDoc(collection(firestore, STEPS), {
        number: stepCount,
        created: serverTimestamp()
      });
      console.log('Steps saved.')
    } catch (error) {
      console.log('Error saving steps: ', error)
    }

    useEffect(() => {
      const q = query(collection(firestore, STEPS));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const tempSteps = [];

        querySnapshot.forEach((doc) => {
          const stepObject = {
            id: doc.id,
            number: doc.data().number,
            created: convertFirebaseTimeStampToJS(doc.data().created)
          };
          tempSteps.push(stepObject);
        });
      });


      return () => unsubscribe();
    }, []);


    useEffect(() => {
      let subscription;
      const subscribeToStepCount = async () => {
        const start = new Date();
        const end = new Date();
        start.setHours(0, 0, 0, 0);
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

  }

  //kalenteri suuremmaksi

  function HomeScreen() {
    return (
      <View style={styles.home}>
        <CustomCalendar />
      </View>
    );
  }
  function MapScreen() {
    return (
      <View style={styles.map}>
        <Map
          region={{ location }}
        />
        <StepCounter style={styles.step} />
      </View>
    );
  }


  function CameraScreen() {
    return (
      <View style={styles.camera}>
        <Camera />
      </View>
    );
  }

  function TrackersScreen() {
    return (
      <View style={styles.trackers}>
        <Tracker />
      </View>
    );
  }

  function MedicineScreen() {
    return (
      <View style={styles.medicine}>
      </View>
    );
  }

  function PeriodScreen() {
    return (
      <View style={styles.period}>
        <PeriodCalendar />
      </View>
    );
  }

  const Tab = createBottomTabNavigator();

  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen style={styles.home}
          name="Home"
          component={HomeScreen}
          options={{
            tabBarLabel: 'Home',
            tabBarIcon: ({ color, size }) => (
              <Icon name="home" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen style={styles.map}
          name="Map"
          component={MapScreen}
          options={{
            tabBarLabel: 'Map',
            tabBarIcon: ({ color, size }) => (
              <Icon name="map-marker" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          name="Medicine"
          component={Medicine}
          options={{
            tabBarLabel: 'Medicine',
            tabBarIcon: ({ color, size }) => (
              <Icon name="medkit" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          style={styles.camera}
          name="Camera"
          component={Camera}
          options={{
            tabBarLabel: 'Camera',
            tabBarIcon: ({ color, size }) => (
              <Icon name="camera" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          style={styles.period}
          name="Period"
          component={PeriodScreen}
          options={{
            tabBarLabel: 'Period',
            tabBarIcon: ({ color, size }) => (
              <Icon name="calendar" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          style={styles.trackers}
          name="Trackers"
          component={TrackersScreen}
          options={{
            tabBarLabel: 'Trackers',
            tabBarIcon: ({ color, size }) => (
              <Icon name="heartbeat" color={color} size={size} />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#B7CFDC',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Platform.OS === 'android' ? Constants.statusBarHeight : 0
  },
  home: {
    backgroundColor: '#B7CFDC',
    flex: 10,
    alignItems: 'center',
    justifyContent: 'center',

  },
  map: {
    backgroundColor: '#B7CFDC',
    flex: 1,
    alignItems: 'center',
    marginTop: '10',
    marginBottom: '20'
  },

  medicine: {
    backgroundColor: '#B7CFDC',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  period: {
    backgroundColor: '#B7CFDC',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  trackers: {
    backgroundColor: '#B7CFDC',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    textShadowColor: '#385E72',
    color: '#3B9778',
    textAlign: 'auto',
    textTransform: 'uppercase',
    textDecorationColor: '#385E72',
  },

  step: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  camera: {
    backgroundColor: '##B7CFDC',
    flex: 1,
    alignItems: 'center',
    marginTop: '10',
    marginBottom: '20'
  }
});
