import React, {useState} from 'react';
import {
  View,
  Image,
  StyleSheet,
  useWindowDimensions,
  ScrollView,
  Alert,
} from 'react-native';
import Logo from '../../assets/images/logo.png';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';
import {useNavigation} from '@react-navigation/native';
import {API_URL, API_KEY} from '@env';

const LoginScreen = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const {height} = useWindowDimensions();
  const navigation = useNavigation();

  const resetTextInput = () => {
    setUsername('');
    setPassword('');
  };

  const onLoginPressed = async () => {
    if (username === '' || password === '') {
      Alert.alert('Error :', 'Please fill in all fields');
      resetTextInput();
      return;
    }
    const formData = {
      username,
      password,
    };
    try {
      const response = await fetch(API_URL + 'login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        Alert.alert('Error :', 'Failed respond to API');
        resetTextInput();
        return;
      }
      const data = await response.json();
      if (data.message === 'Success') {
        Alert.alert('Success', 'Login successful!', [
          {
            text: 'OK',
            onPress: () => {
              navigation.navigate('Navigator', {
                userData: data,
                apiUrl: API_URL,
              });
            },
          },
        ]);
        resetTextInput();
      } else {
        Alert.alert('Error :', data.message);
        resetTextInput();
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error :', 'Failed connect to API');
      resetTextInput();
    }
  };
  const onRegisterPressed = () => {
    navigation.navigate('Register', {
      apiUrl: API_URL,
    });
    resetTextInput();
  };

  return (
    <ScrollView contentContainerStyle={{flex: 1, justifyContent: 'center'}}>
      <View style={styles.root}>
        <Image
          source={Logo}
          style={[styles.logo, {height: height * 0.3}]}
          resizeMode="contain"
        />
        <CustomInput
          placeholder="Username"
          value={username}
          onChangeText={text => setUsername(text)}
        />
        <CustomInput
          placeholder="Password"
          value={password}
          onChangeText={text => setPassword(text)}
          secureTextEntry={true}
        />
        <CustomButton text="Login" onPress={onLoginPressed} />
        <CustomButton
          text="Register"
          onPress={onRegisterPressed}
          type="TERTIARY"
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    padding: 20,
  },
  logo: {
    width: '65%',
    maxWidth: 300,
    maxHeight: 150,
  },
});

export default LoginScreen;
