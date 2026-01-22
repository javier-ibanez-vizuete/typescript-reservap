import classNames from "classnames";
import { memo, useCallback, useMemo, type HTMLAttributes, type MouseEvent, type ReactNode } from "react";
import { useTheme } from "../contexts/ThemeContext.js";
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
    "inline-flex items-center justify-center font-medium transition-all duration-500 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 cursor-pointer relative";

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
    const { theme } = useTheme();

    const variantClasses: Record<VariantType, string> = useMemo(
        () => ({
            default:
                "bg-gray-50 text-text-color border border-gray-500 hover:bg-gray-500/80 focus:ring-gray-900",
            primary: classNames("border shadow-sm", {
                "bg-primary border-primary/90 lg:hover:bg-primary/90 lg:hover:shadow-primary/40":
                    theme === "light",
                "bg-primary-dark border-primary-dark/90 lg:hover:bg-primary/90 lg:hover:shadow-primary-dark/40":
                    theme !== "light",
            }),
            secondary: classNames("border shadow-sm", {
                "bg-secondary border-secondary/90 lg:hover:bg-secondary/90 lg:hover:shadow-secondary/40":
                    theme === "light",
                "bg-secondary-dark border-secondary/90 lg:hover:bg-secondary-dark/90 lg:hover:shadow-secondary-dark/40":
                    theme !== "light",
            }),
            outline: classNames("border bg-transparent lg:hover:bg-gray-200/50 shadow-sm", {
                "border-gray-600 lg:focus:ring-gray-600": theme === "light",
                "border-gray-400 lg:focus:ring-gray-400": theme !== "light",
            }),
            ghost: "bg-transparent text-text-color border-transparent hover:bg-gray-100 focus:ring-gray-500",
            danger: "bg-error-500 text-white border border-error-600 hover:bg-error-600 focus:ring-error-500 shadow-sm",
            none: " ",
        }),
        [theme]
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
                    "hover:shadow-md": !isDisabled && variant !== "ghost",
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
