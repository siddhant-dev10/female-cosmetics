import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatINR(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(value);
}

export function getDeliveryWindow(pin: string) {
  const isMetro = /^[1-3]/.test(pin);
  const startDays = isMetro ? 3 : 4;
  const endDays = isMetro ? 5 : 7;
  const start = new Date();
  const end = new Date();
  start.setDate(start.getDate() + startDays);
  end.setDate(end.getDate() + endDays);
  const formatter = new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short" });
  return {
    range: `${formatter.format(start)} – ${formatter.format(end)}`,
    mode: isMetro ? "Express route available" : "Standard delivery"
  };
}
