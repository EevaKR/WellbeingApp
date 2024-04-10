import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

export function AddItemButton({onPress}) {
    return(
        <TouchableOpacity style = {styles.addButton} onPress={onPress}>
            <Text style = {styles.addButtonText}>+</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    addButton: {
        backgroundColor: 'lightblue',
        padding: 10,
        margin: 10,
        borderRadius: 5,
        alignItems: 'center'
      },
    addButtonText: {
        color: 'black',
        fontWeight: 'bold'
      },
})