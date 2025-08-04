import { UserType } from "@/types";
import { UserProfile } from "firebase/auth";

export function getFullName(user: UserProfile | UserType | null): string {
  return [user?.firstName, user?.lastName].filter(Boolean).join(" ");
}
