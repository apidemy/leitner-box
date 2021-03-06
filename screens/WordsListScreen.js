import * as React from 'react';
import {Text, StyleSheet, SafeAreaView, View, FlatList, Button, ToastAndroid} from 'react-native';
import Constants from 'expo-constants';
import * as SQLite from 'expo-sqlite';
import {useEffect, useState} from "react";

const db = SQLite.openDatabase('leitnerboxdb.db');

const UpdateButtons = (props) => {

    return (
        <View style={styles.flexRow}>
            <View style={styles.changeButtons}>
                <Button title="Edit" onPress={() => props.navigation.navigate('AddWords', props.id)}/>
            </View>
            <View style={styles.changeButtons}>
                <Button title="Delete" onPress={ () => deleteWord(props.id, props.cards)}/>
            </View>
        </View>
    );
}

const deleteWord = (id, setFlatListItems, items) => {
  const filteredData = items.filter(item => item.id !== id);
  setFlatListItems(filteredData)
    db.transaction((tx) => {
        tx.executeSql(
            'DELETE FROM cards WHERE id =?',
            [id],
            (tx, results) => {
                if(results.rowsAffected > 0) {
                  ToastAndroid.show("Word deleted", ToastAndroid.SHORT);
                } 
            },
          (tx, error) => console.error(error)
        );
        });
  }

const WordsListScreen = ({navigation, route}) => {


  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {

      db.transaction((tx) => {
        tx.executeSql(
            'SELECT * FROM cards',
            [],
            (tx, results) => {
            var temp = [];
            for (let i = 0; i < results.rows.length; ++i)
                temp.push(results.rows.item(i));
            setFlatListItems(temp);
            // console.log(temp);
            },
          (tx, error) => console.error(error)
        );
        });
    });

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  }, [navigation]);

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
            style={styles.listArea}>
            <View style={styles.mainText}>
              <Text style={styles.headline}>Word: {item.card}</Text>
              <Text style={styles.headline}>Meaning: {item.meaning}</Text>
              <Text style={styles.headline}>Comment: {item.comment}</Text>
            </View>
            {/* <UpdateButtons cards={this.state} navigation={navigation} id={item.id} /> */}
            <View style={styles.flexRow}>
            <View style={styles.changeButtons}>
                <Button title="Edit" onPress={() =>{
                  console.log(item.id)
                 navigation.navigate('AddWords', {id: item.id})
                 }
                 }/>
            </View>
            <View style={styles.changeButtons}>
                <Button title="Delete" onPress={ () => deleteWord(item.id, setFlatListItems, flatListItems)}/>
            </View>
        </View>
          </View>
        );
      };


    if(flatListItems.length == 0)
      return(
        <View style={{flex: 1, backgroundColor:'rebeccapurple', 
                    paddingTop: 50, flexDirection:'row',
                    justifyContent: 'center', }}>
          <Text style={{fontWeight: 'bold',
                    fontSize: 20,}}>There is No Word to learn.</Text>
        </View>
        )
    return(

        <SafeAreaView style={styles.container}>
        <Text
          style={{
            fontSize: 18,
            textAlign: 'center',
            color: 'grey'
          }}>
          List of all words you have added
        </Text>
        <View style={{ flex: 1, backgroundColor: 'white' }}>
          <View style={{ flex: 1 }}>
            <FlatList
              data={flatListItems}
              ItemSeparatorComponent={listViewItemSeparator}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => listItemView(item)}
            />
          </View>
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
      paddingTop: 16,
      alignItems: 'center',
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
        
    },
    mainText: {
      flex: 1,
      flexDirection: 'column',
      // backgroundColor: 'lightgray',
      justifyContent: 'center',
    },
    headline: {
      fontWeight: 'bold',
      fontSize: 18,
      paddingBottom: 10,
    },
  });

export default WordsListScreen;