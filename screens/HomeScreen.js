import { useCallback, useContext, useEffect, useState } from "react";
import {
  Button,
  Text,
  View,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  TouchableHighlight,
  ToastAndroid,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { useFocusEffect } from "@react-navigation/native";
import { auth, db } from "../firebaseConfig";
import { AuthContext, AuthDispatchContext } from "../components/AuthContext";
import { doc, addDoc, getDoc, collection } from "firebase/firestore";
import { deleteitem, getitem, getOtherUserName, getUser, redGreen } from "../Utils";
import { CustomProgressBar } from "../components/CustomProgressBar";

const searchIcon = <Icon name="search" size={20} color="black" />;
const rupeeIcon = <Icon name="rupee" size={15} color="black" />;

function giveUserName(userIds) {
  for (let index = 0; index < 2; index++) {
    const element = userIds[index];
    if (element != myUserId) {
      const name = UserList.map((item) => {
        if (item.userId == element) {
          return item.userName;
        }
      });
      return name;
    }
  }
}

var getAmount = 0;
var giveAmount = 0;

const getChats = async (user) => {
  try {
    const chatIds = user.chatIds;
    // Use map to create an array of promises
    const promises = chatIds.map(async (id) => {
      const data = await getDoc(doc(db, "chats", id));
      const userName = await getOtherUserName(user.userId, data.data().userIds);
      var result = data.data();
      result.chatName = userName;

      return result; // Return the data to be collected later
    });

    // Use Promise.all to await all promises to resolve
    const result = await Promise.all(promises);

    console.log("Result:", result);
    return result;
  } catch (e) {
    return [];
  }
};

export const HomeScreen = ({ navigation }) => {
  const { auth } = useContext(AuthContext);
  const authDispatch = useContext(AuthDispatchContext);
  const userId = auth.currentUser.uid;
  const [customer, setCustomer] = useState("");
  const [allChats, setAllChats] = useState([]);
  const [chats, setChats] = useState([]);
  const [inProgress, setInProgress] = useState(false);


  const Item = ({ chat }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() =>
        navigation.navigate("chat", {
          userId: userId,
          otherUserId:
            userId === chat.userIds[0] ? chat.userIds[1] : chat.userIds[0],
          prevChat: chat,
        })
      }
    >
      <Text style={styles.title}>{chat.chatName}</Text>
      <View style={{ marginRight: 7 }}>
        <Text style={{}}>
          You will{" "}
          {redGreen(userId, chat.userIds, chat.netAmt) ? "give" : "get"}
        </Text>
        <Text
          style={{
            color: redGreen(userId, chat.userIds, chat.netAmt)
              ? "green"
              : "red",
            textAlign: "center",
            fontWeight: "bold",
          }}
        >
          {rupeeIcon}
          {Math.abs(chat.netAmt)}
        </Text>
      </View>
    </TouchableOpacity>
  );
  useFocusEffect(
    useCallback(() => {
      setInProgress(true);
      async function getChatsHere() {
        const tUser = await getUser(userId);
        const tChats = await getChats(tUser);
        giveAmount = getAmount = 0;

        tChats.forEach((chat) => {
          if (redGreen(userId, chat.userIds, chat.netAmt)) {
            giveAmount += chat.netAmt;
          } else {
            getAmount += chat.netAmt;
          }
        });
        getAmount = getAmount.toFixed(2);
        giveAmount = giveAmount.toFixed(2);
        setInProgress(false);
        setAllChats(tChats);
        setChats(tChats);
      }
      getChatsHere();
    }, [])
  );

  useEffect(() => {
    console.log("Filtered chats: ", customer, " => ", allChats.filter((chat) => {
      return chat.chatName.toLowerCase().includes(customer.toLowerCase());
    }));
    setChats(allChats.filter((chat) => {
      return chat.chatName.toLowerCase().includes(customer.toLowerCase());
    }));
  }, [customer, allChats])

  // getitem("auth")
  // .then((value) => {
  //   console.log("3", JSON.parse(value));
  // })
  // .catch((error) => {
  //   console.log("Error finding credentials", error.message);
  // });


  return (
    <View style={styles.homePageScreen}>
      <CustomProgressBar visible={inProgress}/>
      <View style={styles.bigContainer}>
        <View style={styles.container}>
          <View style={{ borderRightWidth: 1, width: "45%", padding: 2 }}>
            <Text style={{ fontSize: 20 }}>You will give</Text>
            <Text style={{ color: "green", fontWeight: "bold", fontSize: 20 }}>
              {rupeeIcon} {Math.abs(giveAmount)}
            </Text>
          </View>
          <View style={{ width: "40%", padding: 2 }}>
            <Text style={{ fontSize: 20 }}>You will get</Text>
            <Text style={{ color: "red", fontWeight: "bold", fontSize: 20 }}>
              {" "}
              {rupeeIcon} {Math.abs(getAmount)}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.searchBox}>
        <Text>{searchIcon}</Text>
        <TextInput
          style={{ height: 25, width: "90%", fontSize: 16, padding: 3 }}
          placeholder="Search your customer"
          onChangeText={setCustomer}
        ></TextInput>
      </View>
      

      <FlatList
        data={chats}
        renderItem={({ item }) => {
          return <Item chat={item} />;
        }}
        keyExtractor={(item) => item.chatId}
        style={{ height: "50%" }}
      />

      <View
        style={{
          width: "100%",
          flex: 1,
          flexDirection: "row",
          marginBottom: 10,
          justifyContent: "space-evenly",
          alignItems: "center",
        }}
      >
        <TouchableOpacity
          style={{
            width: "40%",
            backgroundColor: "#398EEA",
            height: 45,
            borderRadius: 10,
            padding: 5,
          }}
          onPress={() => navigation.navigate("addperson", { userId: userId })}
        >
          <Text style={{ padding: 5, textAlign: "center", color: "black" }}>
            Add Person
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            width: "40%",
            backgroundColor: "green",
            height: 45,
            borderRadius: 10,
            padding: 5,
          }}
          onPress={() => {
            // navigation.navigate('addperson');
            // signOut(auth);
            deleteitem("auth").then(() => {
              authDispatch({ type: "SIGN_OUT" });
            });
          }}
        >
          <Text style={{ padding: 5, textAlign: "center", color: "black" }}>
            LOG OUT
          </Text>
          {/* <Text style={{ padding: 5, textAlign: 'center', color: 'black' }} onPress={()=>navigation.navigate('settleTransaction')}>Settle Transactions</Text> */}
        </TouchableOpacity>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  homePageScreen: {
    width: "100%",
    flex: 1,
    backgroundColor: "white",
    justifyContent: "space-between",
  },
  bigContainer: {
    width: "100%",
    height: "20%",
    backgroundColor: "#398EEA",
    marginBottom: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    width: "80%",
    height: 80,
    backgroundColor: "white",
    marginTop: 30,
    borderRadius: 20,
    padding: 5,
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  searchBox: {
    width: "95%",
    marginHorizontal: "2.5%",
    backgroundColor: "white",
    height: "6%",
    padding: 4,
    borderWidth: 1,
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  item: {
    backgroundColor: "white",
    width: "95%",
    height: 80,
    padding: 2,
    marginHorizontal: "2.5%",
    marginTop: "2%",
    flexDirection: "row",
    justifyContent: "space-between",
    borderWidth: 1,
    borderRadius: 10,
    alignItems: "center",
  },
  title: {
    marginLeft: 7,
    fontSize: 20,
    color: "black",
  },
});
