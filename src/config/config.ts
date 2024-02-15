import { StyleSheet } from "react-native";

export const appname = 'Three Digits';
export const appversion = '1.0.0';


export const IMAGE = {
    icon : require('../assets/icon.png'),
}

export const STYLES = StyleSheet.create({
    title : {
        fontSize: 24,
        fontWeight: 'bold',
        color:'black',
    },
    normal_label :{
        fontSize: 16,
        fontWeight: 'bold',
        color:'black',
    },
    normal_text :{
        fontSize: 16,
        color:'black',
    },

    bold_text :{
        fontSize: 16,
        fontWeight: 'bold',
        color:'black',
    },

    button : {
        backgroundColor: 'blue',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
    },
    

});