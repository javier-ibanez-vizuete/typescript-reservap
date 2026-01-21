import classNames from "classnames";
import { useMemo, type ReactNode } from "react";
import { useDevice } from "../../hooks/useDevice";
import type { SizeType } from "../../types/index.type";

export type ContainerProps = {
    children: ReactNode;
    direction?: "col" | "row";
    padding?: SizeType;
    width?: SizeType | "default";
    className?: string;
};

const base = "flex flex-1 xl:mx-auto";

export function Container({ children, direction, padding, width, className = "" }: ContainerProps) {
    const { isMobile2Xs, isMobileXs, isMobileSm, isTablet, isDesktop } = useDevice();

    const variantsDirection = {
        col: "flex-col",
        row: "flex-row",
    };

    const variantsPadding = {
        xs: "px-xs",
        sm: "px-sm",
        md: "px-md",
        lg: "px-lg",
        xl: "px-xl",
    };

    const variantsWidth = {
        xs: "xl:w-[1080px]",
        sm: "xl:w-[1180px]",
        default: "xl:w-[1280px]",
        md: "xl:w-[1320px]",
        lg: "xl:w-[1360px]",
        xl: "xl:w-[1400px]",
    };

    const autoConfig = useMemo(
        () =>
            classNames({
                "px-xs": isMobile2Xs,
                "px-sm": isMobileXs,
                "px-md": isMobileSm,
                "px-lg": isTablet,
                "px-xl": isDesktop,
            }),
        [isMobile2Xs, isMobileXs, isMobileSm, isTablet, isDesktop]
    );

    const currentContainerClasses = useMemo(
        () =>
            classNames(
                base,
                variantsDirection[direction ?? "col"],
                padding ? variantsPadding[padding ?? "sm"] : autoConfig,
                variantsWidth[width ?? "default"],
                className
            ),
        [direction, padding, width, className, autoConfig]
    );

    return <div className={currentContainerClasses}>{children}</div>;
}
