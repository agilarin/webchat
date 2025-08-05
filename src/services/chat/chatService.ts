import {
  collection,
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { firestore } from "@/services/firebase.ts";
import { ChatType, CreateChat, RawChat } from "@/types";
import { addUserChat } from "@/services/userChatsService.ts";
import { CHATS_COLLECTION } from "@/constants";
import { getUserProfile } from "../userService";
import { reserveUsername } from "../usernameService";
import { createReadStatus } from "./readStatusService";
import { getFullName } from "@/utils/getFullName";
import {
  ChatParseOrNull,
  CreateChatParseOrThrow,
  RawChatParseOrNull,
} from "@/utils/parsers";

const chatsRef = collection(firestore, CHATS_COLLECTION);

export async function createChat(userId: string, data: CreateChat) {
  const parseResult = CreateChatParseOrThrow(data);
  const { id: chatId, ...savedData } = parseResult;

  if (savedData.type === "GROUP") {
    await reserveUsername({ chatId, username: savedData.username });
  }

  try {
    await setDoc(doc(chatsRef, chatId), {
      ...savedData,
      createdAt: serverTimestamp(),
    });

    await Promise.all(
      savedData.members.flatMap((memberId) => {
        let userChatData;
        if (savedData.type === "PRIVATE") {
          userChatData = {
            userId: memberId,
            chatId,
            type: savedData.type,
            peerId: savedData.members.find((id) => id !== memberId)!,
          };
        } else {
          userChatData = {
            userId: memberId,
            chatId,
            type: savedData.type,
          };
        }

        return [
          addUserChat(userChatData),
          createReadStatus({ chatId, userId: memberId }),
        ];
      })
    );

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
    if (!chatSnap.exists()) return null;

    const parseResult = RawChatParseOrNull({
      id: chatSnap.id,
      ...chatSnap.data(),
    });
    if (!parseResult) return parseResult;

    switch (parseResult.type) {
      case "PRIVATE":
        return processPrivateChat(parseResult, userId);
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

  if (!peer) return null;

  return ChatParseOrNull({
    ...chat,
    peer,
    username: peer.username,
    title: getFullName(peer),
  });
}
