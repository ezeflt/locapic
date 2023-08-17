import { NavigationContainer } from '@react-navigation/native';
//import stack navigation de changé de page sur un press button
import { createNativeStackNavigator } from '@react-navigation/native-stack';
//import Tab Navigator changé de page avec la tabBar
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
//import awesome
import FontAwesome from 'react-native-vector-icons/FontAwesome';
//import screen coponent
import HomeScreen from './screens/HomeScreen';
import MapScreen from './screens/MapScreen';
import PlacesScreen from './screens/PlacesScreen';

//import reducer
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import user from './reducers/user';

//create store reducer
const store = configureStore({
  reducer: { user },
});

//
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator screenOptions={({ route }) => ({
      tabBarIcon: ({ color, size }) => {
        let iconName = '';

        if (route.name === 'Map') {
          iconName = 'location-arrow';
        } else if (route.name === 'Places') {
          iconName = 'map-pin';
        }

        return <FontAwesome name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: '#ec6e5b',
      tabBarInactiveTintColor: '#335561',
      headerShown: false,
    })}>
      <Tab.Screen name="Map" component={MapScreen} />
      <Tab.Screen name="Places" component={PlacesScreen} />
    </Tab.Navigator>
  );
};

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="TabNavigator" component={TabNavigator} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}