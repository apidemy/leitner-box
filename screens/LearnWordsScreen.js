import * as React from 'react';
import {Text, StyleSheet, SafeAreaView, 
  View,
  Pressable,
  Alert,
  Dimensions}
from 'react-native';
import * as SQLite from 'expo-sqlite';
import styles, { colors } from '../styles/index.style';
import Carousel from 'react-native-snap-carousel';


const IS_ANDROID = Platform.OS === 'android';
const SLIDER_1_FIRST_ITEM = 1;



const db = SQLite.openDatabase('leitnerboxdb.db');

const latestBox = 3; // Greates litner box number
const numOfBox1Items = 5;

const getCurrentDate = () => {
  var date = new Date().getDate(); //Current Date
    var month = new Date().getMonth() + 1; //Current Month
    var year = new Date().getFullYear(); //Current Year
    var hours = new Date().getHours(); //Current Hours
    var min = new Date().getMinutes(); //Current Minutes
    var sec = new Date().getSeconds(); //Current Seconds
    return year +'-'+ month+'-' +date + ' ' + hours + ':' + min + ':' + sec;
}

const updateDB = (items) => {

  for (let i = 0; i < items.length; ++i)
  {
    // temp.push(items.item(i));
    db.transaction((tx) => {
      tx.executeSql(
        'UPDATE cards SET box=?, timestamp=? WHERE id=?',
        [items[i].box, items[i].timestamp, items[i].id],
        (tx, results) => {
          console.log('Results', results.rowsAffected);
          // if (results.rowsAffected > 0) {
          //   Alert.alert(
          //     'Success',
          //     'User updated successfully',
          //     [
          //       {
          //         text: 'Ok',
          //         // onPress: () => navigation.navigate('HomeScreen'),
          //       },
          //     ],
          //     { cancelable: false }
          //   );
          // } else alert('Updation Failed');
        }
      );
    });
  }
}

const fetchCards = async (boxId, numLimit) => {

  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
          'SELECT * FROM cards WHERE box=? LIMIT ?;',
          [boxId, numLimit],
          (tx, results) => {
          let temp = [];
          for (let i = 0; i < results.rows.length; ++i)
            temp.push(results.rows.item(i));
          resolve(temp);
          },
        (tx, error) => {
          console.error(error);
          // reject(null);
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
                    'timestamp TEXT);',
        [],
        () => {
        },
        (tx, error) => console.error(error)
      );
    });
}
export default class LearnWordsScreen extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      activeIndex: 0,
      flatListItems: [],
      slider1ActiveSlide: SLIDER_1_FIRST_ITEM,
      _unsubscribe: null,
    }
    
    createLeitnerTable();

    this.getCardForCarosul(); // Leitner algo
  }

  componentDidMount() {
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      // do something
    });
  }

  componentWillUnmount() {
    this._unsubscribe();
  }

  async getCardForCarosul() {
    let temp =  [];

    // for box 1
    temp = await fetchCards(1, numOfBox1Items);
    this.setState({flatListItems: [...this.state.flatListItems, ...temp]})

    // // for box 2
    temp = await fetchCards(2, numOfBox1Items);
    this.setState({flatListItems: [...this.state.flatListItems, ...temp]})

    // // for box 3
    temp = await fetchCards(3, numOfBox1Items);
    this.setState({flatListItems: [...this.state.flatListItems, ...temp]})

    console.log(this.state.flatListItems)
  }

  updateItem(didYouKnow) {

    let index = this.state.activeIndex;
    let box = this.state.flatListItems[index].box;

    if(didYouKnow)
      box = Math.min(box + 1, latestBox);
    else
      box = 1; // go to first box

    this.state.flatListItems[index] = {
        ...this.state.flatListItems[index],
        box: box,
        timestamp:getCurrentDate()}
    this.setState(this.state.flatListItems)

    if(index === this.state.flatListItems.length - 1)
      {
        updateDB(this.state.flatListItems);
        Alert.alert(
          'Review finished',
          'All todays words reviewed',
          [
            {
              title: 'Ok',
              onPress: () => {this.props.navigation.navigate("Home")},
            }
          ], {}
        );
      }
  }

  _renderItem({item}) {
    return (
      <View style={styles.container}>
      <Text style={styles.title}>{item.card}</Text>
      <Text style={styles.meaning}>{item.meaning}</Text>
      <Text style={styles.comment}>{item.comment}</Text>
      
    </View>
    )
  }

  render() 
  {
    return(
      <SafeAreaView style={{flex: 1, backgroundColor:'rebeccapurple', paddingTop: 50, }}>
            <View style={{ flex: 1, flexDirection:'row', justifyContent: 'center', }}>
                <Carousel
                  layout={"tinder"}
                  layoutCardOffset={9}
                  ref={ref => {this.carousel = ref}}
                  data={this.state.flatListItems}
                  sliderWidth={300}
                  itemWidth={Dimensions.get('window').width}
                  renderItem={this._renderItem}
                  scrollEnabled={false}
                  onSnapToItem = { index => this.setState({activeIndex:index}) } />  
            </View>
            <View style={styles.buttons}>
              <Pressable 
              onPress={() => { 
                this.updateItem(false);
                this.carousel.snapToNext(); 
              }} 
              style={styles.buttonNo}>
                <Text>Don't know</Text>
              </Pressable>
              <Pressable 
              onPress={() => { 
                this.updateItem(true);
                this.carousel.snapToNext(); 
                }} 
              style={styles.buttonYes}>
                <Text>I know</Text>
              </Pressable>
            </View>
      </SafeAreaView>
    );
  }
}