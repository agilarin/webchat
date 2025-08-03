import { z } from "zod/v4";
import {
  AuthUserSchema,
  UserSchema,
  UserProfileSchema,
  CreateUserProfileSchema,
} from "@/schemas/user";

export type AuthUser = z.infer<typeof AuthUserSchema>;
export type UserProfile = z.infer<typeof UserProfileSchema>;
export type UserType = z.infer<typeof UserSchema>;
export type CreateUserProfile = z.infer<typeof CreateUserProfileSchema>;

// export type UserType = {
//   id: string;
//   email: string;
//   username: string;
//   firstName: string;
//   lastName?: string;
//   avatar?: string;
//   lastOnline?: number;
//   isOnline?: boolean;
//   createdAt: Timestamp;
//   updatedAt?: Timestamp;
// };
