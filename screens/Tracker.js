import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, TouchableWithoutFeedback, Keyboard, TouchableOpacity } from 'react-native';
import { collection, addDoc, serverTimestamp, deleteDoc, doc } from 'firebase/firestore';
import { firestore } from '../firebase/Config';
import ModalSleep from '../components/SleepModal'
import FetchTrackerData from '../components/FetchTrackerData'
import BarInfoPopup from '../components/BarInfoPopup';

export default function Tracker() {
    const [waterTracker, setWaterTracker] = useState(0);
    const [moodTracker, setMoodTracker] = useState(0);
    const [sleepTime, setSleepTime] = useState('');
    const [isModalVisible, setModalVisible] = useState(false);
    const [trackerData, setTrackerData] = useState([]);
    const [selectedBar, setSelectedBar] = useState(null);
    const [selectedBarInfo, setSelectedBarInfo] = useState(null);
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const [sleepMessage, setSleepMessage] = useState('');
    const [totalWaterIntake, setTotalWaterIntake] = useState(0);

    const addWater = async (amount) => {
        setWaterTracker(amount);
        const formattedDate = formatDate(new Date());
        setTotalWaterIntake(prevIntake => prevIntake + amount);
        await saveWater('water', amount, formattedDate);
    };

    const saveWater = async (type, value, date) => {
        try {
            const docRef = await addDoc(collection(firestore, 'trackers'), {
                type,
                value,
                timestamp: date
            });
            console.log('Document written with ID: ', docRef.id);
        } catch (error) {
            console.error('Error adding document: ', error);
        }
    };

    const formatDate = (date) => {
        if (!date) {
            return null;
        }
   
        if (date instanceof Date) {
            const year = date.getFullYear();
            let month = date.getMonth() + 1;
            if (month < 10) {
                month = '0' + month;
            }
            let day = date.getDate();
            if (day < 10) {
                day = '0' + day;
            }
            return `${year}-${month}-${day}`;
        } else if (date.toDate instanceof Function) {
            return formatDate(date.toDate());
        }
   
        return date;
    };
   
    const handleSave = async (totalMinutes) => {
        try {
            const docRef = await addDoc(collection(firestore, 'trackers'), {
                type: 'sleep',
                value: totalMinutes,
                timestamp: formatDate(new Date())
            });
   
            const [hoursStr, minutesStr] = totalMinutes.split(':');
            const totalHours = parseInt(hoursStr) + parseInt(minutesStr) / 60;
   
            let message = '';
            if (totalHours < 8) {
                message = "You might experience fatigue today. Take it easy.";
            } else if (totalHours > 8) {
                message = "You might feel fantastic today!";
            } else {
                message = "You might feel well-rested today!";
            }
   
            setSleepMessage(message);
            console.log('Document written with ID: ', docRef.id);
            console.log('Sleep Message: ', message);
        } catch (error) {
            console.error('Error adding document: ', error);
        }
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
                timestamp: formatDate(new Date()) // Format current date
            });
            console.log('Document written with ID: ', docRef.id);
        } catch (error) {
            console.error('Error adding document: ', error);
        }
    };

    const handleSleepTimeSelect = (value) => {
        setSleepTime(value);
        addSleep(value);
    };

    const onDataFetched = (data) => {
        setTrackerData(data);
    };

    const getTrackerDataByType = (type) => {
        const filteredData = trackerData.filter(item => item.type === type);

        filteredData.forEach(item => {
            if (item.timestamp && typeof item.timestamp.toDate === 'function') {
                item.timestamp = item.timestamp.toDate();
            }
        });
        const sortedData = filteredData.sort((a, b) => {
            if (a.timestamp && b.timestamp) {
                return a.timestamp - b.timestamp;
            } else if (!a.timestamp && b.timestamp) {
                return 1;
            } else if (a.timestamp && !b.timestamp) {
                return -1;
            } else {
                return 0;
            }
        });
   
        return sortedData;
    };
   
    const dismissKeyboard = () => {
        Keyboard.dismiss();
    };

    const waterColors = {
        1: 'lightblue',
        2: 'blue',
        4: 'purple',
        5: 'black',
    };

    const moodColors = {
        '😄': 'green',
        '😊': 'yellow',
        '😐': 'orange',
        '😔': 'blue',
        '😢': 'purple',
    };

    const handleBarPress = (item) => {
        setSelectedBarInfo(item);
        setIsPopupVisible(true);
    };

    const closePopup = () => {
        setIsPopupVisible(false);
    };

    const deletePopUp = async () => {
        try {
            if (selectedBarInfo) {
                await deleteDoc(doc(firestore, 'trackers', selectedBarInfo.id));
                console.log('Document successfully deleted');
                setTotalWaterIntake(prevIntake => prevIntake - selectedBarInfo.value);
                closePopup();
            }
        } catch (error) {
            console.error('Error deleting document: ', error);
        }
    };

    return (
        <TouchableWithoutFeedback onPress={dismissKeyboard}>
            <TouchableOpacity>
                <View style={styles.container}>
                <Text style={styles.heading}>Today's {formatDate(new Date())}</Text>
                    <FetchTrackerData onDataFetched={onDataFetched} />
                    <View style={styles.trackerContainer}>
                        <Text style={styles.text}>Water Tracker</Text>
                        <View style={styles.barContainer}>
                            {getTrackerDataByType('water').map(item => (
                                <TouchableOpacity
                                    key={item.id}
                                    style={[
                                        styles.bar,
                                        {
                                            height: 50,
                                            backgroundColor: waterColors[item.value],
                                            opacity: selectedBar === item.id ? 0.5 : 1
                                        }
                                    ]}
                                    onPress={() => handleBarPress(item)}
                                />
                            ))}
                        </View>
                        <Text style={styles.waterText}>Total Water Intake: {totalWaterIntake} dl</Text>
                        <View style={styles.button}>            
                    <TouchableOpacity
                    onPress={() => addWater(1)}
                    style={[styles.button, { backgroundColor: '#189ab4' }]}>
                    <Text style={styles.buttonText}>1dl</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                    onPress={() => addWater(2)}
                    style={[styles.button, { backgroundColor: '#189ab4' }]}>
                    <Text style={styles.buttonText}>2dl</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                    onPress={() => addWater(4)}
                    style={[styles.button, { backgroundColor: '#189ab4' }]}>
                    <Text style={styles.buttonText}>4dl</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                    onPress={() => addWater(5)}
                    style={[styles.button, { backgroundColor: '#189ab4' }]}>
                    <Text style={styles.buttonText}>5dl</Text>
                    </TouchableOpacity>
                        </View>
                    </View>
                        <View style={styles.trackerContainer}>
                            <Text style={styles.text}>Sleep Tracker</Text>
                            <View style={styles.sleepContainer}>
                                {getTrackerDataByType('sleep').map(item => (
                                    <Text style={styles.sleepText}>{item.value} hours</Text>
                                ))}
                            </View>
                            <Text style={styles.sleepMessage}>{sleepMessage}</Text>
                            <View style={styles.button}>
                <TouchableOpacity
                    onPress={() => setModalVisible(true)}
                    style={[styles.buttonSleep, { backgroundColor: '#189ab4' }]}
                >
                    <Text style={styles.buttonText}>Select Sleep Time</Text>
                </TouchableOpacity>
                    <ModalSleep
                            visible={isModalVisible}
                            onClose={() => setModalVisible(false)}
                            onSave={handleSave}
                            sleeptime={setSleepTime}
                        />
                         </View>
                    </View>
                    <View style={styles.trackerContainer}>
                        <Text style={styles.text}>Mood Tracker</Text>
                        <View style={styles.barContainer}>
                            {getTrackerDataByType('mood').map(item => (
                                <TouchableOpacity
                                    key={item.id}
                                    style={[
                                        styles.bar,
                                        {
                                            height: 50,
                                            backgroundColor: moodColors[moods[item.value]],
                                            opacity: selectedBar === item.id ? 0.5 : 1
                                        }
                                    ]}
                                    onPress={() => handleBarPress(item)}
                                />
                            ))}
                        </View>
                        <View style={styles.button}>
                            {moods.map((mood, index) => (
                                <TouchableOpacity
                                    key={index}
                                    onPress={() => selectMood(index)}
                                    style={[styles.button, { backgroundColor: '#189ab4' }]}
                                >
                                    <Text style={styles.buttonText}>{mood}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                    {isPopupVisible && selectedBarInfo && (
                        <BarInfoPopup barInfo={selectedBarInfo} onClose={closePopup} onDelete={deletePopUp}/>
                    )}
                </View>
            </TouchableOpacity>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    heading: {
        fontSize: 30,
        fontWeight: "bold",
        color: "#05445e",
      },
    text: {
        color: "#05445e",
        fontWeight: "bold",
        fontSize: 18,
        marginBottom: 2,
    },
    trackerContainer: {
        marginVertical: 10,
        alignItems: 'center',
    },
    button: {
        paddingVertical: 10,
        paddingHorizontal: 27,
        marginVertical: 2,
        borderRadius: 2000,
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '50%',
        marginTop: 0,
    },
    waterText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#425d70',
    },
    buttonText: {
        color: '#ffffff',
        fontWeight: 'bold',
        alignItems: 'center',
        fontSize: 15,
    },
    buttonSleep: {
        paddingVertical: 10,
        paddingHorizontal: 10,
        marginVertical: 2,
        borderRadius: 100,
        width: '100%',
        alignItems: 'center',
        marginTop: 5,
    },
    sleepText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#425d70',
    },
    sleepMessage: {
        fontSize: 16,
        marginTop: 10,
        color: "#05445e",
    },
    inputContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '80%',
        marginBottom: 10,
    },
    barContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        width: '100%',
        height: 50,
        marginTop: 5,
    },
    sleepContainer :{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        width: '100%',
        height: 50,
        marginTop: 5,
    },
    bar: {
        backgroundColor: 'blue',
        width: 20,
    },
});

