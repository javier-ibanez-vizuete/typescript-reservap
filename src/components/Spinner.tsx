import classNames from "classnames";
import { memo, useMemo, type HTMLAttributes } from "react";
import type { SizeType, VariantTypeColor } from "../types/index.type";

export type SpinnerProps = {
    size?: SizeType | "xxl" | "xxxl";
    color?: VariantTypeColor;
    className?: string;
} & HTMLAttributes<HTMLOrSVGElement>;

function Spinner({ size = "md", color = "primary", className = "", ...props }: SpinnerProps) {
    const sizeClasses: Record<SizeType | "xxl" | "xxxl", string> = {
        xs: "w-2 h-2",
        sm: "w-4 h-4",
        md: "w-6 h-6",
        lg: "w-8 h-8",
        xl: "w-12 h-12",
        xxl: "w-18 h-18",
        xxxl: "w-24 h-24",
    };

    const colorClasses: Record<VariantTypeColor, string> = {
        primary: "text-primary",
        secondary: "text-secondary",
        white: "text-white",
        gray: "text-gray-500",
        success: "text-green-500",
        warning: "text-amber-500",
        error: "text-red-500",
    };

    const spinnerClasses = useMemo(
        () => classNames("animate-spin", sizeClasses[size], colorClasses[color], className),
        [size, color, className]
    );

    return (
        <svg
            className={spinnerClasses}
            fill="none"
            viewBox="0 0 24 24"
            role="status"
            aria-label="Loading"
            {...props}
        >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
        </svg>
    );
}

export default memo(Spinner);
