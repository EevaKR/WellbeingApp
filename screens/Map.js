import { View, Text } from 'react-native'
import React from 'react'
import MapView, { Marker } from 'react-native-maps'
import { StyleSheet } from 'react-native'
import { useState, useEffect } from 'react'
import * as Location from 'expo-location'
import { PaperProvider } from 'react-native-paper'
import MainAppBar from '../components/MainAppBar'
import { Pedometer } from 'expo-sensors'




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

    const [marker, setMarker] = useState(null)
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
            location={location}
            icon={icon}
            getUserPosition={getUserPosition}
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
        marginBottom: 10,
    },
})
