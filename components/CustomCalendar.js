import { Calendar } from 'react-native-calendars';
import { Text, TouchableOpacity, StyleSheet, View, Modal, FlatList } from 'react-native';
import { useMemo, useState } from 'react';
import { AddItemButton } from './AddItemButton';

export function CustomCalendar(props) {

  const initialDate = '2024-03-01'
  const [selected, setSelected] = useState(initialDate)
  const [itemsByDate, setItemsByDate] = useState({})
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [availableItems] = useState(['Steps', 'Medicine', 'Water', 'PeriodSymptom', 'Sleep', 'Mood'])

  const marked = useMemo(() => ({
    [selected]: {
      selected: true,
      selectedColor: 'blue',
      selectedTextColor: 'white'
    }
  }), [selected])

  const addItems = (item) => {
    if (selected) {
      setItemsByDate((previousItems) => ({
        ...previousItems,
        [selected]: [...(previousItems[selected] || []), item],
      }))
    }
    setIsModalVisible(false)
  }

  const deleteItems = (itemIndex) => {
    if (selected && itemsByDate[selected]) {
      const updatedItems = [...itemsByDate[selected]]
      updatedItems.splice(itemIndex, 1)
      setItemsByDate((previousItems) => ({
        ...previousItems,
        [selected]: updatedItems
      }))
    }
  }

  return (
    <View>
        <Calendar
        firstDay={1}
        disableAllTouchEventsForDisabledDays={true}
        markedDates={marked}

        minDate='2024-01-01'
        maxDate='2099-12-31'

        onDayPress={(day) => {
          setSelected(day.dateString)
          props.onDaySelect && props.onDaySelect(day)
        }}
        {...props}

        theme={{
          calendarBackground: '#222',
          dayTextColor: '#fff',
          textDisabledColor: '#444',
          monthTextColor: '#888',
        }}
      />

      <AddItemButton onPress={() => setIsModalVisible(true)} />

      <Modal animationType='slide' transparent = {true} visible = {isModalVisible} onRequestClose={() => setIsModalVisible(false)} >
        <View style = {styles.modalContainer}>
          <View style = {styles.modalContent}>
            <Text style = {styles.modalTitle}>Select item:</Text>
            <FlatList 
            data = {availableItems}
            renderItem = {({item}) => (
              <TouchableOpacity onPress={() => addItems(item)}>
                <Text style = {styles.modalItems}>{item}</Text>
              </TouchableOpacity>
            )}
            keyExtractor = {(item, index) => index.toString()}
            />
            <TouchableOpacity onPress={() => setIsModalVisible(false)}>
              <Text style = {styles.modalClose}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {selected && itemsByDate[selected] && (
        <View style = {styles.itemsContainer}>
          <Text style = {styles.itemText}>Items of {selected}</Text>
          {itemsByDate[selected].map((item, index) => (
            <View key = {index} style = {styles.itemContainer}>
              <Text style = {styles.item}>{item}</Text>
              <TouchableOpacity onPress={() => deleteItems(index)}>
                <Text style = {styles.deleteButton}>X</Text>
              </TouchableOpacity>
            </View>
          ))}
          </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  item: {
    flex: 1,
    borderRadius: 5,
    padding: 10,
    color: 'black',
    backgroundColor: 'lightblue',
    marginTop: 4
  },
  itemText: {
    color: '#888',
    fontSize: 16,
    alignSelf: 'center'
  },
  itemsContainer: {
    marginTop: 5
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
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
    fontSize: 16,
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
  deleteButton: {
    color: 'red',
    fontSize: 15,
    margin: 10,
    fontWeight: 'bold'
  }
});