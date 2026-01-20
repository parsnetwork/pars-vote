import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 2,
  }).format(num)
}

// vePARS formula: min(PARS, MIGA) × sqrt(lock_duration / max_duration)
export function calculateVePars(
  pars: number,
  miga: number,
  lockDays: number,
  maxLockDays: number = 1460 // 4 years
): number {
  const minBalance = Math.min(pars, miga)
  const durationMultiplier = Math.sqrt(lockDays / maxLockDays)
  return minBalance * durationMultiplier
}
