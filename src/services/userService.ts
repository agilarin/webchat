import {
  collection, doc, getDoc,
  updateDoc, serverTimestamp,
  query, where, getDocs, onSnapshot
} from "firebase/firestore";
import {UserType} from "@/types";
import {firestore} from "@/services/firebase.ts";


class userService {
  usersRef = collection(firestore, "users");


  async checkUsernameUnique(username: string) {
    const usernameQuery = query(this.usersRef, where('username', "==", username))
    try {
      const snapshot = await getDocs(usernameQuery)
      return snapshot.empty;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }


  async getUser(userId: string) {
    const userRef = doc(this.usersRef, userId);

    try {
      const userSnap = await getDoc(userRef);

      return {
        id: userSnap.id,
        ...userSnap.data()
      } as UserType;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }


  async updateUser(userId: string, user: Partial<Omit<UserType, "createdAt" | "updatedAt" | "email">>) {
    const userRef = doc(this.usersRef, userId);
    try {
      let usernameUnique;
      if (user.username) {
        usernameUnique = await this.checkUsernameUnique(user.username);
      }
      if (user.username && !usernameUnique) {
        return Promise.reject("Username is already in use");
      }

      await updateDoc(userRef, {
        ...user,
        updatedAt: serverTimestamp(),
      })
    } catch (error) {
      console.log(error);
      throw error;
    }
  }


  subscribeToUser(
    userId: string,
    callback: (snapshot: UserType) => void
  ) {
    const userRef = doc(this.usersRef, userId);
    return onSnapshot(userRef, (snapshot) => {
      callback(snapshot.data() as UserType);
    });
  }

}


export default new userService();