import * as React from 'react';
import {Button, Text, View} from 'react-native';
import * as SQLite from 'expo-sqlite';
import {useEffect, useState} from "react";

const db = SQLite.openDatabase('leitnerboxdb.db');

const LearnWordsScreen = ({navigation}) => {

    const dropTable = () => {
        db.transaction((tx) => {
            tx.executeSql(
                'DROP TABLE cards',
                [],
                (tx, results) => {
                    console.log("drop:")
                    console.log(results)
                    // if(results.rowsAffected > 0) {
                        // Alert.alert('Success', 'Word deleted', [{text:'Ok'}]);
                    // } 
                },
            (tx, error) => console.error(error)
            );
            });
      }

    return(
        <View>
            <Text >This is learn words algorithm</Text>
            <Button title="DROp" onPress={() => {dropTable()}} />
        </View>
    );
};

export default LearnWordsScreen;