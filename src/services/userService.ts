import {collection, doc, getDoc} from "firebase/firestore";
import {UserType} from "@/types";
import {firestore} from "@/services/firebase.ts";


class userService {
  usersRef = collection(firestore, "users");

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
}


export default new userService();