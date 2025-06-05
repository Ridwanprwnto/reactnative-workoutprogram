import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, LayoutAnimation, ScrollView, SafeAreaView, Alert} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

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
    navigation.navigate('Schedule', {
      scheduleWorkout: item,
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

const ListProgramScreen = ({route}) => {
  const { userData, apiUrl } = route.params;

  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        try {
          const response = await fetch(`${apiUrl}listprogram&id=${userData.id}`);
          const data = await response.json();
          setlistDataSource(data);
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

  const [multiSelect, setMultiSelect] = useState(false);
  const [listDataSource, setlistDataSource] = useState([]);

  const updateLayout = (index) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    const array = [...listDataSource];
    if (multiSelect) {
      array[index]['isExpanded'] = !array[index]['isExpanded'];
    } else {
      array.map((value, placeIndex) =>
        placeIndex === index ? (array[placeIndex]['isExpanded']) = !array[placeIndex]['isExpanded'] : (array[placeIndex]['isExpanded']) = false
      );
    }
    setlistDataSource(array)
  }

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={styles.root}>
        <Text style={styles.title}>List Program Workout</Text>
      </View>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.titleText}>
            Trainer
          </Text>
          <TouchableOpacity onPress={() => setMultiSelect(!multiSelect)}>
            <Text style={styles.headerButton}>
              { multiSelect ? 'Single View' : 'Multiple View' }
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView>
        {listDataSource && Array.isArray(listDataSource) && listDataSource.map((item, key) => (
          <ExpandableComponent
            key={item.category_name}
            item={item}
            onClickFunc={() => {
              updateLayout(key)
            }}
          />
        )) || (
          <View style={styles.nodata}>
            <Text style={styles.text}>No data available</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'black',
    margin: 10,
  },
  container: {
    // flex: 1,
  },
  header: {
    flexDirection: 'row',
    padding: 10,
    marginLeft: 20,
    marginRight: 20,
  },
  titleText: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
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
    marginLeft: 20,
    marginRight: 20,
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
    marginLeft: 20,
    marginRight: 20,
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
    width: '100%',
    borderRadius: 5,
    marginVertical: 5,
  }
});

export default ListProgramScreen;