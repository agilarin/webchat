import { z } from "zod/v4";
import {
  ChatTypeFieldEnum,
  RawChatSchema,
  CreateChatSchema,
  ChatSchema,
} from "@/schemas/chat";

export type ChatTypeField = z.infer<typeof ChatTypeFieldEnum>;
export type ChatType = z.infer<typeof ChatSchema>;
export type CreateChat = z.infer<typeof CreateChatSchema>;
export type RawChat = z.infer<typeof RawChatSchema>;
