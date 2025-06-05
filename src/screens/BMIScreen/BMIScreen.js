import React, { useState } from 'react';
import { Text, View, StyleSheet, ScrollView, Alert } from 'react-native';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';

const BMIScreen = () => {

  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  
  const bmi = (weight / ((height / 100) ** 2)).toFixed(2);

  let category;
  if (bmi < 18.5) {
    category = 'Underweight';
  } else if (bmi < 25) {
    category = 'Normal';
  } else if (bmi < 30) {
    category = 'Overweight';
  } else if (bmi < 35) {
    category = 'Obese I';
  } else if (bmi < 40) {
    category = 'Obese II';
  } else {
    category = 'Obese III';
  }

  const onCalculateBMI = () => {

    if (weight === '' || height === '') {
      Alert.alert(
        'Error :',
        'Please fill data',
      );
      resetTextInput();
      return;
    }

    if (isNaN(weight) && isNaN(height)) {
      Alert.alert(
        'Error :',
        'Fill in is not number',
      );
      resetTextInput();
      return;
    }

    Alert.alert(
      'Nutrition Status :',
      `BMI = ${bmi} Category = ${category}`,
    );
    resetTextInput();

  }
  
  const resetTextInput = () => {
    setWeight('');
    setHeight('');
  }

  return (
    <ScrollView>
      <View style={styles.root}>
          <Text style={styles.title}>Calculate BMI</Text>
          <CustomInput placeholder="Weight" value={weight} onChangeText={(text) => setWeight(text)}/>
          <CustomInput placeholder="Height" value={height} onChangeText={(text) => setHeight(text)}/>
          <CustomButton text="Calculate" onPress={onCalculateBMI} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  root: {
    padding: 20,
  },
  title: {
    textAlign: 'center',
    fontSize: 22,
    fontWeight: 'bold',
    color: 'black',
    margin: 10,
  },
});

export default BMIScreen;