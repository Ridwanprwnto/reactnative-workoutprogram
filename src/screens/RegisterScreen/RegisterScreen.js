import React, { useState } from 'react';
import { Text, View, StyleSheet, ScrollView, Alert } from 'react-native';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';
import CustomSelect from '../../components/CustomSelect';
import { useNavigation } from '@react-navigation/native';

const RegisterScreen = ({route}) => {

  const { apiUrl } = route.params;
  const [resetCount, setResetCount] = useState(0);

  const resetTextInput = () => {
    setUsername('');
    setPassword('');
    setPasswordRepeat('');

    setSelectedOptionRole(null);
    setSelectedOptionGender(null);
    setResetCount(resetCount + 1);
  }

  const navigation = useNavigation();  
  const onLoginPressed = () => {
    navigation.navigate("Login");
  }

  const optionsRole = [
    { label: 'Trainer', value: 'Trainer' },
    { label: 'Client', value: 'Client' },
  ];

  const optionsGender = [
    { label: 'Man', value: 'Man' },
    { label: 'Woman', value: 'Woman' },
  ];

  const handleSelectRole = (option) => {
    setSelectedOptionRole(option ? option.value : null);
  };

  const handleSelectGender = (option) => {
    setSelectedOptionGender(option ? option.value : null);
  };

  const [selectedOptionRole, setSelectedOptionRole] = useState(null);
  const [selectedOptionGender, setSelectedOptionGender] = useState(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passwordRepeat, setPasswordRepeat] = useState('');

  const handleSubmit = async () => {
      
    if (selectedOptionRole === null || username === '' || password === '' || passwordRepeat === '' || selectedOptionGender === null ) {
      Alert.alert(
        'Error :', 
        'Please fill in all fields',
      );
      resetTextInput();
      return;
    }

    if (password.length < 6) {
      Alert.alert(
        'Error :',
        'Password must not be less than 6 characters',
      );
      resetTextInput();
      return;
    }

    if (password !== passwordRepeat) {
      Alert.alert(
        'Error :',
        'Passwords do not match',
      );
      resetTextInput();
      return;
    }

    const formData = {
      selectedOptionRole,
      username,
      password,
      selectedOptionGender,
    };

    try {
      const response = await fetch(apiUrl+"register", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        Alert.alert(
          'Error :',
          'Failed respond to API',
        );
        resetTextInput();
        return;
      }

      const data = await response.json();

      if (data.message === 'Success') {
        Alert.alert(
          'Success :',
          'Registration successful!',
        );
        resetTextInput();
      } else {
        Alert.alert(
          'Error :',
          data.message,
        );
        resetTextInput();
      }
    } catch (error) {
        console.error(error);
        Alert.alert(
          'Error :',
          'Failed connect to API',
        );
        resetTextInput();
    }
  };

  return (
    <ScrollView>
      <View style={styles.root}>
        <Text style={styles.title}>Register Account</Text>
        <CustomSelect key={`role-${resetCount}`} options={optionsRole} placeholder="Select role" onSelect={handleSelectRole} />
        <CustomSelect key={`gender-${resetCount}`} options={optionsGender} placeholder="Select gender" onSelect={handleSelectGender} />
        <CustomInput placeholder="Username" value={username} onChangeText={(text) => setUsername(text)} />
        <CustomInput placeholder="Password" value={password} onChangeText={(text) => setPassword(text)} secureTextEntry />
        <CustomInput placeholder="Repeat Password" value={passwordRepeat} onChangeText={(text) => setPasswordRepeat(text)} secureTextEntry />
        <CustomButton text="Register" onPress={handleSubmit}/>
        <CustomButton text="Do you have an account? Login" onPress={onLoginPressed} type="TERTIARY" />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'black',
    margin: 10,
  },
});

export default RegisterScreen;
