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

const addCard = (wordItem) => {
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
    },
  );
}

const updateWord = (wordItem) => {
    console.log(wordItem)
    db.transaction((tx) => {
        tx.executeSql(
          'UPDATE words set word=?, meaning=? , comment=? where id=?',
          [wordItem.word, wordItem.meaning, wordItem.comment, wordItem.id],
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
          }
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
        // box: 1,
        word: '',
        meaning: '',
        comment: '',
    });

    
    // const fetchWordValues = (cardId) => {
    //   if(cardId == undefined) {
    //     return;
    //   }
    
    //   db.transaction((tx) => {
    //     tx.executeSql(
    //       'SELECT * FROM words where id = ?',
    //       [cardId],
    //       (tx, results) => {
    //         var len = results.rows.length;
    //         if (len > 0) {
    //           let res = results.rows.item(0);
    //           return res;
    //           console.log("befor:");
    //           console.log(res);
    //         }
    //       }
    //     );
    //   });
    // }


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

        if(cardId != undefined) {
          db.transaction((tx) => {
            tx.executeSql(
              'SELECT * FROM words where id = ?',
              [cardId],
              (tx, results) => {
                var len = results.rows.length;
                if (len > 0) {
                  let res = results.rows.item(0);
                  dispatchWordItem({type:'word', value: res.word})
                  dispatchWordItem({type:'meaning', value: res.meaning})
                  dispatchWordItem({type:'comment', value: res.comment})
                }
              }
            );
          });
        }

      }, []);

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
                    //     addCard(text);
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