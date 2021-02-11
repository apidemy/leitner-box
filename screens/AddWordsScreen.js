import * as React from 'react';
import {Text, StyleSheet, View, Button} from 'react-native'
import { TextInput } from 'react-native-gesture-handler';

const AddWrodsScreen = ({navigation, route}) => {

    const {word, meaning} = route.params;
    const [thisWord, setThisWord] = React.useState('');
    const [thisMeaning, setThisMeaning] = React.useState('');

    return(
        <View style = {styles.Container}>
            <View style = {styles.SearchView}>
                <TextInput style = {styles.SearchView} 
                    placeholder = 'Type a word ' 
                    onChangeText = {setThisWord}
                />
                <TextInput style = {styles.SearchView} 
                    placeholder = 'Type meaning ' 
                    onChangeText = {setThisMeaning}
                />
                <Text>Result: {thisWord} = {thisMeaning}</Text>
            </View>
            <Button title = 'Add' onPress = {() => {
                navigation.navigate('Home', {word: thisWord, meaning: thisMeaning});
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