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
import { CreateUserProfileSchema, UserProfileSchema } from "@/schemas/user";
import { reserveUsername, updateUsername } from "./usernameService";

const usersRef = collection(firestore, USERS_COLLECTION);

export async function createUserProfile(
  userId: string,
  userProfile: CreateUserProfile
): Promise<void> {
  const parseResult = CreateUserProfileSchema.safeParse(userProfile);

  if (!parseResult.success) {
    console.error(parseResult.error);
    throw new Error(`Validation failed: ${parseResult.error.message}`);
  }

  await reserveUsername(userId, parseResult.data.username);

  const userRef = doc(usersRef, userId);
  try {
    await setDoc(userRef, {
      ...parseResult.data,
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

    const parseResult = UserProfileSchema.safeParse({
      id: userDoc.id,
      ...userDoc.data(),
    });

    if (!parseResult.success) {
      throw new Error(`Validation failed: ${parseResult.error.message}`);
    }

    return parseResult.data;
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

    const parseResult = UserProfileSchema.safeParse({
      id: userDoc.id,
      ...userDoc.data(),
    });

    if (!parseResult.success) {
      console.error(`Validation failed: ${parseResult.error.message}`);
      return await callback(null);
    }

    await callback(parseResult.data);
  });
}

export async function updateUserProfile(
  userId: string,
  userProfile: Partial<CreateUserProfile>
): Promise<void> {
  const PartialUserProfileSchema = CreateUserProfileSchema.partial();

  const parseResult = PartialUserProfileSchema.safeParse(userProfile);

  if (!parseResult.success) {
    throw new Error(`Validation failed: ${parseResult.error.message}`);
  }

  if (parseResult.data.username) {
    await updateUsername(userId, parseResult.data.username);
  }
  const updates = { ...parseResult.data };
  delete updates.username;

  if (Object.keys(updates).length === 0) return;

  const userRef = doc(usersRef, userId);

  try {
    await updateDoc(userRef, {
      ...parseResult.data,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Failed to update user profile:", error);
    throw error;
  }
}
