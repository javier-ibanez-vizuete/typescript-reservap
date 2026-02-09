import classNames from "classnames";
import React, { memo, useEffect, useMemo, useRef, type HTMLAttributes, type ReactNode } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { useDevice } from "../../hooks/useDevice";
import { useWindowWidth } from "../../hooks/useWindowWidth";
import type { SizeTypeFull, VariantType } from "../../types/index.type";
import type { DropdownItemProps } from "./DropdownItem";

export type DropdownMenuProps = {
    children: ReactNode;
    isOpen?: boolean;
    onClose?: () => void;
    placement?: string;
    variant?: VariantType | "background" | "accent";
    padding?: SizeTypeFull;
    gap?: SizeTypeFull;
    rounded?: SizeTypeFull;
    className?: string;
    direction?: "row" | "col";
} & HTMLAttributes<HTMLDivElement>;

const baseMenuClasses =
    "absolute z-50 flex flex-col transition-all duration-500 ease-in-out overflow-hidden max-w-[325px] xs:max-w-[375px] sm:max-w-[425px] md:max-w-[768px] lg:max-w-[1024px] xl:max-w-[1280px]";

const baseContainerItemsClasses = "flex flex-1 min-h-0 overflow-y-auto overflow-x-hidden scrollbar-hide";

function DropdownMenu({
    children,

    isOpen = false,

    onClose,

    placement,

    variant,

    padding,

    gap,

    rounded,

    className = "",

    direction = "col",

    ...props
}: DropdownMenuProps) {
    const { isMobile2Xs, isMobileXs, isMobileSm, isTablet, isDesktop } = useDevice();
    const { theme } = useTheme();
    const width = useWindowWidth();

    const containerRef = useRef<HTMLDivElement | null>(null);

    const containerItemHeightConfig = useMemo(
        () =>
            classNames({
                "max-h-[60vh]": isMobile2Xs || isMobileXs || isMobileSm,
                "max-h-[50vh]": isTablet,
                "max-h-[40vh]": isDesktop,
            }),
        [isMobile2Xs, isMobileXs, isMobileSm, isTablet, isDesktop]
    );

    useEffect(() => {
        if (!containerRef?.current) return;

        const container = containerRef.current;

        if (isOpen) {
            container.style.display = "flex";

            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    container.style.visibility = "visible";
                    container.style.opacity = "1";
                    container.style.height = `auto`;
                });
            });
        }
        if (!isOpen) {
            container.style.opacity = "0";
            container.style.height = "0";

            const timeOut = setTimeout(() => {
                if (container) {
                    container.style.visibility = "hidden";
                    container.style.display = "none";
                }
            }, 500);
            return () => clearTimeout(timeOut);
        }
    }, [isOpen, width]);

    const variantConfig: Record<VariantType | "background" | "accent", string> = useMemo(
        () => ({
            default: classNames("shadow-sm border lg:hover:shadow-md", {
                "bg-bg border-gray-300 shadow-text/40": theme === "light",
                "bg-bg-dark border-gray-3 shadow-text-dark/40": theme !== "light",
            }),
            primary: classNames("shadow-sm border lg:hover:shadow-md", {
                "bg-primary border-primary/60 shadow-text/40": theme === "light",
                "bg-primary-dark border-primary-dark/60 shadow-text-dark/40": theme !== "light",
            }),
            secondary: classNames("shadow-sm border lg:hover:shadow-md", {
                "bg-secondary border-secondary/60 shadow-text/40": theme === "light",
                "bg-secondary-dark border-secondary/60 shadow-text-dark/40": theme !== "light",
            }),
            outline: classNames("shadow-sm border lg:hover:shadow-md bg-transparent", {
                "border-gray-600 shadow-text/40": theme === "light",
                "border-gray-400 shadow-text-dark/40": theme !== "light",
            }),
            ghost: "shadow-sm shadow-text/40 bg-transparent border-transparent backdrop-blur-sm",
            background: classNames("shadow-sm border lg:hover:shadow-md", {
                "bg-bg border-bg/60 shadow-text/40": theme === "light",
                "bg-bg-dark border-bg-dark/60 shadow-text-dark/40": theme !== "light",
            }),
            accent: classNames("shadow-sm border lg:hover:shadow-md", {
                "bg-bg-alt border-bg-alt/60 shadow-text/40": theme === "light",
                "bg-bg-alt-dark border-bg-alt-dark/60 shadow-text-dark/40": theme !== "light",
            }),
            danger: classNames("shadow-sm border lg:hover:shadow-md", {
                "bg-error-600 border-error-500 shadow-text/40": theme === "light",
                "bg-error-500 border-error-400 shadow-text-dark/40": theme !== "light",
            }),
            none: " ",
        }),
        [theme]
    );

    const variantsPadding = useMemo(
        () => ({
            default: "p-3",
            none: " ",
            xs: "p-2",
            sm: "p-3",
            md: "p-4",
            lg: "p-6",
            xl: "p-8",
        }),
        []
    );

    const variantsGap = useMemo(
        () => ({
            default: "gap-sm",
            none: " ",
            xs: "gap-xs",
            sm: "gap-sm",
            md: "gap-md",
            lg: "gap-lg",
            xl: "gap-xl",
        }),
        []
    );

    const variantsRounded = useMemo(
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
                "px-2 py-0.5": isMobile2Xs || isMobileXs,
                "px-2.5 py-1": isMobileSm,
                "px-3 py-1.5": isTablet || isDesktop,
            }),
            gap: classNames({
                "gap-1": isMobile2Xs || isMobileXs,
                "gap-2": isMobileSm || isTablet,
                "gap-3": isDesktop,
            }),
            rounded: classNames({
                "rounded-sm": isMobile2Xs || isMobileXs,
                "rounded-default": isMobileSm || isTablet,
                "rounded-md": isDesktop,
            }),
            color: classNames(" border shadow-sm lg:hover:shadow-md", {
                "bg-bg border-bg/90 lg:hover:bg-bg/90 shadow-text/40": theme === "light",
                "bg-bg-dark border-bg-dark/90 lg:hover:bg-bg-dark/90 shadow-text-dark/40": theme !== "light",
            }),
        }),
        [isMobile2Xs, isMobileXs, isMobileSm, isTablet, isDesktop, theme]
    );

    const currentMenuClasses = useMemo(
        () =>
            classNames(
                baseMenuClasses,
                variant?.trim() ? variantConfig[variant] || variantConfig["default"] : autoConfig?.color,
                padding?.trim()
                    ? variantsPadding[padding] || variantsPadding["default"]
                    : autoConfig?.padding,
                rounded?.trim()
                    ? variantsRounded[rounded] || variantsRounded["default"]
                    : autoConfig?.rounded,
                placement,
                className
            ),
        [variant, padding, rounded, placement, className, autoConfig]
    );

    const currentContainerItemClasses = useMemo(
        () =>
            classNames(
                baseContainerItemsClasses,
                containerItemHeightConfig,
                gap?.trim() ? variantsGap[gap] || variantsGap["default"] : autoConfig?.gap,
                {
                    "overflow-hidden": !isOpen,
                    "flex-col": direction === "col",
                    "flex-row": direction === "row",
                }
            ),
        [containerItemHeightConfig, gap, autoConfig?.gap, direction]
    );

    if (!isOpen) return null;

    return (
        <div
            ref={containerRef}
            className={currentMenuClasses}
            role="menu"
            data-state={isOpen && "open"}
            style={{
                display: "none",
                visibility: "hidden",
                opacity: 0,
                transformOrigin: "top-right",
            }}
            {...props}
        >
            <div className={currentContainerItemClasses}>
                {React.Children.map(children, (child) => {
                    if (React.isValidElement<DropdownItemProps>(child)) {
                        return React.cloneElement(child, { onClose });
                    }
                    return child;
                })}
            </div>
        </div>
    );
}

export default memo(DropdownMenu);
