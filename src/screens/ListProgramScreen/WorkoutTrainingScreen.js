import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, SafeAreaView, ScrollView, Alert, SectionList } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import CustomCardExercise from '../../components/CustomCard/CustomExerciseCard';
import CustomButton from '../../components/CustomButton';
import ICONS from "../../assets/icons";
import { iconSize, spacing } from "../../constants/dimensions";

const WorkoutTrainingScreen = ({route}) => {
    const { userData, apiUrl, trainingExercise} = route.params;

    useEffect(() => {

        const formData = {
            idUser: userData.id,
            trainingExercise: trainingExercise.train,
        };
      
        const fetchData = async () => {
          try {
            const response = await fetch(apiUrl + "training", {
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
                setCurrentWorkout(data);
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

    const [currentWorkout, setCurrentWorkout] = useState([]);
    const [seconds, setSeconds] = useState(0);
    const [minutes, setMinutes] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const intervalRef = useRef(null);

    const startTimer = () => {
        setIsRunning(true);
        intervalRef.current = setInterval(() => {
        setSeconds((prevSeconds) => {
            if (prevSeconds === 59) {
            setMinutes((prevMinutes) => prevMinutes + 1);
            return 0;
            } else {
            return prevSeconds + 1;
            }
        });
        }, 1000);
    };

    const pauseTimer = () => {
        clearInterval(intervalRef.current);
        setIsRunning(false);
    };

    const stopTimer = () => {
        clearInterval(intervalRef.current);
        setSeconds(0);
        setMinutes(0);
        setIsRunning(false);
    };

    useEffect(() => {
        return () => clearInterval(intervalRef.current);
    }, []);

    const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds
    .toString()
    .padStart(2, '0')}`;

    const [caloriesBurned, setCaloriesBurned] = useState(0);

    useEffect(() => {
        const calculateCaloriesBurned = () => {
            if (currentWorkout.length > 0) {
                const met = currentWorkout[0].met;
                const weight = currentWorkout[0].weight;
                const time = minutes + (seconds / 60);
                const calories = (met * weight * time) / 200;
                setCaloriesBurned(calories.toFixed(2));
            }
        };
    
        calculateCaloriesBurned();
    }, [minutes, seconds, currentWorkout]);
    
    useFocusEffect(
        React.useCallback(() => {
          const fetchData = async () => {
            try {
              const response = await fetch(`${apiUrl}getactivity&id=${trainingExercise.train}`);
              const data = await response.json();
              setResultWorkoutData(data);
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

    const [resultWorkoutData, setResultWorkoutData] = useState([]);

    const onSavePressed = async () => {
        if (formattedTime === '00:00') {
            Alert.alert(
                'Error',
                'Please start the timer before saving the activity.',
            );
        } else {
            try {
                const response = await fetch(apiUrl + "saveactivity", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        idTraining: trainingExercise.train,
                        timeInterval: formattedTime,
                        caloriesBurned: caloriesBurned,
                    }),
                });

                if (response.ok) {
                    stopTimer();
                    const jsonData = await response.json();
                    setResultWorkoutData(jsonData);
                    Alert.alert(
                        'Success',
                        'You have completed one set of exercises',
                    );
                } else {
                    Alert.alert(
                        'Error',
                        'Failed to save workout data. Please try again.',
                    );
                }
            } catch (error) {
                Alert.alert(
                    'Error',
                    'Failed to save workout data. Please try again.',
                );
            }
        }
    };

    const onDeletPressed = async (training, id) => {
        try {
            const response = await fetch(apiUrl + "deleteactivity", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    idTraining: training,
                    setTraining: id,
                }),
            });

            if (response.ok) {
                stopTimer();
                const jsonData = await response.json();
                setResultWorkoutData(jsonData);
                Alert.alert(
                    'Success',
                    'You have successfully deleted set workout data',
                );
            } else {
                Alert.alert(
                    'Error',
                    'Failed to delete workout data. Please try again.',
                );
            }
        } catch (error) {
            Alert.alert(
                'Error',
                'Failed to delete workout data. Please try again.',
            );
        }
    };

    const handleButtonPress = (training, id) => {
        Alert.alert(
            'Delete Confirmation',
            `Do you want to delete the training set with ID ${id}?`,
            [
                { text: 'Cancel', style: 'cancel' },
                { 
                    text: 'OK', 
                    onPress: () => {
                        onDeletPressed(training, id);
                    } 
                },
            ]
        );
    };
    
    const navigation = useNavigation();

    const onBackPressed = () => {
        navigation.navigate('Schedule', {
            scheduleWorkout: trainingExercise,
        });
    }

    return (
        <SafeAreaView>
            <ScrollView style={styles.scrollView}>
                <View style={styles.root}>
                    <Text style={styles.title}>Workout Training</Text>
                    {currentWorkout.map((item, index) => (
                    <View key={index}>
                        <CustomCardExercise title={item.name}>
                            <Image
                                source={{ uri: item.animation }}
                                style={styles.image}
                            />
                        </CustomCardExercise>
                    </View>
                    ))}
                    <CustomCardExercise title="Timer">
                        <Text style={styles.timerText}>{formattedTime}</Text>
                        <Text style={styles.caloriesText}>Calories burned: {caloriesBurned} kcal</Text>
                    </CustomCardExercise>
                    
                    <View style={styles.footer}>
                        <TouchableOpacity style={styles.button} onPress={pauseTimer} disabled={!isRunning}>
                            <Image
                                source={ICONS["PAUSE"]}
                                style={{ width: iconSize.lg, height: iconSize.lg }}
                            />

                        </TouchableOpacity>
                        <TouchableOpacity style={styles.button} onPress={startTimer} disabled={isRunning}>
                            <Image
                                source={ICONS["PLAY"]}
                                style={{ width: iconSize.lg, height: iconSize.lg }}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.button} onPress={stopTimer}>
                            <Image
                                source={ICONS["STOP"]}
                                style={{ width: iconSize.lg, height: iconSize.lg }}
                            />
                        </TouchableOpacity>
                    </View>
                    <CustomButton text="Save" onPress={onSavePressed}/>
                    <CustomButton text="Back" onPress={onBackPressed}/>
                    {resultWorkoutData.length > 0 && (
                    <SectionList
                        style={styles.sectionList}
                        sections={[
                        {
                            title: 'Workout Data',
                            data: resultWorkoutData,
                        },
                        ]}
                        renderItem={({ item }) => (
                        <View style={styles.itemContainer}>
                            <Text style={styles.itemText}>Set: {item.set}</Text>
                            <Text style={styles.itemText}>Calory: {item.calory}</Text>
                            <Text style={styles.itemText}>Time: {item.time}</Text>
                            <TouchableOpacity style={styles.buttonContainer} onPress={() => handleButtonPress(item.training, item.id)}>
                                <Image
                                    source={ICONS["REMOVE"]}
                                    style={{ width: iconSize.lg, height: iconSize.lg }}
                                />
                            </TouchableOpacity>
                        </View>
                        )}
                        renderSectionHeader={({ section }) => (
                        <View style={styles.headerContainer}>
                            <Text style={[styles.headerText, styles.centeredText]}>{section.title}</Text>
                        </View>
                        )}
                        keyExtractor={(item) => item.id.toString()}
                        scrollEnabled={false}
                    />
                    )}
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
    image: {
        width: '100%',
        height: 350,
        resizeMode: 'cover',
        marginBottom: 10,
    },
    timerText: {
        fontSize: 60,
        fontWeight: 'bold',
        color: '#333',
    },
    caloriesText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#999',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 10,
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        backgroundColor: '#000',
        borderRadius: 5,
    },
    sectionList: {
        backgroundColor: 'white',
        flex: 1,
    },
    itemContainer: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    itemText: {
        fontSize: 16,
        color: '#333',
    },
    headerContainer: {
        backgroundColor: '#f0f0f0',
        paddingVertical: 8,
        paddingHorizontal: 16,
    },
    headerText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    buttonContainer: {
        position: 'absolute',
        right: 16,
        top: 16,
    },
    centeredText: {
      textAlign: 'center',
    },
});

export default WorkoutTrainingScreen;