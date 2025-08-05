import {
  collection,
  doc,
  onSnapshot,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { firestore } from "@/services/firebase.ts";
import { CreateUserChat, UserChat } from "@/types";
import { USERS_CHATS_SUBCOLLECTION, USERS_COLLECTION } from "@/constants";
import {
  CreateUserChatParseOrThrow,
  UserChatParseArray,
} from "@/utils/parsers";

const usersRef = collection(firestore, USERS_COLLECTION);
const getUserChatsRef = (userId: string) => {
  return collection(usersRef, userId, USERS_CHATS_SUBCOLLECTION);
};

export async function addUserChat(data: CreateUserChat) {
  const parseResult = CreateUserChatParseOrThrow(data);

  const { userId, ...otherData } = parseResult;

  let docId: string;
  let docData: Omit<typeof otherData, "peerId">;

  if (otherData.type === "PRIVATE") {
    docId = otherData.peerId;
    const { peerId, ...rest } = otherData;
    docData = rest;
  } else {
    docId = otherData.chatId;
    docData = otherData;
  }

  const userChatsRef = getUserChatsRef(userId);

  try {
    await setDoc(doc(userChatsRef, docId), {
      ...docData,
      role: "member",
      joinedAt: serverTimestamp(),
    });
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

    const parseResult = UserChatParseArray(
      snapshot.docs
        .filter((doc) => !doc.metadata.hasPendingWrites)
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
    );

    callback(parseResult);
  });
}
