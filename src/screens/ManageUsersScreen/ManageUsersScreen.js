import React, {useState} from 'react';
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  Alert,
  SectionList,
} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import CheckBox from '@react-native-community/checkbox';
import CustomInput from '../../components/CustomInput';
import CustomSelect from '../../components/CustomSelect';
import CustomButton from '../../components/CustomButton';

const ManageUsersScreen = ({route}) => {
  const {userData, apiUrl} = route.params;
  const [dataUsers, setDataUsers] = useState([]);

  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        try {
          const response = await fetch(`${apiUrl}allusers&id=${userData.role}`);
          const data = await response.json();
          setDataUsers(data);
          setSelectedIds([]);
        } catch (error) {
          console.error(error);
          Alert.alert('Error :', 'Failed connect to API');
        }
      };
      fetchData();
    }, [apiUrl, userData]),
  );

  const optionsRole = [
    {label: 'Trainer', value: 'Trainer'},
    {label: 'Client', value: 'Client'},
  ];

  const optionsGender = [
    {label: 'Man', value: 'Man'},
    {label: 'Woman', value: 'Woman'},
  ];

  const handleSelectRole = option => {
    setSelectedOptionRole(option ? option.value : null);
  };

  const handleSelectGender = option => {
    setSelectedOptionGender(option ? option.value : null);
  };

  const [selectedOptionRole, setSelectedOptionRole] = useState(null);
  const [selectedOptionGender, setSelectedOptionGender] = useState(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [resetCount, setResetCount] = useState(0);

  const resetTextInput = () => {
    setUsername('');
    setPassword('');

    setSelectedOptionRole(null);
    setSelectedOptionGender(null);
    setResetCount(resetCount + 1);
  };

  const [selectedIds, setSelectedIds] = useState([]);
  const handleCheckboxChange = id => {
    setSelectedIds(prevIds => {
      if (prevIds.includes(id)) {
        return prevIds.filter(itemId => itemId !== id);
      } else {
        return [...prevIds, id];
      }
    });
  };

  const onAddUserPressed = async () => {
    if (
      selectedOptionRole === null ||
      username === '' ||
      password === '' ||
      selectedOptionGender === null
    ) {
      Alert.alert('Error :', 'Please fill in all fields');
      setSelectedIds([]);
      resetTextInput();
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error :', 'Password must not be less than 6 characters');
      setSelectedIds([]);
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
      const response = await fetch(apiUrl + 'createuser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        Alert.alert('Error :', 'Failed respond to API');
        setSelectedIds([]);
        resetTextInput();
        return;
      }

      const data = await response.json();

      if (Array.isArray(data)) {
        setDataUsers(data);
        setSelectedIds([]);
        resetTextInput();
        Alert.alert('Success :', 'Registration successful!');
      } else {
        Alert.alert('Error :', data.message);
        setSelectedIds([]);
        resetTextInput();
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error :', 'Failed connect to API');
      setSelectedIds([]);
      resetTextInput();
    }
  };

  const onDeleteUserPressed = async () => {
    Alert.alert('Confirmation', `Do you want to delete user data?`, [
      {text: 'Cancel', style: 'cancel'},
      {
        text: 'OK',
        onPress: () => {
          if (selectedIds.length === 0) {
            Alert.alert('Error :', 'No user data selected!');
          } else {
            onExecuteUserPressed();
          }
        },
      },
    ]);
  };

  const onExecuteUserPressed = async () => {
    try {
      const response = await fetch(apiUrl + 'deleteuser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({idUser: selectedIds}),
      });

      if (!response.ok) {
        throw new Error('Failed to send data to API');
      }

      const data = await response.json();

      if (Array.isArray(data)) {
        setDataUsers(data);
        setSelectedIds([]);
        resetTextInput();
        Alert.alert('Success :', 'Successfully delete data user');
      } else {
        Alert.alert('Error :', data.message);
        setSelectedIds([]);
        resetTextInput();
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to delete user.');
      setSelectedIds([]);
      resetTextInput();
    }
  };

  return (
    <ScrollView>
      <View style={styles.root}>
        <Text style={styles.title}>Manage Users</Text>
        <Text style={styles.subtitle}>Create Data User</Text>
        <CustomSelect
          key={`role-${resetCount}`}
          options={optionsRole}
          placeholder="Select role"
          onSelect={handleSelectRole}
        />
        <CustomSelect
          key={`gender-${resetCount}`}
          options={optionsGender}
          placeholder="Select gender"
          onSelect={handleSelectGender}
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
          secureTextEntry
        />
        <CustomButton text="Add User" onPress={onAddUserPressed} />
        <Text style={styles.subtitle}>List Data Users</Text>
        {dataUsers.length > 0 && (
          <SectionList
            style={styles.sectionList}
            sections={[{data: dataUsers}]}
            renderItem={({item}) => (
              <View style={styles.itemContainer}>
                <Text style={styles.itemText}>{item.label}</Text>
                <CheckBox
                  style={styles.checkbox}
                  disabled={false}
                  value={selectedIds.includes(item.value)}
                  onValueChange={() => handleCheckboxChange(item.value)}
                  tintColors={{true: '#000000', false: '#aaaaaa'}}
                  boxType={'square'}
                />
              </View>
            )}
            keyExtractor={item => item.value.toString()}
            scrollEnabled={false}
          />
        )}
        <CustomButton text="Delete User" onPress={onDeleteUserPressed} />
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
  subtitle: {
    fontSize: 18,
    color: 'black',
    margin: 10,
  },
  sectionList: {
    backgroundColor: 'white',
    flex: 1,
    borderRadius: 5,
    marginTop: 5,
    marginBottom: 5,
  },
  itemContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  itemText: {
    fontSize: 14,
    color: '#333',
  },
  checkbox: {
    position: 'absolute',
    right: 16,
  },
});

export default ManageUsersScreen;
