import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge Tailwind classes with clsx
 * Handles conflicts like "px-2 px-4" -> "px-4"
 */
export const cn = (...inputs) => twMerge(clsx(inputs));
