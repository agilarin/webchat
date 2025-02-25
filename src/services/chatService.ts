import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  DocumentSnapshot,
  endBefore,
  FieldValue,
  getDoc,
  getDocs,
  increment,
  limitToLast,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  startAt,
  Timestamp,
  updateDoc,
  where
} from "firebase/firestore";
import {firestore} from "@/services/firebase.ts";
import {ChatType, MessageType} from "@/types";
import userService from "@/services/userService.ts";
import userChatsService from "@/services/userChatsService.ts";
import {generateUniqueId} from "@/utils/generateUniqueId.ts";



interface CreateChat {
  data: Omit<ChatType, "id" | "createdAt" | "updatedAt">,
  userId: string,
}

interface GetChat {
  chatId: string,
  userId: string
}

interface SendMessage {
  chatId: string,
  userId: string,
  message: string,
}

type SubscribeToMessages = {
  chatId: string,
  messageId?: string,
  messagesSnapshot?: DocumentSnapshot,
}

interface GetPrevMessages {
  messageId: string,
  chatId: string,
}

interface CreateUnreadCount {
  chatId: string,
  usersId: string | string[],
}

interface UpdateUnreadCountWithValue {
  userId: string,
  chatId: string,
  value: number,
  increment?: never,
}

interface UpdateUnreadCountWithIncrement {
  userId: string,
  chatId: string,
  value?: never,
  increment: number,
}

type UpdateUnreadCount = UpdateUnreadCountWithValue | UpdateUnreadCountWithIncrement

interface IncrementAllExceptUserUnreadCount {
  userId: string,
  chatId: string,
  direction?: 1 | -1,
}

interface GetLastReadMessageAndSnapshot {
  chatId: string,
  userId: string,
}

interface CreateLastReadMessage {
  chatId: string,
  userId: string,
  messageId?: string,
}

interface UpdateLastReadMessage {
  chatId: string,
  userId: string,
  messageId: string,
}

interface SubscribeToUnreadCount {
  chatId: string,
  userId: string,
}




class ChatService {
  private chatsRef = collection(firestore, "chats");


  async createChat({data, userId}: CreateChat) {
    try {
      const chatRef = await addDoc(this.chatsRef, {
        type: "PRIVATE",
        members: data.members,
        createdAt: serverTimestamp(),
      });
      const chatId = chatRef.id;

      data.members.forEach((memberId) => {
        userChatsService.addChatToUserChats({chatId, userId: memberId});
        this.createLastReadMessage({chatId, userId: memberId});
      })

      await this.createUnreadCount({chatId, usersId: data.members})
      return await this.getChat({chatId, userId});
    } catch (error) {
      console.error(error);
      throw error;
    }
  }



  async getChat({chatId, userId: currentUserId}: GetChat) {
    const chatRef = doc(this.chatsRef, chatId);

    try {
      const chatSnap = await getDoc(chatRef);

      if (!chatSnap.exists()) {
        return Promise.reject();
      }
      const chat = {
        id: chatSnap.id,
        ...chatSnap.data()
      } as ChatType;

      if (chat.type !== "PRIVATE") {
        return chat;
      }

      const userId = chat.members.filter(id => id !== currentUserId)[0];
      chat.user = await userService.getUser(userId)

      return chat;
    } catch(error) {
      console.error(error);
      throw error;
    }
  }



  async sendMessage({chatId, userId, message}: SendMessage) {
    const messagesRef = collection(this.chatsRef, chatId, "messages");
    const messagesQueryRef = query(messagesRef, orderBy("createdAt", "asc"), limitToLast(1));

    try {
      const newMessage = {
        id: generateUniqueId(),
        text: message,
        senderId: userId,
        date: Timestamp.fromDate(new Date()),
      }
      const messagesSnap = await getDocs(messagesQueryRef);
      const messagesDoc = messagesSnap.docs?.[0];
      const messagesDocLength: number = messagesDoc?.data().messages.length;


      if (!messagesDoc?.exists() || messagesDocLength >= 1000) {
        await addDoc(messagesRef, {
          messages: [newMessage],
          messagesId: [newMessage.id],
          createdAt: serverTimestamp(),
        })
      } else {
        await updateDoc(doc(messagesRef, messagesDoc?.id), {
          messages: arrayUnion(newMessage),
          messagesId: arrayUnion(newMessage.id),
          updatedAt: serverTimestamp(),
        })
      }
      this.incrementAllExceptUserUnreadCount({chatId, userId});
      this.updateLastReadMessage({chatId, userId, messageId: newMessage.id});
      this.updateUnreadCount({chatId, userId, value: 0})
    } catch (error) {
      console.error(error);
      throw error;
    }
  }



  subscribeToMessages(
    { chatId, messagesSnapshot}: SubscribeToMessages,
    callback: (messages: MessageType[]) => void
  ) {
    const messagesRef = collection(this.chatsRef, chatId, "messages");
    let MessagesQuery = query(messagesRef, orderBy("createdAt", "asc"), limitToLast(1));

    if (messagesSnapshot) {
      MessagesQuery = query(messagesRef, orderBy("createdAt", "asc"), startAt(messagesSnapshot));
    }

    return onSnapshot(MessagesQuery, (querySnap) => {
      let messages: MessageType[] = [];
      querySnap.docs.forEach((docSnap) => {
        messages = [
          ...messages,
          ...docSnap.data().messages as MessageType[]
        ];
      })
      callback(messages);
    });
  }



  async getPrevMessages({messageId, chatId}: GetPrevMessages) {
    const messagesRef = collection(this.chatsRef, chatId, "messages");
    const currentMessagesQuery = query(messagesRef, where("messagesId", "array-contains", messageId));

    try {
      const currentMessagesQuerySnap = await getDocs(currentMessagesQuery);
      const currentMessagesSnap = currentMessagesQuerySnap.docs?.[0];

      if (!currentMessagesSnap?.exists()) {
        return;
      }

      const prevMessagesQuery = query(
        messagesRef,
        orderBy("createdAt", "asc"),
        endBefore(currentMessagesSnap),
        limitToLast(1)
      );
      const prevMessagesQuerySnap = await getDocs(prevMessagesQuery);
      const prevMessagesSnap = prevMessagesQuerySnap.docs?.[0];

      if (!prevMessagesSnap?.exists()) {
        return;
      }

      return prevMessagesSnap?.data().messages as MessageType[];
    } catch(error) {
      console.error(error);
      throw error;
    }
  }



  subscribeToLastMessage(
    chatId: string,
    callback: (message: MessageType) => void
  ) {
    const messagesRef = collection(this.chatsRef, chatId, "messages");
    const lastMessageQuery = query(messagesRef, orderBy("createdAt", "asc"), limitToLast(1));

    return onSnapshot(lastMessageQuery,async (snap) => {
      const lastMessage = snap.docs?.[0]?.data().messages.pop() as MessageType;
      callback(lastMessage);
    })
  }



  async createUnreadCount({chatId, usersId}: CreateUnreadCount) {
    const unreadCountRef = collection(this.chatsRef, chatId, "unreadcount");

    try {
      if (typeof usersId === "string") {
        usersId = [usersId]
      }
      const counts: {[k: string]: number} = {};

      usersId.forEach((userId) => {
        counts[`counts.${userId}`] = 0
      })

      await addDoc(unreadCountRef, {
        ...counts,
        createdAt: serverTimestamp(),
      })
    } catch (error) {
      console.error(error);
      throw error;
    }
  }



  async updateUnreadCount({chatId, userId, value, increment: incrementValue}: UpdateUnreadCount) {
    const unreadCountRef = collection(this.chatsRef, chatId, "unreadcount");
    const unreadCountQuery = query(unreadCountRef, where(`counts.${userId}`, "!=", null));

    let newUnreadCount;
    if (value !== undefined ) {
      newUnreadCount = value
    } else {
      newUnreadCount = increment(incrementValue)
    }

    try {
      const unreadCountSnap = await getDocs(unreadCountQuery);
      const unreadCountId = unreadCountSnap.docs?.[0]?.id;

      await updateDoc(doc(unreadCountRef, unreadCountId), {
        [`counts.${userId}`]: newUnreadCount,
        updatedAt: serverTimestamp(),
      })

    } catch (error) {
      console.error(error);
      throw error;
    }
  }



  subscribeToUnreadCount(
    {chatId, userId}: SubscribeToUnreadCount,
    callback: (count: number) => void
  ) {
    const unreadCountRef = collection(this.chatsRef, chatId, "unreadcount");
    const unreadCountQuery = query(unreadCountRef, where(`counts.${userId}`, "!=", null));

    return onSnapshot(unreadCountQuery,async (snap) => {
      const unreadCount = snap.docs?.[0]?.data().counts[userId] as number;
      callback(unreadCount);
    })
  }



  async incrementAllExceptUserUnreadCount({ chatId, userId, direction }: IncrementAllExceptUserUnreadCount) {
    const unreadCountRef = collection(this.chatsRef, chatId, "unreadcount");

    try {
      const unreadCountSnap = await getDocs(unreadCountRef);

      unreadCountSnap.docs.forEach((DocSnap) => {
        const usersId = Object.keys(DocSnap.data().counts);
        const usersIncrement: {[k: string]: FieldValue} = {};
        usersId.forEach(id => {
          if (id !== userId) {
            usersIncrement[`counts.${id}`] = increment(direction || 1)
          }
        })

        updateDoc(doc(unreadCountRef, DocSnap.id), {
          ...usersIncrement,
          updatedAt: serverTimestamp(),
        })
      })
    } catch (error) {
      console.error(error);
      throw error;
    }
  }



  async createLastReadMessage({chatId, userId, messageId}: CreateLastReadMessage) {
    const readMessagesRef = doc(this.chatsRef, chatId, "readmessages", userId);

    try {
      await updateDoc(readMessagesRef, {
        messageId: messageId || null,
        createdAt: serverTimestamp(),
      })
    } catch (error) {
      console.error(error);
      throw error;
    }
  }



  async updateLastReadMessage({chatId, messageId, userId}: UpdateLastReadMessage) {
    const readMessagesRef = doc(this.chatsRef, chatId, "readmessages", userId);

    try {
      await updateDoc(readMessagesRef, {
        messageId: messageId,
        updatedAt: serverTimestamp(),
      })
    } catch (error) {
      console.error(error);
      throw error;
    }
  }



  subscribeLastReadMessageAndSnapshot(
    {userId, chatId}: GetLastReadMessageAndSnapshot,
    callback: (message?: MessageType, snapshot?: DocumentSnapshot) => void
  ) {
    const messagesRef = collection(this.chatsRef, chatId, "messages");
    const readMessagesRef = doc(this.chatsRef, chatId, "readmessages", userId);

    return onSnapshot(readMessagesRef,async (readMessagesSnap) => {
      if (!readMessagesSnap.exists()) {
        await this.createLastReadMessage({chatId, userId});
      }
      const messageId: string = readMessagesSnap?.data()?.messageId;

      if (!messageId) {
        return callback()
      }

      const MessagesQuery = query(
        messagesRef,
        where("messagesId", "array-contains", messageId));
      const messagesQuerySnap = await getDocs(MessagesQuery);
      const messagesSnap = messagesQuerySnap.docs?.[0];
      const messages = messagesSnap?.data().messages as MessageType[];

      return callback(
        messages.find((message) => message.id === messageId),
        messagesSnap
      )
    })
  }
}



export default new ChatService();



// interface SetTypingStatus {
//   chatId: string,
//   userId: string,
//   isTyping: boolean,
// }
//
// export async function setTypingStatus({chatId, userId, isTyping}: SetTypingStatus) {
//   const readMessagesRef = collection(firestore, "chat", chatId, "readmessages");
//
//   if (isTyping) {
//     const timestamp = Timestamp.fromDate(new Date());
//     set(typingRef, timestamp);
//
//     setTimeout(() => {
//       get(typingRef).then((snapshot) => {
//         if (snapshot.val() === timestamp) {
//           set(typingRef, null);
//         }
//       });
//     }, 5000);
//   } else {
//     set(typingRef, null);
//   }
// }




// interface SubscribeToTypingUsers {
//   chatId: string,
// }
//
// export function subscribeToTypingUsers(
//   {chatId}: SubscribeToTypingUsers,
//   callback: (usersId: string[]) => void
// ) {
//   const typingRef = ref(database, `chats/${chatId}/typing`);
//
//   return onValue(typingRef, (snapshot) => {
//     const typing: { [key: string]: Timestamp } = snapshot.val() || {};
//     const activeTyping = Object.entries(typing)
//       .filter(([_, timestamp]) => Date.now() - timestamp.toDate().getTime() < 6000)
//       .map(([userId]) => userId);
//     callback(activeTyping);
//   });
// }
