import React, {useEffect, useState} from 'react';
import {
  Text,
  View,
  StyleSheet,
  Alert,
  SectionList,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import {Calendar} from 'react-native-calendars';
import CustomSelect from '../../components/CustomSelect';
import CustomButton from '../../components/CustomButton';
import ICONS from '../../assets/icons';
import {iconSize, spacing} from '../../constants/dimensions';

const WorkoutPlanscreen = ({route}) => {
  const {userData, apiUrl, scheduleWorkout} = route.params;
  const [dataClient, setDataClient] = useState([]);

  useEffect(() => {
    const formData = {
      programclient: scheduleWorkout ? scheduleWorkout.id : scheduleWorkout,
    };

    const fetchData = async () => {
      try {
        const response = await fetch(apiUrl + 'programclient', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          Alert.alert('Error :', data.message);
          return;
        }

        const data = await response.json();

        if (Array.isArray(data)) {
          setDataClient(data);
        } else if (data && data.message) {
          Alert.alert('Error :', data.message);
        } else {
          Alert.alert('Error :', 'Unknown error occurred');
        }
      } catch (error) {
        console.error(error);
        Alert.alert('Error :', 'Failed to connect API');
      }
    };

    fetchData();
  }, [userData, apiUrl]);

  const [dataSchedule, setDataSchedule] = useState([]);

  useEffect(() => {
    const formData = {
      scheduleWorkout: scheduleWorkout ? scheduleWorkout.id : scheduleWorkout,
    };

    const fetchData = async () => {
      try {
        const response = await fetch(apiUrl + 'schedule', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          Alert.alert('Error :', data.message);
          return;
        }

        const data = await response.json();

        if (Array.isArray(data)) {
          setDataSchedule(data);
        } else if (data && data.message) {
          Alert.alert('Error :', data.message);
        } else {
          Alert.alert('Error :', 'Unknown error occurred');
        }
      } catch (error) {
        console.error(error);
        Alert.alert('Error :', 'Failed to connect API');
      }
    };

    fetchData();
  }, [userData, apiUrl]);

  const [dataBodyPart, setDataBodyPart] = useState(null);

  const minDate = dataSchedule.length > 0 ? dataSchedule[0].date : null;
  const maxDate =
    dataSchedule.length > 0 ? dataSchedule[dataSchedule.length - 1].date : null;

  const markedDates =
    dataSchedule.length > 0
      ? dataSchedule.reduce((acc, item) => {
          acc[item.date] = {
            marked: true,
            dotColor: item.rest === 'ON' ? '#70d7c7' : '#ff0000',
            color: item.status === '1' ? '#70d7c7' : undefined,
          };
          return acc;
        }, {})
      : {};

  const [selectedDay, setSelectedDay] = useState('');

  onDateChange = async (scheduleWorkout, day) => {
    const selectedDateString = day.dateString;
    setSelectedDay(selectedDateString);

    const dateRange = {
      schedule: scheduleWorkout ? scheduleWorkout.id : scheduleWorkout,
      date: selectedDateString,
    };

    try {
      const response = await fetch(`${apiUrl}schedule_program`, {
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

      if (data && Array.isArray(data.rulebody)) {
        setDataBodyPart(data.rulebody);
        resetTextInput();
        setDataExercise([]);
        setSelectedIds([]);
      } else if (data && data.message) {
        Alert.alert('Error :', data.message);
        resetTextInput();
        setDataBodyPart([]);
        setDataExercise([]);
        setSelectedIds([]);
      } else {
        Alert.alert('Error :', 'Unknown error occurred');
        setDataBodyPart([]);
        setDataExercise([]);
        setSelectedIds([]);
      }

      if (data && Array.isArray(data.listworkout)) {
        setListDataExercise(data.listworkout);
      } else if (data && data.message) {
        Alert.alert('Error :', data.message);
        setListDataExercise([]);
      } else {
        Alert.alert('Error :', 'Unknown error occurred');
        setListDataExercise([]);
      }
    } catch (error) {
      Alert.alert('Error :', data.message);
      console.error(error);
    }
  };

  const [dataExercise, setDataExercise] = useState([]);
  const [selectedOptionWorkout, setSelectedOptionBodyPart] = useState(null);

  const handleSelectBodyPart = async option => {
    setSelectedOptionBodyPart(option ? option.value : null);

    const selectData = {
      bodypartid: option ? option.value : null,
    };

    try {
      const response = await fetch(`${apiUrl}exercise`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(selectData),
      });

      if (!response.ok) {
        throw new Error('Failed to send data to API');
      }

      const data = await response.json();

      if (Array.isArray(data)) {
        setDataExercise(data);
        setSelectedIds([]);
      } else if (data && data.message) {
        Alert.alert('Error :', data.message);
        setDataExercise([]);
        resetTextInput();
      } else {
        Alert.alert('Error :', 'Unknown error occurred');
      }
    } catch (error) {
      Alert.alert('Error :', data.message);
      console.error(error);
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

  const onAddExercisePressed = async () => {
    Alert.alert('Confirmation', `Do you want to add a training session?`, [
      {text: 'Cancel', style: 'cancel'},
      {
        text: 'OK',
        onPress: () => {
          if (selectedDay === '' || selectedIds.length === 0) {
            Alert.alert('Error :', 'No date or exercise data selected!');
          } else {
            const selectData = {
              programId: scheduleWorkout.id,
              dateId: selectedDay,
              bodypartId: selectedOptionWorkout,
              exerciseId: selectedIds,
            };
            onExecuteExercisePressed(selectData);
          }
        },
      },
    ]);
  };

  const onExecuteExercisePressed = async selectData => {
    try {
      const response = await fetch(apiUrl + 'trainingexercise', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(selectData),
      });

      if (!response.ok) {
        throw new Error('Failed to send data to API');
      }

      const data = await response.json();

      if (Array.isArray(data)) {
        Alert.alert('Success', 'Exercise training set successfully added!');
        setSelectedDay(selectedDay);
        setListDataExercise(data);
        setDataExercise([]);
        setSelectedIds([]);
        resetTextInput();
      } else if (data && data.message) {
        Alert.alert('Error :', data.message);
      } else {
        Alert.alert('Error :', data.message);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to add training sessions.');
    }
  };

  const [listDataExercise, setListDataExercise] = useState([]);

  const onDeletPressed = async id => {
    try {
      const response = await fetch(apiUrl + 'deleteworkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          idProgram: scheduleWorkout ? scheduleWorkout.id : null,
          idDay: selectedDay,
          idTraining: id,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send data to API');
      }

      const data = await response.json();

      if (Array.isArray(data)) {
        Alert.alert('Success :', 'Exercise training set successfully delete!');
        setSelectedDay(selectedDay);
        setListDataExercise(data);
        setDataExercise([]);
        setSelectedIds([]);
        resetTextInput();
      } else if (data && data.message) {
        Alert.alert('Error :', data.message);
      } else {
        Alert.alert('Error :', 'Unknown error occurred');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to delete workout data. Please try again.');
    }
  };

  const handleButtonPress = id => {
    Alert.alert(
      'Delete Confirmation',
      `Do you want to delete the exercise set with ID ${id}?`,
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'OK',
          onPress: () => {
            onDeletPressed(id);
          },
        },
      ],
    );
  };

  const [resetCount, setResetCount] = useState(0);

  const resetTextInput = () => {
    setSelectedOptionBodyPart(null);
    setResetCount(resetCount + 1);
  };

  return (
    <FlatList
      data={[{key: 'workout-plan'}]}
      renderItem={() => (
        <View style={styles.root}>
          <Text style={styles.title}>Schedule Workout</Text>
          <Text style={styles.subtitle}>Data Client</Text>
          {dataClient.map((client, index) => (
            <View key={index} style={styles.containercard}>
              <Text style={styles.titlecard}>Personal Data</Text>
              <Text style={styles.childrencard}>Client : {client.client}</Text>
              <Text style={styles.childrencard}>Age : {client.age}</Text>
              <Text style={styles.childrencard}>Goals:</Text>
              <Text style={styles.childrencard}>{client.goals}</Text>
            </View>
          ))}
          {dataClient.map((client, index) => (
            <View key={index} style={styles.containercard}>
              <Text style={styles.titlecard}>Result Diagnose</Text>
              <Text style={styles.childrencard}>
                Category : {client.category}
              </Text>
              <Text style={styles.childrencard}>Level : {client.level}</Text>
              <Text style={styles.childrencard}>Rule : {client.program}</Text>
              <Text style={styles.childrencard}>Workout Program : </Text>
              <Text style={styles.childrencard}>{client.workout}</Text>
            </View>
          ))}
          <Text style={styles.subtitle}>Select Date</Text>
          <View style={styles.container}>
            <Calendar
              markingType={'period'}
              initialDate={minDate}
              minDate={minDate}
              maxDate={maxDate}
              markedDates={markedDates}
              onDayPress={day => {
                onDateChange(scheduleWorkout, day);
              }}
              theme={{
                backgroundColor: '#ffffff',
                calendarBackground: '#ffffff',
                selectedDayBackgroundColor: '#00adf5',
                selectedDayTextColor: '#ffffff',
                todayTextColor: '#00adf5',
                arrowColor: 'black',
              }}
            />
          </View>
          <Text style={styles.dateSelect}>{`Tanggal : ${
            selectedDay ? selectedDay : 'No date selected'
          }`}</Text>
          <Text style={styles.subtitle}>List Exercises</Text>
          <CustomSelect
            key={`bodypart-${resetCount}`}
            options={dataBodyPart ? dataBodyPart : []}
            placeholder="Select body"
            onSelect={handleSelectBodyPart}
          />
          {dataExercise.length > 0 && (
            <SectionList
              style={styles.sectionList}
              sections={[{data: dataExercise}]}
              renderItem={({item}) => (
                <View style={styles.itemContainer}>
                  <Text style={styles.itemText}>{item.value}</Text>
                  <CheckBox
                    style={styles.checkbox}
                    disabled={false}
                    value={selectedIds.includes(item.id)}
                    onValueChange={() => handleCheckboxChange(item.id)}
                    tintColors={{true: '#000000', false: '#aaaaaa'}}
                    boxType={'square'}
                  />
                </View>
              )}
              keyExtractor={item => item.id.toString()}
              scrollEnabled={false}
            />
          )}
          <CustomButton text="Add Exercise" onPress={onAddExercisePressed} />
          <Text style={styles.subtitle}>List Training</Text>
          {(listDataExercise.length > 0 && (
            <SectionList
              style={styles.sectionListWorkout}
              sections={[
                {
                  data: listDataExercise,
                },
              ]}
              renderItem={({item}) => (
                <View style={styles.itemContainer}>
                  <Text style={styles.itemText}>Bodypart: {item.label}</Text>
                  <Text style={styles.itemText}>Exercise: {item.value}</Text>
                  <TouchableOpacity
                    style={styles.buttonContainer}
                    onPress={() => handleButtonPress(item.id)}>
                    <Image
                      source={ICONS['REMOVE']}
                      style={{width: iconSize.lg, height: iconSize.lg}}
                    />
                  </TouchableOpacity>
                </View>
              )}
              keyExtractor={item => item.id.toString()}
              scrollEnabled={false}
            />
          )) || (
            <View style={styles.nodata}>
              <Text style={styles.text}>No data available</Text>
            </View>
          )}
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
  container: {
    backgroundColor: '#FFFFFF',
    width: '100%',
    borderRadius: 5,
    marginVertical: 5,
  },
  dateSelect: {
    textAlign: 'center',
    fontSize: 16,
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
  sectionListWorkout: {
    backgroundColor: 'white',
    flex: 1,
  },
  itemContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  buttonContainer: {
    position: 'absolute',
    right: 16,
    top: 16,
  },
  nodata: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    borderRadius: 5,
    marginVertical: 5,
  },
  text: {
    fontSize: 16,
    padding: 10,
    color: '#333',
  },
  containercard: {
    backgroundColor: '#fff',
    width: '100%',
    padding: 10,
    marginBottom: 8,
  },
  titlecard: {
    textAlign: 'center',
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
  },
  childrencard: {
    fontSize: 14,
    color: '#666',
  },
});

export default WorkoutPlanscreen;
