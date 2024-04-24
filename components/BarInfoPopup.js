import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const BarInfoPopup = ({ barInfo, onClose, onDelete }) => {
    const waterDescriptions = {
        '1': '1dl',
        '2': '2dl',
        '4': '4dl',
        '5': '5dl',
    };

    const moodDescriptions = {
        '0': 'Happy',
        '1': 'Satisfied',
        '2': 'Neutral',
        '3': 'Feeling Underneath',
        '4': 'Sad',
    };

    const waterDescription = barInfo.type === 'water' ? waterDescriptions[barInfo.value] || 'Unknown' : null;
    const moodDescription = barInfo.type === 'mood' ? moodDescriptions[barInfo.value] || 'Unknown' : null;

    return (
        <View style={styles.container}>
            {waterDescription && <Text style={styles.text}>Water: {waterDescription}</Text>}
            {moodDescription && <Text style={styles.text}>Mood: {moodDescription}</Text>}
            <TouchableOpacity onPress={onDelete} style={styles.deleteButton}>
            <Text style={styles.buttonText}>Delete</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onClose}>
                <Text style={styles.closeButton}>X</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        padding: 10,
        marginBottom: 80,
        borderRadius: 10,
        alignItems: 'center',
        left: 0,
        right: 0,
        borderWidth: 2,
        borderColor: '#05445e',
    },
    text: {
        fontSize: 14,
        marginTop: 5,
        marginBottom: 0,
        color: "#05445e",
    },
    closeButton: {
        marginTop: 5,
        fontWeight: "bold",
        color: "#05445e",
        alignItems: 'center',
        fontSize: 18,
    },
    deleteButton: {
        marginRight: 10,
        marginTop: 5,
        alignItems: 'center',
        backgroundColor: "#05445e",
        borderRadius: 100,
        padding: 10,
        borderRadius: 5,
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    },
});

export default BarInfoPopup;