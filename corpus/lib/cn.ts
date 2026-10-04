import { clsx, type ClassValue } from "clsx";

/** Tiny class-name combiner. */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}
