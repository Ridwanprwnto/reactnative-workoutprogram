import React, { useState } from 'react';
import { Text, View, StyleSheet, ScrollView, Alert, SectionList, FlatList } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import CheckBox from '@react-native-community/checkbox';
import CustomButton from '../../components/CustomButton';
import CustomSelect from '../../components/CustomSelect';
import CustomDropdownPicker from '../../components/CustomDropdownPicker';

const FormulaProgramScreen = ({route}) => {
  const { userData, apiUrl } = route.params;

  const [dataCategory, setDataCategory] = useState(null);
  const [dataLevel, setDataLevel] = useState(null);
  const [dataWorkout, setDataWorkout] = useState(null);

  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        try {
          const response = await fetch(`${apiUrl}category&id=${userData.role}`);
          const data = await response.json();
          if (Array.isArray(data)) {
            setDataCategory(data);
            resetTextInput();
          } else if (data && data.message) {
            Alert.alert(
              'Error :',
              data.message,
            );
          } else {
            Alert.alert(
              'Error :',
              'Unknown error occurred',
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
      fetchData();
    }, [apiUrl, userData])
  );

  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        try {
          const response = await fetch(`${apiUrl}level&id=${userData.role}`);
          const data = await response.json();
          if (Array.isArray(data)) {
            setDataLevel(data);
            resetTextInput();
          } else if (data && data.message) {
            Alert.alert(
              'Error :',
              data.message,
            );
          } else {
            Alert.alert(
              'Error :',
              'Unknown error occurred',
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
      fetchData();
    }, [apiUrl, userData])
  );
  
  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        try {
          const response = await fetch(`${apiUrl}workout&id=${userData.role}`);
          const data = await response.json();
          if (Array.isArray(data)) {
            setDataWorkout(data);
            resetTextInput();
          } else if (data && data.message) {
            Alert.alert(
              'Error :',
              data.message,
            );
          } else {
            Alert.alert(
              'Error :',
              'Unknown error occurred',
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
      fetchData();
    }, [apiUrl, userData])
  );

  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        try {
          const response = await fetch(`${apiUrl}formula&id=${userData.id}`);
          const data = await response.json();
          setDataFormula(data);
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
  
  const [selectedOptionCategory, setSelectedOptionCategory] = useState(null);
  const [selectedOptionLevel, setSelectedOptionLevel] = useState(null);
  const [selectedOptionWorkout, setSelectedOptionWorkout] = useState(null);  
  const [dataFormula, setDataFormula] = useState([]);

  const handleSelectCategory = (option) => {
    setSelectedOptionCategory(option ? option.value : null);
  };

  const handleSelectLevel = (option) => {
    setSelectedOptionLevel(option ? option.value : null);
  };

  const handleSelectTypeWorkout = (items) => {
    setSelectedOptionWorkout(items ? items : null);
  };

  const [resetCount, setResetCount] = useState(0);

  const resetTextInput = () => {
    setSelectedOptionCategory(null);
    setSelectedOptionLevel(null);
    setSelectedOptionWorkout(null);
    setResetCount(resetCount + 1);
  }

  const onCreateFormula = async () => {
 
    if (selectedOptionCategory === null || selectedOptionLevel === null || selectedOptionWorkout === null) {
      Alert.alert(
        'Error :', 
        'Please select fields',
      );
      resetTextInput();
      return;
    }

    const formData = {
      category: selectedOptionCategory,
      level: selectedOptionLevel,
      workout: selectedOptionWorkout,
    };

    try {
      const response = await fetch(apiUrl+"formula", {
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
        setDataFormula(data);
        setSelectedIds([]);
        resetTextInput();
        Alert.alert(
          'Success :',
          'Successfully added formula program',
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
  
  const onDeleteFormulaPressed = async () => {
    Alert.alert(
        'Confirmation',
        `Do you want to delete formula data?`,
        [
            { text: 'Cancel', style: 'cancel' },
            { 
                text: 'OK', 
                onPress: () => {
                    if (selectedIds.length === 0) {
                        Alert.alert(
                            'Error :',
                            'No formula data selected!',
                        );
                    }
                    else {
                      onExecuteFormulaPressed();
                    }
                } 
            },
        ]
    );
  };

  const onExecuteFormulaPressed = async () => {

    try {
      const response = await fetch(apiUrl + "deleteformula", {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(
            {idFormula: selectedIds}
          ),
      });

      if (!response.ok) {
        throw new Error('Failed to send data to API');
      }

      const data = await response.json();

      if (Array.isArray(data)) {
        setDataFormula(data);
        setSelectedIds([]);
        resetTextInput();
        Alert.alert(
          'Success :',
          'Successfully delete formula data',
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
        'Failed to delete formula.',
      );
      setSelectedIds([]);
      resetTextInput();
    }
  };
  
  return (
    <FlatList
      data={[{ key: 'formula-program' }]}
      renderItem={() => (
        <View style={styles.root}>
          <Text style={styles.title}>Manage Rule Program</Text>
          <Text style={styles.subtitle}>Create Data Rule Program</Text>
          <CustomSelect
            key={`category-${resetCount}`}
            options={dataCategory ? dataCategory : []}
            placeholder="Select Category"
            onSelect={handleSelectCategory}
          />
          <CustomSelect
            key={`level-${resetCount}`}
            options={dataLevel ? dataLevel : []}
            placeholder="Select Level"
            onSelect={handleSelectLevel}
          />
          <CustomDropdownPicker
            key={`workout-${resetCount}`}
            items={dataWorkout ? dataWorkout : []}
            onSelect={handleSelectTypeWorkout}
            multiple={true}
            min={1}
            max={3}
            placeholder={'Select an type workout'}
          />
          <CustomButton text="Create Rule" onPress={onCreateFormula} />
          <Text style={styles.subtitle}>List Data Rule Program</Text>
          {dataFormula.length > 0 && (
            <SectionList
              style={styles.sectionList}
              sections={[{ data: dataFormula }]}
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
          <CustomButton text="Delete Rule" onPress={onDeleteFormulaPressed}/>
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
});

export default FormulaProgramScreen;