import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  setDoc,
  Timestamp,
} from "firebase/firestore";
import {
  CHATS_COLLECTION,
  CHATS_READ_STATUSES_SUBCOLLECTION,
} from "@/constants";
import { firestore } from "../firebase";
import { ReadStatus } from "@/types";
import { ReadStatusSchema } from "@/schemas/readStatus";

const chatsRef = collection(firestore, CHATS_COLLECTION);
const getReadStatusesRef = (chatId: string) => {
  return collection(chatsRef, chatId, CHATS_READ_STATUSES_SUBCOLLECTION);
};

interface CreateReadStatusParams {
  chatId: string;
  userId: string;
  messageId?: string | null;
  messageCreatedAt?: Date | null;
}

export async function createReadStatus({
  chatId,
  userId,
  messageCreatedAt,
  messageId,
}: CreateReadStatusParams) {
  const readStatusesRef = getReadStatusesRef(chatId);
  const readStatusRef = doc(readStatusesRef, userId);
  const data = {
    lastReadMessageId: messageId || null,
    lastReadAt: messageCreatedAt ? Timestamp.fromDate(messageCreatedAt) : null,
  };

  try {
    const readStatusDoc = await getDoc(readStatusRef);

    if (!readStatusDoc.exists()) {
      await setDoc(readStatusRef, data);
      return;
    }

    if (data.lastReadAt && data.lastReadMessageId) {
      await setDoc(readStatusRef, data, { merge: true });
    }
    return;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

interface SubscribeToReadStatusParams {
  chatId: string;
  userId: string;
}

export function subscribeToReadStatus(
  { chatId, userId }: SubscribeToReadStatusParams,
  callback: (readStatus: ReadStatus | null) => void
) {
  const readStatusesRef = getReadStatusesRef(chatId);

  return onSnapshot(doc(readStatusesRef, userId), (snapshot) => {
    if (!snapshot.exists()) {
      return callback(null);
    }

    const parseResult = ReadStatusSchema.safeParse(snapshot.data());

    if (parseResult.success) {
      return callback(parseResult.data);
    }

    callback(null);
  });
}

interface UpdateLastReadStatusParams {
  chatId: string;
  userId: string;
  messageId: string;
  messageCreatedAt: Date;
}

export async function updateReadStatus({
  chatId,
  userId,
  messageId,
  messageCreatedAt,
}: UpdateLastReadStatusParams): Promise<void> {
  const readStatusesRef = getReadStatusesRef(chatId);

  try {
    await setDoc(
      doc(readStatusesRef, userId),
      {
        lastReadMessageId: messageId,
        lastReadAt: Timestamp.fromDate(messageCreatedAt),
      },
      { merge: true }
    );
  } catch (error) {
    console.error(error);
    throw error;
  }
}
