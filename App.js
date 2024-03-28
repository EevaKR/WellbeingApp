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


const settings = {
  backgroundColor: '#00a484'
}

const icons = {
  location_not_known: 'crosshairs',
  location_searching: 'crosshairs-question',
  location_found: 'crosshairs-gps'
}

// TO DO : APPBAR, STEPSCOUNTER, NAVIGAATIO LOPPUUN(katso jounin navi-ohje), GITREPO UUSI TEE!!
//TEE PAIKANNUS OIKEIN (NYT KOVAKOODATTUNA KOORDIKSET)
//Firebaseen tietokantaan joka päivälle oma rivi jonne askeleet tallentuu. Mihin tallentuu reitti???
export default function App() {

  const [location, setLocation] = useState({
    latitude: 65.0800,
    longitude: 25.4800,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421
  })

  const [icon, setIcon] = useState(icons.location_not_known)

  const Stack = createNativeStackNavigator();

  const getUserPosition = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync()

    try {
      if (status !== 'granted') {
        console.log('Geolocation failed')
        return
      }
      const position = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High })
      setLocation({ ...location, "latitude": position.coords.latitude, "longitude": position.coords.longitude })
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    (async () => {
      getUserPosition()
    })()
  }, [])


  return (
      <PaperProvider>
        <NavigationContainer>
        <MainAppBar
          title="Map"
          backgroundColor={settings.backgroundColor}
          icon={icon}
          getUserPosition={getUserPosition}
        />
        <SafeAreaView style={styles.container}>
          <Map location={location} />
        </SafeAreaView>
        </NavigationContainer>
      </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Platform.OS === 'android' ? Constants.statusBarHeight : 0
  },
});
