import { View, Text, StyleSheet, Button } from 'react-native'
import { NavigationContainer } from '@react-navigation/native';
import { AntDesign, FontAwesome } from '@expo/vector-icons'
import React, { useLayoutEffect } from 'react';



export default function Home({navigation}) {

  useLayoutEffect(() => {
    navigation.setOptions?.({
        headerStyle: {
            backgroundColor: ' #FB8DA0'
        },
        headerRight: () => (
            <FontAwesome
                style={styles.navButton}
                name='map-marker'
                size={24}
                onPress={() => navigation.navigate('Map')}
            />
        )
    })
}, [])


  return (
    <View style={styles.container}>
      <Text style= {styles.text}>Home</Text>
    </View>
  )
}

const styles= StyleSheet.create({
  container: {
    backgroundColor: '#FB6B90',


  },
  text: {
    fontSize: 24,
    alignContent: 'center',

  }
})