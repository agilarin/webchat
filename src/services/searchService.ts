import { USERS_COLLECTION } from "@/constants";
import { firestore } from "@/services/firebase.ts";
import { UserProfileParseArray } from "@/utils/parsers";
import { collection, getDocs, limit, query, where } from "firebase/firestore";

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

    return UserProfileParseArray(
      usersSnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
    );
  } catch (error) {
    console.log(error);
    throw error;
  }
}
