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
import StepCounter, { steps } from './components/StepCounter';
import Home from './screens/Home'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome';
import { location, getUserPosition, icon } from './screens/Map'
import Tracker from './screens/Tracker';
import { CustomCalendar } from './components/CustomCalendar';
import PeriodCalendar from './components/PeriodCalendar';
import Medicine from './screens/Medicine';


const settings = {
  backgroundColor: '#00a484'
}


//Firebaseen tietokantaan joka päivälle oma rivi jonne askeleet tallentuu. Mihin tallentuu reitti???
//voisiko etusivulla olla kuva joka haetaan firebasesta??? 
//firebasen tilien teko, jokaisella käyttäjällä tulee olla tili jonne asiat tallentuu.
// sivustolla tulee olla sivu jossa  käyttäjä voi tehdä käyttäjätunnuksen ja salasanan

const Tab = createBottomTabNavigator();

export default function App() {

  function MapScreen() {
    return (
      <View style={styles.map}>
        <Text style={styles.text}>{steps}</Text>

        <Map location={location} icon={icon} getUserPosition={getUserPosition} />

      </View>
    );
  }

  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen
          name="Home"
          component={Home}
          options={{
            tabBarLabel: 'Home',
            tabBarIcon: ({ color, size }) => (
              <Icon name="home" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen  style={styles.map}
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
          name="Period"
          component={PeriodCalendar}
          options={{
            tabBarLabel: 'Period',
            tabBarIcon: ({ color, size }) => (
              <Icon name="calendar" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          name="Trackers"
          component={Tracker}
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
    backgroundColor: '#93E9BE',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Platform.OS === 'android' ? Constants.statusBarHeight : 0
  },
  home: {
    backgroundColor: '#93E9BE',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',

  },
  map: {
    backgroundColor: '#18A558',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    

  },

  medicine: {
    backgroundColor: '#93E9BE',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  period: {
    backgroundColor: '#93E9BE',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  trackers: {
    backgroundColor: '#93E9BE',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    textShadowColor: '#EBEEF1',
    color: '#3B9778',
    textAlign: 'auto',
    textTransform: 'uppercase',
    textDecorationColor: '#EBEEF1',
  }

});
