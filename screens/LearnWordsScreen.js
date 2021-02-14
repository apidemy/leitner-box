import * as React from 'react';
import {Text, StyleSheet, SafeAreaView, View, FlatList, Button, Alert} from 'react-native';
import * as SQLite from 'expo-sqlite';
import {useEffect, useState} from "react";
// import { createStackNavigator } from '@react-navigation/stack';

// const Stack = createStackNavigator();

const db = SQLite.openDatabase('leitnerboxdb.db');

const CardItemScreen = ({navigation, route}) => {

    return (
        <View>
            <Text>hey: {route.params.card}</Text>
            <Button title="Yes" />
        </View>
    );
}

const LearnWordsScreen = ({navigation}) => {

    useEffect(() => {
        db.transaction((tx) => {
        tx.executeSql(
            'SELECT * FROM cards',
            [],
            (tx, results) => {
            var temp = [];
            for (let i = 0; i < results.rows.length; ++i)
                temp.push(results.rows.item(i));
            // TODO: sort temp by box
            setFlatListItems(temp);
            },
          (tx, error) => console.error(error)
        );
        });
    }, []);


    let [flatListItems, setFlatListItems] = useState([]);

    let cardScreen = () => {
        return (
          <View
            style={{
              height: 0.2,
              width: '100%',
              backgroundColor: '#808080'
            }}
          />
        );
      };


    return(
        // <Stack.Navigator>
            // {flatListItems.map((item) => {CardItemView(item)})}
        // </Stack.Navigator>
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <Text>Cards:{console.log(flatListItems)}</Text>
        </View>
    );
};

export default LearnWordsScreen;