import { z } from "zod/v4";
import { timestampToDate } from "./firebase";

export const UserChatRolesEnum = z.enum(["member", "admin"]);

export const UserChatSchema = z.object({
  chatId: z.string(),
  joinedAt: timestampToDate,
  role: UserChatRolesEnum,
});
