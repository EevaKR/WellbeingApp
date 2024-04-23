import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, SafeAreaView } from 'react-native';
import SymptomModal from './Symptoms';
import moment from 'moment';
import { Calendar } from 'react-native-calendars';
import { firestore, collection, addDoc, deleteDoc, doc, query, where, getDocs } from "../firebase/Config";


const _format = 'YYYY-MM-DD';
const _today = moment().format(_format);
const _maxDate = '2030-12-31';

const PeriodCalendar = () => {
    const [markedDates, setMarkedDates] = useState({});
    const [selectedDates, setSelectedDates] = useState([]);

    useEffect(() => {
        const loadSelectedDates = async () => {
            try {
                const querySnapshot = await getDocs(collection(firestore, 'period day'));
                const dates = [];
                querySnapshot.forEach((doc) => {
                    dates.push(doc.data().date);
                });
                setSelectedDates(dates);
                const updatedMarkedDates = dates.reduce((acc, date) => {
                    acc[date] = { selected: true, selectedColor: '#D3B5E5' };
                    return acc;
                }, {});
                setMarkedDates(updatedMarkedDates);
            } catch (error) {

                console.error('Error loading selected dates from Firestore:', error);
            }
        };
        loadSelectedDates();
    }, []);

    const onDaySelect = (day) => {
        const selectedDay = moment(day.dateString).format(_format);
        const isSelected = selectedDates.includes(selectedDay);
        let updatedMarkedDates = { ...markedDates };
        let updatedSelectedDates = [...selectedDates];

        if (isSelected) {
            // Deselect the day 
            delete updatedMarkedDates[selectedDay];
            updatedSelectedDates = selectedDates.filter(date => date !== selectedDay);
            deleteSelectedDayFromFirestore(selectedDay);
        } else {
            // Select the day 
            updatedMarkedDates[selectedDay] = { selected: true, selectedColor: '#D3B5E5' };
            updatedSelectedDates.push(selectedDay);
            saveSelectedDayToFirestore(selectedDay);
        }
        setMarkedDates(updatedMarkedDates);
        setSelectedDates(updatedSelectedDates);
    };

    const saveSelectedDayToFirestore = async (selectedDay) => {
        try {
            await addDoc(collection(firestore, 'period day'), { date: selectedDay });
            console.log('Selected day saved to Firestore:', selectedDay);
        } catch (error) {
            console.error('Error saving selected day to Firestore:', error);
        }
    };

    const deleteSelectedDayFromFirestore = async (selectedDay) => {
        try {
            const selectedDaysQuery = query(collection(firestore, 'period day'), where('date', '==', selectedDay));
            const querySnapshot = await getDocs(selectedDaysQuery);
            querySnapshot.forEach(async (doc) => {
                await deleteDoc(doc.ref);
                console.log('Selected day deleted from Firestore:', selectedDay);
            });
        } catch (error) {
            console.error('Error deleting selected day from Firestore:', error);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.calendarHeader}>Period Calendar </Text>
            <Text style={styles.text}>add your cycle:</Text>
            <Calendar style={styles.calendar}
                maxDate={_maxDate}
                onDayPress={onDaySelect}
                markedDates={markedDates}
                firstDay={1}
            />
            <SymptomModal />
        </SafeAreaView>
    );
};



const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 50,
        width: 350,
    },
    calendar: {
        borderRadius: 10,
        marginLeft: 10,
        marginRight: 10,
        marginBottom: 10,
        marginTop: 2,
        elevation: 5,
        borderWidth: 2,
        borderColor: '#D3B5E5',
        backgroundColor: 'white',
        paddingBottom: 9,
        paddingLeft: 9,
        paddingRight: 9,
    },
    calendarHeader: {
        textAlign: 'left',
        paddingLeft: 14,
        marginBottom: 1,
        fontWeight: 'bold',
        color: 'black',
        fontSize: 20,
    },
    calendarText: {
        alignItems: 'center',
        textAlign: 'left',
        paddingLeft: 18,
    },
    text: {
        marginLeft: 15,
        marginBottom: 3,
    },

});

export default PeriodCalendar; 