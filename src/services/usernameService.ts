import { collection, doc, getDoc, runTransaction } from "firebase/firestore";
import { RequireAtLeastOne } from "@/types";
import { firestore } from "./firebase";
import {
  CHATS_COLLECTION,
  USERNAMES_COLLECTION,
  USERS_COLLECTION,
} from "@/constants";
import { UsernameType } from "@/types/usernameTypes";
import { UsernameParseOrThrow } from "@/utils/parsers";

const usersRef = collection(firestore, USERS_COLLECTION);
const chatsRef = collection(firestore, CHATS_COLLECTION);
const usernamesRef = collection(firestore, USERNAMES_COLLECTION);

type UsernameAssignment = RequireAtLeastOne<UsernameType, "userId" | "chatId">;

export async function reserveUsername({
  userId,
  chatId,
  username,
}: UsernameAssignment) {
  const usernameRef = doc(usernamesRef, username);

  if (!userId && !chatId) throw new Error("ID is missing");

  try {
    await runTransaction(firestore, async (transaction) => {
      const usernameDoc = await transaction.get(usernameRef);
      if (usernameDoc.exists()) {
        throw new Error("Username is already taken");
      }
      if (userId) {
        transaction.set(usernameRef, { userId });
      } else if (chatId) {
        transaction.set(usernameRef, { chatId });
      }
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function updateUsername({
  userId,
  chatId,
  username: newUsername,
}: UsernameAssignment) {
  const usernameRef = doc(usernamesRef, newUsername);
  const entityId = userId ?? chatId;
  const entityRef = doc(userId ? usersRef : chatsRef, entityId);

  try {
    await runTransaction(firestore, async (transaction) => {
      const entityDoc = await transaction.get(entityRef);
      if (!entityDoc.exists()) {
        throw new Error(`${userId ? "User" : "Chat"} does not exist`);
      }

      const currentUsername = entityDoc.data()?.username;

      const usernameDoc = await transaction.get(usernameRef);
      if (usernameDoc.exists()) {
        throw new Error("Username is already taken");
      }

      if (currentUsername && currentUsername !== newUsername) {
        const oldUsernameRef = doc(usernamesRef, currentUsername);
        transaction.delete(oldUsernameRef);
      }

      const docData = userId ? { userId: entityId } : { chatId: entityId };
      transaction.set(usernameRef, docData);
      transaction.update(entityRef, { username: newUsername });
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getUsername(username: string): Promise<UsernameType> {
  const usernameRef = doc(usernamesRef, username);
  const usernameDoc = await getDoc(usernameRef);

  return UsernameParseOrThrow({
    username: usernameDoc.id,
    ...usernameDoc.data(),
  });
}
