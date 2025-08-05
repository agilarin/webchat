import { z } from "zod/v4";
import { timestampToDate } from "./firebase";
import { ChatTypeFieldEnum } from "./chat";

export const UserChatRolesEnum = z.enum(["member", "admin"]);

export const UserChatSchema = z.object({
  id: z.string(),
  chatId: z.string(),
  joinedAt: timestampToDate,
  role: UserChatRolesEnum,
  type: ChatTypeFieldEnum,
});

export const BaseCreateUserChatSchema = UserChatSchema.omit({
  id: true,
  role: true,
  joinedAt: true,
}).extend({
  userId: z.string(),
});

export const CreatePrivateUserChatSchema = BaseCreateUserChatSchema.extend({
  type: z.literal(ChatTypeFieldEnum.enum.PRIVATE),
  peerId: z.string(),
});

export const CreateGroupUserChatSchema = BaseCreateUserChatSchema.extend({
  type: z.literal(ChatTypeFieldEnum.enum.GROUP),
});

export const CreateUserChatSchema = z.discriminatedUnion("type", [
  CreatePrivateUserChatSchema,
  CreateGroupUserChatSchema,
]);
