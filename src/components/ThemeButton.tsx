import classNames from "classnames";
import { useCallback, useMemo, type ButtonHTMLAttributes, type KeyboardEvent } from "react";
import { Theme, useTheme } from "../contexts/ThemeContext";
import { useDevice } from "../hooks/useDevice";
import type { DeviceSizeType, SizeTypeFull } from "../types/index.type";

export type ThemeButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    className?: string;
    margin?: SizeTypeFull | "2xs";
};

export const ThemeButton = ({ className = "", margin, ...props }: ThemeButtonProps) => {
    const { theme, onToggleTheme } = useTheme();
    const sizesDevice = useDevice();

    const handleClick = useCallback(() => {
        onToggleTheme?.();
    }, [onToggleTheme]);

    const handleKeyDown = useCallback(
        (event: KeyboardEvent) => {
            if (event.key === " ") {
                event.preventDefault();
                handleClick();
            }
            if (event.key === "Enter") handleClick();
        },
        [handleClick]
    );

    const isDarkTheme = theme === Theme.DARK;

    return (
        <div
            className={getContainerClasses(className, theme, sizesDevice, margin)}
            onClick={handleClick}
            role="button"
            tabIndex={0}
            aria-label={`Switch theme from ${theme} to ${isDarkTheme ? "light" : "dark"}`}
            onKeyDown={handleKeyDown}
            data-testid="theme-button"
        >
            <button
                className={getButtonClasses()}
                aria-label={getAriaLabel(theme, isDarkTheme)}
                title={`Currently ${theme} theme. Click to toggle.`}
                role="none"
                tabIndex={-1}
                {...props}
            >
                {renderThemeIcon(isDarkTheme, sizesDevice)}
            </button>
        </div>
    );
};

const getContainerClasses = (
    className: string,
    theme: Theme,
    sizesDevice: DeviceSizeType,
    margin?: SizeTypeFull | "2xs"
): string => {
    const { isMobile2Xs, isMobileXs, isMobileSm, isTablet, isDesktop } = sizesDevice;

    const iconSunContainer = classNames({
        "w-6 h-6": isMobile2Xs,
        "w-7 h-7": isMobileXs,
        "w-8 h-8": isMobileSm,
        "w-9 h-9": isTablet,
        "w-10 h-10": isDesktop,
    });

    const variantsMargin: Record<SizeTypeFull | "2xs", string> = useMemo(
        () => ({
            default: "mx-3 my-1.5",
            none: " ",
            "2xs": "mx-1 my-0.5",
            xs: "mx-2 my-1",
            sm: "mx-3 my-1",
            md: "mx-4 my-2",
            lg: "mx-6 my-3",
            xl: "mx-8 my-4",
        }),
        []
    );

    const autoMargin = classNames({
        "mx-2.5 my-1": isMobile2Xs || isMobileXs || isMobileSm,
        "mx-3 my-1.5": isTablet || isDesktop,
    });

    const currentMargin = classNames(margin ? variantsMargin[margin] : autoMargin);

    return classNames(
        `relative group rounded-full cursor-pointer border transition-all duration-500 ease-in-out active:scale-95 lg:hover:-translate-y-[1px] ${
            theme === "light" ? "border-warning-500 group-hover:border-warning-600" : "border-bg-alt"
        }`,
        "backdrop-blur-[15px]",
        "shadow-[0px_0px_0px_1px_rgba(0,0,0,0.01)]",
        "perfect-center",
        iconSunContainer,
        currentMargin,
        className
    );
};

const getButtonClasses = (): string => {
    return classNames("perfect-center cursor-pointer outline-none", "focus:outline-none rounded-full");
};

const getAriaLabel = (theme: Theme, isDarkTheme: boolean): string => {
    const targetTheme = isDarkTheme ? "light" : "dark";
    return `Switch theme from ${theme} to ${targetTheme}`;
};

const renderThemeIcon = (isDarkTheme: boolean, sizesDevice: DeviceSizeType) => {
    if (isDarkTheme) {
        return renderMoonIcon(sizesDevice);
    }

    return renderSunIcon(sizesDevice);
};

const renderMoonIcon = (sizesDevice: DeviceSizeType) => {
    const { isMobile2Xs, isMobileXs, isMobileSm, isTablet, isDesktop } = sizesDevice;

    const iconMoonConfig = classNames({
        "w-3.5 h-3.5 before:h-3 before:w-3 before:-right-0.5 before:top-0": isMobile2Xs,
        "w-4 h-4 before:h-3.5 before:w-3.5 before:-right-[2px] before:top-0": isMobileXs,
        "w-4.5 h-4.5 before:h-4 before:w-4 before:-right-[2px] before:top-0": isMobileSm,
        "w-5 h-5 before:h-4.5 before:w-4.5 before:-right-[2px] before:top-0": isTablet,
        "w-5.5 h-5.5 before:h-5 before:w-5 before:-right-[3px] before:-top-[1px]": isDesktop,
    });

    return (
        <span
            className={classNames(
                "relative z-10 rounded-full transition-all ease-in-out duration-xtraslow outline-none",
                "bg-bg-alt group-hover:bg-primary-dark shadow-2xs shadow-text-color-dark",
                'before:content-[""] before:rounded-full',
                "before:bg-bg-alt-dark before:absolute",
                iconMoonConfig
            )}
        />
    );
};

const renderSunIcon = (sizesDevice: DeviceSizeType) => {
    return (
        <>
            {renderSunCenter(sizesDevice)}
            {renderSunRays(sizesDevice)}
        </>
    );
};

const renderSunCenter = (sizesDevice: DeviceSizeType) => {
    const { isMobile2Xs, isMobileXs, isMobileSm, isTablet, isDesktop } = sizesDevice;

    const iconSunCenterConfig = classNames({
        "w-2.5 h-2.5": isMobile2Xs,
        "w-3 h-3": isMobileXs,
        "w-3.5 h-3.5": isMobileSm,
        "w-4 h-4": isTablet,
        "w-4.5 h-4.5": isDesktop,
    });

    return (
        <span
            className={classNames(
                "relative z-10 rounded-full transition-colors duration-xtraslow outline-none",
                "bg-warning-500 group-hover:bg-warning-600",
                iconSunCenterConfig
            )}
        />
    );
};

const renderSunRays = (sizesDevice: DeviceSizeType) => {
    const { isMobile2Xs, isMobileXs, isMobileSm, isTablet, isDesktop } = sizesDevice;

    const iconSunRaysConfig = classNames({
        "w-[16px] h-[16px]": isMobile2Xs,
        "w-[18px] h-[18px]": isMobileXs,
        "w-[20px] h-[20px]": isMobileSm,
        "w-[23px] h-[23px]": isTablet,
        "w-[26px] h-[26px]": isDesktop,
    });

    return (
        <div className={`absolute ${iconSunRaysConfig}`}>
            {Array.from({ length: 8 }, (_, index) => (
                <span key={index} className={getSunRayClasses(index)} />
            ))}
        </div>
    );
};

const getSunRayClasses = (rayIndex: number) => {
    const baseClasses =
        "absolute w-[1.5px] h-[2.5px] rounded-full bg-warning-500 group-hover:bg-warning-600 transition-colors duration-xtraslow outline-none";
    const positionClasses = getSunRayPosition(rayIndex);

    return classNames(baseClasses, positionClasses);
};

const getSunRayPosition = (index: number): string => {
    const positions: { [key: number]: string } = {
        0: "top-0 left-1/2 -translate-x-1/2", // Top
        1: "bottom-0 left-1/2 -translate-x-1/2", // Bottom
        2: "top-1/2 left-0 rotate-90 -translate-y-1/2", // Left
        3: "top-1/2 right-0 rotate-90 -translate-y-1/2", // Right
        4: "top-1/8 right-1/8 rotate-45", // Top-right
        5: "top-1/8 left-1/8 -rotate-45", // Top-left
        6: "bottom-1/8 left-1/8 rotate-45", // Bottom-left
        7: "bottom-1/8 right-1/8 -rotate-45", // Bottom-right
    };

    return positions[index];
};
