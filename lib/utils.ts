
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { Timestamp } from 'firebase/firestore';
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Helper to safely convert a Firestore Timestamp (or a serialized one) to a JS Date object
const convertToDate = (date: Timestamp | { seconds: number, nanoseconds: number } | null | undefined): Date | null => {
    if (!date) return null;
    if (date instanceof Timestamp) {
        return date.toDate();
    }
    // Handle serialized Timestamp object
    if (typeof date === 'object' && 'seconds' in date && 'nanoseconds' in date) {
        return new Date(date.seconds * 1000);
    }
    return null;
}

/**
 * Formats a Firestore Timestamp into a date string (e.g., "M/D/YYYY").
 * Handles both server-side Timestamps and client-side serialized objects.
 */
export const getFormattedDate = (date: Timestamp | { seconds: number, nanoseconds: number } | null | undefined) => {
  const dateObj = convertToDate(date);
  return dateObj ? dateObj.toLocaleDateString() : null;
};

/**
 * Formats a Firestore Timestamp into a date and time string (e.g., "M/D/YYYY, h:mm:ss A").
 * Handles both server-side Timestamps and client-side serialized objects.
 */
export const getFormattedDateTime = (date: Timestamp | { seconds: number, nanoseconds: number } | null | undefined) => {
    const dateObj = convertToDate(date);
    return dateObj ? dateObj.toLocaleString() : null;
};
