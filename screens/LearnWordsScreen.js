import * as React from 'react';
import {Text, StyleSheet, SafeAreaView, 
  View,
  Pressable,
  Alert,
  Dimensions}
from 'react-native';
import * as SQLite from 'expo-sqlite';
import Carousel from 'react-native-snap-carousel';


const db = SQLite.openDatabase('leitnerboxdb.db');

const latestBox = 3; // Greates litner box number

const getCurrentDate = () => {
  var date = new Date().getDate(); //Current Date
    var month = new Date().getMonth() + 1; //Current Month
    var year = new Date().getFullYear(); //Current Year
    var hours = new Date().getHours(); //Current Hours
    var min = new Date().getMinutes(); //Current Minutes
    var sec = new Date().getSeconds(); //Current Seconds
    return year +'-'+ month+'-' +date + ' ' + hours + ':' + min + ':' + sec;
}

// const LearnWordsScreen = ({navigation}) => {
export default class LearnWordsScreen extends React.Component {
  constructor(props) {
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

  updateItem(didYouKnow) {

    let index = this.state.activeIndex;
    let box = this.state.flatListItems[index].box;

    if(didYouKnow)
      box = Math.min(box + 1, latestBox);
    else
      box = Math.max(1, box-1);

    this.state.flatListItems[index] = {
        ...this.state.flatListItems[index],
        box: box,
        timestamp:getCurrentDate()}
    this.setState(this.state.flatListItems)

    if(index === this.state.flatListItems.length - 1)
      {
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
                  // scrollEnabled={false}
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
    // justifyContent: "center",
    // paddingHorizontal: 10
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
  buttonYes: {
    alignItems: "flex-end",
    backgroundColor: "#0F0",
    padding: 10,
    paddingHorizontal: 40,
    textAlign: 'right',
  },
  buttonNo: {
    alignItems: "flex-start",
    backgroundColor: "#F00",
    padding: 10,
    paddingHorizontal: 20,
    margin: 10,
  },
  buttons: {
    // flex: 1,
    flexDirection: 'row',
    alignItems: "center",
    // backgroundColor: "#DDDDDD",
    justifyContent: 'space-evenly',
    padding: 10
  },
});