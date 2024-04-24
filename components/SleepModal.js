import React, { useState } from 'react';
import { Modal, View, StyleSheet, Button, TouchableOpacity, Text } from 'react-native';
import {Picker} from '@react-native-picker/picker';

const ModalSleep = ({ visible, onClose, onSave }) => {
    const [sleepTime, setSleepTime] = useState('');

    const handleSave = () => {
        onSave(sleepTime);
        setSleepTime('');
        onClose();
    };

    return (
        <Modal visible={visible} animationType="slide" transparent>
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                        <Text style={styles.closeText}>X</Text>
                    </TouchableOpacity>
                    <Picker
                        selectedValue={sleepTime}
                        onValueChange={(sleepTime) => setSleepTime(sleepTime)}
                        style={styles.picker}
                    >
                       {[...Array(24).keys()].map(hour => (
                    [...Array(12).keys()].map(minute => (
                     <Picker.Item
                        key={`${hour}:${minute * 5}`}
                        label={`${hour} hours ${minute * 5} minutes`}
                        value={`${hour}:${minute * 5}`}
                         />
                            ))
                        ))}
                    </Picker>
                    <Button title="Save" onPress={handleSave} />
                </View>
            </View>
        </Modal>
    );
}
const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "center",
        marginTop: 22,
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    picker: {
        width: '100%',
    },
});

export default ModalSleep;
