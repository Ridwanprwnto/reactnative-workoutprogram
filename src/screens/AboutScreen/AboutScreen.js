import React from 'react';
import { Text, View, StyleSheet } from 'react-native';

const AboutScreen = () => {

  return (
    <View style={styles.root}>
        <Text style={styles.title}>About</Text>
        <View style={styles.content}>
          <Text style={styles.text}>Develoved by Purwanto Ridwan,</Text>
          <Text style={styles.text}>© 2024.</Text>
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

export default AboutScreen;