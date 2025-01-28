import {firestore} from "@/services/firebase.ts";
import {UserType} from "@/types";
import {collection, getDocs, query, where} from "firebase/firestore";



interface ISearchUsers {
  query: string
}


class searchService {
  usersRef = collection(firestore, `users`);
  chatsRef = collection(firestore, `chats`);


  async searchUsers({query: queryText}: ISearchUsers) {
    const searchQueryRef = query(
      this.usersRef,
      where('username', '>=', queryText),
      where('username', '<=', queryText+ '\uf8ff')
    )

    try {
      const usersSnap = await getDocs(searchQueryRef);
      const users: UserType[] = []

      usersSnap.forEach((userSnap) => {
        const user = {
          id: userSnap.id,
          ...userSnap?.data()
        } as UserType;
        users.push(user);
      })

      return users;
    } catch (error) {
      console.log(error)
      throw error;
    }
  }

}


export default new searchService();