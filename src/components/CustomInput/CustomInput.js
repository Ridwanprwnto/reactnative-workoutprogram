import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';

const CustomInput = ({ value, onChangeText, placeholder, secureTextEntry, disabled  }) => {
    return (
      <View style={[styles.container, disabled && styles.disabledContainer]}>
        <TextInput
            style={[styles.input, disabled && styles.disabledInput]}
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder} 
            placeholderTextColor={'#AAAAAA'}
            secureTextEntry={secureTextEntry}
            editable={!disabled}
        />
      </View>
    );
};

const styles = StyleSheet.create({
    container: {
      backgroundColor: 'white',
      width: '100%',
      borderColor: '#e8e8e8',
      borderWidth: 1,
      borderRadius: 5,
      paddingHorizontal: 10,
      marginVertical: 5,
    },
    disabledContainer: {
        backgroundColor: '#AAAAAA',
        opacity: 0.5,
    },
    input: {
      fontSize: 14,
      color: '#333',
    },
    disabledInput: {
      color: '#666',
    },
});

export default CustomInput;