import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Map from './screens/Map';
import { useState, useEffect } from 'react';
import { PaperProvider } from 'react-native-paper';
import Constants from 'expo-constants';
import MainAppBar from './components/MainAppBar';
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
import { firestore, addDoc, STEPS, collection, PICTURES } from './firebase/Config'
import Camera from './components/Camera';
import MapView from './screens/Map'
import * as Location from 'expo-location'






export default function App(props, Location) {

  const Stack = createNativeStackNavigator();
  const save = async (stepCount, pictureUri) => {
    try {
      const stepDocRef = await addDoc(collection(firestore, STEPS), {
        number: stepCount
      })

      console.log('Steps saved.')
      const pictureDocRef = await addDoc(collection(firestore, PICTURES), {
        url: pictureUri
      });
      console.log('Picture saved.');

      setPastStepCount('');
      // Clear picture state or perform any necessary cleanup
      setPictureUri('');

      console.log('Data saved successfully.');
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

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
        region={{location}}
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
          component={MedicineScreen}
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
        style= {styles.period}
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
         style= {styles.trackers}
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
