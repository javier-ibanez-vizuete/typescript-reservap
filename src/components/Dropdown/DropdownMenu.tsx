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
    // padding?: Omit<SizeTypeFull, "none">;
    gap?: SizeTypeFull;
    rounded?: SizeTypeFull;
    className?: string;
} & HTMLAttributes<HTMLDivElement>;

const baseMenuClasses =
    "absolute z-50 flex flex-col transition-all duration-500 ease-in-out overflow-hidden max-w-[325px] xs:max-w-[375px] sm:max-w-[425px] md:max-w-[768px] lg:max-w-[1024px] xl:max-w-[1280px]";

const baseContainerItemsClasses =
    "flex flex-col flex-1 min-h-0 overflow-y-auto overflow-x-hidden scrollbar-hide";

function DropdownMenu({
    children,

    isOpen,

    onClose,

    placement,

    variant,

    padding,

    gap,

    rounded,

    className = "",

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
            default: classNames("shadow-lg border", {
                "bg-bg border-green-300": theme === "light",
                "bg-bg-dark border-gray-3": theme !== "light",
            }),
            primary: classNames("shadow-lg border", {
                "bg-primary border-primary/60": theme === "light",
                "bg-primary-dark border-primary-dark/60": theme !== "light",
            }),
            secondary: classNames("shadow-lg border", {
                "bg-secondary border-secondary/60": theme === "light",
                "bg-secondary-dark border-secondary/60": theme !== "light",
            }),
            outline: classNames("shadow-lg border bg-transparent", {
                "border-gray-600": theme === "light",
                "border-gray-400": theme !== "light",
            }),
            ghost: "shadow-lg bg-transparent border-transparent backdrop-blur-sm",
            background: classNames("shadow-lg border", {
                "bg-bg border-bg/60": theme === "light",
                "bg-bg-dark border-bg-dark/60": theme !== "light",
            }),
            accent: classNames("shadow-lg border", {
                "bg-bg-alt border-bg-alt/60": theme === "light",
                "bg-bg-alt-dark border-bg-alt-dark/60": theme !== "light",
            }),
            danger: classNames("shadow-lg border", {
                "bg-error-600 border-error-500": theme === "light",
                "bg-error-500 border-error-400": theme !== "light",
            }),
            none: " ",
        }),
        [theme]
    );

    const variantsPadding = useMemo(
        () => ({
            default: "p-sm",
            none: " ",
            xs: "p-xs",
            sm: "p-sm",
            md: "p-md",
            lg: "p-lg",
            xl: "p-xl",
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
                "px-xs py-2xs": isMobile2Xs || isMobileXs,
                "px-sm py-xs": isMobileSm,
                "px-md py-sm": isTablet || isDesktop,
            }),
            gap: classNames({
                "gap-xs": isMobile2Xs || isMobileXs,
                "gap-sm": isMobileSm || isTablet,
                "gap-md": isDesktop,
            }),
            rounded: classNames({
                "rounded-sm": isMobile2Xs || isMobileXs,
                "rounded-default": isMobileSm || isTablet,
                "rounded-md": isDesktop,
            }),
            color: classNames("bg-transparent border shadow-sm lg:hover:shadow-md", {
                "border-admin-text-color/90 lg:hover:bg-admin-text-color/10": theme === "light",
                "border-admin-text-color-dark/90 lg:hover:bg-admin-text-color-dark/10": theme !== "light",
            }),
        }),
        [isMobile2Xs, isMobileXs, isMobileSm, isTablet, isDesktop, theme]
    );

    const currentMenuClasses = useMemo(
        () =>
            classNames(
                baseMenuClasses,
                variant ? variantConfig[variant ?? "default"] : autoConfig?.color,
                padding ? variantsPadding[padding ?? "default"] : autoConfig?.padding,
                rounded ? variantsRounded[rounded ?? "default"] : autoConfig?.rounded,
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
                gap ? variantsGap[gap ?? "default"] : autoConfig?.gap,
                {
                    "overflow-hidden": !isOpen,
                }
            ),
        [containerItemHeightConfig, gap, autoConfig?.gap]
    );

    if (!isOpen) return null;

    return (
        <div
            ref={containerRef}
            className={currentMenuClasses}
            role="menu"
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
