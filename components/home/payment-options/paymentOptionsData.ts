import {
  CreditCard,
  Smartphone,
  WalletCards,
  type LucideIcon,
} from "lucide-react";

export type PaymentCategory =
  | "Buy Now, Pay Later"
  | "Digital Wallets"
  | "Cards";

export interface PaymentOption {
  name: string;
  label: string;
  category: PaymentCategory;
  icon: LucideIcon;
  accent: "yellow" | "blue";
  featured?: boolean;
}

export const PAYMENT_CATEGORIES: Array<{
  title: PaymentCategory;
  description: string;
}> = [
  {
    title: "Buy Now, Pay Later",
    description: "Flexible payment options for eligible purchases.",
  },
  {
    title: "Digital Wallets",
    description: "Fast and convenient digital payment options.",
  },
  {
    title: "Cards",
    description: "Major card payment methods accepted.",
  },
];

export const PAYMENT_OPTIONS: PaymentOption[] = [
  {
    name: "Afterpay",
    label: "Pay with Afterpay",
    category: "Buy Now, Pay Later",
    icon: WalletCards,
    accent: "yellow",
    featured: true,
  },
  {
    name: "Zip Pay",
    label: "Pay with Zip Pay",
    category: "Buy Now, Pay Later",
    icon: WalletCards,
    accent: "blue",
    featured: true,
  },

  {
    name: "PayPal",
    label: "Pay securely with PayPal",
    category: "Digital Wallets",
    icon: WalletCards,
    accent: "blue",
    featured: true,
  },
  {
    name: "Apple Pay",
    label: "Pay with Apple Pay",
    category: "Digital Wallets",
    icon: Smartphone,
    accent: "yellow",
  },
  {
    name: "Google Pay",
    label: "Pay with Google Pay",
    category: "Digital Wallets",
    icon: Smartphone,
    accent: "blue",
  },

  {
    name: "Visa",
    label: "Visa cards accepted",
    category: "Cards",
    icon: CreditCard,
    accent: "blue",
    featured: true,
  },
  {
    name: "American Express",
    label: "American Express accepted",
    category: "Cards",
    icon: CreditCard,
    accent: "yellow",
  },
  {
    name: "Credit Card",
    label: "Credit card payments",
    category: "Cards",
    icon: CreditCard,
    accent: "blue",
  },
  {
    name: "Debit Card",
    label: "Debit card payments",
    category: "Cards",
    icon: CreditCard,
    accent: "blue",
  },
];