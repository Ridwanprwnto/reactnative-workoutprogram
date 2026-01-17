import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  SectionList,
} from 'react-native';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import CustomInput from '../../components/CustomInput';
import CustomSelect from '../../components/CustomSelect';
import CustomButton from '../../components/CustomButton';
import CheckBox from '@react-native-community/checkbox';

const ProgramScreen = ({route}) => {
  const {userData, apiUrl} = route.params;
  const [dataFrequency, setDataFrequency] = useState(null);

  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        try {
          const response = await fetch(`${apiUrl}frequency`);
          const data = await response.json();
          if (Array.isArray(data)) {
            setDataFrequency(data);
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
          const response = await fetch(`${apiUrl}goals`);
          const data = await response.json();
          if (Array.isArray(data)) {
            setDataGoals(data);
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

  const [frequencyKey, setFrequencyKey] = useState(1);
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [selectedOptionFrequency, setSelectedOptionFrequency] = useState(null);
  const [dataGoals, setDataGoals] = useState([]);

  const handleSelectFrequency = option => {
    setSelectedOptionFrequency(option ? option.value : null);
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

  const resetTextInput = () => {
    setAge('');
    setWeight('');
    setHeight('');
    setSelectedOptionFrequency(null);
    setFrequencyKey(frequencyKey + 1);
    setSelectedIds([]);
  };

  const navigation = useNavigation();

  const onCheckPressed = () => {
    if (
      selectedOptionFrequency === null ||
      age === '' ||
      weight === '' ||
      height === '' ||
      selectedIds.length === 0
    ) {
      Alert.alert('Error :', 'Please fill in all fields');
      resetTextInput();
      return;
    }

    if (isNaN(age) && isNaN(weight) && isNaN(height)) {
      Alert.alert('Error :', 'Fill in is not number');
      resetTextInput();
      return;
    }

    const resultDiagnose = {
      selectedIds,
      selectedOptionFrequency,
      age,
      weight,
      height,
    };

    navigation.navigate('Result', {
      userData: userData,
      apiUrl: apiUrl,
      resultDiagnose: resultDiagnose,
    });
    resetTextInput();
  };

  return (
    <ScrollView>
      <View style={styles.root}>
        <Text style={styles.title}>Checking Program</Text>
        <Text style={styles.subtitle}>BMI Checking</Text>
        <CustomInput
          placeholder="Age"
          value={age}
          onChangeText={text => setAge(text)}
        />
        <CustomInput
          placeholder="Weight"
          value={weight}
          onChangeText={text => setWeight(text)}
        />
        <CustomInput
          placeholder="Height"
          value={height}
          onChangeText={text => setHeight(text)}
        />
        <Text style={styles.subtitle}>Frekuensi Workout</Text>
        <CustomSelect
          key={frequencyKey}
          options={dataFrequency ? dataFrequency : []}
          placeholder="Select frequency"
          onSelect={handleSelectFrequency}
        />
        <Text style={styles.subtitle}>Workout Goals</Text>
        {(dataGoals.length > 0 && (
          <SectionList
            style={styles.sectionList}
            sections={[{data: dataGoals}]}
            renderItem={({item}) => (
              <View style={styles.itemContainer}>
                <Text style={styles.itemText}>{item.label}</Text>
                <CheckBox
                  style={styles.checkbox}
                  disabled={false}
                  value={selectedIds.includes(item.label)}
                  onValueChange={() => handleCheckboxChange(item.label)}
                  tintColors={{true: '#000000', false: '#aaaaaa'}}
                  boxType={'square'}
                />
              </View>
            )}
            keyExtractor={item => item.label.toString()}
            scrollEnabled={false}
          />
        )) || (
          <View style={styles.nodata}>
            <Text style={styles.text}>No data available</Text>
          </View>
        )}
        <CustomButton text="Checking Program" onPress={onCheckPressed} />
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
    zIndex: -5,
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

export default ProgramScreen;
