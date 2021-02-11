import * as React from 'react';
import {Text, StyleSheet, SafeAreaView, View, FlatList, Button, Alert} from 'react-native';
import Constants from 'expo-constants';
import * as SQLite from 'expo-sqlite';
import {useEffect, useState} from "react";


const db = SQLite.openDatabase('leitnerboxdb.db');

const UpdateButtons = props => {
    return (
        <View style={styles.flexRow}>
            <View style={styles.changeButtons}>
                <Button title="Edit"/>
            </View>
            <View style={styles.changeButtons}>
                <Button title="Delete" onPress={ () => deleteWord(props.id)}/>
            </View>
        </View>
    );
}

let deleteWord = (id) => {
    db.transaction((tx) => {
        tx.executeSql(
            'DELETE FROM words WHERE id =?',
            [id],
            (tx, results) => {
                if(results.rowsAffected > 0) {
                    Alert.alert('Success', 'Word deleted', [{text:'Ok'}]);
                } 
            }
        );
        });
  }


const WordsListScreen = ({navigation}) => {

    useEffect(() => {
        db.transaction((tx) => {
        tx.executeSql(
            'SELECT * FROM words',
            [],
            (tx, results) => {
            var temp = [];
            for (let i = 0; i < results.rows.length; ++i)
                temp.push(results.rows.item(i));
            setFlatListItems(temp);
            }
        );
        });
    }, []);


    let [flatListItems, setFlatListItems] = useState([]);

    let listViewItemSeparator = () => {
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

      let listItemView = (item) => {
        return (
          <View
            key={item.id}
            style={{ backgroundColor: 'white', padding: 20 }}>
            <Text>Word: {item.word}</Text>
            <Text>Meaning: {item.meaning}</Text>
            <Text>Comment: {item.comment}</Text>
            <UpdateButtons id={item.id} />
          </View>
        );
      };

    return(
        <SafeAreaView style={{ flex: 1 }}>
        <View style={{ flex: 1, backgroundColor: 'white' }}>
          <View style={{ flex: 1 }}>
            <FlatList
              data={flatListItems}
              ItemSeparatorComponent={listViewItemSeparator}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => listItemView(item)}
            />
          </View>
          <Text
            style={{
              fontSize: 18,
              textAlign: 'center',
              color: 'grey'
            }}>
            Example of SQLite Database in React Native
          </Text>
        </View>
      </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
      backgroundColor: '#fff',
      flex: 1,
      paddingTop: Constants.statusBarHeight
    },
    heading: {
      fontSize: 20,
      fontWeight: 'bold',
      textAlign: 'center'
    },
    flexRow: {
      flexDirection: 'row'
    },
    input: {
      borderColor: '#4630eb',
      borderRadius: 4,
      borderWidth: 1,
      flex: 1,
      height: 48,
      margin: 16,
      padding: 8
    },
    listArea: {
      backgroundColor: '#f0f0f0',
      flex: 1,
      paddingTop: 16
    },
    sectionContainer: {
      marginBottom: 16,
      marginHorizontal: 16
    },
    sectionHeading: {
      fontSize: 18,
      marginBottom: 8
    },
    changeButtons: {
        margin: 10,
        // height:50,
        // width: 50,
        // backgroundColor: 'rgba(0,0,0,0)'
        
    }
  });

export default WordsListScreen;