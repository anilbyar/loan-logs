import { collection, doc, getDoc, getDocs, query, Timestamp, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from "react-native"
import Icon from "react-native-vector-icons/dist/FontAwesome"
import { db } from "../firebaseConfig";
import { getUserName } from "../Utils";

const netAmount = 1000;

const userId = "atul11";
const idList = ["anil000", 'atul111'];
const userNameList = ['anil', 'atul'];

const TRANSACTION_LIST = [
  {
    tranId: '100',
    tranAmt: 1000,
    aboutTran: 'this is a message this is a message this is a message this is a message ',
    tranTime: '4:30 am',
    tranDate: '30 Apr 24',
    userName: 'atul',
    whoInitiated: false, //true for user1
    initiationByGave: true, //true if entered through you gave button
  },
  {
    tranId: '101',
    tranAmt: 1000,
    aboutTran: 'this is a message',
    tranTime: '4:30 am',
    tranDate: '30 Apr',
    userName: 'anil',
    whoInitiated: true,
    initiationByGave: true,
  },
  {
    tranId: '102',
    tranAmt: 2000,
    aboutTran: 'this is a message',
    tranTime: '4:30 am',
    tranDate: '30 Apr',
    userName: 'anil',
    whoInitiated: true,
    initiationByGave: true,
  },
  {
    tranId: '100',
    tranAmt: 1000,
    aboutTran: 'this is a message this is a message this is a message this is a message ',
    tranTime: '4:30 am',
    tranDate: '30 Apr 24',
    userName: 'atul',
    whoInitiated: false, //true for user1
    initiationByGave: true, //true if entered through you gave button
  },
  {
    tranId: '101',
    tranAmt: 1000,
    aboutTran: 'this is a message',
    tranTime: '4:30 am',
    tranDate: '30 Apr',
    userName: 'anil',
    whoInitiated: true,
    initiationByGave: true,
  },
  {
    tranId: '102',
    tranAmt: 2000,
    aboutTran: 'this is a message',
    tranTime: '4:30 am',
    tranDate: '30 Apr',
    userName: 'anil',
    whoInitiated: true,
    initiationByGave: true,
  }, {
    tranId: '100',
    tranAmt: 1000,
    aboutTran: 'this is a message this is a message this is a message this is a message ',
    tranTime: '4:30 am',
    tranDate: '30 Apr 24',
    userName: 'atul',
    whoInitiated: false, //true for user1
    initiationByGave: true, //true if entered through you gave button
  },
  {
    tranId: '101',
    tranAmt: 1000,
    aboutTran: 'this is a message',
    tranTime: '4:30 am',
    tranDate: '30 Apr',
    userName: 'anil',
    whoInitiated: true,
    initiationByGave: true,
  },
  {
    tranId: '102',
    tranAmt: 2000,
    aboutTran: 'this is a message',
    tranTime: '4:30 am',
    tranDate: '30 Apr',
    userName: 'anil',
    whoInitiated: true,
    initiationByGave: true,
  },
];


export const ChatScreen = ({ route, navigation }) => {
  // const rupeeIcon = <Icon name="rupee" size={30} color="#900" />
  const { userId, otherUserId, chatId } = route.params;
  const [transactionList, setTransactionList] = useState(null);
  console.log(userId, otherUserId);
  useEffect(() => {
    async function getTransactionList() {
      try {
        const querySnapshot = await getDocs(collection(db, 'chats', chatId, 'transactions'));
        const transactionList = [];
        querySnapshot.forEach(async (doc) => {
          console.log(doc.id, " => ", doc.data());
          const transactionData = doc.data();
          transactionData.addedByName = await getUserName(transactionData.addedBy);
          transactionList.push(transactionData);
        });
        transactionList = await Promise.all(
          transactionList.map(async (transaction) => {
            transaction.addedByName = await getUserName(transaction.addedBy);
            return transaction;
          })
        )
        console.log("Transaction List: ", transactionList);
        setTransactionList(transactionList);
      } catch (e) {
        console.log("Exception occured while fetching transaction list: ", e);
      }
    }
    getTransactionList();
  }, []);

  const Item = ({ transaction }) => (

    <TouchableOpacity style={styles.mainContainer} onPress={() => { alert('transaction detail page') }}>

      <View style={styles.dateContainer}>
        <Text style={styles.smallDate}>{transaction.timedate.seconds}</Text>
      </View>

      <View style={styles.container}>

        {/* container for who entered the transaction and about transaction */}
        <View style={styles.namePlusAbout}>
          {/* <View style={styles.userNameContainer}> */}
            <Text style={styles.userNameText}>{transaction.addedByName}</Text>
          {/* </View> */}

          <View style={styles.about}>
            <Text>{transaction.description}</Text>
          </View>
        </View>

        <View style={styles.youGaveContainer}>
          {/* use i gave container for user1 when (initiated by user1 through i gave) or (initiated by user2 and through i got) */}
          {((userId === transaction.addedBy && transaction.transactionAmt<0) || (otherUserId === transaction.addedBy && transaction.transactionAmt>=0))&& (
            <Text style={styles.youGaveText}>{Math.abs(transaction.transactionAmt)}</Text>)}
        </View>

        <View style={styles.youGotContainer}>
          {/* use i got container for user1 when (initiated by user1 through i got) or (initiated by user2 and through i gave) */}
          {((userId === transaction.addedBy && transaction.transactionAmt>=0) || (otherUserId === transaction.addedBy && transaction.transactionAmt<0)) && (
            <Text style={styles.youGotText}>{Math.abs(transaction.transactionAmt)}</Text>)
          }
        </View>

      </View>
    </TouchableOpacity>

  );


  return (
    <View style={{ height: '100%' }}>
      {/* top description */}



      {/* you will get give  */}

      <View style={[styles.topContainer, { height: '12%' }]}>
        <View style={[styles.netAmountContainer, { height: '80%' }]}>
          {/* divisions for you will get or give, if +ve user1 get*/}
          <View>
            {((netAmount >= 0 && userId == otherUserId) || (netAmount < 0 && userId == idList[1])) ? (
              <Text style={styles.topContainerText}>You will get</Text>
            ) : (
              <Text style={styles.topContainerText}>You will give</Text>
            )}
          </View>
          <View>
            {((netAmount >= 0 && userId == otherUserId) || (netAmount < 0 && userId == idList[1])) ? (
              <Text style={[styles.topContainerText, { color: 'green' }]}>{Math.abs(netAmount)}</Text>
            ) : (
              <Text style={[styles.topContainerText, { color: 'red' }]}>{Math.abs(netAmount)}</Text>
            )}
          </View>
        </View>
      </View>




      {/* labelText for ledger */}
      <View style={[styles.labelContainer, { height: '3%' },]}>
        <View style={[{ width: '50%' }]}><Text style={[styles.labelText]}>ENTRIES</Text></View>
        <View style={[{ width: '25%' }]}><Text style={[styles.labelText]}>YOU GAVE</Text></View>
        <View style={[{ width: '25%' }]}><Text style={[styles.labelText]}>YOU GOT</Text></View>

      </View>




      {/* transactions */}
      <View style={{ height: '73%', }}>

        <FlatList
          data={transactionList}
          renderItem={({ item }) => { return <Item transaction={item} /> }}
          keyExtractor={item => item.transactionId}
        />

      </View>

      {/* add transaction get give */}
      <View style={styles.enterTranContainer} >
        <TouchableOpacity style={[styles.button, { backgroundColor: 'red' }]} onPress={() => { alert('you gave page') }}>
          <Text style={{
            color: 'white',
            textAlign: 'center',
          }}> YOU GAVE</Text>

        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, { backgroundColor: 'green' }]} onPress={() => { alert('you got page') }}>
          <Text style={{
            color: 'white',
            textAlign: 'center',

          }}> YOU GOT</Text>

        </TouchableOpacity>
      </View>



    </View>
  )
}



const styles = StyleSheet.create({
  topContainer: {
    flexDirection: 'column',
    // marginVertical: 3,
    // borderWidth: 1,
    alignItems: 'center',
    backgroundColor: 'blue',

  },
  netAmountContainer: {
    flexDirection: 'row',
    marginTop: 10,
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: 'white',
    width: '60%',
  },
  topContainerText: {
    fontSize: 20,
    fontWeight: '700',
    textShadowColor: 'gray',
    elevation: 2,

  },
  labelContainer: {
    flexDirection: 'row',
    alignContent: 'center',
    alignItems: 'center',
    // paddingHorizontal: 5, // Add padding for spacing
    // marginBottom: 10, // Add margin at the bottom for spacing
    // borderWidth:1,
  },
  labelText: {
    fontSize: 10,
    color: 'gray',
    // borderWidth:1,
    // backgroundColor:'pink',
    textAlign: 'center',

  },
  mainContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    // backgroundColor: 'pink',
    marginVertical: 3,
    // borderWidth: 1,
    paddingHorizontal: 5,
    // height: '70%',
    // minHeight: 130, // Set minimum height to accommodate all items
  },
  namePlusAbout: {
    width: '50%',

  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    marginVertical: 1,
    paddingHorizontal: 5,
    // borderWidth: 1,
    borderRadius: 5,
    // height: 30, // Set a smaller height for the dateContainer
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    // marginVertical: 10,
    // borderWidth: 1,
    borderRadius: 10,
    height: 80,
    paddingBottom: 1,
    // paddingHorizontal: 20, // Add padding for spacing
    // elevation: 3, // Add elevation for Android
    shadowColor: 'black', // Add shadow properties for iOS
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

  },
  smallDate: {
    fontSize: 10,
    fontWeight: 'normal',
    textAlign: 'center',
    // backgroundColor:'green',
    // borderWidth: 1,
  },
  userNameContainer: {
    flex: 1,
    fontSize: 16,
    textAlign: 'left',
    padding: 0,
    paddingLeft: 2,
    // paddingTop: 1,
    borderWidth: 1,
    height: '30%',
    justifyContent: 'center',
  },
  userNameText: {
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'left',
    paddingLeft: 10,
    // borderWidth: 1,
  },
  about: {
    flex: 1,
    fontSize: 16,
    textAlign: 'left',
    paddingHorizontal: 10,
    justifyContent: 'center',
    // borderWidth: 1,
    height: '80%'
  },
  youGaveContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 0, 0, 0.1)',
    height: '100%',
    width: '25%',
    // borderWidth: 1,
  },
  youGaveText: {
    color: 'red',
    fontSize: 16,
    paddingHorizontal: 5,
  },
  youGotContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 255, 0, 0.1)',
    height: '100%',
    width: '25%',
    // borderWidth: 1,
  },
  youGotText: {
    color: 'green',
    fontSize: 16,
    paddingHorizontal: 5,
  },
  enterTranContainer: {
    // borderWidth: 1,
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    height: '15%',

  },
  button: {
    height: '60%',
    width: '40%',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 5,
  }
});


export default styles;
