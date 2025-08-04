import { USERS_COLLECTION } from "@/constants";
import { firestore } from "@/services/firebase.ts";
import { UserType } from "@/types";
import { collection, getDocs, limit, query, where } from "firebase/firestore";

class searchService {
  usersRef = collection(firestore, `users`);

  async searchUsers(searchTerm: string) {
    searchTerm = searchTerm.toLowerCase();
    const strLength = searchTerm.length;
    const strFrontCode = searchTerm.slice(0, strLength - 1);
    const strEndCode = searchTerm.slice(strLength - 1, searchTerm.length);
    const endCode =
      strFrontCode + String.fromCharCode(strEndCode.charCodeAt(0) + 1);
    const searchQueryRef = query(
      this.usersRef,
      where("username", ">=", searchTerm),
      where("username", "<", endCode),
      limit(10)
    );

    try {
      const usersSnap = await getDocs(searchQueryRef);
      const users: UserType[] = [];

      usersSnap.forEach((userSnap) => {
        const user = {
          id: userSnap.id,
          ...userSnap?.data(),
        } as UserType;
        users.push(user);
      });

      return users;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}

export default new searchService();

const usersRef = collection(firestore, USERS_COLLECTION);

export async function searchUsersByUsername(searchTerm: string) {
  searchTerm = searchTerm.toLowerCase();
  const strLength = searchTerm.length;
  const strFrontCode = searchTerm.slice(0, strLength - 1);
  const strEndCode = searchTerm.slice(strLength - 1, searchTerm.length);
  const endCode =
    strFrontCode + String.fromCharCode(strEndCode.charCodeAt(0) + 1);
  const searchQueryRef = query(
    usersRef,
    where("username", ">=", searchTerm),
    where("username", "<", endCode),
    limit(10)
  );

  try {
    const usersSnap = await getDocs(searchQueryRef);
    const users: UserType[] = [];

    usersSnap.forEach((userSnap) => {
      const user = {
        id: userSnap.id,
        ...userSnap?.data(),
      } as UserType;
      users.push(user);
    });

    return users;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
