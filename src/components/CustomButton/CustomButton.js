import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const CustomButton = ({ onPress, text, type = "PRIMARY", bgColor, fgColor}) => {
    return (
        <TouchableOpacity onPress={onPress} style={[
            styles.container, 
            styles[`container_${type}`],
            bgColor ? {backgroundColor: bgColor} : {}
            ]}>
            <Text style={[styles.text, styles[`text_${type}`]]}>{text}</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFFFFF',
        width: '100%',

        padding: 15,
        marginVertical: 5,
        alignItems: 'center',
        borderRadius: 5,
    },
    container_PRIMARY: {
        backgroundColor: '#000000',
    },
    container_TERTIARY: {},
    text: {
        fontWeight: 'bold',
        color: 'white',
    },
    text_TERTIARY: {
        color: 'gray',
    }
});

export default CustomButton;
