import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return `${amount.toFixed(2)} ج.م‏`;
}

export function getProductBadge(product: { featured?: boolean; popular?: boolean; discountPrice?: number | null }) {
  if (product.discountPrice) {
    return {
      text: "خصم",
      color: "bg-secondary text-secondary-foreground",
    };
  } else if (product.popular) {
    return {
      text: "الأكثر مبيعًا",
      color: "bg-accent text-accent-foreground",
    };
  } else if (product.featured) {
    return {
      text: "جديد",
      color: "bg-primary text-primary-foreground",
    };
  }
  return null;
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}
