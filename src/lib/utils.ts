import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

const shortDateFormatter = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "short",
  day: "numeric",
});

const longDateFormatter = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "long",
  day: "numeric",
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(
  value: string | Date,
  variant: "short" | "long" = "short",
) {
  const date = value instanceof Date ? value : new Date(value);

  return (variant === "long" ? longDateFormatter : shortDateFormatter).format(date);
}
