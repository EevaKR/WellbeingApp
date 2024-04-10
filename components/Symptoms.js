import React from "react";
import { Modal, StyleSheet, View, Text, Alert, Button, Pressable } from "react-native";
import { useState } from "react";
import DateTimePicker from 'react-native-ui-datepicker';
import dayjs from 'dayjs';

export default function SymptomModal() {
    const [modalVisible, setModalVisible] = useState(false);

    return (

        <View style={styles.container}>
            <Modal
                animationType="slide"
                transparent={false}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}>
                <View style={styles.modalView}>
                    <Text>Add your symptoms</Text>
                    <Pressable
                        onPress={() => setModalVisible(!modalVisible)}>
                        <Text style={styles.closeText}>Close</Text>
                    </Pressable>
                </View>
            </Modal>
            <View style={styles.modalAdd}>
                <Pressable onPress={() => setModalVisible(true)}>
                    <Text>Add symptoms </Text>
                </Pressable>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        padding: 35,
        alignItems: 'center',
    },
    shadowOffset: {
        width: 0,
        height: 2,
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalAdd: {

    },
    closeText: {
        marginTop: 20,
        fontWeight: 'bold',
    },
}); 