import { z, ZodType } from "zod/v4";

export function createParseOrThrow<T>(schema: ZodType<T>) {
  return (data: unknown): T => {
    try {
      return schema.parse(data);
    } catch (error) {
      console.error("Validation failed:", error);
      throw error;
    }
  };
}

export function createParseOrNull<T>(schema: ZodType<T>) {
  return (data: unknown): T | null => {
    const result = schema.safeParse(data);
    if (!result.success) {
      console.error("Validation failed:", result.error.message);
      return null;
    }
    return result.data;
  };
}

export function createParseArray<T>(schema: ZodType<T>) {
  return (data: unknown): T[] => {
    const result = z.array(schema).safeParse(data);
    if (!result.success) {
      console.error("Validation failed:", result.error.message);
      return [];
    }
    return result.data;
  };
}
