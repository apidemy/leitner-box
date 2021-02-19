import 'react-native-gesture-handler'; // Must be at the top
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer, StackActions } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';


import HomeScreen from './screens/HomeScreen';
import AddWrodsScreen from './screens/AddWordsScreen'
import LearnWordsScreen from './screens/LearnWordsScreen';
import WordsListScreen from './screens/WordsListScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;

            if (route.name === 'Home') {
              iconName = focused ? 'home-outline' : 'home';
            } else if (route.name === 'LearnWords') {
              iconName = focused ? 'book-outline' : 'book';
            }
            else if (route.name === 'AddWords') {
              iconName = focused ? 'add-circle-outline' : 'add-circle';
            }
            else if (route.name === 'WordsList') {
              iconName = focused ? 'list-outline' : 'list';
            }
            
            // You can return any component that you like here!
            return <Ionicons name={iconName} size={size} color={color} />;
            },
          })}
          tabBarOptions={{
            activeTintColor: 'tomato',
            inactiveTintColor: 'gray',
          }}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="LearnWords" component={LearnWordsScreen}  options={{ tabBarBadge: 5 }} />
        <Tab.Screen name="AddWords" component={AddWrodsScreen} />
        <Tab.Screen name="WordsList" component={WordsListScreen}/>
      </Tab.Navigator>
    </NavigationContainer>
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
