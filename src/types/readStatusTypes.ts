import { z } from "zod/v4";
import { ReadStatusSchema } from "@/schemas/readStatus";

export type ReadStatus = z.infer<typeof ReadStatusSchema>;
