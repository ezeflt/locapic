import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

//import screen coponent
import HomeScreen from './screens/HomeScreen';
import MapScreen from './screens/MapScreen';
import PlacesScreen from './screens/PlacesScreen';

//import reducer
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import user from './reducers/user';

//create the reducer store
const store = configureStore({
  reducer: { user },
});

// creates a navigation to components
const Stack = createNativeStackNavigator();

// navigate from page to page with Tab Navigator
const Tab = createBottomTabNavigator();

/**
 * Description :
 * creates a navigation tab to move from page to page
 * 
 * @return return to icons tabs
 */
const TabNavigator = () => {
  return (
    <Tab.Navigator screenOptions={({ route }) => ({

      tabBarIcon: ({ color, size }) => {
        let iconName = '';

        // if route name = x return her icon
        if (route.name === 'Map') {
          iconName = 'location-arrow';
        } else if (route.name === 'Places') {
          iconName = 'map-pin';
        }

        return <FontAwesome name={iconName} size={size} color={color} /> // navigation icon
      },
      tabBarActiveTintColor: '#ec6e5b',   // if the icon is selected, it has this color
      tabBarInactiveTintColor: '#335561', // if the icon is not selected, it has this color
      headerShown: false,
    })}>
      {/* creation of navigation tabs associated with each component */}
      <Tab.Screen name="Map" component={MapScreen} />
      <Tab.Screen name="Places" component={PlacesScreen} />
    </Tab.Navigator>
  );
};

export default function App() {
  return (
    //local storage
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {/* all components */}
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="TabNavigator" component={TabNavigator} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}