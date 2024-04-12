import { useState } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome';


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
    userName: 'Anukul',
    phoneNumber: '12312321'
  },
  {
    userId: 2,
    userName: 'Adbul',
    phoneNumber: '12312321'
  },
  {
    userId: 3,
    userName: 'Anil',
    phoneNumber: '12312321'
  },
  {
    userId: 4,
    userName: 'Kumar',
    phoneNumber: '12312321'
  },
  {
    userId: 5,
    userName: 'Subham',
    phoneNumber: '12312321'
  },


]


const myUserId = 1
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



export const SettleTransaction = ({ navigation }) => {


  const [selectedChats, setSelectedChats] = useState([]);


  const userIcon = <Icon name="user" size={30} color="black" />;


  const handlePress = (id) => {
    // setSelectedChat(prevSelectedChat => prevSelectedChat === id ? null : id);
    if (selectedChats.includes(id)) {
      setSelectedChats(prevSelectedChats => prevSelectedChats.filter(chat_id => chat_id !== id));
    } else {
      setSelectedChats(prevSelectedChats => [...prevSelectedChats, id]);
    }
  }
 function isSelected(id){
  if(selectedChats.includes(id)){
    return true;
  }
  else{
    return false;
  }
 }


// this is user item
const Item = ({ userIds, amount, isSelected, onPress }) => (
  <TouchableOpacity style={styles.item} onPress={onPress}>
    <View style={{ width: '50%', height: 60, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly' }}>
      <View style={{ backgroundColor: '#398EEA', width: '20%', height: 40, justifyContent: 'center', alignItems: 'center', borderRadius: 20 }}>{userIcon}</View>
      <View style={{ width: '67%', height: 50, justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={{ fontWeight: 'bold', fontSize: 20 }}>{giveUserName(userIds)}</Text>
        <Text style={amount < 0 ? { color: 'red', textAlign: 'center', fontWeight: 'bold' } : { color: 'green', textAlign: 'center', fontWeight: 'bold' }}>{Math.abs(amount)}</Text>
      </View>
    </View>

    <View style={isSelected ? { width: '30%', height: 40, borderRadius: 10, padding: 4, marginRight: '2%', alignItems: 'center', backgroundColor: 'green' } : { width: '30%', height: 40, borderRadius: 10, padding: 4, marginRight: '2%', backgroundColor: 'teal', alignItems: 'center' }}>
      <Text style={{ color: 'white', fontSize: 20, textAlign: 'center' }} >{isSelected ? 'Selected' : '+Select'}</Text>
    </View>
  </TouchableOpacity>
);
// user item ends here

return (
  <View style={styles.addPersonScreen}>




    {/* this is the list of existing customers in the app */}
    <FlatList
      data={DATA}
      renderItem={({ item }) => <Item amount={item.Net_amount} userIds={item.userIds} onPress={() => handlePress(item.chat_id)} isSelected={isSelected(item.chat_id)} />}
      keyExtractor={item => item.chat_id}
      style={{ backgroundColor: 'white' }}

    />

    <TouchableOpacity style={{ width: '100%', backgroundColor: 'teal', height: '8%', marginBottom: 10, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontSize: 30, color: 'white', fontWeight: 'bold' }}>Settle</Text>
    </TouchableOpacity>

  </View>
)
}

const styles = StyleSheet.create({
  addPersonScreen: {
    width: '100%',
    flex: 1,

  },
  searchBox: {
    width: '90%',
    padding: 4,
    height: 50
  },
  addDummy: {
    width: '100%',
    height: 60,
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  item: {
    width: '100%',
    height: 60,
    marginVertical: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'grey'
  }
})