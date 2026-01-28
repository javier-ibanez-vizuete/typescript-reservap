import type { FLAGS_URL_DATA } from "../data/flagsData";

export type SizeType = "xs" | "sm" | "md" | "lg" | "xl";
export type SizeTypeFull = SizeType | "default" | "none";
export type VariantType = "default" | "primary" | "secondary" | "outline" | "ghost" | "danger" | "none";
export type VariantTypeColor = "primary" | "secondary" | "white" | "gray" | "success" | "warning" | "error";

export interface ImageSourceType {
    avif480?: string;
    webp480?: string;
    png480?: string;

    avif800?: string;
    webp800?: string;
    png800?: string;

    avif1200?: string;
    webp1200?: string;
    png1200?: string;

    avif1800?: string;
    webp1800?: string;
    png1800?: string;

    avif?: string;
    webp?: string;
    png?: string;

    url: string;
    alt: string
}

export type Trigger = "click" | "hover";
export type Placement = { [key: string]: string }

export type LanguageKey = keyof typeof FLAGS_URL_DATA;

export type ButtonTypes = "button" | "submit" | "reset";

export type AvatarSizeType = "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "4xl" | "6xl";

export type KeyType = string;

export type DataType = unknown;

export type DeviceSizeType = {
    isMobile2Xs: boolean,
    isMobileXs: boolean,
    isMobileSm: boolean,
    isMobile: boolean,
    isTablet: boolean,
    isDesktop: boolean,
}