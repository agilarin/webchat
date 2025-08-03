import { z } from "zod/v4";
import { timestampToDate } from "./firebase";
import { UserProfileSchema } from "./user";

export const ChatTypeFieldEnum = z.enum(["PRIVATE", "GROUP"]);

export const RawChatSchema = z.object({
  id: z.string(),
  members: z.array(z.string()),
  type: ChatTypeFieldEnum,
  title: z.string().optional(),
  username: z.string().optional(),
  createdAt: timestampToDate,
  updatedAt: timestampToDate.optional(),
});

export const ChatSchema = RawChatSchema.omit({
  title: true,
  username: true,
  createdAt: true,
}).extend({
  title: z.string(),
  username: z.string(),
  isDraft: z.boolean().optional(),
  peer: UserProfileSchema.optional(),
  createdAt: timestampToDate.optional(),
});

const CreatePrivateChatSchema = z.object({
  id: z.string(),
  type: z.literal(ChatTypeFieldEnum.enum.PRIVATE),
  members: z.array(z.string()).min(2),
});

const CreateGroupChatSchema = z.object({
  id: z.string(),
  type: z.literal(ChatTypeFieldEnum.enum.GROUP),
  members: z.array(z.string()).min(1),
  title: z.string().min(3),
  username: z.string(),
});

export const CreateChatSchema = z.discriminatedUnion("type", [
  CreatePrivateChatSchema,
  CreateGroupChatSchema,
]);
