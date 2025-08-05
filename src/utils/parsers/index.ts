import {
  createParseArray,
  createParseOrNull,
  createParseOrThrow,
} from "./createParser";
import { MessageSchema } from "@/schemas/Message";
import { ChatSchema, CreateChatSchema, RawChatSchema } from "@/schemas/chat";
import { ReadStatusSchema } from "@/schemas/readStatus";
import { CreateUserProfileSchema, UserProfileSchema } from "@/schemas/user";
import { CreateUserChatSchema, UserChatSchema } from "@/schemas/userChat";
import { UsernameSchema } from "@/schemas/username";

export const UserChatParseArray = createParseArray(UserChatSchema);

export const CreateUserChatParseOrThrow =
  createParseOrThrow(CreateUserChatSchema);

export const RawChatParseOrNull = createParseOrNull(RawChatSchema);

export const ChatParseOrNull = createParseOrNull(ChatSchema);

export const CreateChatParseOrThrow = createParseOrThrow(CreateChatSchema);

export const MessageParseOrNull = createParseOrNull(MessageSchema);
export const MessageParseArray = createParseArray(MessageSchema);

export const ReadStatusParseOrNull = createParseOrNull(ReadStatusSchema);

export const UserProfileParseOrThrow = createParseOrThrow(UserProfileSchema);
export const UserProfileParseOrNull = createParseOrNull(UserProfileSchema);
export const UserProfileParseArray = createParseArray(UserProfileSchema);

export const CreateUserProfileParseOrThrow = createParseOrThrow(
  CreateUserProfileSchema
);
export const UpdateUserProfileParseOrThrow = createParseOrThrow(
  CreateUserProfileSchema.partial()
);

export const UsernameParseOrThrow = createParseOrThrow(UsernameSchema);
