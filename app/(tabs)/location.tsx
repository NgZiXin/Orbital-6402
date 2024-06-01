import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useState } from 'react';
import { Dimensions, Text, TextInput, View, StyleSheet, ScrollView, TouchableOpacity, TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView} from 'react-native';
import { globalStyles } from '@/styles/global';

export default function TabTwoScreen() {
  const [search, setSearch] = useState(''); 
  const [activeSG, setActiveSG] = useState(false); 
  const [park, setPark] = useState(false); 

  // TODO 
  const searchHandler = () => {
    console.log('Placeholder!')
  };

  const activeSGHandler = () => {
    setActiveSG(!activeSG)
    setPark(false)
  };

  const parkHandler = () => {
    setPark(!park)
    setActiveSG(false)
  };

  return (
    <View style={{ ...globalStyles.container, padding: 12}}>
       <KeyboardAvoidingView style={{flex: 1}}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          {/* Main working container */}
          <ScrollView style={{flex: 1}}>
            <View style={styles.firstHeader}>
              <Text style={{ ...globalStyles.para, color: 'red', fontFamily: 'inter-bold'}}>Finder</Text>
              <Text style={{ ...globalStyles.header, fontFamily: 'inter-bold', 
                position: 'relative', bottom: 20}}>
                Find Nearest Workout Facility & Park
              </Text>
            </View>

            <View style={[styles.searchWrapper, styles.extra]}>
              <TextInput 
                style={{borderRadius: 7, width: '90%'}}
                placeholder='Your Location'
                onChangeText={(newText) => setSearch(newText)}
                value={search}/>

              <TouchableOpacity onPress={searchHandler}>
                <Ionicons name='search-outline' size={20} style={{
                  position: 'relative', left: 5, top: 1}}/>
              </TouchableOpacity>
            </View>

            <View style={styles.buttonsWrapper}>
              <TouchableOpacity onPress={activeSGHandler} style={[
                styles.button, activeSG ? styles.highlightedButton : undefined]}>

                <Text style={{ ...globalStyles.para, position: 'relative', right: 3}}>ActiveSG</Text>
                <MaterialIcons name='sports-gymnastics' size={20} style={{
                  position: 'relative', left: 2, top: 10}}/>

              </TouchableOpacity>

              <TouchableOpacity onPress={parkHandler} style={[
                styles.button, {marginLeft: 10}, 
                park ? styles.highlightedButton : undefined]}>
                
                <Text style={globalStyles.para}>Park</Text>
                <MaterialCommunityIcons name='tree-outline' size={20} style={{
                  position: 'relative', left: 5, top: 10}}/>

              </TouchableOpacity>
            </View>
            
            <View style={styles.firstResultWrapper}>
              <Text style={{ ...globalStyles.header, fontFamily: 'inter-bold'}}>Result</Text>
              <View style={styles.card}>
                <View style={styles.cardWrapper}>
                  <Text style={globalStyles.para}>Result of the search will be displayed here!</Text>
                </View>
              </View>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </View>
  );
}

const { width } = Dimensions.get('window');
const borderWidth = 1; // Assuming 1 pixel border width
const shadowWidth = 2; // Assuming 2 pixels shadow width
const cardWidth = (width - 4) - (2 * borderWidth) - (2 * shadowWidth);  // Assuming you want a percentage width

const styles = StyleSheet.create({
  firstHeader: {
    width: '100%'
  },

  searchWrapper: {
    width: '100%',
    position: 'relative',
    bottom: 23,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },

  extra: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 7,
    padding: 10
  },

  buttonsWrapper: {
    flexDirection: 'row', 
    position: 'relative',
    bottom: 8,
    alignItems: 'center',
    marginBottom: 10,
    // fixed height
    // so that when height slightly changes onActiveState
    // elements below do not shift down
    height: 43,
  },

  button: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '33%',
    backgroundColor: '#F6F2F2',
    borderRadius: 10
  }, 

  highlightedButton: {
    borderColor: 'red',
    borderWidth: 1
  },

  firstResultWrapper: {
    position: 'relative',
    bottom: 7
  },

  card: {
    backgroundColor: '#fff',
    borderRadius: 7,
    elevation: 3,
    shadowOffset: { width: 0, height: 1},
    shadowColor: "#333",
    shadowOpacity: 0.3,
    shadowRadius: 2,

    // very slight horizontal margin
    // preserving the shadow card effect and also somewhat preserving alignment
    marginHorizontal: '0.15%'
  },

  cardWrapper: {
    width: '100%',
    height: 250,
    padding: 7
  },
});
