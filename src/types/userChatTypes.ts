import { z } from "zod/v4";
import {
  CreateUserChatSchema,
  UserChatRolesEnum,
  UserChatSchema,
} from "@/schemas/userChat";

export type UserChatRoles = z.infer<typeof UserChatRolesEnum>;
export type UserChat = z.infer<typeof UserChatSchema>;
export type CreateUserChat = z.infer<typeof CreateUserChatSchema>;
