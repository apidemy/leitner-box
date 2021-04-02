import React, { useState, useEffect } from 'react'
import {Text, StyleSheet, View, Button} from 'react-native'
import { ScrollView } from 'react-native-gesture-handler';
import Constants from 'expo-constants';
import * as SQLite from 'expo-sqlite';

import { getDaysAgo } from "../components/DateTime";


const db = SQLite.openDatabase('leitnerboxdb.db');

const limitMaxCards = 5;

const getCardItems = (res, boxId, _time) => {
    let box = '';
    if(boxId != undefined)
        box = 'WHERE box = ' + boxId;
    
    let _timeLimit = '';
    if(_timeLimit != undefined)
        _timeLimit = ' AND _time => ' + _time;


    db.transaction((tx) => {
        tx.executeSql(
            // 'SELECT COUNT(*) FROM cards WHERE box = ? AND _time >= ?',
            'SELECT COUNT(*) as count FROM cards ',
            [],
            (tx, results) => {
                res(results.rows.item(0).count)
            },
            (tx, error) => console.error(error)
        );
        });
}

const getLastDateCardItems = (boxId, pastDays, numLimit) => {

    return new Promise((resolve, reject) => {
        if(boxId === undefined)
            resolve(0);

        db.transaction((tx) => {
            tx.executeSql(
                // 'Drop table cards;',
                `SELECT * FROM cards WHERE box = ?
                AND _time >= (Select DATETIME('now', "-${pastDays} day"))
                LIMIT ?;`,
                // 'select DATETIME(\'now\')',
                // 'SELECT sql FROM sqlite_master WHERE name="cards";',
                [boxId, numLimit],
                // [],
                (tx, results) => {
                    // var temp = [];
                    // for (let i = 0; i < results.rows.length; ++i)
                        // temp.push(results.rows.item(i));
                    // res(results.rows.length)
                    // console.log(JSON.stringify(results.rows, null, 2))
                    // console.log(results.rows)
                    if(results.rows != undefined)
                        resolve(results.rows.length);
                },
                (tx, error) => {
                    console.error(error)
                    // reject(0);
                }
            );
            });
    });
}

const createLeitnerTable = () => {
    db.transaction(tx => {
      tx.executeSql(
        'create table if not exists cards ('+
                    'id integer primary key not null,' +
                    'box integer,' +
                    'card varchar(255),' +
                    'meaning varchar(255),' +
                    'comment varchar(255),' +
                    '_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP);',
        [],
        () => {
        },
        (tx, error) => console.error(error)
      );
    });
}

const CoutCardsToReview = async (res) => 
{
    let itemCount = await getLastDateCardItems(1, 1, limitMaxCards); // box 1 for every 1 day
    itemCount += await getLastDateCardItems(2, 3, limitMaxCards); // box 2 for every 3 day
    itemCount += await  getLastDateCardItems(3, 5, limitMaxCards); // box 3 for every 5 day
    res(itemCount);
}

const HomeScreen = ({navigation, route}) => {

    const [cardsCount, setCardsCount] = useState(0);
    const [cardsToReview, setBoxCount] = useState(0);
    createLeitnerTable()

    useEffect(() => {
            const unsubscribe = navigation.addListener('focus', () => {

            getCardItems(setCardsCount);

            CoutCardsToReview(setBoxCount)
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
                <Text style={styles.font}>You should review {cardsToReview} cards</Text>
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