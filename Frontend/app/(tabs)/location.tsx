import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useState } from 'react';
import { FlatList, Image, Dimensions, Alert, Text, TextInput, View, StyleSheet, ScrollView, TouchableOpacity, TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView} from 'react-native';
import { globalStyles } from '../../styles/global';

interface GymInfo {
  name: string, 
  latitude: number,
  longitude: number,
  distance: number,
}

export default function TabTwoScreen() {
  const [search, setSearch] = useState(''); 
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [gymData, setGymData] = useState<GymInfo[] | null>(null);
  const [message, setMessage] = useState<string>("Result of the search will be displayed here!");
  const [gym, setGym] = useState(false); 
  const [park, setPark] = useState(false); 


  const getNearestGyms = async (lat: number, lon: number, radius: number) => {
      const response = await fetch(`http://192.168.50.37:8000/services/find_gym/?lat=${lat}&lon=${lon}&radius=${radius}`, {
          method: 'GET',
          headers: {
              'Content-Type': 'application/json'
          },
      });

      if (!response.ok) {
          // TODO: Handle Error Response
          throw new Error('Network response was not ok');
      }

      const data = await response.json();
      return data;
  };


  const searchHandler = () => {
    if (!gym && !park) {
      Alert.alert('Choose Gym or Park!')
    }
    else if (gym) {
      // Fetching data from the URL
      fetch(`https://www.onemap.gov.sg/api/common/elastic/search?searchVal=${search}&returnGeom=Y&getAddrDetails=Y&pageNum=1`)
      .then((response) => {
          if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
      })
      .then((data) => {
          if (data["results"].length == 0) {
            Alert.alert('User Error', 'Invalid Postal Code / Address input');
          } else {
            setMessage(`Searching for gym(s) around ${data["results"][0]["SEARCHVAL"]}`)
            getNearestGyms(data["results"][0]["LATITUDE"], data["results"][0]["LONGITUDE"], 1000)
            .then((res: GymInfo[] ) => {
              console.log(res)
              setGymData(res);
              let points: string[] = [];
              res.forEach((entry: GymInfo) => {
              if (entry.latitude && entry.longitude) {
                points.push(`[${entry.latitude},${entry.longitude}]`);
              }});
              points.push(`[${data["results"][0]["LATITUDE"]},${data["results"][0]["LONGITUDE"]}]`)
              setImageUri(`https://www.onemap.gov.sg/api/staticmap/getStaticImage?layerchosen=default&latitude=${data["results"][0]["LATITUDE"]}&longitude=${data["results"][0]["LONGITUDE"]}&zoom=15&width=400&height=400&points=${points.join('|')}`)
            }) // Radius of 1km from first search result
          }
      })
      .catch((error) => {
          // Logging any errors
          console.error('Error fetching data:', error);
      });
    }
  };

  const gymHandler = () => {
    setGym(!gym)
    setPark(false)
  };

  const parkHandler = () => {
    setPark(!park)
    setGym(false)
  };

  const renderItem = ({ item }: { item: GymInfo }) => (
    <View style={styles.item}>
      <Text style={styles.column}>{item.name}</Text>
      <Text style={styles.column}>{item.distance + " km"}</Text>
    </View>
    // TODO: add reverse geocode for address
  );

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
                placeholder='Your Location (Postal Code)'
                onChangeText={(newText) => setSearch(newText)}
                value={search}/>

              <TouchableOpacity onPress={searchHandler}>
                <Ionicons name='search-outline' size={20} style={{
                  position: 'relative', left: 5, top: 1}}/>
              </TouchableOpacity>
            </View>

            <View style={styles.buttonsWrapper}>
              <TouchableOpacity onPress={gymHandler} style={[
                styles.button, gym ? styles.highlightedButton : undefined]}>

                <Text style={{ ...globalStyles.para, position: 'relative', right: 3}}>Gym</Text>
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
                  <Text style={globalStyles.para}>{message}</Text>
                  {imageUri && 
                    <View style={styles.imageWrapper}>
                      <Image style={styles.banner} source={{ uri: imageUri }}/>
                    </View>
                  }
                  {gymData && 
                    <>  
                      <Text style={{...globalStyles.para, color: 'grey'}}>Listing Gyms found within 1km radius:</Text>
                      <FlatList
                        data={gymData}
                        renderItem={renderItem}
                        keyExtractor={(item: GymInfo, index: number) => index.toString()}
                        ListHeaderComponent={() => (
                          <View style={styles.item}>
                            <Text style={styles.headerText}>Name</Text>
                            <Text style={styles.headerText}>Distance</Text>
                          </View>
                        )}
                      />
                    </>
                  }
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
    height: 'auto',
    width: '100%',
    padding: 7
  },

  imageWrapper: {
    height: 400,
    width: '100%'
  },

  banner: {
    flex: 1,
    height: null,
    width: null,
    resizeMode: 'cover',
  },

  item: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },

  headerText: {
    flex: 1,
    paddingHorizontal: 10,
    fontWeight: 'bold',
  },

  column: {
    flex: 1, // Take up equal space
    paddingHorizontal: 10,
  },
});
