import React, { useState, useEffect } from 'react'
import {Text, StyleSheet, View, Button} from 'react-native'
import { ScrollView } from 'react-native-gesture-handler';
import Constants from 'expo-constants';
import * as SQLite from 'expo-sqlite';

import { getDaysAgo } from "../components/DateTime";


const db = SQLite.openDatabase('leitnerboxdb.db');

const getCardItems = (res, boxId, timestamp) => {
    let box = '';
    if(boxId != undefined)
        box = 'WHERE box = ' + boxId;
    
    let _time = '';
    if(timestamp != undefined)
        _time = ' AND timestamp => ' + timestamp;


    db.transaction((tx) => {
        tx.executeSql(
            // 'SELECT COUNT(*) FROM cards WHERE box = ? AND timestamp >= ?',
            'SELECT COUNT(*) as count FROM cards ',
            [],
            (tx, results) => {
                res(results.rows.item(0).count)
            },
            (tx, error) => console.error(error)
        );
        });
}

const getLastDateCardItems = (boxId, pastDays) => {

    return new Promise((resolve, reject) =>{
        if(boxId === undefined)
            resolve(0);

        db.transaction((tx) => {
            tx.executeSql(
                // 'Drop table cards;',
                `SELECT * FROM cards WHERE box = ? AND timestamp >= (Select DATETIME('now', "-${pastDays} day"))`,
                [boxId],
                (tx, results) => {
                    // var temp = [];
                    // for (let i = 0; i < results.rows.length; ++i)
                        // temp.push(results.rows.item(i));
                    // res(results.rows.length)
                    resolve(results.rows.length);
                    // console.log(JSON.stringify(temp, null, 2))
                },
                (tx, error) => {
                    console.error(error)
                    reject(null);
                }
            );
            });
    });
}

const HomeScreen = ({navigation, route}) => {

    const [cardsCount, setCardsCount] = useState(0);
    const [boxCount, setBoxCount] = useState(0);

    useEffect(() => {
            const unsubscribe = navigation.addListener('focus', () => {

            getCardItems(setCardsCount);

            let totalReview = boxCount;

            let itemCount =  getLastDateCardItems(1, 1); // box 1 for every 1 day
            // itemCount +=  getLastDateCardItems(2, 3); // box 2 for every 3 day
            // itemCount +=  getLastDateCardItems(3, 5); // box 3 for every 5 day

            setBoxCount(itemCount);

        });
        // Return the function to unsubscribe from the event so it gets removed on unmount
        return unsubscribe;
    }, [navigation]);

    return(
        <View style={styles.Container}>
            <Text style={styles.wellcomeText}>Wellcome to Leitner box technic</Text>
            <View>
                <Text style={styles.font}>Profile Sates</Text>
                <Text style={styles.font}>Total cards: {cardsCount}</Text>
                <Text style={styles.font}>You should review {boxCount} cards</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    Container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#af0faf',
        fontWeight: 'bold',
        paddingTop: Constants.statusBarHeight
    },
    wellcomeText: {
        fontWeight: 'bold',
        fontSize: 20,
        paddingBottom: 100,
    },
    font: {
        // fontWeight: 'bold',
        fontSize: 20,
      },
});

export default HomeScreen;