import { useContext, useEffect, useState } from 'react';
import { Button, Text, View, StyleSheet, FlatList, TextInput, TouchableOpacity, TouchableHighlight, ToastAndroid } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome';
import { auth, db } from '../firebaseConfig';
import { AuthContext, AuthDispatchContext } from '../components/AuthContext';
import { doc, addDoc, getDoc, collection } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { getOtherUserName, getUser } from '../Utils';


const DATA = [
  {
    chat_id: 12312312,
    userIds: [1, 2],
    Net_amount: 1000,
  },
  {
    chat_id: 12312314,
    userIds: [1, 3],
    Net_amount: 1000
  },
  {
    chat_id: 12312313,
    userIds: [4, 1],
    Net_amount: -1000,
  },
  {
    chat_id: 12312310,
    userIds: [5, 1],
    Net_amount: -700,
  }

]

const UserList = [
  {
    userId: 1,
    userName: 'Anukul'
  },
  {
    userId: 2,
    userName: 'Adbul'
  },
  {
    userId: 3,
    userName: 'Anil'
  },
  {
    userId: 4,
    userName: 'Kumar'
  },
  {
    userId: 5,
    userName: 'Subham'
  },


]


const myUserId = 1;

const searchIcon = <Icon name="search" size={20} color="black" />;
const rupeeIcon = <Icon name="rupee" size={15} color="black" />;


function giveUserName(userIds) {
  for (let index = 0; index < 2; index++) {
    const element = userIds[index];
    if (element != myUserId) {
      const name = UserList.map((item) => {
        if (item.userId == element) {
          return item.userName
        }
      })
      return name
    }
  }
}

var getAmount = 0;
var giveAmount = 0;

const getChats = async (user) => {
  try {
    const chatIds = user.chatIds;
    console.log("ChatIds: ", chatIds);
    // Use map to create an array of promises
    const promises = chatIds.map(async (id) => {
      const data = await getDoc(doc(db, 'chats', id));
      const userName = await getOtherUserName(user.userId, data.data().userIds);
      var result = data.data();
      result.chatName = userName;
      console.log("Name: ", userName);

      return result; // Return the data to be collected later
    });

    // Use Promise.all to await all promises to resolve
    const result = await Promise.all(promises);
    
    console.log("Result:", result);
    return result;
  } catch (e){
    return [];
  }
}

export const HomeScreen = ({navigation}) => {
  const {auth} = useContext(AuthContext);
  const authDispatch = useContext(AuthDispatchContext);
  const userId = auth.currentUser.uid;
  // console.log("Home Screen", auth);
  // ToastAndroid.show(auth.currentUser.email, ToastAndroid.SHORT, ToastAndroid.CENTER);
  
  const [user, setUser] = useState(null);
  const [chats, setChats] = useState(null);

  const Item = ({ chat }) => (
    <TouchableOpacity style={styles.item} onPress={() => navigation.navigate('chat', {
      userId: userId, 
      otherUserId: userId===chat.userIds[0]?chat.userIds[1]:chat.userIds[0],
      chatId: chat.chatId
    })}>
      <Text style={styles.title}>{chat.chatName}</Text>
      <View style={{ marginRight: 7 }}>
        <Text style={{}}>You will {chat.netAmt > 0 ? "get" : "give"}</Text>
        <Text style={{ color: chat.netAmt <= 0 ? 'red' : 'green', textAlign:'center', fontWeight:'bold' }}>{rupeeIcon}{Math.abs(chat.netAmt)}</Text>
      </View>
  
    </TouchableOpacity>
  );
  
  useEffect(() => {
    async function getChatsHere() {
      const tUser = await getUser(userId);
      const tChats = await getChats(tUser);
      giveAmount = getAmount = 0;
      
      tChats.forEach((chat) => {
        if (chat.netAmt > 0) {
          getAmount += chat.netAmt
        }
        else {
          giveAmount += chat.netAmt
        }
      })
      getAmount = getAmount.toFixed(2);
      giveAmount = giveAmount.toFixed(2);
      setUser(tUser);
      setChats(tChats);
    }
    getChatsHere();
  }, [userId]);

  return (
    <View style={styles.homePageScreen}>
      <View style={styles.bigContainer}>
        {/* <View style={styles.top_header}>
          <Text style={{ color: 'white',fontSize:20 }}>ANUKUL</Text>
        </View> */}
        <View style={styles.container}>
          <View style={{ borderRightWidth: 1, width: '45%', padding: 2 }}>
            <Text style={{ fontSize: 20 }}>You will give</Text>
            <Text style={{ color: 'red',fontWeight:'bold',fontSize: 20 }}>{rupeeIcon} {Math.abs(giveAmount)}</Text>
          </View>
          <View style={{ width: '40%', padding: 2 }}>
            <Text style={{ fontSize: 20 }}>You will get</Text>
            <Text style={{ color: 'green',fontWeight:'bold',fontSize: 20}}> {rupeeIcon} {Math.abs(getAmount)}</Text>
          </View>
        </View>
      </View>


      <View style={styles.searchBox}>
        <Text>{searchIcon}</Text>
        <TextInput style={{ height: 25, width: '90%', fontSize: 16, padding: 3 }} placeholder='Search your customer'></TextInput>
      </View>
      

      <FlatList
        data={chats}
        renderItem={({ item }) => {
          return <Item chat={item} />;
        }}

        keyExtractor={item => item.chatId}
        style={{height:'50%'}}
      /> 

      <View style={{width:'100%',flex:1,flexDirection:'row',marginBottom:10, justifyContent:'space-evenly',alignItems:'center'}}>
        <TouchableOpacity style={{ width: '40%', backgroundColor: '#398EEA', height: 45, borderRadius: 10,padding:5 }}>

        <Text style={{ padding: 5, textAlign: 'center', color: 'black'}}>Add Person</Text>

        </TouchableOpacity>
        <TouchableOpacity style={{ width: '40%', backgroundColor: 'green', height: 45, borderRadius: 10,padding:5}} onPress={()=>{
          // navigation.navigate('addperson');
            signOut(auth);
            authDispatch({type: 'SIGN_OUT'});
          }}>

          <Text style={{ padding: 5, textAlign: 'center', color: 'black'}}>LOG OUT</Text>
          {/* <Text style={{ padding: 5, textAlign: 'center', color: 'black' }} onPress={()=>navigation.navigate('settleTransaction')}>Settle Transactions</Text> */}

        </TouchableOpacity>
      </View>
    </View>
  )
}
const styles = StyleSheet.create({
  homePageScreen: {
    width: '100%',
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'space-between'
  },
  bigContainer: {
    width: '100%',
    height: '20%',
    backgroundColor: '#398EEA',
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center'

  },
  container: {
    width: '80%',
    height: 80,
    backgroundColor: 'white',
    marginTop: 30,
    borderRadius: 20,
    padding: 5,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  searchBox: {
    width: '95%',
    marginHorizontal: '2.5%',
    backgroundColor: 'white',
    height: '6%',
    padding: 4,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center'
  },
  item: {
    backgroundColor: 'white',
    width: '95%',
    height: 80,
    padding: 2,
    marginHorizontal: '2.5%',
    marginTop: '2%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderRadius: 10,
    alignItems: 'center'
  },
  title: {
    marginLeft: 7,
    fontSize: 20,
    color: 'black'
  }
})


