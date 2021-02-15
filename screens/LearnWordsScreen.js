import * as React from 'react';
import {Text, StyleSheet, SafeAreaView, 
  View,
  TouchableHighlight,
  FlatList, Button, Alert, Dimensions} from 'react-native';
import * as SQLite from 'expo-sqlite';
import {useEffect, useState} from "react";
import { render } from 'react-dom';
import Carousel from 'react-native-snap-carousel';
import {Constants} from 'expo'

// import { createStackNavigator } from '@react-navigation/stack';

// const Stack = createStackNavigator();

const db = SQLite.openDatabase('leitnerboxdb.db');

// const LearnWordsScreen = ({navigation}) => {
export default class LearnWordsScreen extends React.Component {
  constructor({props, navigation}) {
    super(props);
    
    this.state = {
    activeIndex: 0,
    flatListItems: [],

    }

    db.transaction((tx) => {
      tx.executeSql(
          'SELECT * FROM cards',
          [],
          (tx, results) => {
          var temp = [];
          for (let i = 0; i < results.rows.length; ++i)
              temp.push(results.rows.item(i));
          // TODO: sort temp by box
          this.setState({flatListItems:temp});
          },
        (tx, error) => console.error(error)
      );
      });
  }

  componentDidUpdate() {
    console.log("componn")
    console.log(this.state.activeIndex)

  }

  // useEffect(() => {
  //     db.transaction((tx) => {
  //     tx.executeSql(
  //         'SELECT * FROM cards',
  //         [],
  //         (tx, results) => {
  //         var temp = [];
  //         for (let i = 0; i < results.rows.length; ++i)
  //             temp.push(results.rows.item(i));
  //         // TODO: sort temp by box
  //         setFlatListItems(temp);
  //         },
  //       (tx, error) => console.error(error)
  //     );
  //     });
  // }, []);
  

  // cardScreen = () => {
  //     return (
  //       <View
  //         style={{
  //           height: 0.2,
  //           width: '100%',
  //           backgroundColor: '#808080'
  //         }}
  //       />
  //     );
  //   };

  _renderItem({item}) {
    return (
      <View style={styles.container}>
      <Text style={styles.title}>{item.card}</Text>
      <Text style={styles.meaning}>{item.meaning}</Text>
      <Text style={styles.comment}>{item.comment}</Text>
    </View>
    )
  }

  render() {
    return(
      <SafeAreaView style={{flex: 1, backgroundColor:'rebeccapurple', paddingTop: 50, }}>
            <View style={{ flex: 1, flexDirection:'row', justifyContent: 'center', }}>
                <Carousel
                  layout={"stack"}
                  layoutCardOffset={`18`}
                  ref={ref => this.carousel = ref}
                  data={this.state.flatListItems}
                  sliderWidth={300}
                  itemWidth={Dimensions.get('window').width}
                  renderItem={this._renderItem}
                  onSnapToItem = { index => this.setState({activeIndex:index}) } />
            </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create ({
  container: {
    backgroundColor:'floralwhite',
    borderRadius: 5,
    height: 50,
    padding: 50,
    flex:1,
    marginLeft: 25,
    marginBottom: 25,
    marginRight: 25, 
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 50,
  },
  meaning: {
    fontSize: 25,
    marginBottom: 50,
  },
  comment: {
    fontSize: 15,
    fontStyle: 'italic'
  },
});

// export default LearnWordsScreen;