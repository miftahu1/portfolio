import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { Timestamp } from 'firebase/firestore';
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getFormattedDate = (date: Timestamp | { seconds: number, nanoseconds: number } | null | undefined) => {
  if (!date) return null;

  if (date instanceof Timestamp) {
    return date.toDate().toLocaleDateString();
  }

  // Handle serialized Timestamp object
  if (typeof date === 'object' && 'seconds' in date && 'nanoseconds' in date) {
    return new Date(date.seconds * 1000).toLocaleDateString();
  }

  return null;
};