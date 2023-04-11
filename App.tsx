import { StyleSheet, View } from 'react-native';
import HomeScreen from './components/HomeScreen';
import { PlaceContextProvider } from './contexts/PlacesContext';
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { Screens } from './components/constants';
import IndividualSearchScreen from './components/IndividualSearchScreen';
import GroupScreen from './components/GroupScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <PlaceContextProvider>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerStyle: {
              backgroundColor: "black"
            },
            headerTintColor: "white"
          }}
          >
            <Stack.Screen name={Screens.HOME} component={HomeScreen}/>
            <Stack.Screen name={Screens.INDIVIDUAL} component={IndividualSearchScreen} />
            <Stack.Screen name={Screens.GROUP} component={GroupScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </PlaceContextProvider>
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
