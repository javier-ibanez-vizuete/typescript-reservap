import classNames from "classnames";
import { memo, useMemo } from "react";
import { NavLink, type NavLinkRenderProps } from "react-router-dom";
import { useTheme } from "../contexts/ThemeContext";
import { useDevice } from "../hooks/useDevice";
import { useTranslate } from "../translations/useTranslate";

export type NavbarLinksProps = {
    tabAccess: boolean;
    className?: string;
    handleLinkClick?: () => void;
};

const baseNavbarLinksConfig = "flex flex-1 self-stretch 2xs:gap-xs xs:gap-sm";

function NavbarLinks({ tabAccess, className, handleLinkClick }: NavbarLinksProps) {
    const { isMobile, isTablet, isDesktop } = useDevice();
    const { t } = useTranslate();
    const { theme } = useTheme();

    const NAV_LINKS = [
        { to: "menu", label: t("navbar.navbar_links.menu") },
        { to: "orders", label: t("navbar.navbar_links.orders") },
        { to: "cart", label: t("navbar.navbar_links.cart") },
        { to: "bookings", label: t("navbar.navbar_links.bookings") },
    ];

    const autoConfig = useMemo(
        () => ({
            ulStyle: classNames({
                "flex-col": isMobile || isTablet,
                "flex-row justify-center gap-md": isDesktop,
            }),
        }),
        [isMobile, isTablet, theme]
    );

    const currentNavbarLinksConfig = useMemo(
        () => classNames(baseNavbarLinksConfig, autoConfig?.ulStyle, className),
        [autoConfig?.ulStyle]
    );

    // if (!isLoggedIn) return null;
    return (
        <ul className={currentNavbarLinksConfig}>
            {NAV_LINKS.map((link) => (
                <li className="perfect-center" key={link?.to}>
                    <NavLink
                        tabIndex={tabAccess ? 0 : -1}
                        to={link?.to}
                        onClick={handleLinkClick}
                        className={({ isActive }: NavLinkRenderProps) =>
                            `navbar-link ${theme} ${isActive ? "active" : ""}`
                        }
                    >
                        {link.label}
                    </NavLink>
                </li>
            ))}
        </ul>
    );
}

export default memo(NavbarLinks);
