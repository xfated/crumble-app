import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import IntroScreen from './components/IntroScreen'
import HomeScreen from './components/HomeScreen';
import { PlaceContextProvider } from './contexts/PlacesContext';
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { Screens } from './components/constants';
import IndividualSearchScreen from './components/IndividualSearchScreen';
import GroupScreen from './components/GroupScreen';
import CreateGroupScreen from './components/CreateGroupScreen';
import Spinner from 'react-native-loading-spinner-overlay/lib';

import useLaunchState from './services/firstlaunch'

const Stack = createNativeStackNavigator();

export default function App() {
  const {isLoading, hasLaunched, checkFirstLaunch} = useLaunchState();

  useEffect(() => {
    checkFirstLaunch();
  }, [])

  if (isLoading) {
    return <Spinner
        textContent="Loading..."
        overlayColor="rgba(25,25,25,0.5)"
    />
  }

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
            {!hasLaunched ? 
              <>
                { !hasLaunched && <Stack.Screen name={Screens.INTRO} component={IntroScreen}/> }
                <Stack.Screen name={Screens.HOME} component={HomeScreen} options={{ headerBackVisible: false }}/>
                <Stack.Screen name={Screens.INDIVIDUAL} component={IndividualSearchScreen} />
                <Stack.Screen name={Screens.GROUP} component={GroupScreen} />
                <Stack.Screen name={Screens.CREATE_GROUP} component={CreateGroupScreen} />
              </>
            : 
              <>
                <Stack.Screen name={Screens.HOME} component={HomeScreen} options={{ headerBackVisible: false }}/>
                <Stack.Screen name={Screens.INDIVIDUAL} component={IndividualSearchScreen} />
                <Stack.Screen name={Screens.GROUP} component={GroupScreen} />
                <Stack.Screen name={Screens.CREATE_GROUP} component={CreateGroupScreen} />
              </>
            }
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
