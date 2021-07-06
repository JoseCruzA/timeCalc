import React, { useState } from 'react';
import { ScrollView, RefreshControl, Pressable, StyleSheet, TextInput, Text, SafeAreaView, View } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { responsiveHeight, responsiveWidth, responsiveFontSize } from "react-native-responsive-dimensions"

const wait = (timeout) => {
  return new Promise(resolve => setTimeout(resolve, timeout));
}

/**
 * Principal function for render the app
 * @author José Cruz
 * @version 1.0
 * @returns 
 */
export default function App() {
  const [dateFrom, setDateFrom] = new useState(new Date());
  const [timeFrom, setTimeFrom] = new useState("");
  const [showFrom, setShowFrom] = new useState(false);
  const [dateTo, setDateTo] = new useState(new Date());
  const [timeTo, setTimeTo] = new useState("");
  const [showTo, setShowTo] = new useState(false);
  const [hoursDif, setHoursDif] = new useState("");
  const [minutesDif, setMinutesDif] = new useState("");
  const [refreshing, setRefreshing] = new useState(false);

  /**
   * Method that refresh the view
   */
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);

    wait(2000).then(() => 
      setRefreshing(false),
      setDateFrom(new Date()),
      setTimeFrom(""),
      setShowFrom(false),
      setDateTo(new Date()),
      setTimeTo(""),
      setShowTo(false),
      setHoursDif(""),
      setMinutesDif(""));
  }, []);

  /**
   * Function that open the picker from
   * @param {*} event 
   */
  const onPressFrom = function() {
    setShowFrom(true);
  }

  /**
   * Function that open the picker to
   * @param {*} event 
   */
   const onPressTo = function() {
    setShowTo(true);
  }

  /**
   * Function that set the selected time to the timee from picker
   * @param {*} event 
   * @param {*} selectedDate 
   */
  const onChangeFrom = function(event, selectedDate) {
    selectedDate = event.nativeEvent.timestamp;
    setShowFrom(false);
    dateTo.setDate(selectedDate.getDate());
    let hours = selectedDate.getHours() > 12 ? selectedDate.getHours() - 12 : selectedDate.getHours();
    hours = String(hours).length < 2 ? '0' + hours : hours;
    let minutes = String(selectedDate.getMinutes()).length < 2 ? '0' + selectedDate.getMinutes() : selectedDate.getMinutes();
    let timeMoment = selectedDate.getHours() > 12 ? "p.m" : "a.m";

    if (timeTo != "" && selectedDate > dateTo) {
      dateTo.setDate(dateTo.getDate() + 1);
    }

    setDateFrom(selectedDate);
    setTimeFrom(hours + ':' + minutes + ' ' + timeMoment);

    if (timeTo !== "") {
      calculateDif(selectedDate, dateTo);
    }
  }

  /**
   * Function that set the selected time to the timee to picker
   * @param {*} event 
   * @param {*} selectedDate 
   */
  const onChangeTo = function(event, selectedDate) {
    selectedDate = event.nativeEvent.timestamp;
    setShowTo(false);
    selectedDate.setDate(dateFrom.getDate());
    let hours = selectedDate.getHours() > 12 ? selectedDate.getHours() - 12 : selectedDate.getHours();
    hours = String(hours).length < 2 ? '0' + hours : hours;
    let minutes = String(selectedDate.getMinutes()).length < 2 ? '0' + selectedDate.getMinutes() : selectedDate.getMinutes();
    let timeMoment = selectedDate.getHours() > 12 ? "p.m" : "a.m";
    
    if (timeFrom != "" && selectedDate < dateFrom) {
      selectedDate.setDate(selectedDate.getDate() + 1);
    }
    
    setDateTo(selectedDate);
    setTimeTo(hours + ':' + minutes + ' ' + timeMoment);

    if (timeFrom !== "") {
      calculateDif(dateFrom, selectedDate);
    }
  }

  /**
   * Method that calculates the diff between two times
   * 
   * @param dateFrom init date
   * @param dateTo end date
   */
  const calculateDif = function(dateFrom, dateTo) {
    let timeDif = dateTo.getTime() - dateFrom.getTime();
    let hours = ((timeDif / (1000 * 3600 * 24)) * 24).toFixed(0);
    let minutes = ((((timeDif / (1000 * 3600 * 24)) * 24) -hours) * 60);
    
    if (minutes < 0) {
      hours -= 1;
      minutes += 60;  
    }

    hours = String(hours).length < 2 ? "0" + hours : hours;
    minutes = String(minutes).length < 2 ? "0" + minutes.toFixed(0) : minutes.toFixed(0);
    
    setHoursDif(hours);
    setMinutesDif(minutes);
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.columnCont}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing}
            onRefresh={onRefresh}/>
        }>
        <Text style={styles.title}>Hora</Text>
        <View style={styles.inputGroup}>
          <Pressable 
            style={styles.pressable}
            onPress={onPressFrom}>
            <Text
              style={styles.text}>
              Hora Salida:
            </Text>
            <TextInput
              style={styles.input}
              value={timeFrom}
              editable={false}
              placeholder="HH:mm am/pm"
              placeholderTextColor="#FFFFFF"/>
          </Pressable>
          <Pressable 
            style={styles.pressable}
            onPress={onPressTo}>
            <Text
              style={styles.text}>
              Hora Llegada:
            </Text>
            <TextInput
              style={styles.input}
              value={timeTo}
              editable={false}
              placeholder="HH:mm am/pm"
              placeholderTextColor="#FFFFFF"/>
          </Pressable>
          { showFrom && (
            <DateTimePicker 
              testId="timeFrom"
              value={dateFrom}
              mode="time"
              is24Hour={false}
              display="spinner"
              onChange={onChangeFrom}/>)}
          { showTo && (
            <DateTimePicker 
              testId="timeTo"
              value={dateTo}
              mode="time"
              is24Hour={false}
              display="spinner"
              onChange={onChangeTo}/>)}
        </View>
        <View style={styles.groupCont}>
          <View style={styles.resultCont}>
              <Text style={styles.difTitle}>Diferencia</Text>
              <View style={styles.row}>
                <Text style={styles.textWhite}>Horas</Text>
                <Text> </Text>
                <Text style={styles.textWhite}>Minutos</Text>
              </View>
              <View style={styles.rowResult}>
                <Text style={styles.textResult}>{hoursDif !== "" ? hoursDif : "00"}</Text>
                <Text style={styles.textResult}>:</Text>
                <Text style={styles.textResult}>{minutesDif !== "" ? minutesDif : "00"}</Text>
              </View>
              <View style={styles.row}>
                <View style={styles.col}>
                  <Text style={styles.infoTitle}>Salida</Text>
                  <Text style={styles.textWhite}>{timeFrom !== "" ? timeFrom : "HH:mm am/pm"}</Text>
                </View>
                <View style={styles.col}>
                  <Text style={styles.infoTitle}>Llegada</Text>
                  <Text style={styles.textWhite}>{timeTo !== "" ? timeTo : "HH:mm am/pm"}</Text>
                </View>
              </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  columnCont: {
    flexDirection: "column",
  },
  inputGroup: {
    height: responsiveHeight(20),
    marginTop: 20
  },
  title: {
    fontSize: responsiveFontSize(2.5),
    textAlign: "center",
    textAlignVertical: "center",
    fontWeight: "bold",
    color: "#FFFFFF",
    marginTop: 10
  },
  pressable: {
    flexDirection: "row",
    width: responsiveWidth(100),
    justifyContent: "space-between",
    paddingLeft: responsiveWidth(5),
    paddingRight: responsiveWidth(5)
  },
  input: {
    height: 40,
    color: "#FFFFFF",
    borderBottomColor: "#FFFFFF",
    borderBottomWidth: 1,
    textAlign: "center",
    fontSize: responsiveFontSize(2)
  },
  text: {
    height: 40,
    color: "#FFFFFF",
    textAlignVertical: "center",
    fontSize: responsiveFontSize(2)
  },
  groupCont: {
    height: responsiveHeight(80)
  },
  resultCont: {
    backgroundColor: "#3D3C3C",
    width: responsiveWidth(85),
    alignSelf: "center",
    borderRadius: 20
  },
  difTitle: {
    color: "#BF3BB6",
    fontSize: responsiveFontSize(3),
    textAlign: "center",
    padding: 30,
    fontWeight: "bold",
    borderBottomWidth: 1
  },
  infoTitle: {
    color: "#BF3BB6",
    fontSize: responsiveFontSize(3),
    textAlign: "center",
    fontWeight: "bold",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginTop: 10,
    marginBottom: 10,
    textAlign: "center"
  },
  col: {
    flexDirection: "column",
    textAlign: "center",
    paddingBottom: 50
  },
  textWhite: {
    color: "#FFFFFF",
    textAlign: "center"
  },
  textResult: {
    color: "#FFFFFF",
    fontSize: responsiveFontSize(3),
    fontWeight: "bold",
    textAlign: "center",
    textAlignVertical: "center"
  },
  rowResult: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginTop: 10,
    marginBottom: 10,
    borderBottomWidth: 1,
    paddingBottom: 20
  }
});
