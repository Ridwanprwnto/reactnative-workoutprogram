import React, { useState  } from 'react';
import { Text, View, StyleSheet, ScrollView, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';

const ProfileScreen = ({route}) => {
  const { userData, apiUrl } = route.params;

  const [dataProfile, setDataProfile] = useState(null);

  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        try {
          const response = await fetch(`${apiUrl}user&id=${userData.id}`);
          const data = await response.json();
          setDataProfile(data);
          setGender(data.gender);
          setUsername(data.username);
          setEmail(data.email);
        } catch (error) {
          console.error(error);
          Alert.alert(
            'Error :',
            'Failed connect to API',
          );
        }
      };
      fetchData();
    }, [apiUrl, userData])
  );

  const idUser = userData.id;
  
  const [role, setRole] = useState(userData.role);
  const [gender, setGender] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');

  const onProfileUpdate = async () => {
      
    if (username === '') {
      Alert.alert(
        'Error :', 
        'Please fill username',
      );
      return;
    }

    const formData = {
      idUser,
      username,
      email,
    };

    try {
      const response = await fetch(apiUrl+"profile", {
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
        return;
      }

      const data = await response.json();

      if (data.message === 'Success') {
        Alert.alert(
          'Success :',
          'Update Profile successful!',
        );
      } else {
        Alert.alert(
          'Error :',
          data.message,
        );
      }
    } catch (error) {
        console.error(error);
        Alert.alert(
          'Error :',
          'Failed connect to API',
        );
    }
  };
  
  return (
    <ScrollView>
      <View style={styles.root}>
          <Text style={styles.title}>Profile</Text>
          <CustomInput placeholder="Role" value={role} setRole={setRole} disabled={true} />
          <CustomInput placeholder="Gender" value={gender} setRole={setRole} disabled={true} />
          <CustomInput placeholder="Username" value={username} onChangeText={(text) => setUsername(text)}/>
          <CustomInput placeholder="Email" value={email} onChangeText={(text) => setEmail(text)}/>
          <CustomButton text="Update Profile" onPress={onProfileUpdate} />
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

export default ProfileScreen;