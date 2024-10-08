import {
  arrayRemove,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ToastAndroid,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/dist/FontAwesome";
import { db } from "../firebaseConfig";
import {
  getUserName,
  dateTimeStringFromTimestamp,
  PRIMARY,
  SECONDARY,
  redGreen,
} from "../Utils";
import { StatusBar } from "expo-status-bar";
import { ChatContext, ChatDispatchContext } from "../components/ChatContext";
import { CustomProgressBar } from "../components/CustomProgressBar";

export const ChatScreen = ({ route, navigation }) => {
  // const rupeeIcon = <Icon name="rupee" size={30} color="#900" />
  const { userId, otherUserId, prevChat } = route.params;
  console.log(chat);
  const [chat, setChat] = useState(prevChat);
  const [transactionList, setTransactionList] = useState(null);
  const [inProgress, setInProgress] = useState(false);

  console.log(userId, otherUserId);

  const deleteChat = () => {
    setInProgress(true);
    const removeChatPromise = deleteDoc(doc(db, "chats", chat.chatId));
    const removeChatIdFromUser1 = updateDoc(
      doc(db, "users", chat.userIds[0]),
      {
        chatIds: arrayRemove(chat.chatId),
      }
    );
    const removeChatIdFromUser2 = updateDoc(
      doc(db, "users", chat.userIds[1]),
      {
        chatIds: arrayRemove(chat.chatId),
      }
    );
    Promise.all([
      removeChatPromise,
      removeChatIdFromUser1,
      removeChatIdFromUser2,
    ])
      .then((result) => {
        ToastAndroid.show(
          "Chat deleted",
          ToastAndroid.CENTER,
          ToastAndroid.SHORT
        );
        setInProgress(false);
        navigation.goBack();
      })
      .catch((e) => {
        ToastAndroid.show(e, ToastAndroid.CENTER, ToastAndroid.SHORT);
        setInProgress(false);
      });
  };

  const onDeleteChatHandler = () => {
    Alert.alert("Delete chat?", "sure????? ", [
      {
        text: "NO",
      },
      {
        text: "YES",
        onPress: () => {
          deleteChat();
        },
      },
    ]);
  };

  // Adding delete icon for chat
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={onDeleteChatHandler}>
          <MaterialIcons name="delete" size={30} color="black" />
        </TouchableOpacity>
      ),
    })
  }, []);

  useFocusEffect(
    useCallback(() => {
      setInProgress(true);
      async function getTransactionList() {
        try {
          const q = query(
            collection(db, "chats", chat.chatId, "transactions"),
            orderBy("timestamp", "desc")
          );
          const querySnapshot = await getDocs(q);
          var transactionList = [];
          var totalAmt = 0;
          querySnapshot.forEach(async (doc) => {
            console.log(doc.id, " => ", doc.data());
            const transactionData = doc.data();
            totalAmt = totalAmt + transactionData.transactionAmt;
            console.log(
              "TotAmt: ",
              totalAmt,
              " tamt: ",
              transactionData.transactionAmt
            );
            transactionList.push(transactionData);
          });
          console.log("Tot: ", totalAmt);
          transactionList = await Promise.all(
            transactionList.map(async (transaction) => {
              transaction.addedByName = await getUserName(transaction.addedBy);
              return transaction;
            })
          );
          if (totalAmt != chat.netAmt) {
            setChat({ ...chat, netAmt: totalAmt });
            await updateDoc(doc(db, "chats", chat.chatId), {
              netAmt: totalAmt,
            });
          }
          console.log("Transaction List: ", transactionList);
          setInProgress(false);
          setTransactionList(transactionList);
        } catch (e) {
          console.log("Exception occured while fetching transaction list: ", e);
          setInProgress(false);
        }
      }
      getTransactionList();
    }, [])
  );

  const Item = ({ transaction }) => (
    <TouchableOpacity
      style={styles.mainContainer}
      onPress={() => {
        navigation.navigate("transactiondetail", {
          prevTransaction: transaction,
          userId: userId,
          chat: chat,
        });
      }}
    >
      <View style={styles.dateContainer}>
        <Text style={styles.smallDate}>
          {dateTimeStringFromTimestamp(transaction.timestamp)}
        </Text>
      </View>

      <View style={styles.container}>
        {/* container for who entered the transaction and about transaction */}
        <View style={styles.namePlusAbout}>
          <Text style={styles.userNameText}>{transaction.addedByName}</Text>
          <View style={styles.about}>
            <Text numberOfLines={3} ellipsizeMode="tail">
              {transaction.description}
            </Text>
          </View>
        </View>

        <View style={styles.youGaveContainer}>
          {/* use i gave container for user1 when (initiated by user1 through i gave) or (initiated by user2 and through i got) */}
          {(!redGreen(userId, chat.userIds, transaction.transactionAmt)) && (
            <Text style={styles.youGaveText}>
              {Math.abs(transaction.transactionAmt)}
            </Text>
          )}
        </View>

        <View style={styles.youGotContainer}>
          {/* use i got container for user1 when (initiated by user1 through i got) or (initiated by user2 and through i gave) */}
          {(redGreen(userId, chat.userIds, transaction.transactionAmt) && (
            <Text style={styles.youGotText}>
              {Math.abs(transaction.transactionAmt)}
            </Text>
          ))}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View>
      <CustomProgressBar visible={inProgress}/>
      <View style={{ height: "100%" }}>
        {/* top description */}
        {/* you will get/give  */}

        <View style={[styles.topContainer, { height: "12%" }]}>
          <View style={[styles.netAmountContainer, { height: "80%" }]}>
            {/* divisions for you will get/give, if +ve user1 will give*/}
            {redGreen(userId, chat.userIds, chat.netAmt) ? (
              // give
              <View style={styles.getGiveBox}>
                <Text style={styles.topContainerText}>You will give</Text>
                <Text
                  style={[
                    styles.topContainerText,
                    { borderWidth: 0, color: "green" },
                  ]}
                >
                  {Math.abs(chat.netAmt)}
                </Text>
              </View>
            ) : (
              // get
              <View style={styles.getGiveBox}>
                <Text style={styles.topContainerText}>You will get</Text>
                <Text
                  style={[
                    styles.topContainerText,
                    { borderWidth: 0, color: "red" },
                  ]}
                >
                  {Math.abs(chat.netAmt)}
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* labelText for ledger */}
        <View style={[styles.labelContainer, { height: "3%" }]}>
          <View style={[{ width: "50%" }]}>
            <Text style={[styles.labelText]}>ENTRIES</Text>
          </View>
          <View style={[{ width: "25%" }]}>
            <Text style={[styles.labelText]}>YOU GAVE</Text>
          </View>
          <View style={[{ width: "25%" }]}>
            <Text style={[styles.labelText]}>YOU GOT</Text>
          </View>
        </View>

        {/* transactions */}
        <View style={{ height: "73%" }}>
          <FlatList
            data={transactionList}
            renderItem={({ item }) => {
              return <Item transaction={item} />;
            }}
            keyExtractor={(item) => item.transactionId}
          />
        </View>

        {/* add transaction get give */}
        <View style={styles.enterTranContainer}>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: "red" }]}
            onPress={() => {
              navigation.navigate("addtransaction", {
                yougave: true,
                isEdit: false,
                userId: userId,
                chat: chat,
              });
            }}
          >
            <Text
              style={{
                color: "white",
                textAlign: "center",
              }}
            >
              {" "}
              YOU GAVE
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: "green" }]}
            onPress={() => {
              navigation.navigate("addtransaction", {
                yougave: false,
                isEdit: false,
                userId: userId,
                chat: chat,
              });
            }}
          >
            <Text
              style={{
                color: "white",
                textAlign: "center",
              }}
            >
              {" "}
              YOU GOT
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  topContainer: {
    flexDirection: "column",
    // marginVertical: 3,
    // borderWidth: 1,
    alignItems: "center",
    backgroundColor: SECONDARY,
  },
  netAmountContainer: {
    flexDirection: "row",
    marginTop: 10,
    alignContent: "center",
    alignItems: "center",
    justifyContent: "space-around",
    backgroundColor: SECONDARY,
    width: "60%",
  },
  topContainerText: {
    fontSize: 18,
    fontWeight: "700",
    textShadowColor: "gray",
  },
  labelContainer: {
    flexDirection: "row",
    alignContent: "center",
    alignItems: "center",
    // paddingHorizontal: 5, // Add padding for spacing
    // marginBottom: 10, // Add margin at the bottom for spacing
    // borderWidth:1,
  },
  labelText: {
    fontSize: 10,
    color: "gray",
    // borderWidth:1,
    // backgroundColor:'pink',
    textAlign: "center",
  },
  mainContainer: {
    flexDirection: "column",
    alignItems: "center",
    // backgroundColor: 'pink',
    marginVertical: 3,
    // borderWidth: 1,
    paddingHorizontal: 5,
    // height: '70%',
    // minHeight: 130, // Set minimum height to accommodate all items
  },
  namePlusAbout: {
    width: "50%",
  },
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    marginVertical: 1,
    paddingHorizontal: 5,
    // borderWidth: 1,
    borderRadius: 5,
    // height: 30, // Set a smaller height for the dateContainer
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "white",
    // marginVertical: 10,
    // borderWidth: 1,
    borderRadius: 10,
    height: 80,
    paddingBottom: 1,
    // paddingHorizontal: 20, // Add padding for spacing
    // elevation: 3, // Add elevation for Android
    shadowColor: "black", // Add shadow properties for iOS
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  smallDate: {
    fontSize: 10,
    fontWeight: "normal",
    textAlign: "center",
    // backgroundColor:'green',
    // borderWidth: 1,
  },
  userNameContainer: {
    flex: 1,
    fontSize: 16,
    textAlign: "left",
    padding: 0,
    paddingLeft: 2,
    // paddingTop: 1,
    // borderWidth: 1,
    height: "30%",
    justifyContent: "center",
  },
  userNameText: {
    fontSize: 12,
    fontWeight: "bold",
    textAlign: "left",
    paddingLeft: 10,
    // borderWidth: 1,
  },
  about: {
    flex: 1,
    fontSize: 16,
    textAlign: "left",
    paddingHorizontal: 10,
    justifyContent: "center",
    // borderWidth: 1,
    height: "80%",
  },
  youGaveContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 0, 0, 0.1)",
    height: "100%",
    width: "25%",
    // borderWidth: 1,
  },
  youGaveText: {
    color: "red",
    fontSize: 16,
    paddingHorizontal: 5,
  },
  youGotContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 255, 0, 0.1)",
    height: "100%",
    width: "25%",
    // borderWidth: 1,
  },
  youGotText: {
    color: "green",
    fontSize: 16,
    paddingHorizontal: 5,
  },
  enterTranContainer: {
    // borderWidth: 1,
    backgroundColor: "white",
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
    height: "15%",
  },
  button: {
    height: "60%",
    width: "40%",
    justifyContent: "center",
    paddingVertical: 10,
    borderRadius: 5,
  },
  getGiveBox: {
    display: "flex",
    flexDirection: "row",
    // borderWidth: 1,
    height: "80%",
    width: "90%",
    alignItems: "center",
    justifyContent: "space-around",
  },
});
