import React, {useState} from 'react';
import {
  Text,
  View,
  StyleSheet,
  Alert,
  SectionList,
  FlatList,
} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import CustomInput from '../../components/CustomInput';
import CustomSelect from '../../components/CustomSelect';
import CheckBox from '@react-native-community/checkbox';
import CustomButton from '../../components/CustomButton';

const FormulaWorkoutScreen = ({route}) => {
  const {userData, apiUrl} = route.params;
  const [dataBody, setdataBody] = useState([]);
  const [sequence, setsequence] = useState('');
  const [dataProgram, setDataProgram] = useState([]);
  const [dataFormula, setDataFormula] = useState([]);

  const [selectedOptionProgram, setSelectedOptionProgram] = useState(null);
  const handleSelectProgram = option => {
    setSelectedOptionProgram(option ? option.value : null);
  };

  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        try {
          const response = await fetch(`${apiUrl}formula&id=${userData.id}`);
          const data = await response.json();
          if (Array.isArray(data)) {
            setDataProgram(data);
            resetTextInput();
          } else if (data && data.message) {
            Alert.alert('Error :', data.message);
          } else {
            Alert.alert('Error :', 'Unknown error occurred');
          }
        } catch (error) {
          console.error(error);
          Alert.alert('Error :', 'Failed connect to API');
        }
      };
      fetchData();
    }, [apiUrl, userData]),
  );

  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        try {
          const response = await fetch(
            `${apiUrl}bodypartworkout&id=${userData.role}`,
          );
          const data = await response.json();
          if (Array.isArray(data)) {
            setdataBody(data);
            resetTextInput();
          } else if (data && data.message) {
            Alert.alert('Error :', data.message);
          } else {
            Alert.alert('Error :', 'Unknown error occurred');
          }
        } catch (error) {
          console.error(error);
          Alert.alert('Error :', 'Failed connect to API');
        }
      };
      fetchData();
    }, [apiUrl, userData]),
  );

  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        try {
          const response = await fetch(
            `${apiUrl}formulaworkout&id=${userData.role}`,
          );
          const data = await response.json();
          setDataFormula(data);
          resetTextInput();
        } catch (error) {
          console.error(error);
          Alert.alert('Error :', 'Failed connect to API');
        }
      };
      fetchData();
    }, [apiUrl, userData]),
  );

  const onCreateFormula = async () => {
    if (
      sequence === '' ||
      selectedOptionProgram === null ||
      selectedIds.length === 0
    ) {
      Alert.alert('Error :', 'Please select fields');
      resetTextInput();
      return;
    }

    if (isNaN(sequence)) {
      Alert.alert('Error :', 'Fill sequence in is not number');
      resetTextInput();
      return;
    }

    const formData = {
      sequence: sequence,
      program: selectedOptionProgram,
      body: selectedIds,
    };

    try {
      const response = await fetch(apiUrl + 'createformulaworkout', {
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

      if (Array.isArray(data)) {
        setDataFormula(data);
        resetTextInput();
        Alert.alert('Success :', 'Successfully added formula workout');
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

  const [selectedIdFormula, setselectedIdFormula] = useState([]);
  const handleCheckboxChangeFormula = id => {
    setselectedIdFormula(prevIds => {
      if (prevIds.includes(id)) {
        return prevIds.filter(itemId => itemId !== id);
      } else {
        return [...prevIds, id];
      }
    });
  };

  const onDeleteFormulaPressed = async () => {
    Alert.alert('Confirmation', `Do you want to delete formula data?`, [
      {text: 'Cancel', style: 'cancel'},
      {
        text: 'OK',
        onPress: () => {
          if (selectedIdFormula.length === 0) {
            resetTextInput();
            Alert.alert('Error :', 'No formula data selected!');
          } else {
            onExecuteFormulaPressed();
          }
        },
      },
    ]);
  };

  const onExecuteFormulaPressed = async () => {
    try {
      const response = await fetch(apiUrl + 'deleteformulaworkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({idFormula: selectedIdFormula}),
      });

      if (!response.ok) {
        throw new Error('Failed to send data to API');
      }

      const data = await response.json();

      if (Array.isArray(data)) {
        setDataFormula(data);
        resetTextInput();
        Alert.alert('Success :', 'Successfully delete formula workout');
      } else {
        Alert.alert('Error :', data.message);
        resetTextInput();
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to delete formula.');
      resetTextInput();
    }
  };

  const [resetCount, setResetCount] = useState(0);

  const resetTextInput = () => {
    setsequence('');
    setSelectedOptionProgram(null);
    setSelectedIds([]);
    setselectedIdFormula([]);
    setResetCount(resetCount + 1);
  };

  return (
    <FlatList
      data={[{key: 'formula-program'}]}
      renderItem={() => (
        <View style={styles.root}>
          <Text style={styles.title}>Manage Rule Workout</Text>
          <Text style={styles.subtitle}>Create Data Rule Workout</Text>
          <CustomInput
            placeholder="Exercise sequence (Input number)"
            value={sequence}
            onChangeText={text => setsequence(text)}
          />
          <CustomSelect
            key={`program-${resetCount}`}
            options={dataProgram ? dataProgram : []}
            placeholder="Select rule program"
            onSelect={handleSelectProgram}
          />
          {(dataBody.length > 0 && (
            <SectionList
              style={styles.sectionList}
              sections={[{data: dataBody}]}
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
          )) || (
            <View style={styles.nodata}>
              <Text style={styles.text}>No data available</Text>
            </View>
          )}
          <CustomButton text="Create Rule" onPress={onCreateFormula} />
          <Text style={styles.subtitle}>List Data Rule Workout</Text>
          {(dataFormula.length > 0 && (
            <SectionList
              style={styles.sectionList}
              sections={[{data: dataFormula}]}
              renderItem={({item}) => (
                <View style={styles.itemContainer}>
                  <Text style={styles.itemText}>{item.label}</Text>
                  <CheckBox
                    style={styles.checkbox}
                    disabled={false}
                    value={selectedIdFormula.includes(item.value)}
                    onValueChange={() =>
                      handleCheckboxChangeFormula(item.value)
                    }
                    tintColors={{true: '#000000', false: '#aaaaaa'}}
                    boxType={'square'}
                  />
                </View>
              )}
              keyExtractor={item => item.value.toString()}
              scrollEnabled={false}
            />
          )) || (
            <View style={styles.nodata}>
              <Text style={styles.text}>No data available</Text>
            </View>
          )}
          <CustomButton text="Delete Rule" onPress={onDeleteFormulaPressed} />
        </View>
      )}
    />
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
  nodata: {
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    borderRadius: 5,
    marginVertical: 5,
  },
  text: {
    fontSize: 14,
    padding: 10,
    color: '#333',
  },
});

export default FormulaWorkoutScreen;
