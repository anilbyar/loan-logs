import { useState } from 'react'
import { View, StyleSheet, TextInput, Button, Pressable, Text, Image, TouchableOpacity } from 'react-native'

const isRegistered = (number) => {
  return false;
}

export const LoginScreen = ({navigation}) => {
  const [number, setnumber] = useState('');
  const [confirmation, setconfirmation] = useState('');
  const [id, setid] = useState(null);
  const [registered, setregistered] = useState(true);
  const [userName, setuserName] = useState('');
  const [btnstate, stebtnstate] = useState(0);

  const login = () => {
    
    // try to login and store result in id
    const pattern = /^\d{10}$/;
    if (!pattern.test(number)){
      alert("Please enter valid number!");
      return;
    }
    alert("Confirmation Code sent to " + number);
    setid('dad2isdn333');
    // setregistered(false);
    stebtnstate(2);
  }
  
  const registerUser = () => {
    setid('dad2isdn333');
    stebtnstate(1);
  }
  const verifyCode = () => {
    alert("Logged In");
    setid(null);
    navigation.navigate('home');
  }
  return (
    <View style={styles.container}>
      <Image
        style={{
            width: 66,
            height: 58,
          }}
        source={require('../assets/favicon.png')}
      />
      <TextInput
        style = {[styles.input,]}
        keyboardType='number-pad'
        onChangeText={setnumber}
        placeholder='Phone number'
        editable={(btnstate===0)?true:false}
        />
      <Pressable style={[styles.button, (btnstate!==0)&&{display: 'none'}]} onPress={() => {
        login();
      }}>
        <Text>Login</Text>
      </Pressable>
      {
        !registered && (
          <>
            <TextInput
              style = {styles.input}
              onChangeText={setuserName}
              placeholder='Enter your name'
              editable={(btnstate===1)?true:false}
              />
            <TouchableOpacity style={[styles.button, (btnstate!==1)&&{display: 'none'}]} onPress={() => {
              registerUser();
            }}>
              <Text>Register</Text>
            </TouchableOpacity>
          </>
        )
      }
      {
        id && (
          <>
            <TextInput
              style = {styles.input}
              keyboardType='number-pad'
              onChangeText={setconfirmation}
              placeholder='OTP'
              editable={(btnstate===2)?true:false}
            />
            <TouchableOpacity style={styles.button} onPress={() => {
              verifyCode();
            }}>
              <Text>Submit Code</Text>
            </TouchableOpacity>
          </>
        )
      }
    </View>
  )
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e7f4ed'
  },
  input: {
    borderWidth: 1,
    margin: 8,
    padding: 10,
    width: '70%',
    borderRadius: 5,
  },
  button: {
    alignContent: 'center',
    alignItems: 'center',
    backgroundColor: '#aaf2cb',
    padding: 8,
    width: '70%'
  }
})