import classNames from "classnames";
import { memo, useMemo } from "react";
import { useTheme } from "../contexts/ThemeContext";
import { useDevice } from "../hooks/useDevice";

type BurgerButtonProps = {
    isMobileMenuOpen: boolean;
    toggleMobileMenu: () => void;
};

const baseClasses = "relative cursor-pointer m-auto active:scale-95";

function BurgerButton({ isMobileMenuOpen, toggleMobileMenu }: BurgerButtonProps) {
    const { isMobile2Xs, isMobileXs, isMobileSm, isTablet, isDesktop } = useDevice();
    const { theme } = useTheme();

    const iconBaseClasses = useMemo(
        () =>
            `absolute left-0 right-0 h-1 rounded-sm shadow-xs transition-all duration-500 ease-in-out ${
                theme === "light" ? "bg-text shadow-text" : "bg-text-dark shadow-text-dark"
            }`,
        [theme]
    );

    const containerSizeConfig = useMemo(
        () =>
            classNames({
                "w-7 h-7": isMobile2Xs || isMobileXs || isMobileSm,
                "w-9 h-9": isTablet,
            }),
        [isMobile2Xs, isMobileXs, isMobileSm, isTablet]
    );

    const iconSize = useMemo(() => {
        if (isMobile2Xs && !isMobileMenuOpen) return 28;
        if (isMobile2Xs && isMobileMenuOpen) return 28 * Math.sqrt(2) - 7;

        if (isMobileXs && !isMobileMenuOpen) return 28;
        if (isMobileXs && isMobileMenuOpen) return 28 * Math.sqrt(2) - 7;

        if (isMobileSm && !isMobileMenuOpen) return 28;
        if (isMobileSm && isMobileMenuOpen) return 28 * Math.sqrt(2) - 8;

        if (isTablet && !isMobileMenuOpen) return 36;
        if (isTablet && isMobileMenuOpen) return 36 * Math.sqrt(2) - 8;
    }, [isMobile2Xs, isMobileXs, isMobileSm, isTablet, isDesktop, isMobileMenuOpen]);

    return (
        <div className="perfect-center flex-1 p-1">
            <input
                id="burger-checkbox"
                type="checkbox"
                className="hidden"
                checked={isMobileMenuOpen}
                onChange={toggleMobileMenu}
            />
            <label htmlFor="burger-checkbox" className={classNames(baseClasses, containerSizeConfig)}>
                <div
                    className={classNames(iconBaseClasses, {
                        "top-0 origin-left -left-0.5 rotate-410 delay-0": isMobileMenuOpen,
                        "top-0 delay-200": !isMobileMenuOpen,
                    })}
                    style={{ width: `${iconSize}px` }}
                />

                <div
                    className={classNames(
                        iconBaseClasses,
                        {
                            "opacity-0 -rotate-410 delay-100": isMobileMenuOpen,
                            "opacity-100 delay-100": !isMobileMenuOpen,
                        },
                        "top-1/2 -translate-y-1/2"
                    )}
                />

                <div
                    className={classNames(
                        iconBaseClasses,
                        {
                            "origin-left -left-0.5 -rotate-410 delay-200": isMobileMenuOpen,
                            "delay-0": !isMobileMenuOpen,
                        },
                        "top-full -translate-y-full"
                    )}
                    style={{ width: `${iconSize}px` }}
                />
            </label>
        </div>
    );
}

export default memo(BurgerButton);
