import { auth, database } from '../firebaseConfig'
import { createUserWithEmailAndPassword, deleteUser, signInWithEmailAndPassword } from 'firebase/auth';
import { collection, doc, setDoc } from 'firebase/firestore';
import { useCallback, useState } from 'react'
import { View, StyleSheet, TextInput, ToastAndroid, Pressable, Text, Image, TouchableOpacity } from 'react-native'


export const SignUpScreen = ({navigation}) => {
  const [userName, setuserName] = useState('');
  const [btnstate, setBtnstate] = useState(false);
  const [email, setemail] = useState('');
  const [password, setpassword] = useState('');
  const [user, setUser] = useState(null);
	const [uid, setUid] = useState('');


  function registerUser() {
		setBtnstate(true);
    createUserWithEmailAndPassword(auth, email, password)
		.then((userCredential) => {
			// Signed up 
				const currUser = userCredential.user;
				setUser(currUser);
				setUid(currUser.uid);
				console.log("uid", currUser.uid);
				console.log(5, currUser);
				const ref = doc(database, 'users', currUser.uid);
				const userRef = setDoc(ref, {
					name: userName,
					email: email,
					chatIds: [],
					userId: currUser.uid
				})
				ToastAndroid.show('Logged in as '+userName, ToastAndroid.LONG, ToastAndroid.CENTER);
				navigation.navigate('home')
				// ...
			})
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
				if (errorCode=='auth/invalid-credential') ToastAndroid.show("Invalid email or password", ToastAndroid.LONG, ToastAndroid.CENTER);
        else ToastAndroid.show(errorMessage, ToastAndroid.LONG, ToastAndroid.CENTER);
        console.log(3, error);
        // ..
      });
		setBtnstate(false);
	}
  return (

    <View style={styles.container}>

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
          style = {[styles.input]}
					editable = {!btnstate}
          onChangeText={setuserName}
          placeholder='Name'
          />
        <TextInput
          style = {[styles.input]}
					editable = {!btnstate}
          onChangeText={setemail}
          placeholder='Email'
          />
        <TextInput
          style = {[styles.input]}
					editable = {!btnstate}
					secureTextEntry={true}
					onChangeText={setpassword}
          placeholder='Password'
          />
        <TouchableOpacity style={[styles.button, ]} disabled={btnstate} onPress={() => {
          registerUser();
        }}>
          <Text>Register</Text>
        </TouchableOpacity>
        <Pressable style={[{position:'absolute', right: 0, bottom: 0}]} onPress={() => navigation.navigate('login')}>
          <Text>Already have an account</Text>
        </Pressable>
      </View>
    </View>
  )
}


const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#e7f4ed',
		width: '100%'
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