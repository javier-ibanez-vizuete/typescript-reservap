import classNames from "classnames";
import { memo, useCallback, useMemo, type HTMLAttributes, type MouseEvent, type ReactNode } from "react";
import { useDevice } from "../hooks/useDevice.js";
import type { ButtonTypes, SizeType, VariantType } from "../types/index.type.js";
import Spinner from "./Spinner.js";

export type LoadingButtonProps = {
    children: ReactNode;
    loading?: boolean;
    disabled?: boolean;
    variant?: VariantType;
    size?: SizeType;
    loadingText?: string;
    onClick?: () => void;
    type?: ButtonTypes;
    className?: string;
} & HTMLAttributes<HTMLButtonElement>;

const baseClasses =
    "inline-flex items-center justify-center font-medium transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 cursor-pointer relative";

function LoadingButton({
    children,
    loading = false,
    disabled = false,
    variant = "default",
    size,
    loadingText = "Cargando...",
    className = "",
    onClick,
    type = "button",
    ...props
}: LoadingButtonProps) {
    const { isMobile2Xs, isMobileXs, isMobileSm, isTablet, isDesktop } = useDevice();

    const variantClasses: Record<VariantType, string> = useMemo(
        () => ({
            default:
                "bg-gray-50 text-text-color border border-gray-500 hover:bg-gray-500/80 focus:ring-gray-900",
            primary:
                "bg-primary-color text-text-color border border-primary-color hover:bg-primary-color/80 focus:ring-primary-color shadow-sm",
            secondary:
                "bg-secondary-color text-text-color border border-secondary-color hover:bg-secondary-color/80 focus:ring-secondary-color shadow-sm",
            outline:
                "bg-transparent text-text-color border border-gray-300 hover:bg-gray-50 focus:ring-gray-500",
            ghost: "bg-transparent text-text-color border-transparent hover:bg-gray-100 focus:ring-gray-500",
            danger: "bg-error-500 text-white border border-error-600 hover:bg-error-600 focus:ring-error-500 shadow-sm",
            none: " ",
        }),
        []
    );

    const sizeClasses: Record<SizeType, string> = useMemo(
        () => ({
            xs: "px-2.5 py-1 text-xs",
            sm: "px-3 py-1.5 text-base",
            md: "px-4 py-2 text-md",
            lg: "px-6 py-3 text-md",
            xl: "px-8 py-4 text-lg",
        }),
        []
    );

    const autoButtonConfig = useMemo(
        () => ({
            padding: classNames({
                "px-3 py-1.5 text-xs": isMobile2Xs || isMobileXs || isMobileSm,
                "px-4 py-2 text-base": isTablet || isDesktop,
            }),
        }),
        [isMobile2Xs, isMobileXs, isMobileSm, isTablet, isDesktop]
    );

    const isDisabled = disabled || loading;

    const buttonClasses = useMemo(
        () =>
            classNames(
                baseClasses,
                variantClasses[variant],
                size ? sizeClasses[size ?? "sm"] : autoButtonConfig?.padding,
                {
                    "opacity-50 cursor-not-allowed pointer-events-none": isDisabled,
                    "hover:scale-105 hover:shadow-lg transform": !isDisabled && variant !== "ghost",
                    "hover:shadow-brand-400/25": !isDisabled && variant === "primary",
                    "hover:shadow-blue-400/25": !isDisabled && variant === "secondary",
                },
                className
            ),
        [variant, size, isDisabled, className, autoButtonConfig?.padding]
    );

    const handleClick = useCallback(
        (event: MouseEvent<HTMLButtonElement>) => {
            if (!isDisabled && onClick) {
                onClick?.(event);
            }
        },
        [isDisabled, onClick]
    );

    const getSpinnerColor = () => {
        if (variant === "primary" || variant === "danger") return "white";
        return "primary";
    };

    return (
        <button
            type={type}
            disabled={isDisabled}
            onClick={handleClick}
            className={buttonClasses}
            aria-busy={loading}
            {...props}
        >
            {loading && <Spinner size={size} color={getSpinnerColor()} className="mr-2" />}
            <span className={loading ? "opacity-75" : ""}>{loading ? loadingText : children}</span>
        </button>
    );
}

export default memo(LoadingButton);
