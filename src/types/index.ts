import {Timestamp} from "firebase/firestore";

export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

export type UserType = {
  id: string,
  email: string,
  username: string,
  firstName: string,
  lastName?: string,
  avatar?: string,
  lastOnline?: number,
  isOnline?: boolean,
  createdAt: Timestamp,
  updatedAt?: Timestamp
}

type chatTypeField = "PRIVATE" | "GROUP";

export type ChatType = {
  id: string,
  members: string[],
  type: chatTypeField,
  title?: string,
  username?: string,
  // firstName?: string,
  // lastName?: string,
  photo?: string,
  user?: UserType,
  createdAt: Timestamp,
  updatedAt?: Timestamp
}

export type MessageType = {
  id: string,
  senderId: string,
  text: string,
  editDate?: number,
  isDeleted?: boolean,
  isRead?: boolean,
  isJumpTo?: boolean,
  date: Timestamp,
}

export type MessagesDoc = {
  id: string,
  messages: MessageType[],
  messagesId: string[],
  createdAt: Timestamp,
  updatedAt?: Timestamp
}



export type UserChatType = {
  id: string,
  lastMessage: {
    text: string,
    date: number
  },
  unreadCount: number,
}