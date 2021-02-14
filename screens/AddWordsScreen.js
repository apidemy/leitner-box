import React, {useState} from 'react';
import {Text, StyleSheet, View, Button, Alert} from 'react-native'
import { TextInput } from 'react-native-gesture-handler';
import * as SQLite from 'expo-sqlite';
import { useReducer } from 'react';

const db = SQLite.openDatabase('leitnerboxdb.db');


function reducer(wordItem, action) {
    switch(action.type) {
      case 'box':
            return {...wordItem, box: action.value};  
      case 'card':
            return {...wordItem, card: action.value};
      case 'meaning':
          return {...wordItem, meaning: action.value};
      case 'comment':
          return {...wordItem, comment: action.value};
      case 'timestamp':
            return {...wordItem, timestamp: action.value};

    }
}

const getCurrentDate = () => {
  var date = new Date().getDate(); //Current Date
    var month = new Date().getMonth() + 1; //Current Month
    var year = new Date().getFullYear(); //Current Year
    var hours = new Date().getHours(); //Current Hours
    var min = new Date().getMinutes(); //Current Minutes
    var sec = new Date().getSeconds(); //Current Seconds
    return year +'-'+ month+'-' +date + ' ' + hours + ':' + min + ':' + sec;
}

const addCard = (wordItem) => {
  // is text empty?
  console.log(wordItem)
  if (wordItem.card === null || wordItem.card === '') {
      console.log("no card typed")
    return false;
  }

  db.transaction(
    tx => {
      tx.executeSql('insert into cards (card, meaning, comment, box, timestamp) values (?, ?, ?, ?,?)',
      [wordItem.card, wordItem.meaning, wordItem.comment, wordItem.box, getCurrentDate()],
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
        }, (tx, error) => console.error(error)

      )
    },
  );
}

const updateWord = (wordItem) => {
    console.log(wordItem)
    db.transaction((tx) => {
        tx.executeSql(
          'UPDATE cards set card=?, meaning=? , comment=? where id=?',
          [wordItem.card, wordItem.meaning, wordItem.comment, wordItem.id],
          (tx, results) => {
            console.log('Results', results.rowsAffected);
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
  if(props.wordItem.id == undefined || props.wordItem.id < 0) {
    return (
      <View>
        <Button title="Add" onPress={() => addCard(props.wordItem)}/>
        <Button title = 'Back' onPress = {() => {
                  props.navigation.navigate('Home');
          } } />
      </View> 
    );
  } else {
    return (
      <View>
        <Button title="Update" onPress={() => updateWord(props.wordItem)}/>
        <Button title = 'Back' onPress = {() => {
                  props.navigation.navigate('Home');
          } } />
      </View> 
    );
  }
}

const AddWrodsScreen = ({navigation, route}) => {

    const cardId = route.params;

    const [wordItem, dispatchWordItem] = useReducer(reducer, {
        id: cardId,
        box: 1,
        card: '',
        meaning: '',
        comment: '',
        timestamp: '',
    });

    React.useEffect(() => {
        db.transaction(tx => {
          tx.executeSql(
            'create table if not exists cards ('+
                        'id integer primary key not null,' +
                        'box integer,' +
                        'card varchar(255),' +
                        'meaning varchar(255),' +
                        'comment varchar(255),' +
                        'timestamp TEXT);',
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

      }, []);

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