import {
  addDoc,
  collection,
  getDocs,
  limitToLast,
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
import { RawMessage } from "@/types";
import {
  CHATS_COLLECTION,
  CHATS_MESSAGES_SUBCOLLECTION,
  MESSAGE_LIMIT,
} from "@/constants";
import { updateReadStatus } from "./readStatusService";
import { RawMessageSchema } from "@/schemas/Message";

export type NewMessageType = Pick<RawMessage, "text" | "senderId"> & {
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
    const newMessage: NewMessageType = {
      text: message,
      senderId,
      createdAt,
    };

    const docRef = await addDoc(messagesRef, newMessage);

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

interface SubscribeToMessagesParams {
  chatId: string;
  createdAt?: Date | null;
}

export function subscribeToMessages(
  { chatId, createdAt }: SubscribeToMessagesParams,
  callback: (messages: RawMessage[]) => void
) {
  const messagesRef = getChatMessagesRef(chatId);
  const constraints: QueryConstraint[] = [orderBy("createdAt", "asc")];

  if (createdAt) {
    constraints.push(startAt(createdAt), limit(MESSAGE_LIMIT));
  } else {
    constraints.push(limitToLast(MESSAGE_LIMIT));
  }

  return onSnapshot(query(messagesRef, ...constraints), (snapshot) => {
    const messages: RawMessage[] = [];

    snapshot.docs.forEach((doc) => {
      const parseResult = RawMessageSchema.safeParse({
        id: doc.id,
        ...doc.data(),
      });

      if (parseResult.success) {
        messages.push(parseResult.data);
      } else {
        console.error("Invalid message data", parseResult.error);
      }
    });

    callback(messages);
  });
}

export async function getPreviousMessages(chatId: string, createdAt: Date) {
  const messagesRef = getChatMessagesRef(chatId);
  try {
    const constraints: QueryConstraint[] = [
      orderBy("createdAt", "desc"),
      limit(MESSAGE_LIMIT),
    ];

    if (createdAt) {
      constraints.push(startAfter(Timestamp.fromDate(createdAt)));
    }

    const messagesSnap = await getDocs(query(messagesRef, ...constraints));

    const messages: RawMessage[] = [];

    messagesSnap.docs.forEach((doc) => {
      const result = RawMessageSchema.safeParse({
        id: doc.id,
        ...doc.data(),
      });
      if (result.success) {
        messages.push(result.data);
      } else {
        console.error("Invalid message format:", result.error);
      }
    });

    return messages;
  } catch (err) {
    console.error("Error loading messages:", err);
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
      // sort === "asc" ? limitToLast(limitValue) : limit(limitValue),
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

    const messages: RawMessage[] = [];

    messagesSnap.docs.forEach((doc) => {
      const result = RawMessageSchema.safeParse({
        id: doc.id,
        ...doc.data(),
      });
      if (result.success) {
        messages.push(result.data);
      } else {
        console.error("Invalid message format:", result.error);
      }
    });

    return messages;
  } catch (err) {
    console.error("Error loading messages:", err);
    throw err;
  }
}

export function subscribeToLastMessage(
  chatId: string,
  callback: (message: RawMessage | null) => void
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

    const parseResult = RawMessageSchema.safeParse({
      id: doc.id,
      ...doc.data(),
    });

    if (parseResult.success) {
      callback(parseResult.data);
    } else {
      console.error("Invalid message data", parseResult.error);
    }
  });
}

export async function getMessagesCount(chatId: string, date?: Date) {
  const messagesRef = getChatMessagesRef(chatId);
  const constraints: QueryConstraint[] = [];

  if (date) {
    constraints.push(where("createdAt", ">", Timestamp.fromDate(date)));
  }

  const messagesQuery = query(messagesRef, ...constraints);

  const countSnap = await getCountFromServer(messagesQuery);
  return countSnap.data().count;
}
