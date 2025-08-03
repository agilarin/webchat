import { collection, doc, runTransaction } from "firebase/firestore";
import { firestore } from "./firebase";
import { USERNAMES_COLLECTION, USERS_COLLECTION } from "@/constants";

const usersRef = collection(firestore, USERS_COLLECTION);
const usernamesRef = collection(firestore, USERNAMES_COLLECTION);

export async function reserveUsername(userId: string, username: string) {
  const usernameRef = doc(usernamesRef, username);

  try {
    await runTransaction(firestore, async (transaction) => {
      const usernameDoc = await transaction.get(usernameRef);
      if (usernameDoc.exists()) {
        throw new Error("Username is already taken");
      }
      transaction.set(usernameRef, { userId });
      // const userRef = doc(firestore, "users", userId);
      // transaction.update(userRef, { username });
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function updateUsername(userId: string, newUsername: string) {
  const usernameRef = doc(usernamesRef, newUsername);
  const userRef = doc(usersRef, userId);

  try {
    await runTransaction(firestore, async (transaction) => {
      const userDoc = await transaction.get(userRef);
      if (!userDoc.exists()) {
        throw new Error("User does not exist");
      }

      const currentUsername = userDoc.data()?.username;

      const usernameDoc = await transaction.get(usernameRef);
      if (usernameDoc.exists()) {
        throw new Error("Username is already taken");
      }

      if (currentUsername && currentUsername !== newUsername) {
        const oldUsernameRef = doc(firestore, "usernames", currentUsername);
        transaction.delete(oldUsernameRef);
      }

      transaction.set(usernameRef, { userId });
      transaction.update(userRef, { username: newUsername });
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
}
