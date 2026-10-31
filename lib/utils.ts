import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Token de tempo do CSS em ms. Lido pela unidade, não por parseFloat cru: o
// minificador do build reescreve 480ms como .48s.
export function cssTimeToMs(value: string) {
  const time = value.trim();
  return time.endsWith('ms') ? parseFloat(time) : parseFloat(time) * 1000;
}
