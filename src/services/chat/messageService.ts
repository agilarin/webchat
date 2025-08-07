import {
  addDoc,
  collection,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  QueryConstraint,
  Timestamp,
  limit,
  startAfter,
  endBefore,
  startAt,
  endAt,
  where,
  getCountFromServer,
} from "firebase/firestore";
import { firestore } from "@/services/firebase.ts";
import { Message } from "@/types";
import {
  CHATS_COLLECTION,
  CHATS_MESSAGES_SUBCOLLECTION,
  MESSAGE_LIMIT,
} from "@/constants";
import { updateReadStatus } from "./readStatusService";
import { MessageParseArray, MessageParseOrNull } from "@/utils/parsers";

export type NewMessageType = Pick<Message, "text" | "senderId"> & {
  createdAt: Timestamp;
};

const chatsRef = collection(firestore, CHATS_COLLECTION);
const getChatMessagesRef = (chatId: string) => {
  return collection(chatsRef, chatId, CHATS_MESSAGES_SUBCOLLECTION);
};
interface SendMessageParams {
  chatId: string;
  senderId: string;
  members: string[];
  message: string;
}

export async function sendMessage({
  chatId,
  senderId,
  message,
}: SendMessageParams): Promise<string> {
  const messagesRef = getChatMessagesRef(chatId);
  const createdAt = Timestamp.fromDate(new Date(Date.now()));

  try {
    const docRef = await addDoc(messagesRef, {
      text: message,
      senderId,
      createdAt,
    });
    await updateReadStatus({
      chatId,
      userId: senderId,
      messageId: docRef.id,
      messageCreatedAt: createdAt.toDate(),
    });

    return docRef.id;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

export interface GetMessagesParams {
  chatId: string;
  startAfterDate?: Date | null;
  endBeforeDate?: Date | null;
  startAtDate?: Date | null;
  endAtDate?: Date | null;
  limit?: number;
  sort?: "asc" | "desc";
}

export async function getMessages({
  chatId,
  limit: limitValue = MESSAGE_LIMIT,
  startAfterDate,
  endBeforeDate,
  endAtDate,
  startAtDate,
  sort = "asc",
}: GetMessagesParams) {
  const messagesRef = getChatMessagesRef(chatId);
  try {
    const constraints: QueryConstraint[] = [
      orderBy("createdAt", sort),
      limit(limitValue),
    ];

    if (startAfterDate) {
      constraints.push(startAfter(Timestamp.fromDate(startAfterDate)));
    }
    if (endBeforeDate) {
      constraints.push(endBefore(Timestamp.fromDate(endBeforeDate)));
    }
    if (startAtDate) {
      constraints.push(startAt(Timestamp.fromDate(startAtDate)));
    }
    if (endAtDate) {
      constraints.push(endAt(Timestamp.fromDate(endAtDate)));
    }

    const messagesSnap = await getDocs(query(messagesRef, ...constraints));

    const messages = MessageParseArray(
      messagesSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
    );

    return messages;
  } catch (err) {
    console.error("Error loading messages:", err);
    throw err;
  }
}

export function subscribeToLastMessage(
  chatId: string,
  callback: (message: Message | null) => void
) {
  const messagesRef = getChatMessagesRef(chatId);
  const messagesQuery = query(
    messagesRef,
    orderBy("createdAt", "desc"),
    limit(1)
  );

  return onSnapshot(messagesQuery, (snapshot) => {
    if (snapshot.empty) {
      return callback(null);
    }

    const doc = snapshot.docs[0];
    const parseResult = MessageParseOrNull({
      id: doc.id,
      ...doc.data(),
    });

    callback(parseResult);
  });
}

interface GetMessagesCountParams {
  chatId: string;
  userId: string;
  date?: Date | null;
}

export async function getMessagesCount({
  chatId,
  userId,
  date,
}: GetMessagesCountParams) {
  const messagesRef = getChatMessagesRef(chatId);
  const constraints: QueryConstraint[] = [where("senderId", "!=", userId)];
  if (date) {
    constraints.push(where("createdAt", ">", Timestamp.fromDate(date)));
  }

  const messagesQuery = query(messagesRef, ...constraints);

  const countSnap = await getCountFromServer(messagesQuery);
  return countSnap.data().count;
}
