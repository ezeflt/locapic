import { useEffect, useState } from 'react';
import { Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { addPlace,ecrasePlace } from '../reducers/user';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';

export default function MapScreen() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.value);

  const [currentPosition, setCurrentPosition] = useState(null);
  const [tempCoordinates, setTempCoordinates] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [newPlace, setNewPlace] = useState('');

  // au chargement du composant je demande la permission d'acces à la localisation
  //chaque 10sec je récupère les coordonées
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status === 'granted') {
        Location.watchPositionAsync({ distanceInterval: 10 },
          (location) => {
            setCurrentPosition(location.coords);
          });
      }
    })();
  }, []);

  
  //long press sur l'écran qui active la modale et qui obtient les coordonnée pour les ajouter en BDD 
  const handleLongPress = (e) => {
    setTempCoordinates(e.nativeEvent.coordinate);
    setModalVisible(true);
  };

  const addBack = ()=>{
    fetch(`http://172.20.10.2:3000/places/places`,{
      method:'POST',
      headers: { 'Content-Type': 'application/json' },
      // nom : reducer, name: Ville saisie, lat&long: pressData
      body: JSON.stringify({nickname: user.nickname, name: newPlace, latitude: tempCoordinates.latitude, longitude: tempCoordinates.longitude }),
    })
    .then(response=>response.json())
    .then(data=>{
      console.log(data)
    })
  }
  //au chargement du composent j'envoie l'identifiant du reducer dans la BDD
  //je récupère les villes de cette utilisateur pour lui afficher
  useEffect(()=>{
    fetch(`http://172.20.10.2:3000/places/places/${user.nickname}`)
    .then(response=>response.json())
    .then(data=>{
      if(data.result){
        const newTab = data.places.map((data,i)=>{
          return({
            name: data.name,
            longitude: data.longitude,
            latitude: data.latitude,
          })
        })
        if(newTab){
          dispatch(ecrasePlace(newTab))
        }else{
          console('new tab error data no recup')
        }
      }
    })
  },[])


  const handleNewPlace = () => {
    // ajoute dans la BDD
    // ajoute dans le reducer
    // ferme la modal
    // reset les champs
    addBack()
    dispatch(addPlace({ name: newPlace, latitude: tempCoordinates.latitude, longitude: tempCoordinates.longitude }));
    setModalVisible(false);
    setNewPlace('');
  };

  const handleClose = () => {
    // ferme la modal et reset le champ
    setModalVisible(false);
    setNewPlace('');
  };

  const markers = user.places.map((data, i) => {
    return <Marker key={i} coordinate={{ latitude: data.latitude, longitude: data.longitude }} title={data.name} />;
  });

  return (
    <View style={styles.container}>
      <Modal visible={modalVisible} animationType="fade" transparent>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TextInput placeholder="New place" onChangeText={(value) => setNewPlace(value)} value={newPlace} style={styles.input} />
            <TouchableOpacity onPress={() => handleNewPlace()} style={styles.button} activeOpacity={0.8}>
              <Text style={styles.textButton}>Add</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleClose()} style={styles.button} activeOpacity={0.8}>
              <Text style={styles.textButton}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <MapView onLongPress={(e) => handleLongPress(e)} mapType="hybrid" style={styles.map}>
        {currentPosition && <Marker coordinate={currentPosition} title="My position" pinColor="#fecb2d" />}
        {markers}
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
