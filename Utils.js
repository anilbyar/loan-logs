import * as SecureStore from 'expo-secure-store';
import { doc, getDoc } from 'firebase/firestore';
import { db } from './firebaseConfig';


export async function setitem(key, val){
    await SecureStore.setItemAsync(key, val);
  }
  
export async function getitem(key){
    try {
        val = SecureStore.getItem(key);
        return val;
    } catch (error){
        console.log("err", error.message);
    }
}

export async function delitem(key){
    await SecureStore.deleteItemAsync(key)
    .catch((error)=>{
        console.log("deleting", error.message);
    })
}

export const getUser = async ( userId ) => {
    try {
        const userDoc = await getDoc(doc(db, 'users', userId));
        console.log("UserId: ", userId, " \nUser data: ", userDoc.data());
        return userDoc.data();
    } catch (e){
        console.log("Error occured while fetching user: ", e);
    }
}
  
export const getUserName = async (userId) => {
    try {
        const user = await getUser(userId);
        return user.name;
    } catch (e){
        console.log("Error occured while fetching user name: ", e);
        return "";
    }
}

export const getOtherUserName = async (userId, userList) => {
    console.log("UserList: ", userId, userList);
    console.assert(userId  in userList);
    return (userId===userList[0]?await getUserName(userList[1]):await getUserName(userList[0]));
}
