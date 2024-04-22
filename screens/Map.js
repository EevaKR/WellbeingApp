import { View, Text, Button } from 'react-native'
import React from 'react'
import MapView, { Marker , PROVIDER_GOOGLE} from 'react-native-maps'
import { StyleSheet } from 'react-native'
import { useState, useEffect } from 'react'
import * as Location from 'expo-location'
import { PaperProvider } from 'react-native-paper'
import MainAppBar from '../components/MainAppBar'
import { Pedometer } from 'expo-sensors'
import { Polyline } from 'react-native-maps';







export default function Map(props, { navigation }) {

    const [location, setLocation] = useState({
        latitude: 65.0800,
        longitude: 25.4800,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421
    })

    const icons = {
        location_not_known: 'crosshairs',
        location_searching: 'crosshairs-question',
        location_found: 'crosshairs-gps'
    }

    const [icon, setIcon] = useState(icons.location_not_known)

    const [routeCoordinates, setRouteCoordinates] = useState([]);


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
      getLocationPermission();
    }, []);


    const getLocationPermission = async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          console.error('Location permission not granted');
        } else {
          startLocationTracking();
        }
      };

      const startLocationTracking = async () => {
        Location.watchPositionAsync(
          { accuracy: Location.Accuracy.BestForNavigation, timeInterval: 1000 },
          (newLocation) => {
            const { latitude, longitude } = newLocation.coords;
            const newCoordinates = [...routeCoordinates, { latitude, longitude }];
            setRouteCoordinates(newCoordinates);
            setLocation(newLocation);
          }
        );
      };

   

    useEffect(() => {
        (async () => {
            getUserPosition()
        })()
    }, [])

    const [marker, setMarker] = useState(null)
    const showMarker = (e) => {
        const coords = e.nativeEvent.coordinate
        setMarker(coords)
    }

    return (
        <View style={styles.container}>
        <MapView
            style={styles.map}
            region={location}
            mapType='standard'
            onLongPress={showMarker}

      >
        {location && <Polyline coordinates={routeCoordinates} strokeWidth={5} />}       
        </MapView>
        <Button title="Start Tracking" onPress={startLocationTracking} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        
    },
    map: {
     flex: 1,
      
    },
})
