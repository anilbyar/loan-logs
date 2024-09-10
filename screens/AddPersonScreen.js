import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  getDocs,
  limit,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  ToastAndroid,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { db } from "../firebaseConfig";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../components/AuthContext";
import { CustomProgressBar } from "../components/CustomProgressBar"

const addChat = async (userId1, userId2) => {
  const ref = doc(collection(db, "chats"));
  console.log("Chat ref: ", ref);
  await setDoc(ref, {
    chatId: ref.id,
    netAmt: 0,
    userIds: [userId1, userId2],
  });
  await updateDoc(doc(db, "users", userId1), {
    chatIds: arrayUnion(ref.id),
  });
  await updateDoc(doc(db, "users", userId2), {
    chatIds: arrayUnion(ref.id),
  });
  return ref.id;
};

export const AddPersonScreen = ({ route, navigation }) => {
  const { auth } = useContext(AuthContext);
  const userId = auth.currentUser.uid;
  const [users, setUsers] = useState(null);
  const [dummyName, setDummyName] = useState("");
  const [inProgress, setInProgress] = useState(false);
  const myUserId = 1;
  console.log("APS UserId: ", userId);
  const searchIcon = <Icon name="search" size={20} color="black" />;
  const userIcon = <Icon name="user" size={30} color="black" />;
  const sideArrowIcon = <Icon name="arrow-right" size={30} color="black" />;

  const handleQueryChange = (event) => {
    event.persist();
    const queryText = event.nativeEvent.text.trim();
    console.log("QT: ", queryText);
    const queryUser = async () => {
      const docRef = query(
        collection(db, "users"),
        where("name", ">=", queryText),
        where("name", "<=", queryText + "\uf8ff"),
        where("isDummy","==", false),
        limit(10)
      );
      var tempUsers = [];
      (await getDocs(docRef)).forEach((queryData) => {
        tempUsers.push(queryData.data());
      });
      tempUsers = tempUsers.map((x) => {
        return x;
      });
      setUsers(tempUsers);
    };
    queryUser();
    console.log("Queried users: ", users);
  };

  const addDummyUserHandler = () => {
    // TODO add logic
    setInProgress(true);
    console.log("AddDummyUser dummyName: ", dummyName);
    const dummyUserCreator = async () => {
      const dummyUserRef = doc(collection(db, "users"));
      addChat(userId, dummyUserRef.id);
      await setDoc(dummyUserRef, {
        userId: dummyUserRef.id,
        name: dummyName,
        isDummy: true,
      });
    };
    dummyUserCreator().then((result) => {
      ToastAndroid.show(
        "Chat with " + dummyName + " created.",
        ToastAndroid.SHORT
      );
      setInProgress(false);
      navigation.goBack();
    });
  };

  const onAddHandler = (user) => {
    if (userId == user.userId) {
      ToastAndroid.show(
        "Chat can't be created with same user",
        ToastAndroid.SHORT
      );
      return;
    }
    const isChatValidToCreate = async () => {
      console.log("Check: ", userId, user.userId);
      const querySnapshot = await getDocs(
        query(
          collection(db, "chats"),
          where("userIds", "in", [
            [userId, user.userId],
            [user.userId, userId],
          ])
        )
      );
      var flag = true;
      // check if chat already exist
      querySnapshot.forEach((doc) => {
        console.log("check: ", doc.data());
        flag = false;
      });
      console.log(flag);
      return flag;
    };
    setInProgress(true);
    var checkFlag = false;
    isChatValidToCreate(userId, user.userId).then((data) => {
      checkFlag = data;
      console.log("Res: ", checkFlag);
      if (!checkFlag) {
        ToastAndroid.show(
          "Chat with " + user.name + " already exit",
          ToastAndroid.SHORT
        );
        setInProgress(false);
        navigation.goBack();
      } else {
        addChat(userId, user.userId).then((newChatId) => {
          ToastAndroid.show(
            "Chat with " + user.name + " created.",
            ToastAndroid.SHORT
          );
          console.log("ChatId: ", newChatId);
          setInProgress(false);
          navigation.goBack();
        });
      }
    });
  };

  // this is user item
  const Item = ({ user }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => {
        onAddHandler(user);
      }}
    >
      <View
        style={{
          width: "80%",
          height: 60,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-evenly",
          // borderWidth: 1
        }}
      >
        <View
          style={{
            backgroundColor: "#398EEA",
            width: "12%",
            height: 40,
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 20,
            // borderWidth: 1
          }}
        >
          {userIcon}
        </View>
        <View
          style={{
            width: "67%",
            height: 50,
            justifyContent: "space-between",
            alignItems: "center",
            // borderWidth: 1
          }}
        >
          <Text
            style={{
              fontWeight: "bold",
              fontSize: 20,
              alignSelf: "flex-start",
            }}
          >
            {user.name}
          </Text>
          <Text style={{ fontStyle: "italic", alignSelf: "flex-start" }}>
            {user.email}
          </Text>
        </View>
      </View>

      <View
        style={{
          width: "15%",
          height: 30,
          backgroundColor: "green",
          borderRadius: 10,
          padding: 4,
          marginRight: "2%",
          alignItems: "center",
        }}
      >
        <Text style={{ color: "white", fontWeight: "bold" }}>+ADD</Text>
      </View>
    </TouchableOpacity>
  );

  // user item ends here
  return (
    <View style={styles.addPersonScreen}>
      <CustomProgressBar visible = {inProgress}/>
      {/* this is search box in addperson */}
      <View
        style={{
          width: "90%",
          height: 60,
          marginBottom: 4,
          flexDirection: "row",
          alignItems: "center",
          marginHorizontal: "5%",
          borderWidth: 2,
          borderRadius: 10,
          justifyContent: "space-evenly",
        }}
      >
        <TextInput
          style={styles.searchBox}
          onChange={handleQueryChange}
          placeholder="Search Your Person "
        ></TextInput>
        <Text>{searchIcon}</Text>
      </View>
      {/*  */}

      {/* this is adding dummy person */}

      <View style={styles.addDummy}>
        <View
          style={{
            width: "80%",
            flexDirection: "row",
            justifyContent: "space-evenly",
            alignItems: "center",
          }}
        >
          <View
            style={{
              backgroundColor: "red",
              width: "15%",
              height: 40,
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 20,
            }}
          >
            {userIcon}
          </View>
          <TextInput
            placeholder="Add Dummy Customer"
            style={{ width: "70%", padding: 4 }}
            onChangeText={setDummyName}
          ></TextInput>
        </View>
        <TouchableOpacity
          style={{ marginRight: 10 }}
          onPress={addDummyUserHandler}
        >
          {sideArrowIcon}
        </TouchableOpacity>
      </View>
      {/*  */}

      {/* this is the list of existing customers in the app */}
      <FlatList
        data={users}
        renderItem={({ item }) => {
          return <Item user={item} />;
        }}
        keyExtractor={(item) => item.userId}
        style={{ backgroundColor: "white" }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  addPersonScreen: {
    width: "100%",
    flex: 1,
  },
  searchBox: {
    width: "90%",
    padding: 4,
    height: 50,
  },
  addDummy: {
    width: "100%",
    height: 60,
    backgroundColor: "white",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
  },
  item: {
    width: "100%",
    height: 60,
    marginVertical: 4,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "grey",
  },
});
