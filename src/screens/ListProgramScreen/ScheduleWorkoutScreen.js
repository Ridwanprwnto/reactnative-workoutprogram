import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, LayoutAnimation, ScrollView, SafeAreaView, Alert } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { useNavigation } from '@react-navigation/native';
import CustomButton from '../../components/CustomButton';

const ExpandableComponent = ({ item, onClickFunc }) => {
  const [layoutHeight, setLayoutHeight] = useState(0);

  useEffect(() => {
    if (item.isExpanded) {
      setLayoutHeight(null);
    } else {
      setLayoutHeight(0);
    }
  }, [item.isExpanded])
  
  const navigation = useNavigation();

  const onCheckPressed = (item) => {
    navigation.navigate('Training', {
      trainingExercise: item,
    });
  }

  return (
    <View>
      <TouchableOpacity
        style={styles.item} 
        onPress={onClickFunc}
      >
      <Text style={styles.itemText}>
        {item.category_name}
      </Text>
      </TouchableOpacity>
      <View style={{
        height: layoutHeight, 
        overflow: 'hidden',
      }}>
        {
          item.subcategory.map((item, key) => (
            <TouchableOpacity
              onPress={() => onCheckPressed(item)}
              key={key}
              style={styles.content}
            >
            <Text style={styles.text}>
              {key}. {item.val}
            </Text>
            <View style={styles.separator}/>
            </TouchableOpacity>
          ))
        }
      </View>
    </View>
  )
}

const ScheduleWorkoutScreen = ({route}) => {
  const { userData, apiUrl, scheduleWorkout} = route.params;
  const [dataSchedule, setDataSchedule] = useState([]);

  useEffect(() => {

    const formData = {
      scheduleWorkout: scheduleWorkout ? scheduleWorkout.id : scheduleWorkout,
    };
  
    const fetchData = async () => {
      try {
        const response = await fetch(apiUrl + "schedule", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
  
        if (!response.ok) {
          Alert.alert(
            'Error :',
            data.message,
          );
          return;
        }

        const data = await response.json();  

        if (Array.isArray(data)) {
          setDataSchedule(data);
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
          'Failed to connect API',
        );
      }
    };
  
    fetchData();
  }, [userData, apiUrl]);

  const minDate = dataSchedule.length > 0 ? dataSchedule[0].date : null;
  const maxDate = dataSchedule.length > 0 ? dataSchedule[dataSchedule.length - 1].date : null;

  const markedDates = dataSchedule.length > 0 ? dataSchedule.reduce((acc, item) => {
    acc[item.date] = {
      marked: true,
      dotColor: item.rest === 'ON' ? '#70d7c7' : '#ff0000',
      color: item.status === '1' ? '#70d7c7' : undefined 
    };
    return acc;
  }, {}) : {};

  const [listWorkoutDataSource, setlistWorkoutDataSource] = useState([]);

  onDateChange = async (scheduleWorkout, day) => {
    const selectedDateString = day.dateString;
        
    const dateRange = {
      schedule: scheduleWorkout ? scheduleWorkout.id : scheduleWorkout,
      date: selectedDateString,
    };

    try {
      const response = await fetch(`${apiUrl}schedule_activity`, {
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

      if (Array.isArray(data)) {
          setSelectedDay(day.dateString);
          setlistWorkoutDataSource(data);
      } else if (data && data.message) {
        Alert.alert(
          'Error :',
          data.message,
        );
        setSelectedDay([]);
        setlistWorkoutDataSource([]);
      } else {
        Alert.alert(
          'Error :',
          'Unknown error occurred',
        );
      }
    } catch (error) {
      Alert.alert(
        'Error :',
        data.message,
      );
      console.error(error);
    }

  }
  
  const [multiSelect, setMultiSelect] = useState(false);

  const updateLayout = (index) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    const array = [...listWorkoutDataSource];
    if (multiSelect) {
      array[index]['isExpanded'] = !array[index]['isExpanded'];
    } else {
      array.map((value, placeIndex) =>
        placeIndex === index ? (array[placeIndex]['isExpanded']) = !array[placeIndex]['isExpanded'] : (array[placeIndex]['isExpanded']) = false
      );
    }
    setlistWorkoutDataSource(array)
  }
  
  const [selectedDay, setSelectedDay] = useState('');

  const onFinishChange = async (scheduleWorkoutId, selectedDayValue) => {
    try {
      const response = await fetch(apiUrl + "completesession", {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(
            {
              programid: scheduleWorkoutId,
              programdate: selectedDayValue,
            }
          ),
      });

      if (!response.ok) {
        throw new Error('Failed to send data to API');
      }
  
      const data = await response.json();

      if (Array.isArray(data)) {
        setDataSchedule(data);
        setSelectedDay([]);
        setlistWorkoutDataSource([]);
        Alert.alert(
          'Success :',
          'Training session completed successfully',
        );
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
      Alert.alert(
          'Error',
          'Failed to complete sesi workout. Please try again.',
      );
    }
  };

  const onFinishPressed = () => {
    const scheduleWorkoutId = scheduleWorkout ? scheduleWorkout.id : scheduleWorkout;
    const selectedDayValue = selectedDay;
    Alert.alert(
      'Confirmation',
      `Are you sure you have completed the training session on ${selectedDayValue}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
            text: 'OK', 
            onPress: () => {
              onFinishChange(scheduleWorkoutId, selectedDayValue);
            } 
        },
      ]
    );
  };

  const onResetChange = async (scheduleWorkoutId, selectedDayValue) => {
    try {
      const response = await fetch(apiUrl + "resetsession", {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(
            {
              programid: scheduleWorkoutId,
              programdate: selectedDayValue,
            }
          ),
      });

      if (!response.ok) {
        throw new Error('Failed to send data to API');
      }
  
      const data = await response.json();

      if (Array.isArray(data)) {
        setDataSchedule(data);
        setSelectedDay([]);
        setlistWorkoutDataSource([]);
        Alert.alert(
          'Success :',
          'Training session reset successfully',
        );
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
      Alert.alert(
          'Error',
          'Failed to reset the training session',
      );
    }
  };
  
  const onResetPressed = () => {
    const scheduleWorkoutId = scheduleWorkout ? scheduleWorkout.id : scheduleWorkout;
    const selectedDayValue = selectedDay;
    Alert.alert(
      'Confirmation',
      `Do you want to reset the training session to ${selectedDayValue}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
            text: 'OK', 
            onPress: () => {
              onResetChange(scheduleWorkoutId, selectedDayValue);
            } 
        },
      ]
    );
  };

  return (
    <SafeAreaView>
      <ScrollView>
        <View style={styles.root}>
          <Text style={styles.title}>Schedule Workout</Text>
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
          <Text style={styles.subtitle}>Select Exercises</Text>
          <View>
            <View style={styles.header}>
              <Text style={styles.titleText}>
                List Training
              </Text>
              <TouchableOpacity onPress={() => setMultiSelect(!multiSelect)}>
                <Text style={styles.headerButton}>
                  { multiSelect ? 'Single View' : 'Multiple View' }
                </Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.dateSelect}>{`Tanggal : ${selectedDay}`}</Text>
          </View>
          {listWorkoutDataSource.length > 0 ? (
            listWorkoutDataSource.map((item, key) => (
              <ExpandableComponent
                key={item.category_name}
                item={item}
                onClickFunc={() => {
                  updateLayout(key)
                }}
              />
            ))
          ) : (
            <View style={styles.nodata}>
              <Text style={styles.text}>No data workout</Text>
            </View>
          )}
          <View style={styles.nodata}>
            <CustomButton text="Finish" onPress={onFinishPressed}/>
            <CustomButton text="Reset" onPress={onResetPressed}/>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
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
  dateSelect: {
    textAlign: 'center',
    fontSize: 16,
    color: 'black',
    margin: 10,
  },
  container: {
    backgroundColor: "#FFFFFF",
    width: '100%',
    borderRadius: 5,
    marginVertical: 5,
  },
  headerButton: {
    textAlign: 'center',
    justifyContent: 'center',
    fontSize: 18,
    color: '#333',
  },
  item: {
    backgroundColor: 'white',
    padding: 20,
  },
  itemText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  content: {
    paddingLeft: 10,
    paddingRight: 10,
    backgroundColor: '#fff',
    color: '#333',
  },
  text: {
    fontSize: 16,
    padding: 10,
    color: '#333',
  },
  separator: {
    height: 0.5,
    backgroundColor: '#000000',
    width: '100%',
  },
  nodata: {
    flex: 1,
    justifyContent: 'center', 
    alignItems: 'center', 
    marginTop: 10,
    backgroundColor: "#FFFFFF",
    width: '100%',
    borderRadius: 5,
    marginVertical: 5,
  },
  header: {
    flexDirection: 'row',
    padding: 10,
    marginLeft: 10,
    marginRight: 10,
  },
  titleText: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default ScheduleWorkoutScreen;