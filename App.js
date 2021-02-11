import 'react-native-gesture-handler'; // Must be at the top
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer, StackActions } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import HomeScreen from './screens/HomeScreen';
import AddWrodsScreen from './screens/AddWordsScreen'
import LearnWordsScreen from './screens/LearnWordsScreen';
import WordsListScreen from './screens/WordsListScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName = "Home">
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{title: 'Leitner Box'}}
          />
        <Stack.Screen 
          name="AddWords"
          component={AddWrodsScreen}
          options={{title: 'Add'}}
        />
        <Stack.Screen 
          name = "LearnWords"
          component = {LearnWordsScreen}
          options = {{title: 'Learn Words'}}
        />
        <Stack.Screen 
          name = "WordsList"
          component = {WordsListScreen}
          options = {{title: 'Words List Title'}}
        />
      </Stack.Navigator>
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
