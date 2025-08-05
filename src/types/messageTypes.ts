import { MessageSchema } from "@/schemas/Message";
import { z } from "zod/v4";

export type Message = z.infer<typeof MessageSchema>;
