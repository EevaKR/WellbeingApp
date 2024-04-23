import React from "react";
import { Modal, StyleSheet, View, TextInput, Text, Button, Pressable } from "react-native"
import { useState, useEffect } from "react";
import { firestore, collection, addDoc, query, where, getDocs } from "../firebase/Config";

export default function SymptomModal() {

    const [modalVisible, setModalVisible] = useState([]);
    const [selectedSymptoms, setSelectedSymptoms] = useState([]);
    const [otherSymptoms, setOtherSymptoms] = useState('');
    const [currentDate, setCurrentDate] = useState('');
    //Current date 

    useEffect(() => {
        var date = new Date().getDate();
        var month = new Date().getMonth() + 1;
        var year = new Date().getFullYear();
        setCurrentDate(
            date + '/' + month + '/' + year + ' '
        );
    }, []);

    const toggleSymptom = (symptom) => {
        if (selectedSymptoms.includes(symptom)) {
            setSelectedSymptoms(selectedSymptoms.filter((s) => s !== symptom));
        } else {
            setSelectedSymptoms([...selectedSymptoms, symptom]);
        }
    };
    //Save symptoms 

    const saveSymptoms = async () => {

        try {
            const symptomDocuments = selectedSymptoms.map(symptom => ({ name: symptom, date: currentDate }));
            if (otherSymptoms.trim() !== '') {
                const otherSymptomDocument = { name: otherSymptoms, date: currentDate };
                await addDoc(collection(firestore, 'symptom'), otherSymptomDocument);
                console.log('Other symptom input saved to Firestore:', otherSymptomDocument);
            }
            await Promise.all(symptomDocuments.map(symptom => addDoc(collection(firestore, 'symptom'), symptom)));
            console.log('Selected symptoms saved to Firestore:', symptomDocuments);
            setModalVisible(false);
        } catch (error) {
            console.error('Error saving symptoms to Firestore:', error);
        }
    };

    //Fetch the picked symptoms 
    useEffect(() => {
        const fetchSymptoms = async () => {
            try {
                const date = new Date();
                const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
                setCurrentDate(formattedDate);
                const symptomsRef = collection(firestore, 'symptom');
                const q = query(symptomsRef, where('date', '==', formattedDate));
                const querySnapshot = await getDocs(q);
                const symptomsData = querySnapshot.docs.map(doc => doc.data().name);
                setSelectedSymptoms(symptomsData);
            } catch (error) {
                console.error('Error fetching symptoms:', error);
            }
        };
        fetchSymptoms();
    }, []);

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
                    <Text style={styles.modalHeader}>Add your symptoms: </Text>
                    <Text style={styles.currentDate}>{currentDate}</Text>
                    <View style={styles.buttonContainer}>
                        <View style={styles.row}>
                            <Button
                                title="Cramps "
                                color={selectedSymptoms.includes("Cramps") ? '#6AABD2' : '#D3B5E5'}
                                onPress={() => toggleSymptom("Cramps")}
                                style={styles.button}
                            />
                            <Button
                                title="Headache 🤕"
                                color={selectedSymptoms.includes("Headache") ? '#6AABD2' : '#D3B5E5'}
                                onPress={() => toggleSymptom("Headache")}
                                style={styles.button}
                            />
                            <Button
                                title="Tiredness 🥱"
                                color={selectedSymptoms.includes("Tiredness") ? '#6AABD2' : '#D3B5E5'}
                                onPress={() => toggleSymptom("Tiredness")}
                                style={styles.button}
                            />
                        </View>
                        <View style={styles.row}>
                            <Button
                                title="Insomnia "
                                color={selectedSymptoms.includes("Insomnia") ? '#6AABD2' : '#D3B5E5'}
                                onPress={() => toggleSymptom("Insomnia")}
                                style={styles.button}
                            />
                            <Button
                                title="Cravings 🍫"
                                color={selectedSymptoms.includes("Cravings") ? '#6AABD2' : '#D3B5E5'}
                                onPress={() => toggleSymptom("Cravings")}
                                style={styles.button}
                            />
                            <Button
                                title="Bloating 🤰"
                                color={selectedSymptoms.includes("Bloating") ? '#6AABD2' : '#D3B5E5'}
                                onPress={() => toggleSymptom("Bloating")}
                                style={styles.button}
                            />
                        </View>
                        <View style={styles.row}>
                            <Button
                                title="Acne 😶‍🌫️"
                                color={selectedSymptoms.includes("Acne") ? '#6AABD2' : '#D3B5E5'}
                                onPress={() => toggleSymptom("Acne")}
                                style={styles.button}
                            />
                            <Button
                                title="Backache 🙇‍♀️"
                                color={selectedSymptoms.includes("Backache") ? '#6AABD2' : '#D3B5E5'}
                                onPress={() => toggleSymptom("Backache")}
                                style={styles.button}
                            />
                            <Button
                                title="Nausea 🤢"
                                color={selectedSymptoms.includes("Nausea") ? '#6AABD2' : '#D3B5E5'}
                                onPress={() => toggleSymptom("Nausea")}
                                style={styles.button}
                            />
                        </View>
                    </View>
                    <TextInput
                        style={styles.input}
                        placeholder="Other..."
                        onChangeText={text => setOtherSymptoms(text)}
                    />
                    <Pressable onPress={saveSymptoms}>
                        <Text style={styles.modalCloseText}>Save</Text>
                    </Pressable>
                </View>
            </Modal>
            <View style={styles.modalAdd}>
                <Pressable onPress={() => setModalVisible(true)}>
                    <Text style={styles.addText}>Add symptoms 💜 </Text>
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 15,
    },
    modalAdd: {
        backgroundColor: 'white',
        borderWidth: 2.5,
        borderColor: '#D3B5E5',
        borderRadius: 10,
        padding: 15,
    },
    modalView: {
        margin: 20,
        backgroundColor: '#B7CFDC',
        padding: 35,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#D3B5E5',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 6,
        elevation: 7,
    },
    buttonContainer: {
        width: '115%',
        alignItems: 'space-evenly',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        marginBottom: 10,
        marginTop: 15,
    },
    button: {
        flex: 1,
        marginRight: 10,
    },
    input: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
        borderWidth: 2,
        borderColor: '#D3B5E5',
        paddingLeft: 55,
        paddingRight: 55,
    },
    modalHeader: {
        color: 'black',
        fontWeight: 'bold',
        fontSize: 15,
        marginBottom: 10,
    },
    modalCloseText: {
        fontWeight: 'bold',
        marginTop: 30,
        backgroundColor: '#D3B5E5',
        padding: 10,
        borderWidth: 0.5,
        borderRadius: 0,
        borderColor: 'grey'
    },
});