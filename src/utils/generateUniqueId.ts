import { customAlphabet } from 'nanoid/non-secure'


export function generateUniqueId() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const generateId = customAlphabet(chars, 20);

  return generateId()
}