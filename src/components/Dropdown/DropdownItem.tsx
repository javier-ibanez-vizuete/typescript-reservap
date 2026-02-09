import classNames from "classnames";
import { memo, useCallback, useMemo, type HTMLAttributes, type MouseEvent, type ReactNode } from "react";
import { useDevice } from "../../hooks/useDevice";
import type { SizeTypeFull } from "../../types/index.type";

export type DropdownItemProps = {
    children: ReactNode;
    onClick?: () => void;
    onClose?: () => void;
    padding?: SizeTypeFull | "2xs";
    disabled?: boolean;
    className?: string;
} & HTMLAttributes<HTMLDivElement>;

function DropdownItem({
    children,

    onClick,

    onClose,

    padding,

    disabled = false,

    className = "",

    ...props
}: DropdownItemProps) {
    const { isMobile2Xs, isMobileXs, isMobileSm, isTablet, isDesktop } = useDevice();

    const handleClick = useCallback(
        (event: MouseEvent<HTMLDivElement>) => {
            if (disabled) return;
            onClick?.(event);
            onClose?.();
        },
        [disabled]
    );

    const baseItemClasses = useMemo(
        () =>
            classNames(
                "cursor-pointer whitespace-nowrap transition-all duration-500 ease-in-out lg:hover:-translate-y-[2px]",
                {
                    "opacity-50 cursor-not-allowed": disabled,
                }
            ),
        [disabled]
    );

    const variantsPadding: Record<SizeTypeFull | "2xs", string> = useMemo(
        () => ({
            default: "px-3 py-1.5",
            none: " ",
            "2xs": "px-1 py-0.5",
            xs: "px-2 py-1",
            sm: "px-3 py-1.5",
            md: "px-4 py-2",
            lg: "px-6 py-3",
            xl: "px-8 py-4",
        }),
        []
    );

    const autoConfig = useMemo(
        () => ({
            padding: classNames({
                "px-3 py-1.5": isMobile2Xs || isMobileXs || isMobileSm,
                "px-4 py-2": isTablet || isDesktop,
            }),
        }),
        [isMobile2Xs, isMobileXs, isMobileSm, isTablet, isDesktop]
    );

    const currentItemClasses = useMemo(
        () =>
            classNames(
                baseItemClasses,
                padding?.trim()
                    ? variantsPadding[padding] || variantsPadding["default"]
                    : autoConfig?.padding,
                className
            ),
        [baseItemClasses, padding, autoConfig?.padding, className]
    );

    return (
        <div
            className={currentItemClasses}
            onClick={handleClick}
            role="menuitem"
            tabIndex={disabled ? -1 : 0}
            aria-disabled={disabled}
            {...props}
        >
            {typeof children === "string" && <p>{children}</p>}
            {typeof children !== "string" && children}
        </div>
    );
}

export default memo(DropdownItem);
