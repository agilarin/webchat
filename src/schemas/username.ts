import { z } from "zod/v4";

export const UsernameSchema = z.object({
  username: z.string(),
  chatId: z.string().optional(),
  userId: z.string().optional(),
});
