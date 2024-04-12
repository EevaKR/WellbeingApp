import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet
} from "react-native";
import { collection, addDoc, doc, updateDoc, Timestamp, getDocs, onSnapshot } from "firebase/firestore";
import { firestore } from '../firebase/Config';
import ModalComponent from '../components/ModalComponent';

export default function Medicine() {
  const [meds, setMeds] = useState([]);
  const [editIndex, setEditIndex] = useState(-1);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [medicine, setMedicine] = useState('');
  const [dosage, setDosage] = useState('');
  const [type, setType] = useState('');
  const [unit, setUnit] = useState('');

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(firestore, 'medicines'), (snapshot) => {
      const medicineList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const filteredMedicineList = medicineList.filter(medicine => !medicine.taken);
      setMeds(filteredMedicineList);
    });

    return () => unsubscribe();
  }, [firestore]);

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  const handleSaveMedicine = async (medicine, dosage, type, unit) => {
    try {
      await addDoc(collection(firestore, 'medicines'), {
        medicine: medicine,
        dosage: dosage,
        type: type,
        unit: unit,
        taken: false,
        timestamp: Timestamp.now(),
      });
      toggleModal();
    } catch (error) {
      console.error('Error adding medicine: ', error)
    }
  };

  const handleEditMedicine = (index) => {
    const medicineToEdit = meds[index];
    setMedicine(medicineToEdit.medicine);
    setDosage(medicineToEdit.dosage);
    setType(medicineToEdit.type);
    setUnit(medicineToEdit.unit);
    setEditIndex(index);
    setIsModalVisible(true);
  };

  const handleDeleteMedicine = async (index) => {
    const medicineToUpdate = meds[index];
    try {
      const medicineDocRef = doc(firestore, "medicines", medicineToUpdate.id);
      await updateDoc(medicineDocRef, { taken: true });

      const updatedMeds = meds.filter(medicine => mecidine.id !== medicineToUpdate.id);
      setMeds(updatedMeds);
    } catch (error) {
      console.error("Error updating medicines in Firebase: ", error);
    }
  };

  const renderItem = ({ item, index }) => (
    <View style={styles.medicineCard}>
      <View style={styles.medicineHeader}>
        <Text style={styles.itemListHighlighted}>{item.medicine}</Text>
      </View>
      <View style={styles.medicineDetails}>
        <Text style={styles.itemList}>Dosage: {item.dosage}</Text>
        <Text style={styles.itemList}>Type: {item.type}</Text>
      </View>
      <View style={styles.medicineButtons}>
        <TouchableOpacity onPress={() => handleEditMedicine(index)}>
          <Text style={styles.editButton}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleDeleteMedicine(index)}>
          <Text style={styles.deleteButton}>Take medicine</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.heading}>Medicine</Text>
        <ModalComponent
          visible={isModalVisible}
          onClose={() => setIsModalVisible(false)}
          onSave={handleSaveMedicine}
          medicine={medicine}
          setMedicine={setMedicine}
          dosage={dosage}
          setDosage={setDosage}
          type={type}
          setType={setType}
          unit={unit}
          setUnit={setUnit}
        />
      </View>
      <FlatList
        data={meds}
        renderItem={renderItem}
        keyExtractor={(item, index) => item.id}
      />
      <TouchableOpacity style={styles.addButton} onPress={toggleModal}>
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 40,
    marginTop: 40,
    position: 'relative',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  heading: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#05445e",
  },
  addButton: {
    backgroundColor: "#189ab4",
    padding: 20,
    borderRadius: 10,
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
  addButtonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 20,
  },
  medicineCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  medicineHeader: {
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    paddingBottom: 10,
    marginBottom: 10,
  },
  medicineDetails: {
    marginBottom: 10,
  },
  itemListHighlighted: {
    fontSize: 19,
    fontWeight: "bold",
    color: "#189ab4",
  },
  medicineButtons: {
    flexDirection: "row",
  },
  editButton: {
    marginRight: 10,
    color: "#189ab4",
    fontWeight: "bold",
    fontSize: 18,
  },
  deleteButton: {
    color: "#05445e",
    fontWeight: "bold",
    fontSize: 18,
  },
});
