import { z } from "zod/v4";
import { timestampToDate } from "./firebase";

export const ReadStatusSchema = z.object({
  lastReadMessageId: z.union([z.string(), z.null()]),
  lastReadAt: z.union([timestampToDate, z.null()]),
});
