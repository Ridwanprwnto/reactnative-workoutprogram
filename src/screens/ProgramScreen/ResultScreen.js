import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Alert} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';

import CustomCard from '../../components/CustomCard';
import CustomSelect from '../../components/CustomSelect';
import CustomButton from '../../components/CustomButton';
import CustomDatePicker from '../../components/CustomDatePicker';

const ResultScreen = ({route}) => {
  const { userData, apiUrl, resultDiagnose} = route.params;
  const { age, height, weight, selectedOptionFrequency, selectedIds } = resultDiagnose;
  const dataGoals = selectedIds.join(', ');
  const { id } = userData;
  const currentDate = new Date();
  const formattedDate = currentDate.getFullYear() + "-" + ("0" + (currentDate.getMonth() + 1)).slice(-2) + "-" + ("0" + currentDate.getDate()).slice(-2);

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

  const [dataProgram, setDataProgram] = useState(null);

  useEffect(() => {

    const formData = {
      category,
      selectedOptionFrequency,
    };
  
    const fetchData = async () => {
      try {
        const response = await fetch(apiUrl + "bmi", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
  
        if (!response.ok) {
          Alert.alert(
            'Error :',
            'Failed to connect API',
          );
          return;
        }

        const data = await response.json();
  
        if (data && data.message === 'Success') {
          setDataProgram(data);
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
          'Failed to connect API',
        );
      }
    };
  
    fetchData();
  }, [userData, apiUrl]);

  const [dataTrainer, setDataTrainer] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${apiUrl}trainer&id=${userData.id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          Alert.alert(
            'Error :',
            'Failed to connect API',
          );
          return;
        }

        const data = await response.json();

        if (Array.isArray(data)) {
          setDataTrainer(data);
        } else if (data && data.message) {
          Alert.alert(
            'Error :',
            data.message,
          );
        } else {
          Alert.alert(
            'Error :',
            'Failed to response to API',
          );
        }
      } catch (error) {
        console.error(error);
        Alert.alert(
          'Error :',
          'Failed to connect API',
        );
      }
    };

    fetchData();
  }, [userData, apiUrl]);

  const [SelectedOptionTrainer, setSelectedOptionTrainer] = useState(null);

  const handleSelectTrainer = (option) => {
      setSelectedOptionTrainer(option ? option.id : null);
  };

  const [resetCount, setResetCount] = useState(0);

  const resetTextInput = () => {
    setSelectedOptionTrainer(null);
    setResetCount(resetCount + 1);
  }

  const [selectedStartDate, setSelectedStartDate] = useState('');
  const [selectedEndDate, setSelectedEndDate] = useState('');

  const navigation = useNavigation();

  const onCreatePressed = async () => {

    // Validate selected date
    if (SelectedOptionTrainer === null || selectedStartDate === 'DD/MM/YYYY' || selectedEndDate === 'DD/MM/YYYY') {
      Alert.alert(
        'Error :', 
        'Please fill data',
      );
      resetTextInput();
      return;
    }
        
    const dateRange = {
      program: dataProgram.id,
      bmi: dataProgram.category,
      frequency: selectedOptionFrequency,
      goals: dataGoals,
      user: userData.id,
      trainer: SelectedOptionTrainer,
      date: formattedDate,
      age: age,
      weight: height,
      height: weight,
      startDate: selectedStartDate,
      endDate: selectedEndDate,
    };

    try {
      const response = await fetch(`${apiUrl}program`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dateRange),
      });
  
      if (!response.ok) {
        throw new Error('Failed to send data to API');
      }
  
      const data = await response.json();

      if (data.message === 'Success') {
        Alert.alert(
          'Success',
          'Workout program successfully created',
          [
            {
              text: 'OK',
              onPress: () => {
                navigation.navigate("List Program");
                resetTextInput();
              },
            },
          ],
        );
      } else {
        Alert.alert(
          'Error :',
          data.message,
        );
        resetTextInput();
      }
    } catch (error) {
      Alert.alert(
        'Error :',
        'Failed connect to API',
      );
      console.error(error);
      resetTextInput();
    }

  }

  return (
    <ScrollView>
        <View style={styles.root}>
            <Text style={styles.title}>Result Program</Text>

            <Text style={styles.subtitle}>Diagnose Result</Text>
            <CustomCard 
              title="Nutrition Status :"
              value={`BMI = ${bmi}`}
              category={`Category = ${category}`}   
            />

            <CustomCard 
              title="Level Workout :"
              value={`Level = ${dataProgram ? dataProgram.level : []}`}
            />
            
            <CustomCard 
              title="Workout Goals :"
              value={dataGoals}
            />

            <CustomCard 
              title="Workout Program :"
              value={dataProgram ? dataProgram.programs.map((exercise, index) => (
                <Text key={index}>{exercise.exercise}</Text>
              )) : null} 
            />
            
            <CustomCard 
              title="Workout Recomendation :"
              value={dataProgram ? dataProgram.programs.map((program, index) => (
                <Text key={index}>{program.program}</Text>
              )) : null}
            />
            
            <Text style={styles.subtitle}>Personal Trainer</Text>
            <CustomSelect
                key={`trainer-${resetCount}`}
                options={dataTrainer ? dataTrainer : []}
                placeholder="Select Trainer"
                onSelect={handleSelectTrainer}
            />
            
            <Text style={styles.subtitle}>Select Days</Text>
            <CustomDatePicker
              onDateRangeChange={(startDate, endDate) => {
                setSelectedStartDate(startDate);
                setSelectedEndDate(endDate);
              }}
            />

            <CustomButton text="Create Program" onPress={onCreatePressed} />
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
  }
});

export default ResultScreen;