import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import { HomeScreen } from './screens/HomeScreen';
import { AddTransaction } from './screens/AddTransaction';
import { LoginScreen } from './screens/LoginScreen';
import { ChatScreen } from './screens/ChatScreen';
import { AddPersonScreen } from './screens/AddPersonScreen';
import { TransactionDetailScreen } from './screens/TransactionDetailScreen';

const Stack = createNativeStackNavigator();


export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
      >
        <Stack.Screen
          name = 'Home'
          component={HomeScreen}
          options={{headerShown:false}}
        />
        <Stack.Screen
          name = 'login'
          component={LoginScreen}
        />
        <Stack.Screen
          name = 'chat'
          component={ChatScreen}
        />
        <Stack.Screen
          name = 'addtransaction'
          component={AddTransaction}
        />
        <Stack.Screen
          name = 'addperson'
          component={AddPersonScreen}
        />
        <Stack.Screen
          name = 'transactiondetail'
          component={TransactionDetailScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
