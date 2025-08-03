import { MessageSchema, RawMessageSchema } from "@/schemas/Message";
import { Timestamp } from "firebase/firestore";
import { z } from "zod/v4";

// export type RawMessage = {
//   id: string;
//   senderId: string;
//   text: string;
//   editDate?: number;
//   isDeleted?: boolean;
//   date: Timestamp;
// };

// export type MessageView = RawMessage & {
//   isRead?: boolean;
//   isJumpTo?: boolean;
// };

export type MessageType = {
  id: string;
  senderId: string;
  text: string;
  editDate?: number;
  isDeleted?: boolean;
  date: Timestamp;
};

export type MessagesDoc = {
  id: string;
  messages: RawMessage[];
  messagesId: string[];
  createdAt: Timestamp;
  updatedAt?: Timestamp;
};

export type RawMessage = z.infer<typeof RawMessageSchema>;
export type Message = z.infer<typeof MessageSchema>;
