import {
  collection,
  FieldValue,
  doc,
  onSnapshot,
  serverTimestamp,
  Timestamp,
  setDoc,
} from "firebase/firestore";
import { firestore } from "@/services/firebase.ts";
import { UserChat } from "@/types";
import { USERS_CHATS_SUBCOLLECTION, USERS_COLLECTION } from "@/constants";

const usersRef = collection(firestore, USERS_COLLECTION);
const getUserChatsRef = (userId: string) => {
  return collection(usersRef, userId, USERS_CHATS_SUBCOLLECTION);
};

type CreateUserChat = Omit<UserChat, "joinedAt"> & {
  joinedAt: FieldValue;
};

export async function addUserChats(
  userId: string,
  chatId: string,
  joinedAt?: Date
) {
  const userChatsRef = getUserChatsRef(userId);

  try {
    await setDoc(doc(userChatsRef, chatId), {
      chatId,
      joinedAt: joinedAt ? Timestamp.fromDate(joinedAt) : serverTimestamp(),
      role: "member",
    } as CreateUserChat);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export function subscribeToUserChats(
  userId: string,
  callback: (data: UserChat[]) => Promise<void>
) {
  const userChatsRef = getUserChatsRef(userId);

  return onSnapshot(userChatsRef, (snapshot) => {
    if (snapshot.empty) {
      return callback([]);
    }
    callback(snapshot.docs.map((doc) => doc.data() as UserChat));
  });
}
