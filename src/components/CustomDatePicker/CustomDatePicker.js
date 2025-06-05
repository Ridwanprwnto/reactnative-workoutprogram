import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import CalendarPicker from "react-native-calendar-picker";

const CustomDatePicker = ({onDateRangeChange}) => {

    const minDate = new Date(); // Today
    const maxDate = new Date(2045, 6, 3);

    const [selectedStartDate, setSelectedStartDate] = useState('DD/MM/YYYY');
    const [selectedEndDate, setselectedEndDate] = useState('DD/MM/YYYY');

    onDateChange = (date, type) => {
        const newDate = JSON.stringify(date);
        const newDate1 = newDate.substring(1, newDate.length-1);
        const dates = newDate1.split("T");
        const date1 = dates[0].split("-");
        const day = date1[2];
        const month = date1[1];
        const year = date1[0];

        if (type == 'END_DATE') {
            if (day == undefined) {
                setselectedEndDate('DD/MM/YYYY');
            } else {
                setselectedEndDate(day+"/"+month+"/"+year);
            }
        } else {
            setSelectedStartDate(day+"/"+month+"/"+year);
            setselectedEndDate('DD/MM/YYYY');
        }
    }
    
    useEffect(() => {
        onDateRangeChange(selectedStartDate, selectedEndDate);
    }, [selectedStartDate, selectedEndDate, onDateRangeChange]);

    return (
        <View style={styles.container}>
            <CalendarPicker
                startFromMonday={true}
                allowRangeSelection={true}
                minDate={minDate}
                maxDate={maxDate}
                todayBackgroundColor="gray"
                selectedDayColor="#000000"
                selectedDayTextColor="#FFFFFF"
                onDateChange={onDateChange}
                scaleFactor={384}
                marginVertical={20}
                textStyle={{
                    fontFamily: "Cochin",
                    color: "#000000",
                }}
            />

            <Text style={styles.text}>{selectedStartDate+" - "+selectedEndDate}</Text>
      </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        backgroundColor: "#FFFFFF",
        width: '100%',
        borderRadius: 5,
        marginVertical: 5,
    },
    text: {
        fontSize: 15,
        color: 'black',
        margin: 10,
    }
});

export default CustomDatePicker;