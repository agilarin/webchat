import { Timestamp } from "firebase/firestore";

export * from "./userTypes";
export * from "./userChatTypes";
export * from "./chatTypes";
export * from "./readStatusTypes";
export * from "./messageTypes";

export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

export type UserChatRoles = "member" | "admin";

export type UserChat = {
  chatId: string;
  joinedAt: Timestamp;
  role: UserChatRoles;
};

// export type UserChatType = {
//   id: string;
//   lastMessage: {
//     text: string;
//     date: number;
//   };
//   unreadCount: number;
// };
