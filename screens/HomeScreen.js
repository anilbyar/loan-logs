import {
  Button,
  FlatList,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";

const transactions = [];

export const HomeScreen = ({ route, navigation }) => {
  useEffect(() => {
    if (
      route.params?.details != undefined &&
      Number(route.params.details.Amount) > 0
    ) {
      alert("transaction added");
      transactions.push(route.params.details);
    }
  }, [route.params?.details]);

  const [entryDetail, setentryDetail] = useState(null);

  const render = ({ item }) => {
    return (
      <View>
        <Text>Date: {item.date}</Text>
        <Text>Amount: {item.Amount}</Text>
        <Text style={{ marginBottom: 10 }}>
          Description: {item.Description}
        </Text>
        <TouchableOpacity
          style={{ width: "100%", borderWidth: 2, marginBottom: 10 }}
          onPress={() => {
            navigation.navigate("AddTransaction", {
              yougave: true,
              isEdit: true,
              amt: item.Amount,
              des: item.Description,
            });
          }}
        >
          <Text style={{ textAlign: "center" }}>Edit Entry</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View>
      <Button
        title="add transaction"
        onPress={() => {
          navigation.navigate("AddTransaction", {
            yougave: false,
            isEdit: false,
            amt: undefined,
            des: undefined,
          });
        }}
      ></Button>

      <FlatList data={transactions} renderItem={render}></FlatList>
    </View>
  );
};
