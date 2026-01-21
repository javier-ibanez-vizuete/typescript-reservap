import classNames from "classnames";
import { memo, useMemo, type ButtonHTMLAttributes, type MouseEvent, type ReactNode } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { useDevice } from "../../hooks/useDevice";
import type { SizeTypeFull, VariantType } from "../../types/index.type";

export type ButtonComponentProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onClick"> & {
    children: ReactNode;
    variant?: VariantType;
    padding?: SizeTypeFull | "2xs";
    onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
    className?: string;
    disabled?: boolean;
};

const baseButtonConfig =
    "cursor-pointer transition-all duration-xtraslow ease-in-out lg:focus:outline-none lg:focus:ring-2 lg:focus:ring-offset-2";

function Button({
    children,
    variant,
    padding,
    onClick,
    disabled,
    className,
    ...props
}: ButtonComponentProps) {
    const { isMobile2Xs, isMobileXs, isMobileSm, isTablet, isDesktop } = useDevice();
    const { theme } = useTheme();

    const handleClick = (event: MouseEvent<HTMLButtonElement>): void => {
        if (!disabled) onClick?.(event);
    };

    const variantsConfig = useMemo(
        () => ({
            default: {
                classes:
                    "bg-gray-400 border border-gray-500 shadow-sm hover:bg-gray-500/80 lg:focus:ring-gray-900",
                hasHoverEffects: true,
                hasActiveEffects: true,
                shadowColor: null,
            },
            primary: {
                classes: classNames("border shadow-sm", {
                    "bg-primary border-primary/90 hover:bg-primary/90 lg:focus:ring-primary":
                        theme === "light",
                    "bg-primary-dark border-primary-dark/90 hover:bg-primary-dark/90 lg:focus:ring-primary-dark":
                        theme !== "light",
                }),
                hasHoverEffects: true,
                hasActiveEffects: true,
                shadowColor: classNames({
                    "hover:shadow-primary/25": theme === "light",
                    "hover:shadow-primary-dark/25": theme !== "light",
                }),
            },
            secondary: {
                classes: classNames("border shadow-sm text-text", {
                    "bg-secondary border-secondary/90 hover:bg-secondary/90 lg:focus:ring-secondary":
                        theme === "light",
                    "bg-secondary-dark border-secondary-dark/90 hover:bg-secondary-dark/90 lg:focus:ring-secondary-dark":
                        theme !== "light",
                }),
                hasHoverEffects: true,
                hasActiveEffects: true,
                shadowColor: classNames({
                    "hover:shadow-secondary/25": theme === "light",
                    "hover:shadow-secondary-dark/25": theme !== "light",
                }),
            },
            outline: {
                classes: classNames("border bg-transparent hover:bg-gray-200/50 shadow-sm", {
                    "border-gray-600 lg:focus:ring-gray-600": theme === "light",
                    "border-gray-400 lg:focus:ring-gray-400": theme !== "light",
                }),
                hasHoverEffects: true,
                hasActiveEffects: true,
                shadowColor: null,
            },
            ghost: {
                classes:
                    "bg-transparent border border-transparent hover:bg-gray200/50 lg:focus:ring-gray-500",
                hasHoverEffects: false,
                hasActiveEffects: true,
                shadowColor: null,
            },
            danger: {
                classes:
                    "bg-error-600 text-white border border-error-500 shadow-sm hover:bg-error-500 lg:focus:ring-error-600",
                hasHoverEffects: true,
                hasActiveEffects: true,
                shadowColor: "hover:shadow-error-500/25",
            },
            none: {
                classes: "",
                hasHoverEffects: false,
                hasActiveEffects: true,
                shadowColor: null,
            },
        }),
        [theme]
    );

    const variantsPadding = {
        default: "px-3 py-1.5",
        none: " ",
        "2xs": "px-1 py-0.5",
        xs: "px-2 py-1",
        sm: "px-3 py-1.5",
        md: "px-4 py-2",
        lg: "px-6 py-3",
        xl: "px-8 py-4",
    };

    const autoConfig = useMemo(
        () => ({
            padding: classNames({
                "px-3 py-1.5": isMobile2Xs || isMobileXs || isMobileSm,
                "px-4 py-2": isTablet || isDesktop,
            }),
        }),
        [isMobile2Xs, isMobileXs, isMobileSm, isTablet, isDesktop]
    );

    const currentVariantConfig = useMemo(
        () => variantsConfig[variant ?? "default"],
        [variant, variantsConfig]
    );

    const currentButtonConfig = useMemo(
        () =>
            classNames(
                baseButtonConfig,
                currentVariantConfig?.classes,
                padding ? variantsPadding[padding ?? "default"] : autoConfig?.padding,
                {
                    "opacity-50 cursor-not-allowed pointer-events-none": disabled,
                    "hover:shadow-lg": !disabled && currentVariantConfig?.hasHoverEffects,
                    "active:scale-95": !disabled && currentVariantConfig?.hasActiveEffects,
                },
                !disabled && currentVariantConfig?.shadowColor,
                className
            ),
        [currentVariantConfig, padding, autoConfig?.padding]
    );

    return (
        <button
            type="button"
            disabled={disabled}
            onClick={handleClick}
            className={currentButtonConfig}
            {...props}
        >
            {children}
        </button>
    );
}

export default memo(Button);
