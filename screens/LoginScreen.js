import { auth, database } from '../firebaseConfig'
import { getAuth, sendPasswordResetEmail, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { collection, doc, getDoc } from 'firebase/firestore';
import { useState } from 'react'
import { View, StyleSheet, TextInput, Button, Pressable, Text, Image, TouchableOpacity, ToastAndroid, Modal, KeyboardAvoidingView, ScrollView } from 'react-native'

const isRegistered = (number) => {
  return false;
}



export const LoginScreen = ({navigation}) => {
  const [number, setnumber] = useState('');
  const [btnstate, setBtnstate] = useState(false);
  const [email, setemail] = useState('');
  const [password, setpassword] = useState('');
  const [user, setUser] = useState(null);
  const [forgetPassword, setForgetPassword] = useState(false);
  console.log(auth.currentUser);


  async function getName(){
    const userRef = doc(database, 'users', auth.currentUser.uid);
    const docSnap = await getDoc(userRef);
    if (docSnap.exists()){
      const data = docSnap.data();
      console.log("My data: ", data['name']);
      return data['name'];
    } else {
      raise
    }
    return 'None';
  }

  async function login(){
    // disable btn
    setBtnstate(true);

    // signin
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in 
        getName()
          .then((name)=>{
            ToastAndroid.show('Logged in as '+name, ToastAndroid.SHORT, ToastAndroid.CENTER);
            navigation.navigate('home')
          })
          .catch((error)=> {
            ToastAndroid.show(error.message, ToastAndroid.SHORT, ToastAndroid.CENTER);
            signOut(auth)
          })
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        if (errorCode=='auth/invalid-credential') ToastAndroid.show("Invalid email or password", ToastAndroid.SHORT, ToastAndroid.CENTER);
        else ToastAndroid.show(errorMessage, ToastAndroid.SHORT, ToastAndroid.CENTER);
        console.log(4, error);
      });

    // remove this after test
    setBtnstate(false);
  }
  async function resetPassword(){
    sendPasswordResetEmail(auth, email)
      .then(()=> {
        ToastAndroid.show("Reset link sent to "+email, ToastAndroid.SHORT, ToastAndroid.CENTER);
      })
  }

  return (
    <KeyboardAvoidingView behavior='padding' style={[styles.container, {paddingVertical: 0, }]}>
      <Modal
        animationType="fade"
        transparent={true}
        visible={forgetPassword}
        onRequestClose={() => {
          setForgetPassword(!forgetPassword);
        }}>
          <KeyboardAvoidingView behavior='padding' style={{paddingVertical: 0, justifyContent: 'center', height: '100%', backgroundColor:'#e7f4ed', }}>
              <View style = {{borderRadius: 9, paddingVertical: 10, width: '85%', alignSelf: 'center', elevation: 10, borderWidth: 0, bottom: 0, backgroundColor: '#e7f4ed', alignItems: 'center', justifyContent: 'center'}}>
                <View style ={{paddingVertical: 0, width: '80%'}}>
                  <TextInput
                    style = {[styles.input]}
                    editable = {!btnstate}
                    onChangeText={setemail}
                    placeholder='Email'
                    />
                  <TouchableOpacity style={[styles.button, {marginTop: 10, marginBottom: 12}]} onPress={() => {
                    resetPassword();
                    setForgetPassword(false);
                  }}>
                    <Text>Send Reset Link</Text>
                  </TouchableOpacity>
                </View>
              </View>
          </KeyboardAvoidingView>
      </Modal>
      <View style={[{width: '70%'}]}>
        <Image
          style={{
              width: 66,
              height: 58,
              alignSelf: 'center'
            }}
          source={require('../assets/favicon.png')}
        />
        <TextInput
          style = {[styles.input,]}
          onChangeText={setemail}
          placeholder='Email'
          />
        <TextInput
          style = {[styles.input,]}
          onChangeText={setpassword}
          secureTextEntry={true}
          placeholder='Password'
          />
        <TouchableOpacity style={[styles.button, ]} disabled={btnstate} onPress={() => {
          login();
        }}>
          <Text>Login</Text>
        </TouchableOpacity>
        <Pressable style={[{position:'absolute', right: 0, bottom: 0}]} onPress={() => navigation.navigate('signup')}>
          <Text>Don't have an account</Text>
        </Pressable>
        <Pressable style={[{position:'absolute', left: 0, bottom: 0}]} onPress={
          () => {
            setForgetPassword(true);
          }
        }>
          <Text>Forget password</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  )
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e7f4ed',
  },
  input: {
    borderWidth: 1,
    marginVertical: 8,
    padding: 10,
    width: '100%',
    borderRadius: 5,
  },
  button: {
    alignContent: 'center',
    alignItems: 'center',
    backgroundColor: '#aaf2cb',
    padding: 8,
    width: '100%',
    marginBottom: '13%'
  }
})