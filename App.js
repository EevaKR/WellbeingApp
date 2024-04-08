import { StyleSheet, View } from 'react-native';
import Tracker from './components/Tracker';


export default function App() {
  return (
    <View style={styles.container}>
      <Tracker />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
