import { StyleSheet } from 'react-native';

const colors = {
    black: '#1a1917',
    gray: '#888888',
    background1: '#B721FF',
    background2: '#21D4FD'
};

export default StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: colors.black
    },
    container: {
        flex: 1,
        backgroundColor: colors.background1
    },
    gradient: {
        ...StyleSheet.absoluteFillObject
    },
    scrollview: {
        flex: 1
    },
    exampleContainer: {
        paddingVertical: 30
    },
    exampleContainerDark: {
        backgroundColor: colors.black
    },
    exampleContainerLight: {
        backgroundColor: 'white'
    },
    title: {
        paddingHorizontal: 30,
        backgroundColor: 'transparent',
        color: 'rgba(255, 255, 255, 0.9)',
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center'
    },
    titleDark: {
        // color: colors.black
    },
    subtitle: {
        marginTop: 5,
        paddingHorizontal: 30,
        backgroundColor: 'transparent',
        color: 'rgba(255, 255, 255, 0.75)',
        fontSize: 13,
        fontStyle: 'italic',
        textAlign: 'center'
    },
    slider: {
        marginTop: 15,
        overflow: 'visible' // for custom animations
    },
    sliderContentContainer: {
        paddingVertical: 10 // for custom animation
    },
    paginationContainer: {
        paddingVertical: 8
    },
    paginationDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginHorizontal: 8
    },
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