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


const settings = {
  backgroundColor: '#00a484'
}


//Firebaseen tietokantaan joka päivälle oma rivi jonne askeleet tallentuu. Mihin tallentuu reitti???
//voisiko etusivulla olla kuva joka haetaan firebasesta??? 
//firebasen tilien teko, jokaisella käyttäjällä tulee olla tili jonne asiat tallentuu.
// sivustolla tulee olla sivu jossa  käyttäjä voi tehdä käyttäjätunnuksen ja salasanan

export default function App() {

  const Stack = createNativeStackNavigator();

  // antdesign: home
  function HomeScreen() {
    return (
      <View style={styles.home}>
        <CustomCalendar />
      </View>
    );
  }


  // tää löytyy jo jostain
  function MapScreen() {
    return (
      <View style={styles.map}>
        <Text style={styles.text}>{steps}</Text>

        <Map location={location} icon={icon} getUserPosition={getUserPosition} />

      </View>
    );
  }

  // antdesing: heart
  function TrackersScreen() {
    return (
      <View style={styles.trackers}>
        <Tracker />

      </View>
    );
  }

  // FontAwesome5: pills
  function MedicineScreen() {
    return (
      <View style={styles.medicine}>
        <Text style={styles.text}>Medicine Screen</Text>

      </View>
    );
  }

  ////Fontisto : blood-drop
  function PeriodScreen() {
    return (
      <View style={styles.period}>
        <PeriodCalendar />
      </View>
    );
  }

  const Tab = createBottomTabNavigator();

  /// MITEN JAKAA SIVUT ERI KOMPONENTTEIHIN???
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen style={styles.home} name="Home" component={HomeScreen} />
        <Tab.Screen style={styles.map}
          name="Map"
          component={MapScreen}
          location={location}
          getUserPosition={getUserPosition}
          icon='arrowright'

        />

        <Tab.Screen style={styles.medicine} name="Medicine" component={MedicineScreen} />
        <Tab.Screen style={styles.period} name="Period" component={PeriodScreen} />
        <Tab.Screen style={styles.trackers} name="Trackers" component={TrackersScreen} />
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
    backgroundColor: '#93E9BE',
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

/*
 <MainAppBar
          title="Map"
          backgroundColor={settings.backgroundColor}
          icon={icon}
          getUserPosition={getUserPosition}
        />

///////////////////
  <SafeAreaView style={styles.container}>
          <Map location={location} />
          <Text style={styles.step}>{steps}</Text>
        </SafeAreaView>

        ///////



         <Stack.Navigator initialRouteName="WELCOME">
        <Stack.Screen
          name="Home"
          component={Home}
          options={{
            title: 'Home',
            headerTitle: 'Home'
          }}
        />
         <Stack.Screen
          name="Map"
          component={Map}
          options={{
            title: 'Map',
            headerTitle: 'Map'
          }}
        />
       
      
        </Stack.Navigator>

*/
