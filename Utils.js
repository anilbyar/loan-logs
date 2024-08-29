import * as SecureStore from "expo-secure-store";
import { doc, getDoc, Timestamp } from "firebase/firestore";
import { db } from "./firebaseConfig";

export async function setitem(key, val) {
  await SecureStore.setItemAsync(key, val);
}

export async function getitem(key) {
  try {
    val = SecureStore.getItem(key);
    console.log(key, " => ", val)
    return val;
  } catch (error) {
    console.log("Error getting auth from store: ", error.message);
  }
}

export async function deleteitem(key) {
  await SecureStore.deleteItemAsync(key).catch((error) => {
    console.log("Error deleting item in store: ", error.message);
  });
}

export const getUser = async (userId) => {
  try {
    const userDoc = await getDoc(doc(db, "users", userId));
    console.log("UserId: ", userId, " \nUser data: ", userDoc.data());
    return userDoc.data();
  } catch (e) {
    console.log("Error occured while fetching user: ", e);
  }
};

export const getUserName = async (userId) => {
  try {
    const user = await getUser(userId);
    return user.name;
  } catch (e) {
    console.log("Error occured while fetching user name: ", e);
    return "";
  }
};

export const getOtherUserName = async (userId, userList) => {
  console.log("UserList: ", userId, userList);
  console.assert(userId in userList);
  return userId === userList[0]
    ? await getUserName(userList[1])
    : await getUserName(userList[0]);
};

const formatter = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "short",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: true, // 12-hour format
});

export function dateTimeStringFromTimestamp(timestamp) {
  return formatter.format(timestamp.toDate());
}

/* 0 -> red(gave), 1 -> green(got) */
export function redGreen(userId, allUserIds, transactionAmt){
    return (userId===allUserIds[0] && transactionAmt>=0) ||
    (userId===allUserIds[1] && transactionAmt<0);
}

export const RED = 'red';
export const GREEN = 'green';
export const PRIMARY = '#aaf2cb';
export const SECONDARY = '#e7f4ed';
export const LIGHT_SECONDARY = '#d5f5e4';

