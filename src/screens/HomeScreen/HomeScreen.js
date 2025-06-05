import React from 'react';
import { Text, View, StyleSheet } from 'react-native';

const HomeScreen = ( {route} ) => {
  const { userData, apiUrl } = route.params;

  return (
    <View style={styles.root}>
        <Text style={styles.title}>Home</Text>
        <View style={styles.content}>
          <Text style={styles.text}>Welcome, {userData.username}</Text>
        </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    padding: 20,
    flex: 1,
  },
  title: {
    textAlign: 'center',
    fontSize: 22,
    fontWeight: 'bold',
    color: 'black',
    margin: 10,
  },
  content: {
    flex: 1, 
    justifyContent: 'center',
    alignItems: 'center'
  },
  text: {
    textAlign: 'center',
    fontSize: 20,
    color: 'black',
  },
});

export default HomeScreen;