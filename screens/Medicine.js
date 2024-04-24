import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet
} from "react-native";
import { collection, addDoc, doc, updateDoc, onSnapshot } from "firebase/firestore";
import { firestore } from '../firebase/Config';
import ModalComponent from '../components/ModalComponent';
import { printToFileAsync } from 'expo-print';
import { shareAsync } from 'expo-sharing';

export default function Medicine() {
  const [meds, setMeds] = useState([]);
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
      const timestamp = date.toDate();
      const year = timestamp.getFullYear();
      let month = timestamp.getMonth() + 1;
      if (month < 10) {
        month = '0' + month;
      }
      let day = timestamp.getDate();
      if (day < 10) {
        day = '0' + day;
      }
      return `${year}-${month}-${day}`;
    }
  
    return date;
  };
  

  const handleSaveMedicine = async (medicine, dosage, type, unit) => {
    try {
      const formattedDate = formatDate(new Date)
      await addDoc(collection(firestore, 'medicines'), {
        medicine: medicine,
        dosage: dosage,
        type: type,
        unit: unit,
        taken: false,
        timestamp: formattedDate
      });
      toggleModal();
    } catch (error) {
      console.error('Error adding medicine: ', error)
    }
  };


  const editMedicine = (index) => {
    const medicineToEdit = meds[index];
    setMedicine(medicineToEdit.medicine);
    setDosage(medicineToEdit.dosage);
    setType(medicineToEdit.type);
    setUnit(medicineToEdit.unit);
    setIsModalVisible(true);
  };

  const takeMedicine = async (index) => {
    const medicineToUpdate = meds[index];
    try {
      const medicineDocRef = doc(firestore, "medicines", medicineToUpdate.id);
      await updateDoc(medicineDocRef, { taken: true });

      const updatedMeds = meds.filter(medicine => medicine.id !== medicineToUpdate.id);
      setMeds(updatedMeds);
    } catch (error) {
      console.error("Error updating medicines in Firebase: ", error);
    }
  };

  const generatePDF = async () => {
    try {
      const htmlContent = `
        <h1>Medicine list</h1>
        <ul>
          ${meds.map((item) => `<li>${item.medicine} - Dosage: ${item.dosage}, Type: ${item.type}, Unit: ${item.unit}</li>`).join('')}
        </ul>
      `;

      const { uri } = await printToFileAsync({ html: htmlContent });

      await shareAsync(uri);
    } catch (error) {
      console.error('Error generating PDF:', error);
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
        <Text style={styles.itemList}>Unit: {item.unit}</Text>
      </View>
      <View style={styles.medicineButtons}>
        <TouchableOpacity onPress={() => editMedicine(index)}>
          <Text style={styles.editButton}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => takeMedicine(index)}>
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
          onSave={(medicine, dosage, type, unit, date, formattedDate) => 
            handleSaveMedicine(medicine, dosage, type, unit, date, formattedDate)}
          medicine={medicine}
          setMedicine={setMedicine}
          dosage={dosage}
          setDosage={setDosage}
          type={type}
          setType={setType}
          unit={unit}
          setUnit={setUnit}
          formatDate={formatDate}
        />
      </View>
      <FlatList
        style={styles.flatListContainer}
        data={meds}
        renderItem={renderItem}
        keyExtractor={(item, index) => item.id}
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.pdfButton} onPress={generatePDF}>
          <Text style={styles.pdfButtonText}>Create PDF</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.addButton} onPress={toggleModal}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>
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
    marginRight: 10,
    flex: 1,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  addButtonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 20,
  },
  pdfButton: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    marginRight: 10,
    flex: 1,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  flatListContainer: {
    flex: 1,
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
  pdfButtonText: {
    color: "#05445e",
    fontWeight: "bold",
    fontSize: 18,
  }
});