import { StyleSheet, Text, ToastAndroid, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { HomeScreen } from './screens/HomeScreen';
import { AddTransaction } from './screens/AddTransaction';
import { LoginScreen } from './screens/LoginScreen';
import { ChatScreen } from './screens/ChatScreen';
import { AddPersonScreen } from './screens/AddPersonScreen';
import { TransactionDetailScreen } from './screens/TransactionDetailScreen';
import { SettleTransaction } from './screens/SettleTransaction';
import { SignUpScreen } from './screens/SignUpScreen';
import { AuthContext, AuthDispatchContext } from './components/AuthContext';
import { useMemo, useReducer, useState } from 'react';
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import * as SecureStore from 'expo-secure-store';
import { LoadingScreen } from './screens/LoadingScreen';
import { getitem } from './Utils';

const Stack = createNativeStackNavigator();

export default function App() {
  const [authState, authDispatch] = useReducer(
    (prevState, action) => {
      switch (action.type) {
        case 'SIGN_IN':
          return {
            ...prevState,
            auth: action.auth,
            isSignout: false
          }
        case 'SIGN_OUT':
          return {
            ...prevState,
            auth: null,
            isSignout: true
          }
        case 'RESTORE_TOKEN':
          return {
            ...prevState,
            auth: action.auth,
          }
        case 'LOADING':
          return {
            ...prevState,
            isLoading: action.isLoading
          }
      }
    }, 
    {
      auth: getAuth(),
      isSignout: true,
      isLoading: true
    }
  )
  console.log("AuthState", authState);
  useState(async ()=>{
    authDispatch({type: 'LOADING', isLoading: true})
    console.log("1");
    getitem('auth')
    .then((value)=>{
      value = null;
      console.log("3", JSON.parse(value));
      if (value==null) {
        authDispatch({type: 'RESTORE_TOKEN', auth: getAuth()});
      } else {
        authDispatch({type: 'RESTORE_TOKEN', auth: getAuth()});
        authDispatch({type: 'SIGN_IN', auth: JSON.parse(value)});
      }
    })
    .catch((error)=>{
      console.log("Error finding credentials", error.message);
      authDispatch({type: 'RESTORE_TOKEN', auth: getAuth()});
    })
    authDispatch({type: 'LOADING', isLoading: false})
  }, []);

  const authContext = useMemo(
    () => ({
        signUp: async({email, password}) => {
          createUserWithEmailAndPassword(getAuth(), email, password)
          .then((userCredential) => {
            // Signed up 
            const ref = doc(database, 'users', currUser.uid);
            ToastAndroid.show('Logged in', ToastAndroid.LONG, ToastAndroid.CENTER);
            authDispatch({type:'SIGN_UP', auth: getAuth()});
          })
          .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            if (errorCode=='auth/invalid-credential') ToastAndroid.show("Invalid email or password", ToastAndroid.LONG, ToastAndroid.CENTER);
            else ToastAndroid.show(errorMessage, ToastAndroid.LONG, ToastAndroid.CENTER);
            console.log(3, error);
            // ..
          });
      },
      signOut: async () => {
        signOut(getAuth());
        authDispatch({type: 'SIGN_OUT'});
      },
    })
  )

  return (
    <AuthContext.Provider value={authState}>
      <AuthDispatchContext.Provider value = {authDispatch}>

        <NavigationContainer>
          <Stack.Navigator
          >
            {
              authState.isLoading ? (
                <Stack.Screen
                  name='loading'
                  component={LoadingScreen}
                  options={{headerShown: false}}
                />
              ) : (
                authState.isSignout ? (
                  <>
                    <Stack.Screen
                      name = 'login'
                      component={LoginScreen}
                      options={{headerShown: false}}
                      />
                    <Stack.Screen
                      name = 'signup'
                      component={SignUpScreen}
                      options={{headerShown: false}}
                    />
                  </>
                ) : (
                  <>
                    <Stack.Screen
                      name = 'home'
                      component={HomeScreen}
                      // options={{headerShown: false}}
                      options={{title: authState.auth.currentUser.email}}
                    />
                    <Stack.Screen name="chat" component={ChatScreen} />
                    <Stack.Screen name="addtransaction" component={AddTransaction} />
                    <Stack.Screen name="addperson" component={AddPersonScreen} />
                    <Stack.Screen
                      name="transactiondetail"
                      component={TransactionDetailScreen}
                      options={{
                        title: "Entry Details",
                        headerStyle: {
                          backgroundColor: "#001eff",
                        },
                        headerTintColor: "#fff",
                      }}
                    />
                    <Stack.Screen name="settleTransaction" component={SettleTransaction} />
                  </>
                )
              )
            }
          </Stack.Navigator>
        </NavigationContainer>
      </AuthDispatchContext.Provider>
    </AuthContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
