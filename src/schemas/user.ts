import { z } from "zod/v4";
import { timestampToDate } from "./firebase";

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

export const UserRolesEnum = z.enum(["admin"]);

export const AuthUserSchema = z.object({
  id: z.string(),
  email: z.string(),
});

export const UserProfileSchema = z.object({
  id: z.string(),
  role: UserRolesEnum.optional(),
  username: z.string(),
  firstName: z.string(),
  lastName: z.string().nullable(),
  avatar: z.string().optional(),
  createdAt: timestampToDate,
  updatedAt: timestampToDate.optional(),
});

export const UserSchema = AuthUserSchema.extend(UserProfileSchema.shape);

export const CreateUserProfileSchema = UserProfileSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
