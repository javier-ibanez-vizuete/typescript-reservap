import type { ReactNode } from "react";

export type SizeType = "xs" | "sm" | "md" | "lg" | "xl";

export type ContainerProps = {
    children: ReactNode;
    direction?: "col" | "row";
    padding?: SizeType;
    width?: SizeType | "default";
    className?: string;
}