import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useState } from 'react';
import { Text, TextInput, View, StyleSheet, ScrollView, TouchableOpacity, Keyboard} from 'react-native';
import { globalStyles } from '@/styles/global';

export default function TabTwoScreen() {
  const [search, setSearch] = useState(''); 
  const [activeSG, setActiveSG] = useState(false); 
  const [park, setPark] = useState(false); 

  const activeSGHandler = () => {
    setActiveSG(!activeSG)
    setPark(false)
  }

  const parkHandler = () => {
    setPark(!park)
    setActiveSG(false)
  }

  return (
    <View style={{ ...globalStyles.container, padding: 15}}>
      <View style={styles.firstHeader}>
        <Text style={{ ...globalStyles.para, color: 'red', fontFamily: 'inter-bold'}}>Finder</Text>
        <Text style={{ ...globalStyles.header, fontFamily: 'inter-bold', 
          position: 'relative', bottom: 20}}>
          Find Nearest Workout Facility & Park
        </Text>
      </View>

      <View style={[styles.searchWrapper, styles.extra]}>
        <TextInput 
          style={{borderRadius: 10, width: '90%'}}
          placeholder='Your Location'
          onChangeText={(newText) => setSearch(newText)}
          value={search}/>

        <TouchableOpacity>
          <Ionicons name='search-outline' size={20} style={{
            position: 'relative', left: 5, top: 1}}/>
        </TouchableOpacity>
      </View>

      <View style={styles.buttonsWrapper}>
        <TouchableOpacity onPress={activeSGHandler} style={[
          styles.button, activeSG ? styles.highlightedButton : undefined]}>

          <Text style={globalStyles.para}>ActiveSG</Text>
          <MaterialIcons name='sports-gymnastics' size={20} style={{
            position: 'relative', left: 5, top: 10}}/>

        </TouchableOpacity>

        <TouchableOpacity onPress={parkHandler} style={[
          styles.button, {marginLeft: 10}, 
          park ? styles.highlightedButton : undefined]}>
          
          <Text style={globalStyles.para}>Park</Text>
          <MaterialIcons name='park' size={20} style={{
            position: 'relative', left: 5, top: 10}}/>

        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  firstHeader: {
    width: '100%',
    paddingLeft: 2
  },

  searchWrapper: {
    width: '100%',
    position: 'relative',
    bottom: 15,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },

  extra: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 10
  },

  buttonsWrapper: {
    flexDirection: 'row', 
    position: 'relative',
    bottom: 3,
    alignItems: 'center'
  },

  button: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '33%',
    backgroundColor: '#F6F2F2',
    borderRadius: 12, 
  }, 

  highlightedButton: {
    borderColor: 'red',
    borderWidth: 1
  }

});
