import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome';



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



export const AddPersonScreen = ({ navigation }) => {
 const myUserId = 1

  const searchIcon = <Icon name="search" size={20} color="black" />;
  const userIcon = <Icon name="user" size={30} color="black" />;
  const sideArrowIcon = <Icon name="arrow-right" size={30} color="black" />;

  // this is user item
  const Item = ({ person }) => (
    <TouchableOpacity style={styles.item} onPress={() => alert('touched')}>
      <View style={{ width: '50%', height: 60, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly' }}>
        <View style={{ backgroundColor: '#398EEA', width: '20%', height: 40, justifyContent: 'center', alignItems: 'center', borderRadius: 20 }}>{userIcon}</View>
        <View style={{ width: '67%', height: 50, justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={{ fontWeight: 'bold', fontSize: 20 }}>{person.userName}</Text>
          <Text style={{ fontStyle: 'italic' }}>{person.phoneNumber}</Text>
        </View>
      </View>

      <View style={{ width: '15%', height: 30, backgroundColor: 'green', borderRadius: 10, padding: 4, marginRight: '2%', alignItems: 'center' }}>
        <Text style={{color:'white',fontWeight:'bold'}}>+ADD</Text>
      </View>
    </TouchableOpacity>
  );
  // user item ends here

  return (
    <View style={styles.addPersonScreen}>
      {/* this is search box in addperson */}
      <View style={{
        width: '90%', height: 60, marginBottom:4,flexDirection: 'row', alignItems: 'center', marginHorizontal: '5%', borderWidth: 2,
        borderRadius: 10, justifyContent: 'space-evenly'
      }}>
        <TextInput style={styles.searchBox} placeholder='Search Your Person '></TextInput>
        <Text>{searchIcon}</Text>
      </View>
      {/*  */}

      {/* this is adding dummy person */}

      <View style={styles.addDummy}>
        <View style={{ width: '50%', flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center' }}>

          <View style={{ backgroundColor: 'red', width: '20%', height: 40, justifyContent: 'center', alignItems: 'center', borderRadius: 20 }}>{userIcon}</View>
          <TextInput placeholder='Add New Customer' style={{width:'70%',padding:4}}></TextInput>
        </View>
        <Text>{sideArrowIcon}</Text>
      </View>
      {/*  */}


      {/* this is the list of existing customers in the app */}
      <FlatList
        data={UserList}
        renderItem={({ item }) => <Item person={item} />}
        keyExtractor={item => item.userId}
        style={{backgroundColor:'white'}}
      />

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
    backgroundColor:'white',
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
    alignItems:'center',
    borderBottomWidth:1,
    borderBottomColor:'grey'
  }
})