import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'; 
import { firestore } from '../firebase/Config';

export default function Tracker() {
    const [waterTracker, setWaterTracker] = useState(0);
    const [sleepTracker, setSleepTracker] = useState(0);
    const [moodTracker, setMoodTracker] = useState(0);

    const addWater = async (amount) => {
        setWaterTracker(waterTracker + amount);
        await saveData('water', waterTracker + amount);
    };

    const addSleep = async () => {
        setSleepTracker(sleepTracker + 1);
        await saveData('sleep', sleepTracker + 1);
    };

    const moods = ['😄', '😊', '😐', '😔', '😢'];

    const selectMood = async (index) => {
        setMoodTracker(index);
        await saveData('mood', index);
    };

    const saveData = async (type, value) => {
        try {
            const docRef = await addDoc(collection(firestore, 'trackers'), {
                type,
                value,
                timestamp: serverTimestamp()
            });
            console.log('Document written with ID: ', docRef.id);
        } catch (error) {
            console.error('Error adding document: ', error);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Today's xx.xx.2024</Text>
            <View style={styles.trackerContainer}>
                <Text>Water Tracker</Text>
                <View style={styles.button}>
                    <Button title="1dl" onPress={() => addWater(1)} />
                    <Button title="2dl" onPress={() => addWater(2)} />
                    <Button title="4dl" onPress={() => addWater(4)} />
                    <Button title="5dl" onPress={() => addWater(5)} />
                </View>
            </View>
            <View style={styles.trackerContainer}>
                <Text>Sleep Tracker</Text>
                <View style={styles.button}>
                    <Button title="Add Sleep" onPress={addSleep} />
                </View>
            </View>
            <View style={styles.trackerContainer}>
                <Text>Mood Tracker</Text>
                <View style={styles.button}>
                    {moods.map((mood, index) => (
                        <Button
                            key={index}
                            title={mood}
                            onPress={() => selectMood(index)}
                        />
                    ))}
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    header: {
        fontSize: 30
    },
    trackerContainer: {
        marginVertical: 10,
        alignItems: 'center',
    },
    button: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
});
