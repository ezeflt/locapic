import { useEffect, useState } from 'react';
import { Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { addPlace,ecrasePlace } from '../reducers/user';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';

export default function MapScreen() {

  const dispatch = useDispatch(); // initialise dispatch
  const user = useSelector((state) => state.user.value); // initialise the user local storage

  const [currentPosition, setCurrentPosition] = useState(null); // the state to hold value of the current position
  const [tempCoordinates, setTempCoordinates] = useState(null); // the state to hold value of coorinates
  const [modalVisible, setModalVisible] = useState(false);      // the state to hold the value of modal visible
  const [newPlace, setNewPlace] = useState('');                 // the state to hold the value of input place

  /**
   * Description :
   * when the coponent is monted, requests user location
   */
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();

      // if the response is valided
      if (status === 'granted') {
        Location.watchPositionAsync({ distanceInterval: 10 }, // each 10 secondes GET the user position
          (location) => {
            setCurrentPosition(location.coords); // GET the current posotion
          });
      }
    })();
  }, []);

  /**
   * Description :
   * when the component is mounted, GET user places from the database
   */
  useEffect(()=>{
    fetch(`https://locapicbackend-4dc272s0f-ezeflt.vercel.app/places/places/${user.nickname}`)
    .then(response=>response.json())
    .then(data=>{
      if(data.result){
        // loop through all user place
        const userPlaces = data.places.map((data)=>{
          return({
            name: data.name,            // GET each city name
            longitude: data.longitude,  // GET each longitude
            latitude: data.latitude,    // GET each latitude
          })
        })
        // if userPlace is not empty, add every place to the local storage else log this
        userPlaces ? dispatch(ecrasePlace(userPlaces)) : console.log('new tab error data no recup');
      }
    })
  },[])


  /**
   * Description :
   * add a created place to the database
   */
  function addBack()
  {
    fetch(`https://locapicbackend-4dc272s0f-ezeflt.vercel.app/places/add`,{
      method:'POST',
      headers: { 'Content-Type': 'application/json' },
      // datas post
      body: JSON.stringify({
        nickname: user.nickname,             // username
        name: newPlace,                      // city name
        latitude: tempCoordinates.latitude,  // latitude selected
        longitude: tempCoordinates.longitude // longitude selected
      }),
    })
  }

  const handleNewPlace = () => {

    // add the place to the database
    addBack();

    // add the place to the local storage
    dispatch(addPlace({ 
      name: newPlace, 
      latitude: tempCoordinates.latitude, 
      longitude: tempCoordinates.longitude 
    }));

    setModalVisible(false); // do not display the modal
    setNewPlace('');        // reset the place input value
  };

  return (
    <View style={styles.container}>
      <Modal visible={modalVisible} animationType="fade" transparent>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TextInput placeholder="New place" onChangeText={(value) => setNewPlace(value)} value={newPlace} style={styles.input} />
            <TouchableOpacity onPress={() => handleNewPlace()} style={styles.button} activeOpacity={0.8}>
              <Text style={styles.textButton}>Add</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {setModalVisible(false), setNewPlace('')}} style={styles.button} activeOpacity={0.8}>
              <Text style={styles.textButton}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <MapView onLongPress={(e) => {setTempCoordinates(e.nativeEvent.coordinate), setModalVisible(true)}} mapType="hybrid" style={styles.map}>
        {/* if the current position is not emtpy then display the marker with the current position */}
        {currentPosition && <Marker coordinate={currentPosition} title="My position" pinColor="#fecb2d" />}
        {/* loop through the places and return the places with markers  */}
        {user.places.map((data, i) => {
          return <Marker key={i} coordinate={{ latitude: data.latitude, longitude: data.longitude }} title={data.name} />;
        })}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  input: {
    width: 150,
    borderBottomColor: '#ec6e5b',
    borderBottomWidth: 1,
    fontSize: 16,
  },
  button: {
    width: 150,
    alignItems: 'center',
    marginTop: 20,
    paddingTop: 8,
    backgroundColor: '#ec6e5b',
    borderRadius: 10,
  },
  textButton: {
    color: '#ffffff',
    height: 24,
    fontWeight: '600',
    fontSize: 15,
  },
});
