import React, {useState} from 'react';
import {Text, StyleSheet, View, Button, Alert} from 'react-native'
import { TextInput } from 'react-native-gesture-handler';
import * as SQLite from 'expo-sqlite';
import { useReducer } from 'react';

const db = SQLite.openDatabase('leitnerboxdb.db');


function reducer(wordItem, action) {
    switch(action.type) {
        case 'word':
            return {...wordItem, word: action.value};
        case 'meaning':
            return {...wordItem, meaning: action.value};
        case 'comment':
            return {...wordItem, comment: action.value};

    }
}

const AddWrodsScreen = ({navigation, route}) => {

    const [wordItem, dispatchWordItem] = useReducer(reducer, {
        word: '',
        meaning: '',
        comment: '',
    });

    React.useEffect(() => {
        db.transaction(tx => {
          tx.executeSql(
            'create table if not exists words ('+
                        'id integer primary key not null,' +
                        'word varchar(255),' +
                        'meaning varchar(255),' +
                        'comment varchar(255));'
          );
        });
      }, []);

      const add = (wordItem) => {
        // is text empty?
        if (wordItem.word === null || wordItem.word === '') {
            console.log("no word typed")
          return false;
        }
    
        db.transaction(
          tx => {
            tx.executeSql('insert into words (word, meaning, comment) values (?, ?, ?)', [wordItem.word, wordItem.meaning, wordItem.comment],
            (tx, results) => {
                console.log('Results', results.rowsAffected);
                if (results.rowsAffected > 0) {
                  Alert.alert(
                    'Success',
                    'Your Word Added Successfully',
                    [
                      {
                        text: 'Ok',
                        onPress: () => navigation.navigate('Home'),
                      },
                    ],
                    { cancelable: false }
                  );
                } else alert('Registration Failed');
              }

            );
            // tx.executeSql('select * from items', [], (_, { rows }) =>
            //   console.log(JSON.stringify(rows))
            // );
          },
        //   null,
        // forceUpdate
        );
      }

    return(
        <View style = {styles.Container}>
            <View style = {styles.SearchView}>
                <TextInput style = {styles.SearchView} 
                    placeholder = 'Type a word '
                    value={wordItem.word}
                    onChangeText = {(text) => dispatchWordItem({type:'word', value: text})}
                />
                <TextInput style = {styles.SearchView} 
                    placeholder = 'Type meaning ' 
                    value={wordItem.meaning}
                    onChangeText = {(text) => dispatchWordItem({type:'meaning', value: text})}
                    // onSubmitEditing={() => {
                    //     add(text);
                    //     setThisMeaning(null);
                    //   }}
                />
                <TextInput style = {styles.SearchView} 
                    placeholder = 'Type a comment (optional) ' 
                    value={wordItem.comment}
                    onChangeText = {(text) => dispatchWordItem({type:'comment', value: text})}
                />
                <Text>Result: {wordItem.word} = {wordItem.meaning} and {wordItem.comment}</Text>
            </View>
            <Button title="Add" onPress={() => add(wordItem)}/>
            <Button title = 'Back' onPress = {() => {
                navigation.navigate('Home');
            } } />
        </View>
    );
};

const styles = StyleSheet.create({
    Container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    SearchView: {
        marginBottom: 20,
        padding: 10,
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default AddWrodsScreen;