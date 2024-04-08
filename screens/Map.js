import { View, Text } from 'react-native'
import React from 'react'
import MapView, { Marker } from 'react-native-maps'
import { StyleSheet } from 'react-native'
import { useState, useEffect } from 'react'
import * as Location from 'expo-location'
import { PaperProvider } from 'react-native-paper'
import MainAppBar from '../components/MainAppBar'
import { Pedometer } from 'expo-sensors'



export default function Map(props, {navigation}) {

    // const [isPedometerAvailable, setIsPedometerAvailable] = useState('checking')
    // const [pastStepCount, setPastStepCount] = useState(0);
    // const [currentStepCount, setCurrentStepCount] = useState(0);

    // const subscribe = async () => {
    //     const isAvailable = await Pedometer.isAvailableAsync();
    //     setIsPedometerAvailable(String(isAvailable));

    //     if (isAvailable) {
    //         const end = new Date();
    //         const start = new Date();
    //         start.setDate(end.getDate() - 1);

    //         const pastStepCountResult = await Pedometer.getStepCountAsync(start, end);
    //         if (pastStepCountResult) {
    //             setPastStepCount(pastStepCountResult.steps);
    //         }
    //         return Pedometer.watchStepCount(result => {
    //             setCurrentStepCount(result.steps);
    //         });
    //     }
    // };

    // useEffect(() => {
    //     const subscription = subscribe();
    //     return () => subscription.remove();
    // }, []);

    const [marker, setMarker] = useState(null)

    // const [location, setLocation] = useState({
    //     latitude: 65.0800,
    //     longitude: 25.4800,
    //     latitudeDelta: 0.0922,
    //     longitudeDelta: 0.0421
    // })


    // const getUserPosition = async () => {
    //     let { status } = await Location.requestForegroundPermissionsAsync()

    //     try {
    //         if (status !== 'granted') {
    //             console.log('Geolocation failed')
    //             return
    //         }
    //         const position = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High })
    //         setLocation({ ...location, "latitude": position.coords.latitude, "longitude": position.coords.longitude })
    //     } catch (error) {
    //         console.log(error)
    //     }
    // }

    // useEffect(() => {
    //     (async () => {
    //         getUserPosition()
    //     })()
    // }, [])

    const showMarker = (e) => {
        const coords = e.nativeEvent.coordinate
        setMarker(coords)
    }


    return (

        <MapView
            style={styles.map}
            region={props.location}
            mapType='standard'
            onLongPress={showMarker}
        >
            {marker &&
                <Marker
                    title="My marker"
                    coordinate={{ latitude: marker.latitude, longitude: marker.longitude }}
                />
            }
        </MapView>
    )
}

const styles = StyleSheet.create({

    map: {
        height: '45%',
        width: '75%',
        marginTop: 10,
        marginBottom: 450,

    },

})

/*
LAITA TÄÄ RESULTIIN KUHAN SAA TOIMIIN NÄKYMÄN, VOISKO JOKU ERI KOODI OLLA PAREMPI
 <View style={styles.container}>
<Text>Pedometer.isAvailableAsync(): {isPedometerAvailable}</Text>
<Text>Steps taken in the last 24 hours: {pastStepCount}</Text>
<Text>Walk! And watch this go up: {currentStepCount}</Text>
</View>
 */



/* 
<MainAppBar
          title="Map"
          backgroundColor={settings.backgroundColor}
          icon={icon}
          getUserPosition={getUserPosition}
        />

/////////////////////////////////////////////

          <SafeAreaView style={styles.container}>
          <Map location={location} />
          <Text style={styles.step}>{steps}</Text>
        </SafeAreaView>
        */