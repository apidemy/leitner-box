import React, {useState} from 'react';
import {Text, StyleSheet, View, Button, Alert, ToastAndroid} from 'react-native'
import { TextInput } from 'react-native-gesture-handler';
import * as SQLite from 'expo-sqlite';
import { useReducer } from 'react';

import { getCurrentDate } from "../components/DateTime";

const db = SQLite.openDatabase('leitnerboxdb.db');


function reducer(wordItem, action) {
    switch(action.type) {
      case 'box':
          return {...wordItem, box: action.value}; 
      case 'id':
          return {...wordItem, id: action.value}; 
      case 'card':
            return {...wordItem, card: action.value};
      case 'meaning':
          return {...wordItem, meaning: action.value};
      case 'comment':
          return {...wordItem, comment: action.value};
      case '_time':
          return {...wordItem, _time: action.value};

    }
}

const addCard = (props) => {
  // is text empty?
  if (props.wordItem.card === null || props.wordItem.card === '') {
      ToastAndroid.show("Type a word to add", ToastAndroid.SHORT);
    return Promise.reject(false);
  }

  return new Promise((resolve, reject) => {
    db.transaction(
      tx => {
        tx.executeSql('INSERT INTO cards (card, meaning, comment, box) VALUES (?, ?, ?, ?)',
        [props.wordItem.card, props.wordItem.meaning, props.wordItem.comment, props.wordItem.box],
        (tx, results) => {
            console.log('Results', results.rowsAffected);
            if (results.rowsAffected > 0) {
              ToastAndroid.show("Word added", ToastAndroid.SHORT);

              resolve(true);
            } else {
              ToastAndroid.show("Cannot a add word.", ToastAndroid.SHORT);

              reject(false);
            }
          }, (tx, error) => {
            console.error(error);
            reject(false);
          }
        )
      },
    );
  });
  
}

const updateWord = (wordItem) => {
    db.transaction((tx) => {
        tx.executeSql(
          'UPDATE cards SET card=?, meaning=? , comment=? , _time = DATETIME(\'now\') where id=?',
          [wordItem.card, wordItem.meaning, wordItem.comment, wordItem.id],
          (tx, results) => {
            if (results.rowsAffected > 0) {
              Alert.alert(
                'Success',
                'Card updated successfully',
                [
                  {
                    text: 'Ok',
                    // onPress: () => navigation.navigate('HomeScreen'),
                  },
                ],
                { cancelable: false }
              );
            } else alert('Update Failed');
          },
          (tx, error) => console.error(error)
        );
      });
};

const HandleButton = (props) => {
  console.log(props.wordItem)
  if(props.wordItem.id == undefined || props.wordItem.id < 0) {
    return (
      <View>
        <Button title="Add" onPress={ async () => {
          
            let res = await addCard(props);
            if(res === true) {
              // TODO: clear input boxes while a word added
              // dispatchWordItem({type:'card', value: ''})
              // dispatchWordItem({type:'meaning', value: ''})
              // dispatchWordItem({type:'comment', value: ''})
            }
          }
        }/>
      </View> 
    );
  } else {
    return (
      <View>
        <Button title="Update" onPress={() => updateWord(props.wordItem)}/>
      </View> 
    );
  }
}

const AddWrodsScreen = ({navigation, route}) => {

    let cardId = route.params?.id;

    const [wordItem, dispatchWordItem] = useReducer(reducer, {
        id: cardId,
        box: 1,
        card: '',
        meaning: '',
        comment: '',
        _time: '',
    });

    React.useEffect(() => {
      const unsubscribe = navigation.addListener('focus', () => {

        cardId = route.params?.id;
        console.log(cardId)

        db.transaction(tx => {
          tx.executeSql(
            'create table if not exists cards ('+
                        'id integer primary key not null,' +
                        'box integer,' +
                        'card varchar(255),' +
                        'meaning varchar(255),' +
                        'comment varchar(255),' +
                        '_time TIMESTAMP  DEFAULT CURRENT_TIMESTAMP);',
            [],
            () => {
            },
            (tx, error) => console.error(error)
          );
        });

        if(cardId != undefined) {
          db.transaction((tx) => {
            tx.executeSql(
              'SELECT * FROM cards where id = ?',
              [cardId],
              (tx, results) => {
                var len = results.rows.length;
                if (len > 0) {
                  let res = results.rows.item(0);
                  dispatchWordItem({type:'card', value: res.card})
                  dispatchWordItem({type:'meaning', value: res.meaning})
                  dispatchWordItem({type:'comment', value: res.comment})
                }
              },
              (tx, error) => console.error(error)
            );
          });
        }
        else {
          dispatchWordItem({type:'card', value: ''})
          dispatchWordItem({type:'meaning', value: ''})
          dispatchWordItem({type:'comment', value: ''})
        }

      }, []);

      // Return the function to unsubscribe from the event so it gets removed on unmount
      return unsubscribe;
    }, [navigation, route.params?.id]);

    return(
        <View style = {styles.Container}>
            <View style = {styles.SearchView}>
                <TextInput style = {styles.SearchView} 
                    placeholder = 'Type a Word '
                    value={wordItem.card}
                    onChangeText = {(text) => dispatchWordItem({type:'card', value: text})}
                />
                <TextInput style = {styles.SearchView} 
                    placeholder = 'Type meaning ' 
                    value={wordItem.meaning}
                    onChangeText = {(text) => dispatchWordItem({type:'meaning', value: text})}
                    // onSubmitEditing={() => {
                    //     addCard(text);
                    //     setThisMeaning(null);
                    //   }}
                />
                <TextInput style = {styles.SearchView} 
                    placeholder = 'Type a comment (optional) ' 
                    value={wordItem.comment}
                    onChangeText = {(text) => dispatchWordItem({type:'comment', value: text})}
                />
            </View>
            <HandleButton navigation={navigation} wordItem={wordItem}/>
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