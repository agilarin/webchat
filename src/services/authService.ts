import {
  signOut as _signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
  updatePassword as _updatePassword,
  updateEmail as _updateEmail,
} from "firebase/auth";
import { auth } from "@/services/firebase.ts";
import { updateUserOnlineStatus } from "@/services/presenceService.ts";
import { createUserProfile } from "./userService";
import {
  useActiveChatStore,
  useCurrentUserStore,
  useUserChatsStore,
  useMessagesStore,
  useReadStatusesStore,
} from "@/store";

async function passwordVerification(password: string) {
  const user = auth.currentUser;
  if (!user?.email) throw new Error("Не удалось получить email");

  try {
    const credential = EmailAuthProvider.credential(user.email, password);
    return await reauthenticateWithCredential(user, credential);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

interface SignUpParams {
  email: string;
  password: string;
  username: string;
  firstName: string;
  lastName?: string;
}

export async function signUp({
  email,
  password,
  username,
  firstName,
  lastName,
}: SignUpParams) {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    await createUserProfile(userCredential.user.uid, {
      username,
      firstName,
      lastName: lastName || null,
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
}

interface SignInParams {
  email: string;
  password: string;
}

export async function signIn({ email, password }: SignInParams) {
  try {
    return await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function signOut() {
  try {
    await _signOut(auth);
    useCurrentUserStore.getState().reset();
    useUserChatsStore.getState().reset();
    useReadStatusesStore.getState().reset();
    useActiveChatStore.getState().reset();
    useMessagesStore.getState().reset();
  } catch (error) {
    console.log(error);
    throw error;
  }
}

interface UpdatePasswordParams {
  oldPassword: string;
  newPassword: string;
}

export async function updatePassword({
  oldPassword,
  newPassword,
}: UpdatePasswordParams) {
  try {
    const userCredential = await passwordVerification(oldPassword);
    await _updatePassword(userCredential.user, newPassword);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

interface UpdateEmailParams {
  newEmail: string;
  password: string;
}

export async function updateEmail({ newEmail, password }: UpdateEmailParams) {
  try {
    const userCredential = await passwordVerification(password);
    await _updateEmail(userCredential.user, newEmail);
  } catch (error) {
    console.log(error);
    throw error;
  }
}
