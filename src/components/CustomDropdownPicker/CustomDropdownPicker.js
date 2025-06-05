// components/DropdownPicker.js
import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';

  const CustomDropdownPicker = ({
    items,
    onSelect,
    multiple = false,
    min = 0,
    max = items.length,
    placeholder,
  }) => {
  
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(multiple ? [] : null);

  return (
    <View>
      <DropDownPicker
        open={open}
        value={value}
        items={items}
        setOpen={setOpen}
        setValue={setValue}
        multiple={multiple}
        min={min}
        max={max}
        placeholder={placeholder}
        onChangeValue={(value) => onSelect(value)}
        dropDownContainerStyle={styles.dropdownBorder}
        placeholderStyle={styles.placeholder}
        style={styles.dropdown}
        maxHeight={300}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  dropdown: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#e8e8e8',
    borderRadius: 5,
    marginTop: 5,
    marginBottom: 5,
    width: '100%',
  },
  dropdownBorder: {
      borderColor: '#e8e8e8',
  },
  placeholder: {
      color: "grey",
  }
});

export default CustomDropdownPicker;