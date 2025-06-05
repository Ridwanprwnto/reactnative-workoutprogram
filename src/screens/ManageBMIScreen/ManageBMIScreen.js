import React, { useState  } from 'react';
import { Text, View, StyleSheet, ScrollView, Alert, SectionList } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import CheckBox from '@react-native-community/checkbox';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';

const ManageBMIScreen = ({route}) => {
  const { userData, apiUrl } = route.params;
  const [dataCategory, setDataCategory] = useState([]);

  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        try {
          const response = await fetch(`${apiUrl}category&id=${userData.id}`);
          const data = await response.json();
          setDataCategory(data);
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
  
  const [nilaiAwal, setNilaiAwal] = useState('');
  const [nilaiAkhir, setNilaiAkhir] = useState('');
  const [categoryBMI, setCategoryBMI] = useState('');

  const resetTextInput = () => {
    setNilaiAwal('');
    setNilaiAkhir('');
    setCategoryBMI('');
  }

  const onCreateBMI = async () => {
      
    if (nilaiAwal === '' || nilaiAkhir === '' || categoryBMI === '') {
      Alert.alert(
        'Error :', 
        'Incorrect data input',
      );
      setSelectedIds([]);
      resetTextInput();
      return;
    }

    const formData = {
      nilaiAwal,
      nilaiAkhir,
      categoryBMI,
    };

    try {
      const response = await fetch(apiUrl+"createbmi", {
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
        setSelectedIds([]);
        resetTextInput();
        return;
      }

      const data = await response.json();

      if (Array.isArray(data)) {
        setDataCategory(data);
        setSelectedIds([]);
        resetTextInput();
        Alert.alert(
          'Success :',
          'Successfully added bmi data',
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
        console.error(error);
        Alert.alert(
          'Error :',
          'Failed connect to API',
        );
        setSelectedIds([]);
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

  const onDeleteBMIPressed = async () => {
      Alert.alert(
          'Confirmation',
          `Do you want to delete bmi data?`,
          [
              { text: 'Cancel', style: 'cancel' },
              { 
                  text: 'OK', 
                  onPress: () => {
                      if (selectedIds.length === 0) {
                          Alert.alert(
                              'Error :',
                              'No BMI data selected!',
                          );
                      }
                      else {
                        onExecuteBMIPressed();
                      }
                  } 
              },
          ]
      );
  };

  const onExecuteBMIPressed = async () => {

    try {
      const response = await fetch(apiUrl + "deletebmi", {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(
            {idBMI: selectedIds}
          ),
      });

      if (!response.ok) {
        throw new Error('Failed to send data to API');
      }

      const data = await response.json();

      if (Array.isArray(data)) {
        setDataCategory(data);
        setSelectedIds([]);
        resetTextInput();
        Alert.alert(
          'Success :',
          'Successfully delete bmi data',
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
        'Failed to delete BMI.',
      );
      setSelectedIds([]);
      resetTextInput();
    }
  };
  
  return (
    <ScrollView>
      <View style={styles.root}>
          <Text style={styles.title}>Manage BMI</Text>
          <Text style={styles.subtitle}>Create Data BMI</Text>
          <CustomInput placeholder="Nilai awal" value={nilaiAwal} onChangeText={(text) => setNilaiAwal(text)}/>
          <CustomInput placeholder="Nilai akhir" value={nilaiAkhir} onChangeText={(text) => setNilaiAkhir(text)}/>
          <CustomInput placeholder="Category BMI" value={categoryBMI} onChangeText={(text) => setCategoryBMI(text)}/>
          <CustomButton text="Create BMI" onPress={onCreateBMI} />
          <Text style={styles.subtitle}>List Data Category</Text>
          {dataCategory.length > 0 && (
              <SectionList
                  style={styles.sectionList}
                  sections={[{ data: dataCategory }]}
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
          <CustomButton text="Delete Category" onPress={onDeleteBMIPressed}/>
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

export default ManageBMIScreen;