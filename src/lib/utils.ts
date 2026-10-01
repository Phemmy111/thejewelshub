import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/** Merge Tailwind classes safely */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Format price from kobo (integer) to NGN string e.g. ₦12,500.00 */
export function formatPrice(kobo: number): string {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(kobo / 100)
}

/** Convert naira to kobo */
export function toKobo(naira: number): number {
  return Math.round(naira * 100)
}

/** Convert kobo to naira */
export function toNaira(kobo: number): number {
  return kobo / 100
}

/** Generate a URL-safe slug from a string */
export function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/** Truncate a string to a given length */
export function truncate(str: string, length: number): string {
  return str.length > length ? str.slice(0, length) + '...' : str
}
