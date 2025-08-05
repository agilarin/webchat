import { z } from "zod/v4";
import { timestampToDate } from "./firebase";

export const MessageSchema = z.object({
  id: z.string(),
  senderId: z.string(),
  text: z.string(),
  isDeleted: z.boolean().optional(),
  createdAt: timestampToDate,
  updatedAt: timestampToDate.optional(),
  editedAt: timestampToDate.optional(),
});

export const CreateMessageSchema = MessageSchema.pick({
  senderId: true,
  text: true,
});
