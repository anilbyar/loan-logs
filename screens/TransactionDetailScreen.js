import { useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  Modal,
  ToastAndroid,
} from "react-native";
import AntDesign from "react-native-vector-icons/AntDesign";
import Octicons from "react-native-vector-icons/Octicons";
import { dateTimeStringFromTimestamp, redGreen } from "../Utils";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebaseConfig";

export const TransactionDetailScreen = ({ route, navigation }) => {
  const { userId, chat, transaction } = route.params;
  const [modalVisible, setModalVisible] = useState(false);
  const isEditDisabled = userId != transaction.addedBy;

  const onDelete = async () => {
    await deleteDoc(doc(db, 'chats', chat.chatId, 'transactions', transaction.transactionId)).then(() => {
      navigation.goBack();
    }).catch((e)=> {
      ToastAndroid.show(e);
    });
  }

  return (
    <View style={{ height: "100%", width: "100%" }}>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View
          style={{
            height: "100%",
            width: "100%",
            backgroundColor: "rgba(222, 222, 222, 0.8)",
          }}
        >
          <View
            style={{
              padding: "2%",
              borderTopRightRadius: 15,
              borderTopLeftRadius: 15,
              position: "absolute",
              bottom: 0,
              height: "20%",
              width: "100%",
              backgroundColor: "rgb(222, 222, 222)",
            }}
          >
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 20, fontWeight: "500" }}>
                Delete Entry?
              </Text>
              <Text style={{ fontSize: 15, fontWeight: "400" }}>
                Deleting entry will delete all the details with the entry.
              </Text>
            </View>
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                padding: "5%",
                height: "100%",
                justifyContent: "space-evenly",
              }}
            >
              <TouchableOpacity
                style={{
                  borderWidth: 2,
                  height: "100%",
                  width: "45%",
                  borderRadius: 8,
                }}
                onPress={() => setModalVisible(false)}
              >
                <Text
                  style={{
                    alignSelf: "center",
                    height: "100%",
                    textAlignVertical: "center",
                    fontWeight: "500",
                    fontSize: 15,
                  }}
                >
                  No
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  borderWidth: 2,
                  height: "100%",
                  width: "45%",
                  borderRadius: 8,
                  borderColor: "red",
                }}
                onPress={() => {
                  setModalVisible(false);
                  onDelete();
                }}
              >
                <Text
                  style={{
                    alignSelf: "center",
                    height: "100%",
                    textAlignVertical: "center",
                    fontWeight: "500",
                    fontSize: 15,
                    color: "red",
                  }}
                >
                  YES
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <View
        style={[
          {
            backgroundColor: "#4649f2",
            height: "35%",
            justifyContent: "center",
            alignItems: "center",
          },
        ]}
      >
        <View
          style={{
            backgroundColor: "#fff",
            height: "80%",
            width: "95%",
            borderRadius: 8,
          }}
        >
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              justifyContent: "space-between",
              padding: 8,
            }}
          >
            <View style={{ justifyContent: "space-around" }}>
              <Text style={{ fontWeight: "bold", fontSize: 18 }}>
                {transaction.addedByName}
              </Text>
              <Text style={{ color: "grey", fontWeight: "400", fontSize: 13 }}>
                {dateTimeStringFromTimestamp(transaction.timestamp)}
              </Text>
            </View>
            <View style={{ justifyContent: "space-around" }}>
              <Text
                style={{
                  fontWeight: "bold",
                  fontSize: 18,
                  alignSelf: "center",
                  color:
                    redGreen(userId, chat.userIds, transaction.transactionAmt)
                    ? "green"
                    : "red",
                  }}
                  >
                {Math.abs(transaction.transactionAmt)}
              </Text>
              <Text style={{ color: "grey", fontWeight: "400", fontSize: 13 }}>
                {redGreen(userId, chat.userIds, transaction.transactionAmt)
                  ? "YOU GOT"
                  : "YOU GAVE"}
              </Text>
            </View>
          </View>
          <View
            style={{
              borderTopWidth: 1,
              borderColor: "#525252",
              flex: 1,
              padding: 5,
            }}
          >
            <Text style={{ color: "grey", fontWeight: "500" }}>Details</Text>
            <View style={{ flex: 1, justifyContent: "center" }}>
              <Text numberOfLines={2} ellipsizeMode="tail">
                {transaction.description}
              </Text>
            </View>
          </View>
          <View
            style={{
              borderTopWidth: 1,
              borderColor: "#525252",
              flex: 1,
              alignItems: "center",
              display: "flex",
            }}
          >
            <TouchableOpacity
              style={{
                paddingHorizontal: "30%",
                width: "100%",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-evenly",
                flex: 1,
                height: "90%",
              }}
              onPress={() => navigation.navigate("addtransaction", {
                transaction: transaction,
                userId: userId,
                chat: chat,
                isEdit: true,
                yougave:
                  (userId === chat.userIds[0] &&
                    transaction.transactionAmt < 0) ||
                  (userId === chat.userIds[1] &&
                    transaction.transactionAmt >= 0),
              })}
            >
              <AntDesign name="edit" color="black" size={20} />
              <Text
                style={{
                  marginLeft: 7,
                  height: "100%",
                  alignSelf: "center",
                  fontSize: 17,
                  textAlignVertical: "center",
                  textAlign: "center",
                  fontWeight: "500",
                }}
              >
                EDIT ENTRY
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <View
        style={{
          position: "absolute",
          bottom: 0,
          width: "100%",
          height: "10%",
          flexDirection: "row",
          borderWidth: 0,
          elevation: 2,
          alignItems: "center",
          paddingTop: 10,
        }}
      >
        <TouchableOpacity
          style={{
            paddingHorizontal: "25%",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-evenly",
            flex: 1,
            width: "100%",
            height: "80%",
            marginHorizontal: 15,
            borderColor: "red",
            borderWidth: 2,
            borderRadius: 8,
          }}
          onPress={() => {
            setModalVisible(true);
          }}
        >
          <AntDesign name="delete" color="red" size={18} />
          <Text
            style={{
              color: "red",
              height: "100%",
              alignSelf: "center",
              fontSize: 16,
              textAlignVertical: "center",
              textAlign: "center",
              fontWeight: "500",
            }}
          >
            DELETE ENTRY
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
