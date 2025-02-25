import {arrayUnion, collection, doc, onSnapshot, setDoc, updateDoc} from "firebase/firestore";
import {firestore} from "@/services/firebase.ts";


interface AddChatToUserChats {
  chatId: string,
  userId: string
}

class userChatsService {
  private usersChatsRef = collection(firestore, "userchats");


  async createUserChats(userId: string) {
    const userChatsRef = doc(this.usersChatsRef, userId);

    try {
      await setDoc(userChatsRef, {
        chats: []
      });
    } catch (error) {
      console.error(error);
      throw error;
    }
  }


  async addChatToUserChats({chatId, userId}: AddChatToUserChats) {
    const userChatsRef = doc(this.usersChatsRef, userId);

    try {
      await updateDoc(userChatsRef, {
        chats: arrayUnion(chatId)
      });
    } catch (error) {
      console.error(error);
      throw error;
    }
  }


  subscribeToUserChats(
    userId: string,
    callback: (data: string[]) => void
  ) {
    const userChatsRef = doc(this.usersChatsRef, userId);

    return onSnapshot(userChatsRef, (snapshot) => {
      callback(snapshot.data()?.chats || [])
    });
  }


}


export default new userChatsService();