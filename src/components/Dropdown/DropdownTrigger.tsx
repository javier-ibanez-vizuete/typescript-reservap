import classNames from "classnames";
import { forwardRef, useMemo, type HTMLAttributes, type MouseEvent, type ReactNode } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { useDevice } from "../../hooks/useDevice";
import type { SizeTypeFull, VariantType } from "../../types/index.type";

export type DropdownTriggerProps = {
    children: ReactNode;
    variant?: VariantType;
    padding?: SizeTypeFull | "2xs";
    rounded?: SizeTypeFull;
    onClick?: (event: MouseEvent<HTMLDivElement>) => void;
    isOpen?: boolean;
    disabled?: boolean;
    shadow?: boolean;
    className?: string;
} & HTMLAttributes<HTMLDivElement>;

export const DropdownTrigger = forwardRef<HTMLDivElement, DropdownTriggerProps>(
    (
        {
            children,
            variant,
            padding,
            rounded,
            onClick,
            isOpen,
            disabled,
            shadow = true,
            className = "",
            ...props
        },
        ref
    ) => {
        const { isMobile2Xs, isMobileXs, isMobileSm, isTablet, isDesktop } = useDevice();
        const { theme } = useTheme();

        const baseTriggerClasses = useMemo(
            () =>
                classNames(
                    "cursor-pointer perfect-center transition-all duration-500 ease-in-out lg:focus:outline-none lg:focus:ring-1 lg:focus:ring-offset-2",
                    {
                        "cursor-not-allowed": disabled,
                        "shadow-sm": shadow,
                    }
                ),
            [shadow, disabled]
        );

        const variantsConfig: Record<
            VariantType,
            {
                classes: string;
                hasHoverEffects: boolean;
                hasActiveEffects: boolean;
                shadowColor: string | null;
            }
        > = useMemo(
            () => ({
                default: {
                    classes:
                        "bg-gray-400  border border-gray-500 shadow-sm hover:bg-gray-500/80 focus:ring-gray-900",
                    hasHoverEffects: true,
                    hasActiveEffects: true,
                    shadowColor: null,
                },
                primary: {
                    classes:
                        "bg-primary border border-primary/90 shadow-sm hover:bg-primary/90 focus:ring-primary",
                    hasHoverEffects: true,
                    hasActiveEffects: true,
                    shadowColor: "hover:shadow-admin-primary-color/25",
                },
                secondary: {
                    classes:
                        "bg-secondary border border-secondary/90 shadow-sm hover:bg-secondary/90 focus:ring-secondary",
                    hasHoverEffects: true,
                    hasActiveEffects: true,
                    shadowColor: "hover:shadow-admin-secondary-color/25",
                },
                outline: {
                    classes: `bg-transparent border border-gray-500 shadow-sm hover:bg-gray-300 focus:ring-gray-500`,
                    hasHoverEffects: true,
                    hasActiveEffects: true,
                    shadowColor: null,
                },
                ghost: {
                    classes: "bg-transparent border-transparent hover:bg-gray-200/50 focus:ring-gray-500",
                    hasHoverEffects: false,
                    hasActiveEffects: false,
                    shadowColor: null,
                },
                danger: {
                    classes:
                        "bg-error-600 text-white border border-error-500 shadow-md hover:bg-error-500 focus:ring-error-500",
                    hasHoverEffects: true,
                    hasActiveEffects: true,
                    shadowColor: "hover:shadow-error-600/25",
                },
                none: {
                    classes: " ",
                    hasHoverEffects: false,
                    hasActiveEffects: true,
                    shadowColor: null,
                },
            }),
            []
        );

        const variantsPadding: Record<SizeTypeFull | "2xs", string> = useMemo(
            () => ({
                default: "px-3 py-1.5",
                none: " ",
                "2xs": "px-1 py-0.5",
                xs: "px-2 py-1",
                sm: "px-3 py-1",
                md: "px-4 py-2",
                lg: "px-6 py-3",
                xl: "px-8 py-4",
            }),
            []
        );

        const variantsRounded: Record<SizeTypeFull, string> = useMemo(
            () => ({
                default: "rounded-default",
                none: " ",
                xs: "rounded-xs",
                sm: "rounded-sm",
                md: "rounded-md",
                lg: "rounded-lg",
                xl: "rounded-xl",
            }),
            []
        );

        const autoConfig = useMemo(
            () => ({
                padding: classNames({
                    "px-2.5 py-1": isMobile2Xs || isMobileXs || isMobileSm,
                    "px-3 py-1.5": isTablet || isDesktop,
                }),
                variant: classNames("border active:scale-95 active:shadow-md", {
                    "bg-bg-alt border-bg-alt/90 lg:hover:bg-bg-alt/90 lg:focus:ring-bg-alt":
                        theme === "light",
                    "bg-bg-alt-dark border-bg-alt-dark/90 lg:hover:bg-bg-alt-dark/90 lg:focus:ring-bg-alt-dark":
                        theme !== "light",
                }),
                rounded: classNames({
                    "rounded-xs": isMobile2Xs || isMobileXs,
                    "rounded-default": isMobileSm || isTablet || isDesktop,
                }),
            }),
            [isMobile2Xs, isMobileXs, isMobileSm, isTablet, isDesktop, theme]
        );

        const currentClasses = useMemo(
            () =>
                classNames(
                    baseTriggerClasses,
                    variant?.trim()
                        ? variantsConfig[variant]?.classes || variantsConfig["default"].classes
                        : autoConfig?.variant,
                    padding?.trim()
                        ? variantsPadding[padding] || variantsPadding["default"]
                        : autoConfig?.padding,
                    rounded?.trim()
                        ? variantsRounded[rounded] || variantsRounded["default"]
                        : autoConfig?.rounded,
                    shadow &&
                        variant &&
                        variantsConfig[variant]?.shadowColor &&
                        variantsConfig[variant].shadowColor,
                    {
                        "opacity-50 cursor-not-allowed pointer-events-none": disabled,
                        "lg:hover:shadow-xl":
                            !disabled &&
                            shadow &&
                            variantsConfig[variant ? variant : "default"]?.hasHoverEffects,
                        "active:scale-95 active:shadow-lg":
                            !disabled && variantsConfig[variant ? variant : "default"]?.hasActiveEffects,
                    },
                    className
                ),
            [variant, padding, rounded, autoConfig, disabled, shadow, baseTriggerClasses, className]
        );

        return (
            <div
                ref={ref}
                onClick={onClick}
                className={currentClasses}
                role="button"
                tabIndex={disabled ? -1 : 0}
                aria-disabled={disabled ?? false}
                data-state={isOpen ? "open" : "closed"}
                {...props}
            >
                {typeof children === "string" && <p>{children}</p>}
                {typeof children !== "string" && children}
            </div>
        );
    }
);
