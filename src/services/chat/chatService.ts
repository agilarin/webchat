import {
  collection,
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { firestore } from "@/services/firebase.ts";
import { ChatType, CreateChat, RawChat } from "@/types";
import { addUserChats } from "@/services/userChatsService.ts";
import { CHATS_COLLECTION } from "@/constants";
import { ChatSchema, CreateChatSchema, RawChatSchema } from "@/schemas/chat";
import { getUserProfile } from "../userService";
import { reserveUsername } from "../usernameService";
import { createReadStatus } from "./readStatusService";

const chatsRef = collection(firestore, CHATS_COLLECTION);

export async function createChat(userId: string, data: CreateChat) {
  const parseResult = CreateChatSchema.safeParse(data);

  if (!parseResult.success) {
    console.error(parseResult.error);
    throw new Error(`Validation failed: ${parseResult.error.message}`);
  }
  const { id: chatId, ...savedData } = parseResult.data;

  if (savedData.type === "GROUP") {
    await reserveUsername(chatId, savedData.username);
  }

  try {
    await setDoc(doc(chatsRef, chatId), {
      ...savedData,
      createdAt: serverTimestamp(),
    });

    savedData.members.forEach((memberId) => {
      addUserChats(memberId, chatId);
      createReadStatus({ chatId, userId: memberId });
    });

    return await getChat(chatId, userId);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getChat(
  chatId: string,
  userId: string
): Promise<ChatType | null> {
  const chatRef = doc(chatsRef, chatId);
  try {
    const chatSnap = await getDoc(chatRef);

    if (!chatSnap.exists()) {
      return null;
    }
    const parseResult = RawChatSchema.safeParse({
      id: chatSnap.id,
      ...chatSnap.data(),
    });

    if (!parseResult.success) {
      console.error(parseResult.error);
      return null;
    }

    const rawChat = parseResult.data;

    switch (rawChat.type) {
      case "PRIVATE":
        return processPrivateChat(rawChat, userId);
      case "GROUP":
        return null;
      default:
        return null;
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function processPrivateChat(
  chat: RawChat,
  userId: string
): Promise<ChatType | null> {
  const peerId = chat.members.filter((id) => id !== userId)[0];
  const peer = await getUserProfile(peerId);

  if (!peer) {
    return null;
  }

  const parseResult = ChatSchema.safeParse({
    ...chat,
    peer,
    username: peer.username,
    title: [peer.firstName, peer.lastName].join(" "),
  });

  if (!parseResult.success) {
    console.error(parseResult.error);
    return null;
  }

  return parseResult.data;
}
