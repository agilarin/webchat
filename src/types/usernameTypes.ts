import { UsernameSchema } from "@/schemas/username";
import { z } from "zod/v4";

export type UsernameType = z.infer<typeof UsernameSchema>;
