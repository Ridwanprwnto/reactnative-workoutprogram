import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const CustomSelect = ({ options, placeholder, onSelect }) => {
  const [showOptions, setShowOptions] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);

  const handleSelect = (option) => {
    setSelectedOption(option);
    setShowOptions(false);
    onSelect(option);
  };

  const handleShowOptions = () => {
    setShowOptions(!showOptions);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleShowOptions}>
        <View style={styles.selectContainer}>
          {selectedOption ? (
            <Text style={styles.selectedOption}>{selectedOption.label}</Text>
          ) : (
            <Text style={styles.placeholder}>{placeholder}</Text>
          )}
          <Text style={styles.arrowDown}>▼</Text>
        </View>
      </TouchableOpacity>
      {showOptions && (
        <View style={styles.optionsContainer}>
          {options.map((option, index) => (
            <TouchableOpacity key={index} onPress={() => handleSelect(option)}>
              <Text style={styles.option}>{option.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    width: '100%',
    marginVertical: 5,
    borderRadius: 5,
  },
  selectContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderColor: '#e8e8e8',
    borderWidth: 1,
    borderRadius: 5,
    width: '100%',
  },
  selectedOption: {
    fontSize: 14,
    color: '#333',
  },
  placeholder: {
    fontSize: 14,
    color: '#999',
  },
  arrowDown: {
    fontSize: 14,
    color: '#333',
  },
  optionsContainer: {
    position: 'relative',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderColor: '#e8e8e8',
    borderWidth: 1,
    borderRadius: 5,
    padding: 15,
    zIndex: 1,
  },
  option: {
    fontSize: 14,
    color: '#333',
    paddingVertical: 10,
  },
});

export default CustomSelect;