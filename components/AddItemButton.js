import React, { useEffect, useState } from 'react';
import { TouchableOpacity, Text, StyleSheet, View, Modal, Image } from 'react-native';
import { TextInput, GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler';
import { firestore } from '../firebase/Config';
import { collection, addDoc, query, onSnapshot, where, limit, deleteDoc, doc } from 'firebase/firestore';

export function AddItemButton({selected}) {
    const [isModalVisible, setIsModalVisible] = useState(false)
    const [activity, setActivity] = useState('')
    const [activities, setActivities] = useState([])
    const [periodDays, setPeriodDays] = useState([])
    const [tracker, setTracker] = useState([])
    const [steps, setSteps] = useState([])
    const [pictures, setPictures] = useState([])
    const [meds, setMeds] = useState([])

    const act = 'activity'
    const prd = 'period day'
    const trk = 'trackers'
    const stp = 'steps'
    const pct = 'PICTURES'
    const med = 'medicines'

    const saveActivity = async(value) => {
      const docRef = await addDoc(collection(firestore, act), {
        value,
        text: activity
      }).catch (error => console.log(error))

      setActivity('')
      setIsModalVisible(false)
      console.log('activity saved')
    }

    const addActivity = async(selected) => {
      await saveActivity(selected)
    }

    const deleteActivity = async (activityId) => {
      await deleteDoc(doc(firestore, act, activityId))
      console.log('activity deleted')
    }

    const deletePeriodDay = async (periodDayId) => {
      await deleteDoc(doc(firestore, prd, periodDayId))
      console.log('period deleted')
    }

    const deleteTracker = async (trackerId) => {
      await deleteDoc(doc(firestore, trk, trackerId))
      console.log('tracker deleted')
    } 

    const deleteSteps = async (stepsId) => {
      await deleteDoc(doc(firestore, stp, stepsId))
      console.log('steps deleted')
    }

    const deletePicture = async (pictureId) => {
      await deleteDoc(doc(firestore, pct, pictureId))
      console.log('picture deleted')
    }

    const deleteMedicine = async(medId) => {
      await deleteDoc(doc(firestore, med, medId))
      console.log('medicine deleted')
    }

    useEffect(() => {

      const fetchActivities = async () => {
        const q = query(collection(firestore, act), where('value', '==', selected), limit(10))
        const unsubscribeA = onSnapshot(q, (querySnapshot) => {
          const tempActivities = []
  
          querySnapshot.forEach((doc) => {
            tempActivities.push({id: doc.id, ...doc.data()})
          })
          setActivities(tempActivities)
        })
        return unsubscribeA
      }

      const fetchPeriodDays = async () => {
        const pQ = query(collection(firestore, prd), where('date', '==', selected), limit(1))
        const unsubscribeP = onSnapshot(pQ, (querySnapshot) => {
          const tempPeriodDays = []
  
          querySnapshot.forEach((doc) => {
            tempPeriodDays.push({id: doc.id, ...doc.data()})
          })
          setPeriodDays(tempPeriodDays)
        })
        return unsubscribeP
      }

      const fetchTrackers = async () => {
        const qT = query(collection(firestore, trk), where('timestamp', '==', selected), limit(10))
        const unsubscribeT = onSnapshot(qT, (querySnapshot) => {
          const tempTrackers = []
  
          querySnapshot.forEach((doc) => {
            tempTrackers.push({id: doc.id, ...doc.data()})
          })
          setTracker(tempTrackers)
        })
        return unsubscribeT
      }

      const fetchSteps = async () => {
        const qS = query(collection(firestore, stp), where('timestamp', '==', selected), limit(10))
        const unsubscribeS = onSnapshot(qS, (querySnapshot) => {
          const tempSteps = []

          querySnapshot.forEach((doc) => {
            tempSteps.push({id: doc.id, ...doc.data()})
          })
          setSteps(tempSteps)
        })
        return unsubscribeS
      }

      const fetchPictures = async () => {
        const qPi = query(collection(firestore, pct), where('timestamp', '==', selected), limit(10))
        const unsubscribePic = onSnapshot(qPi, (querySnapshot) => {
          const tempPictures = []

          querySnapshot.forEach((doc) => {
            tempPictures.push({id: doc.id, ...doc.data()})
          })
          setPictures(tempPictures)
        })
        return unsubscribePic
      }

      const fetchMedicine = async() => {
        const qMed = query(collection(firestore, med), where('timestamp', '==', selected), limit(20))
        const unsubscribeMed = onSnapshot(qMed, (querySnapshot) => {
          const tempMeds = []

          querySnapshot.forEach((doc) => {
            tempMeds.push({id: doc.id, ...doc.data()})
          })
          setMeds(tempMeds)
        })
        return unsubscribeMed
      }

        fetchActivities()
        fetchPeriodDays()
        fetchTrackers()
        fetchSteps()
        fetchPictures()
        fetchMedicine()
    }, [selected])

    const getTrackerText = (type, value) => {
      switch (type) {
        case 'mood':
          switch(value) {
            case 0:
              return {type: 'Mood:', value: 'HAPPY'}
            case 1:
              return {type: 'Mood:', value: 'SATISFIED'}
            case 2:
              return {type: 'Mood:', value: 'NEUTRAL'}
            case 3:
              return {type: 'Mood:', value: 'FEELING UNDERNEATH'}
            case 4:
              return {type: 'Mood:', value: 'SAD'}
          }

        case 'water':
          switch(value) {
            case 1:
              return {type: 'Water consumed:', value: '1 DL'}
            case 2:
              return {type: 'Water consumed:', value: '2 DL'}
            case 4:
              return {type: 'Water consumed:', value: '4 DL'}
            case 5:
              return {type: 'Water consumed:', value: '5 dl'}
          }

        default:
          return {type, value}
      }
    }

    return(
      <GestureHandlerRootView>
          <View>
              <TouchableOpacity style = {styles.addButton} onPress={() => setIsModalVisible(true)}>
                  <Text style = {styles.addButtonText}>+</Text>
              </TouchableOpacity>
              
              <Modal animationType='slide' transparent = {true} visible = {isModalVisible} onRequestClose={() => setIsModalVisible(false)} >
                  <View style = {styles.modalContainer}>
                      <View style = {styles.modalContent}>
                          <Text style = {styles.modalTitle}>What would you like to do on {selected} ?</Text>
                            <TextInput 
                              style = {styles.input}
                              onChangeText={text => setActivity(text)}
                              value={activity}
                              placeholder='Enter activity'
                            />

                          <TouchableOpacity style = {styles.modalAddButton} onPress={() => addActivity(selected)}>
                            <Text>Add</Text>
                          </TouchableOpacity>

                          <TouchableOpacity onPress={() => setIsModalVisible(false)}>
                          <Text style = {styles.modalClose}>Close</Text>
                          </TouchableOpacity>
                      </View>
                  </View>
              </Modal>
          </View>
          <ScrollView style = {{flex: 1, maxHeight: '73.5%'}}>
            {
              activities.map((activity, index) => {
                return(
                  <View style = {styles.message} key={index}>
                    <Text style = {styles.messageInfo}>{activity.text}</Text>
                    <TouchableOpacity style = {styles.deleteButton} onPress={() => deleteActivity(activity.id)}>
                      <Text style = {styles.deleteButtonText}>DELETE</Text>
                    </TouchableOpacity>
                  </View>
                )
              })
            }

            {
              periodDays.map((periodDay, index) => {
                return(
                <View style = {styles.message} key={index}>
                  <Text style = {styles.messageInfo}>Periods</Text>
                  <TouchableOpacity style = {styles.deleteButton} onPress={() => deletePeriodDay(periodDay.id)}>
                      <Text style = {styles.deleteButtonText}>DELETE</Text>
                  </TouchableOpacity>
                </View>
                )
              })
            }

            {
              tracker.map((trackerItem, index) => {
                return(
                <View style = {styles.message} key={index}>
                  <Text style = {styles.messageInfo}>{getTrackerText(trackerItem.type, trackerItem.value).type}</Text>
                  <Text style = {styles.messageInfo}>{getTrackerText(trackerItem.type, trackerItem.value).value}</Text>
                  <TouchableOpacity style = {styles.deleteButton} onPress={() => deleteTracker(trackerItem.id)}>
                      <Text style = {styles.deleteButtonText}>DELETE</Text>
                  </TouchableOpacity>
                </View>
                )
              })
            }

            {
              steps.map((stepsItem, index) => {
                return(
                  <View style = {styles.message} key={index}>
                    <Text style = {styles.messageInfo}>Steps taken: {stepsItem.steps}</Text>
                    <TouchableOpacity style = {styles.deleteButton} onPress={() => deleteSteps(stepsItem.id)}>
                      <Text style = {styles.deleteButtonText}>DELETE</Text>
                    </TouchableOpacity>
                  </View>
                )
              })
            }

            {
              pictures.map((pictureItem, index) => {
                const imageUrl = 'data:image/jpeg;base64,' + pictureItem.base64
                return(
                  <View style = {styles.message} key={index}>
                    <Image source={{uri: imageUrl}} style={styles.image} />
                    <TouchableOpacity style = {styles.deleteButton} onPress={() => deletePicture(pictureItem.id)}>
                      <Text style = {styles.deleteButtonText}>DELETE</Text>
                    </TouchableOpacity>
                  </View>
                )
              })
            }

            {
              meds.map((medItem, index) => {
                return(
                  <View style = {styles.message} key={index}>
                    <Text style = {styles.messageInfo}>Taken medicine:</Text>
                    <Text style = {styles.messageInfo}>{medItem.medicine}</Text>
                    <Text style = {styles.messageInfo}>{medItem.type}</Text>
                    <Text style = {styles.messageInfo}>{medItem.dosage}{medItem.unit}</Text>
                    <TouchableOpacity style = {styles.deleteButton} onPress={() => deleteMedicine(medItem.id)}>
                      <Text style = {styles.deleteButtonText}>DELETE</Text>
                    </TouchableOpacity>
                  </View>
                )
              })
            }
          </ScrollView>
      </GestureHandlerRootView>
    )
}

const styles = StyleSheet.create({
    addButton: {
        backgroundColor: '#05445e',
        padding: 10,
        marginTop: 3,
        marginBottom: 3,
        borderRadius: 5,
        alignItems: 'center'
      },
    addButtonText: {
        color: 'white',
        fontWeight: 'bold'
      },
      modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
      },
      modalContent: {
        backgroundColor: 'rgba(211, 211, 211, 0.95)',
        padding: 15,
        borderRadius: 10,
        width: '75%',
        maxHeight: '75%'
      },
      modalTitle: {
        fontSize: 15,
        fontWeight: 'bold',
        marginBottom: 10
      },
      modalItems: {
        fontSize: 14,
        marginBottom: 10
      },
      modalClose: {
        fontSize: 14,
        color: 'blue',
        textAlign: 'center',
        marginTop: 10
      },
      input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 10,
        paddingHorizontal: 10
      },
      modalAddButton: {
        backgroundColor: 'lightblue',
        padding: 10,
        marginVertical: 10,
        borderRadius: 5,
        alignItems: 'center'
      },
      container: {
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
      },
      message: {
        padding: 10,
        backgroundColor: '#f5f5f5',
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 5
      },
      messageInfo: {
        fontSize: 12,
        fontWeight: 'bold'
      },
      deleteButton: {
        backgroundColor: '#05445e',
        marginTop: 6,
        padding: 5,
        borderRadius: 5
      },
      deleteButtonText: {
        color: 'white',
        fontSize: 12,
        fontWeight: 'bold',
        textAlign: 'center'
      },
      image: {
        width: 210,
        height: 210,
        resizeMode: 'contain'
      }
})