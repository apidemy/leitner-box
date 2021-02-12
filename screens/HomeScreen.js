import React, { useState, useEffect } from 'react'
import {Text, StyleSheet, View, Button} from 'react-native'
import { ScrollView } from 'react-native-gesture-handler';

let id = 0;
let leitnerArr = [];

const HomeScreen = ({navigation, route}) => {

    const [a, setA] = useState('');

    useEffect(() => {
        if(route.params?.word)
        {
            setA(route.params.word);
            leitnerArr.push({
                key: id++,
                word: route.params.word, 
                meaning: route.params.meaning,
            })
        }
    }, [route.params?.word]);

    return(
        <View style={styles.Container}>
            <Text>this is home screen</Text>
            <View style={styles.button}>
                <Button title='Add' onPress = {() => navigation.navigate('AddWords') }/>
                <Button title='Start Learning' onPress = {() => navigation.navigate('LearnWords') } />
                <Button title='Words List' onPress = {() => navigation.navigate('WordsList') } />
            </View>
            <ScrollView>
                {leitnerArr.map( val  => (
                    <Text key={val.id}>word : {val.word} = meaning: {val.meaning}</Text>
                ) )}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    Container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    button: {
        // flexDirection: 'row',
      },
});

export default HomeScreen;