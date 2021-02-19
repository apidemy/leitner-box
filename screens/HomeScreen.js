import React, { useState, useEffect } from 'react'
import {Text, StyleSheet, View, Button} from 'react-native'
import { ScrollView } from 'react-native-gesture-handler';
import Constants from 'expo-constants';
import * as SQLite from 'expo-sqlite';


const db = SQLite.openDatabase('leitnerboxdb.db');

const HomeScreen = ({navigation, route}) => {

    const [cardsCount, setCardsCount] = useState('');

    useEffect(() => {
            const unsubscribe = navigation.addListener('focus', () => {
        
            db.transaction((tx) => {
            tx.executeSql(
                'SELECT * FROM cards',
                [],
                (tx, results) => {
                // var temp = [];
                // for (let i = 0; i < results.rows.length; ++i)
                    // temp.push(results.rows.item(i));
                // console.log(results)
                setCardsCount(results.rows.length);
                },
                (tx, error) => console.error(error)
            );
            });
        });
        // Return the function to unsubscribe from the event so it gets removed on unmount
        return unsubscribe;
    }, [navigation]);

    return(
        <View style={styles.Container}>
            <Text>Wellcome to Leitner box technic</Text>
            <View style={styles.button}>
                <Text>This is your profile sates</Text>
                <Text>Total cards:{cardsCount}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    Container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
        flex: 1,
        paddingTop: Constants.statusBarHeight
    },
    button: {
        // flexDirection: 'row',
      },
});

export default HomeScreen;