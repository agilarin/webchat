import { z } from "zod/v4";
import { Timestamp } from "firebase/firestore";

export const timestampToDate = z.preprocess((arg) => {
  if (arg instanceof Timestamp) return arg.toDate();
  if (arg instanceof Date) return arg;
  return undefined;
}, z.date());
