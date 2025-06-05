import React, { useState  } from 'react';
import { Text, View, StyleSheet, ScrollView, Alert, SectionList } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import CheckBox from '@react-native-community/checkbox';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';

const ManageFrequencyScreen = ({route}) => {
  const { userData, apiUrl } = route.params;
  const [dataLevel, setDataLevel] = useState([]);

  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        try {
          const response = await fetch(`${apiUrl}level&id=${userData.id}`);
          const data = await response.json();
          setDataLevel(data);
          setSelectedIds([]);
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
  
  const [levelWorkout, setLevelWorkout] = useState('');
  const [descWorkout, setDescWorkout] = useState('');

  const resetTextInput = () => {
    setLevelWorkout('');
    setDescWorkout('');
  }

  const onCreateFrequency = async () => {
      
    if (levelWorkout === '' || descWorkout === '') {
      Alert.alert(
        'Error :', 
        'Incorrect data input',
      );
      resetTextInput();
      return;
    }

    const formData = {
      levelWorkout,
      descWorkout,
    };

    try {
      const response = await fetch(apiUrl+"createfrequency", {
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

      if (Array.isArray(data)) {
        setDataLevel(data);
        setSelectedIds([]);
        resetTextInput();
        Alert.alert(
          'Success :',
          'Successfully added frequency data',
        );
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

  const [selectedIds, setSelectedIds] = useState([]);
  const handleCheckboxChange = (id) => {
      setSelectedIds((prevIds) => {
          if (prevIds.includes(id)) {
              return prevIds.filter((itemId) => itemId !== id);
          } else {
              return [...prevIds, id];
          }
      });
  };

  const onDeleteFrequencyPressed = async () => {
    Alert.alert(
        'Confirmation',
        `Do you want to delete frequency data?`,
        [
            { text: 'Cancel', style: 'cancel' },
            { 
                text: 'OK', 
                onPress: () => {
                    if (selectedIds.length === 0) {
                        Alert.alert(
                            'Error :',
                            'No frequency data selected!',
                        );
                    }
                    else {
                      onExecuteFrequencyPressed();
                    }
                } 
            },
        ]
    );
  };

  const onExecuteFrequencyPressed = async () => {

    try {
      const response = await fetch(apiUrl + "deletefrequency", {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(
            {idFrequency: selectedIds}
          ),
      });

      if (!response.ok) {
        throw new Error('Failed to send data to API');
      }

      const data = await response.json();

      if (Array.isArray(data)) {
        setDataLevel(data);
        setSelectedIds([]);
        resetTextInput();
        Alert.alert(
          'Success :',
          'Successfully delete frequency data',
        );
      } else {
        Alert.alert(
          'Error :',
          data.message,
        );
        setSelectedIds([]);
        resetTextInput();
      }
    } catch (error) {
      Alert.alert(
        'Error',
        'Failed to delete frequency.',
      );
      setSelectedIds([]);
      resetTextInput();
    }
  };
  
  return (
    <ScrollView>
      <View style={styles.root}>
          <Text style={styles.title}>Manage Frequency</Text>
          <Text style={styles.subtitle}>Create Data Frequency</Text>
          <CustomInput placeholder="Level Frequency" value={levelWorkout} onChangeText={(text) => setLevelWorkout(text)}/>
          <CustomInput placeholder="Description Frequency Training" value={descWorkout} onChangeText={(text) => setDescWorkout(text)}/>
          <CustomButton text="Create Frequency" onPress={onCreateFrequency} />
          <Text style={styles.subtitle}>List Data Level</Text>
          {dataLevel.length > 0 && (
              <SectionList
                  style={styles.sectionList}
                  sections={[{ data: dataLevel }]}
                  renderItem={({ item }) => (
                  <View style={styles.itemContainer}>
                    <Text style={styles.itemText}>{item.label}</Text>
                      <CheckBox 
                          style={styles.checkbox}
                          disabled={false}
                          value={selectedIds.includes(item.value)}
                          onValueChange={() => handleCheckboxChange(item.value)}
                          tintColors={{ true: '#000000', false: '#aaaaaa' }}
                          boxType={'square'}
                      />
                    </View>
                  )}
                  keyExtractor={(item) => item.value.toString()}
                  scrollEnabled={false}
              />
          )}
          <CustomButton text="Delete Level" onPress={onDeleteFrequencyPressed}/>
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

export default ManageFrequencyScreen;