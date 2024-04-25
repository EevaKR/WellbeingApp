import React, { useState } from 'react';
import { View, TextInput, Modal, Button, StyleSheet, Dimensions } from 'react-native';
import {Picker} from '@react-native-picker/picker';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const ModalComponent = ({ visible, onClose, onSave, medicine, setMedicine, dosage, setDosage, type, setType, unit, setUnit }) => {
  const [step, setStep] = useState(1);

  const handleSaveMedicine = () => {
    if (step === 1) {
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    } else if (step === 3) {
      setStep(4);
    } else {
      onSave(medicine, dosage, type, unit);
      setMedicine('');
      setDosage('');
      setType('');
      setUnit('');
      setStep(1);
      onClose();
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>
          {step === 1 && (
            <>
              <TextInput
                style={styles.input}
                placeholder="Medicine name"
                value={medicine}
                onChangeText={(text) => setMedicine(text)}
              />
              <View style={styles.buttonContainer}>
                <Button title="Cancel" onPress={onClose} />
                <Button title="Next" onPress={handleSaveMedicine} />
              </View>
            </>
          )}
          {step === 2 && (
            <>
              <TextInput
                style={styles.input}
                placeholder="Dosage"
                value={dosage}
                onChangeText={(text) => setDosage(text)}
              />
              <View style={styles.buttonContainer}>
                <Button title="Previous" onPress={() => setStep(1)} />
                <Button title="Next" onPress={handleSaveMedicine} />
              </View>
            </>
          )}
          {step === 3 && (
            <>
              <Picker
                selectedValue={type}
                onValueChange={(typeValue) => setType(typeValue)}
                style={{ width: '100%', marginBottom: 20 }}
              >
                <Picker.Item label="Capsel" value="capsel" />
                <Picker.Item label="Tablet" value="tablet" />
                <Picker.Item label="Liquid" value="liquid" />
              </Picker>
              <View style={styles.buttonContainer}>
                <Button title="Previous" onPress={() => setStep(2)} />
                <Button title="Next" onPress={handleSaveMedicine} />
              </View>
            </>
          )}
          {step === 4 && (
            <>
              <Picker
                selectedValue={unit}
                onValueChange={(unitValue) => setUnit(unitValue)}
                style={{ width: '100%', marginBottom: 20 }}
              >
                <Picker.Item label="mg" value="mg" />
                <Picker.Item label="ug" value="ug" />
                <Picker.Item label="g" value="g" />
                <Picker.Item label="ml" value="ml" />
                <Picker.Item label="%" value="percentage" />
              </Picker>
              <View style={styles.buttonContainer}>
                <Button title="Previous" onPress={() => setStep(3)} />
                <Button title="Save" onPress={handleSaveMedicine} />
              </View>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: 'white',
    width: windowWidth * 0.66,
    height: windowHeight * 0.5,
    borderRadius: 10,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    width: '100%',
    borderRadius: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 20,
  },
});

export default ModalComponent;