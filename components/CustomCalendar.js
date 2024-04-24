import { Calendar } from 'react-native-calendars';
import { View, StyleSheet } from 'react-native';
import { useMemo, useState } from 'react';
import { AddItemButton } from './AddItemButton';

export function CustomCalendar(props) {

  const initialDate = '2024-03-01'
  const [selected, setSelected] = useState(initialDate)

  const marked = useMemo(() => ({
    [selected]: {
      selected: true,
      selectedColor: 'blue',
      selectedTextColor: 'white'
    }
  }), [selected])

  return (
    <View style= {styles.container}>
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
      </View>

      <AddItemButton onPress={() => setIsModalVisible(true)} selected = {selected} />

    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 5,
   
  },


});
