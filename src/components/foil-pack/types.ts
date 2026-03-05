import type { ReactNode } from "react";

export interface FoilPackTheme {
  gradient: string;
  crimpColor1: string;
  crimpColor2: string;
  holoRainbow?: string;
  holoBlendMode?: string;
}

export interface SealedPackProps {
  icon: ReactNode;
  brandName: string;
  subtitle: string;
  theme?: FoilPackTheme;
  dragX?: number | null;
  className?: string;
}

export interface TradingCardProps {
  icon: ReactNode;
  name: string;
  cardType: string;
  flavorText: string;
  stats: { label: string; value: string }[];
  theme?: FoilPackTheme;
  dragX?: number | null;
  className?: string;
}

export interface RevealPackProps {
  sealedProps: Omit<SealedPackProps, "className" | "dragX">;
  cardProps: Omit<TradingCardProps, "className" | "dragX">;
  className?: string;
}
