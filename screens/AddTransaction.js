import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import { addDoc, collection, doc, setDoc, Timestamp } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  KeyboardAvoidingView,
  Button,
  Alert,
  SafeAreaView,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

import Icon from "react-native-vector-icons/FontAwesome";
import Ionicon from "react-native-vector-icons/Ionicons";
import { db } from "../firebaseConfig";
import { ChatContext } from "../components/ChatContext";


/*
wrt first user
  +ve => 
    in profit,
    Green
    You Got
    You will give
*/
export const AddTransaction = ({ route, navigation }) => {
  const { userId, chat, yougave, isEdit, transaction } = route.params;
  
  const specialColor = yougave ? "red" : "green";
  const styles = createStyles(specialColor);

  const [isAmountEntered, setAmountEntered] = useState(false);

  const [amount, setAmount] = useState(transaction ? String(Math.abs(transaction.transactionAmt)) : "");
  const [desc, setDesc] = useState(transaction ? transaction.description : "");
  const [dateTime, setDateTime] = useState(transaction? transaction.timestamp.toDate():new Date());
  const [disableSubmit, setDisableSubmit] = useState(false);

  const onSubmit = async () => {
    const newRefDoc = doc(collection(db, "chats", chat.chatId, "transactions"));
    const netAmount =
      (userId == chat.userIds[0] && !yougave) ||
      (userId == chat.userIds[1] && yougave)
        ? Number(amount)
        : -Number(amount);
    console.log("Ref: ", newRefDoc);
    await setDoc(newRefDoc, {
      addedBy: userId,
      description: desc,
      timestamp: Timestamp.fromDate(dateTime),
      transactionAmt: netAmount,
      transactionId: newRefDoc.id
    }).then((res) => {
      setDisableSubmit(false);
      navigation.goBack();
    });
  };

  useEffect(() => {
    if (desc === "" && (amount === "" || Number(amount) <= 0))
      setAmountEntered(false);
    if (Number(amount) > 0) setAmountEntered(true);
  }, [amount, desc]);

  useEffect(() => {
    navigation.setOptions({
      headerTitle: `${yougave ? "You Gave" : "You Got"} ${"\u20B9"} ${
        amount === "" || Number(amount) <= 0 ? "0" : amount
      } ${yougave ? "to" : "from"}`,
      headerTitleStyle: {
        color: specialColor,
      },
      headerLeft: () => {
        return (
          <Ionicon
            name="arrow-back"
            size={25}
            style={{ marginRight: 10, width: 40 }}
            onPress={() => {
              // TODO: add this also when SYSTEM BACK is pressed

              // Alert.alert("Exit without saving?", "Changes will not be saved", [
              //   {
              //     text: "NO",
              //   },
              //   {
              //     text: "YES",
              //     onPress: () => {
                    navigation.goBack();
                  // },
                // },
              // ]);
            }}
          />
        );
      },
    });
  }, [amount]);

  const MyDateTimePicker = () => {
    const [showTime, setShowTime] = useState(false);
    const [showDate, setShowDate] = useState(false);

    const onChange = (e, selectedDate) => {
      setDateTime(selectedDate);
    };

    return (
      <View style={styles.dateContainer}>
        {showDate && (
          <>
            <DateTimePicker
              value={dateTime}
              mode={"date"}
              is24Hour={false}
              onChange={onChange}
            />
          </>
        )}
        {showTime && (
          <>
            <DateTimePicker
              value={dateTime}
              mode={"time"}
              is24Hour={false}
              onChange={onChange}
            />
          </>
        )}
        <TouchableOpacity
          style={styles.dateTimeButton}
          onPress={() => setShowDate(true)}
        >
          <Text style={styles.dateTimeText}>{dateTime.toDateString()}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.dateTimeButton}
          onPress={() => setShowTime(true)}
        >
          <Text style={styles.dateTimeText}>
            {dateTime.toLocaleTimeString("en-US")}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    //start
    <KeyboardAvoidingView style={styles.main}>
      {/* ADD AMOUNT */}

      <View style={styles.addAmountContainer}>
        <Text style={styles.addAmountText}>{"\u20B9"}</Text>
        <TextInput
          style={styles.addAmountTextInput}
          placeholder="Add Amount"
          onChangeText={(amnt) => setAmount(amnt)}
          value={amount}
          inputMode="numeric"
          autoFocus={isEdit}
        ></TextInput>
      </View>

      {isAmountEntered && (
        <>
          {/* ADD DESCRIPTION */}

          <View style={styles.addDescContainer}>
            <Icon name="pencil" size={20} style={styles.penIcon} />
            <TextInput
              style={styles.addDescTextInput}
              placeholder="Add Description"
              onChangeText={(Desc) => setDesc(Desc)}
              value={desc}
            ></TextInput>
          </View>

          {/* ADD DATE */}
          <MyDateTimePicker />
        </>
      )}

      {/* SAVE BUTTON */}

      <View style={styles.saveContainer}>
        <TouchableOpacity
          style={styles.saveButton}
          onPress={onSubmit}
          disabled={!isAmountEntered && !disableSubmit}
        >
          <Text style={styles.saveText}>SAVE</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const createStyles = (specialColor) => {
  return (styles = StyleSheet.create({
    main: {
      flex: 1,
    },
    addAmountContainer: {
      flexDirection: "row",
      marginHorizontal: 20,
      marginTop: 20,
      borderRadius: 20,
      borderWidth: 2,
    },
    addAmountText: {
      fontSize: 30,
      padding: 10,
      color: specialColor,
    },
    addAmountTextInput: {
      width: "90%",
      fontSize: 25,
      color: specialColor,
    },
    addDescContainer: {
      margin: 20,
      borderRadius: 20,
      borderWidth: 2,
      flexDirection: "row",
    },
    penIcon: {
      paddingTop: 13,
      paddingLeft: 8,
      color: specialColor,
    },
    addDescTextInput: {
      padding: 10,
      width: "91%",
    },
    dateContainer: {
      flexDirection: "row",
      margin: 20,
      padding: 6,
      borderRadius: 10,
      borderWidth: 2,
      alignItems: "center",
      justifyContent: "center",
    },
    calendarIcon: {
      padding: 10,
      color: specialColor,
    },
    dateTimeButton: {
      width: "50%",
      justifyContent: "center",
      alignItems: "center",
    },
    dateTimeText: {
      textAlign: "center",
      padding: 3,
      backgroundColor: "#d4eeff",
      borderRadius: 3,
      textAlignVertical: "center",
    },
    saveContainer: {
      position: "absolute",
      bottom: 20,
      left: 20,
      right: 20,
      borderRadius: 20,
      borderWidth: 2,
      backgroundColor: specialColor,
    },
    saveButton: {
      width: "100%",
    },
    saveText: {
      textAlign: "center",
      fontSize: 20,
      padding: 10,
      color: "white",
    },
  }));
};
