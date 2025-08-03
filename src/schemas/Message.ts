import { z } from "zod/v4";
import { timestampToDate } from "./firebase";

// export type RawMessage = {
//   id: string;
//   senderId: string;
//   text: string;
//   editDate?: Timestamp;
//   isDeleted?: boolean;
//   date: Timestamp;
// };

// export type Message = RawMessage & {
//   isRead?: boolean;
//   isJumpTo?: boolean;
// };

export const RawMessageSchema = z.object({
  id: z.string(),
  senderId: z.string(),
  text: z.string(),
  isDeleted: z.boolean().optional(),
  createdAt: timestampToDate,
  updatedAt: timestampToDate.optional(),
  editedAt: timestampToDate.optional(),
});

export const MessageSchema = RawMessageSchema.extend({
  isRead: z.boolean().optional(),
  isJumpTo: z.boolean().optional(),
});
