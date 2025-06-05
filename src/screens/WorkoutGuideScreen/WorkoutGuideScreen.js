import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Image, SafeAreaView, ScrollView, Alert } from 'react-native';
import CustomCardExercise from '../../components/CustomCard/CustomExerciseCard';

const WorkoutGuideScreen = ({route}) => {
  const { userData, apiUrl, workoutGuide} = route.params;

  useEffect(() => {

      const formData = {
          idUser: userData.id,
          idExercise: workoutGuide.id,
      };
    
      const fetchData = async () => {
        try {
          const response = await fetch(apiUrl + "guide", {
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

  return (
    <SafeAreaView>
      <ScrollView>
        <View style={styles.root}>
            <Text style={styles.title}>Workout Guide</Text>
              {currentWorkout && Array.isArray(currentWorkout) && currentWorkout.map((item, index) => (
                <View key={index}>
                    <CustomCardExercise 
                      title={item.body}
                      body={item.name}
                      children={
                        <Image
                          source={{ uri: item.animation }}
                          style={styles.image}
                        />
                      }
                    />
                </View>
              ))}
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
  image: {
    width: '100%',
    height: 350,
    resizeMode: 'cover',
    marginBottom: 10,
  },
});

export default WorkoutGuideScreen;