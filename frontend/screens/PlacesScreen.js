import { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useDispatch, useSelector } from 'react-redux';
import { addPlace, removePlace } from '../reducers/user';

export default function PlacesScreen() {

  const dispatch = useDispatch(); // initialise dispatch
  const user = useSelector((state) => state.user.value); // initialise the user local storage

  const [city, setCity] = useState(''); // the state to hold the value of city input

  /**
   * Description :
   * add a city and its location to the databse
   */
  function handleSubmit()
  {
    // check if the length of city value is greater than 0 
    if(city.length === 0)
      return;
    
    // GET city data with this API
    fetch(`https://api-adresse.data.gouv.fr/search/?q=${city}`)
      .then((response) => response.json()) // convert data to JSON
      .then((data) => {
        const firstCity = data.features[0]; // GET the first city to find

        const newPlace = {
          name: (firstCity.properties.city), // store the city name
          latitude: (firstCity.geometry.coordinates[1]), // store the city latitude
          longitude: (firstCity.geometry.coordinates[0]), // store the city longitude
        };

        // POST the place to the database
        fetch(`https://locapicbackend-4dc272s0f-ezeflt.vercel.app/places/add`,{
          method:'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({nickname: user.nickname, name: newPlace.name, latitude: newPlace.latitude, longitude: newPlace.longitude }),
        })
        dispatch(addPlace(newPlace)); // add the place to the user's place local storage
        setCity(''); // reset the city input value
      });
  };

  /**
   * Descrption :
   * delete a place to the databse
   */
  function deletePlace (data)
  {
    fetch(`https://locapicbackend-4dc272s0f-ezeflt.vercel.app/places/delete`,{
      method:'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({nickname: user.nickname, name: data.name})
    })
    dispatch(removePlace(data.name)); // remove the place of the local storage
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>{user.nickname}'s places</Text>

      <View style={styles.inputContainer}>
        <TextInput placeholder="New city" onChangeText={(value) => setCity(value)} value={city} style={styles.input} />
        <TouchableOpacity onPress={() => handleSubmit()} style={styles.button} activeOpacity={0.8}>
          <Text style={styles.textButton}>Add</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollView}>
        {/* loop to the places array from the local storage */}
        {user.places.map((data, i) => {
          return (
            <View key={i} style={styles.card}>
              <View>
                <Text style={styles.name}>{data.name}</Text>
                <Text>LAT : {Number(data.latitude).toFixed(3)} LON : {Number(data.longitude).toFixed(3)}</Text>
              </View>
              <FontAwesome name='trash-o' onPress={()=>deletePlace(data)} size={25} color='#ec6e5b' />
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 30,
    marginBottom: 20,
  },
  scrollView: {
    alignItems: 'center',
    paddingBottom: 20,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '80%',
    backgroundColor: '#ffffff',
    padding: 20,
    marginTop: 20,
    borderRadius: 10,
  },
  name: {
    fontSize: 18,
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '80%',
    backgroundColor: '#ffffff',
    padding: 20,
    marginTop: 20,
    borderRadius: 10,
  },
  input: {
    width: '65%',
    marginTop: 6,
    borderBottomColor: '#ec6e5b',
    borderBottomWidth: 1,
    fontSize: 16,
  },
  button: {
    width: '30%',
    alignItems: 'center',
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
