import {
  collection,
  doc,
  updateDoc,
  serverTimestamp,
  setDoc,
  getDoc,
  onSnapshot,
} from "firebase/firestore";
import { CreateUserProfile, UserProfile } from "@/types";
import { firestore } from "@/services/firebase.ts";
import { USERS_COLLECTION } from "@/constants";
import { reserveUsername, updateUsername } from "./usernameService";
import {
  CreateUserProfileParseOrThrow,
  UpdateUserProfileParseOrThrow,
  UserProfileParseOrNull,
  UserProfileParseOrThrow,
} from "@/utils/parsers";

const usersRef = collection(firestore, USERS_COLLECTION);

export async function createUserProfile(
  userId: string,
  userProfile: CreateUserProfile
): Promise<void> {
  const parseResult = CreateUserProfileParseOrThrow(userProfile);

  await reserveUsername({ userId, username: parseResult.username });

  const userRef = doc(usersRef, userId);
  try {
    await setDoc(userRef, {
      ...parseResult,
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getUserProfile(
  userId: string
): Promise<UserProfile | null> {
  const userRef = doc(usersRef, userId);

  try {
    const userDoc = await getDoc(userRef);
    if (!userDoc.exists()) return null;

    return UserProfileParseOrThrow({
      id: userDoc.id,
      ...userDoc.data(),
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export function subscribeToUserProfile(
  userId: string,
  callback: (user: UserProfile | null) => Promise<void>
) {
  const userRef = doc(usersRef, userId);

  return onSnapshot(userRef, async (userDoc) => {
    if (!userDoc.exists()) return await callback(null);
    if (userDoc.metadata.hasPendingWrites) return;

    const parseResult = UserProfileParseOrNull({
      id: userDoc.id,
      ...userDoc.data(),
    });

    await callback(parseResult);
  });
}

export async function updateUserProfile(
  userId: string,
  userProfile: Partial<CreateUserProfile>
): Promise<void> {
  const parseResult = UpdateUserProfileParseOrThrow(userProfile);

  if (parseResult.username) {
    await updateUsername({ userId, username: parseResult.username });
  }
  delete parseResult.username;

  if (Object.keys(parseResult).length === 0) return;

  const userRef = doc(usersRef, userId);
  try {
    await updateDoc(userRef, {
      ...parseResult,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Failed to update user profile:", error);
    throw error;
  }
}
