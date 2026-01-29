import classNames from "classnames";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "../contexts/ThemeContext";
import { useAuth } from "../core/auth/useAuth";
import { LOGO_DARK, LOGO_LIGHT } from "../data/logoData";
import { useDevice } from "../hooks/useDevice";
import { useWindowWidth } from "../hooks/useWindowWidth";
import LanguagesSelector from "../translations/LanguagesSelector";
import { useTranslate } from "../translations/useTranslate";
import type { SizeType } from "../types/index.type";
import BurgerButton from "./BurgerButton";
import NavbarLinks from "./NavbarLinks";
import ProfileButton from "./ProfileButton";
import { ThemeButton } from "./ThemeButton";
import Button from "./UI/Button";
import { Container } from "./UI/Container";
import Image from "./UI/Image";
import ImageContainer from "./UI/ImageContainer";

export type NavbarProps = {
    height?: SizeType | "default";
    padding?: SizeType | "default" | "none";
    logoSize?: SizeType | "default";
};

const baseNavbarConfig =
    "flex flex-col w-full shadow-md z-1 shrink-0 transition-all duration-500 ease-in-out";
const baseNavbarInnerConfig = "flex justify-between items-center";
const baseNavbarMenuContainerConfig = "justify-center items-center overflow-hidden";
const baseNavbarActionsConfig = "flex items-center lg:gap-sm";
const baseNavbarUserProfileConfig = "flex items-center transition-all duration-500 gap-2";
const baseMobileMenuConfig =
    "flex flex-col min-h-0 overflow-hidden transition-all p-0 duration-500 ease-in-out z-50";

const baseLogoConfig = "perfect-center cursor-pointer gap-xs md:gap-sm";
const baseLogoIcon = "flex-1 max-w-8 hover:scale-105 transition-transform duration-slow ease-in-out";

function Navbar({ height, padding, logoSize }: NavbarProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const mobileNavRef = useRef<HTMLDivElement | null>(null);

    const { isMobile2Xs, isMobileXs, isMobileSm, isMobile, isTablet, isDesktop } = useDevice();
    const width = useWindowWidth();

    const { pathname } = useLocation();
    const navigate = useNavigate();
    const { isLoggedIn } = useAuth();
    const { theme } = useTheme();
    const { t } = useTranslate();

    useEffect(() => setIsMenuOpen(false), [pathname]);

    useEffect(() => {
        if (!mobileNavRef?.current) return;

        const mobileMenu = mobileNavRef?.current?.style;

        if (isMenuOpen) mobileMenu.height = `${mobileNavRef?.current.scrollHeight + 12}px`;
        if (!isMenuOpen) mobileMenu.height = "0";
    }, [isMenuOpen, width]);

    const handleCloseMobileMenu = useCallback(() => setIsMenuOpen(false), []);

    const toggleMobileMenu = useCallback(() => setIsMenuOpen((prev) => !prev), []);

    const handleLogin = useCallback(() => {
        handleCloseMobileMenu();
        navigate("login");
    }, [navigate]);

    const handleRegister = useCallback(() => {
        handleCloseMobileMenu();
        navigate("register");
    }, [navigate]);

    const handleLinkClick = useCallback(() => handleCloseMobileMenu(), []);

    const variantsHeight = {
        default: "h-15",
        xs: "h-15",
        sm: "h-16",
        md: "h-17",
        lg: "h-18",
        xl: "h-19",
    };

    const variantsPadding = {
        default: "py-xs",
        none: " ",
        xs: "py-xs",
        sm: "py-sm",
        md: "py-md",
        lg: "py-lg",
        xl: "py-xl",
    };

    const variantsLogoSize = {
        default: "w-12",
        xs: "w-8",
        sm: "w-10",
        md: "w-14",
        lg: "w-16",
        xl: "w-18",
    };

    const autoConfig = useMemo(
        () => ({
            logoSize: classNames({
                "w-6": isMobile2Xs,
                "w-7": isMobileXs,
                "w-8": isMobileSm,
                "w-9": isTablet,
                "w-10": isDesktop,
            }),
            height: classNames({
                "h-14": isMobile2Xs,
                "h-15": isMobileXs,
                "h-16": isMobileSm,
                "h-17": isTablet,
                "h-20": isDesktop,
            }),
            padding: classNames({
                "py-md": isMobile2Xs || isMobileXs || isMobileSm || isTablet,
                "py-lg": isDesktop,
            }),
        }),
        [isMobile2Xs, isMobileXs, isMobileSm, isTablet, isDesktop, width]
    );

    const currentNavbarConfig = useMemo(
        () =>
            classNames(baseNavbarConfig, {
                "bg-bg-alt text-text": theme === "light",
                "bg-bg-alt-dark text-text-dark": theme !== "light",
            }),
        [theme]
    );

    const currentNavbarInnerConfig = useMemo(
        () =>
            classNames(
                baseNavbarInnerConfig,
                height ? variantsHeight[height ?? "default"] : autoConfig?.height,
                padding ? variantsPadding[padding ?? "default"] : autoConfig?.padding
            ),
        [height, padding, autoConfig?.height, autoConfig?.padding]
    );

    const currentLogoSize = useMemo(
        () => classNames(logoSize ? variantsLogoSize[logoSize ?? "default"] : autoConfig.logoSize),
        [logoSize]
    );

    const currentLogoTheme = useMemo(() => {
        if (theme === "light") return LOGO_LIGHT;
        return LOGO_DARK;
    }, [theme]);

    const currentNavbarMenuContainerConfig = useMemo(
        () =>
            classNames(baseNavbarMenuContainerConfig, {
                hidden: isMobile || isTablet,
                "flex self-stretch flex-1": !isMobile && !isTablet,
            }),
        [isMobile, isTablet]
    );

    const currentMobileMenuConfig = useMemo(
        () =>
            classNames(baseMobileMenuConfig, {
                hidden: !isMobile && !isTablet,
                "cursor-not-allowed": !isMenuOpen,
                "bg-bg-alt": theme === "light",
                "bg-bg-alt-dark": theme !== "light",
            }),
        [isMobile, isTablet, isMenuOpen]
    );

    return (
        <nav className={currentNavbarConfig}>
            <Container>
                <div className={currentNavbarInnerConfig}>
                    <Link className={baseLogoConfig} to={"/"}>
                        <ImageContainer className={baseLogoIcon} size={currentLogoSize}>
                            <Image imageData={currentLogoTheme} />
                        </ImageContainer>
                        {isLoggedIn && !isMobile && <h3>ReservApp</h3>}
                    </Link>
                    {isLoggedIn && (
                        <div className={currentNavbarMenuContainerConfig}>
                            <NavbarLinks handleLinkClick={handleLinkClick} />
                        </div>
                    )}
                    <div className={baseNavbarActionsConfig}>
                        <ThemeButton />
                        <LanguagesSelector placement="bottom-end" onClick={handleCloseMobileMenu} />
                        {!isLoggedIn && (
                            <div className="perfect-center self-center gap-xs lg:gap-sm">
                                <Button onClick={handleLogin} variant="primary" className="whitespace-nowrap">
                                    {t("navbar.login_button")}
                                </Button>
                                <Button onClick={handleRegister} variant="secondary">
                                    {t("navbar.register_button")}
                                </Button>
                            </div>
                        )}
                        {isLoggedIn && (
                            <>
                                <div className={baseNavbarUserProfileConfig}>
                                    {!pathname.includes("/profile") && (
                                        <ProfileButton onClick={handleCloseMobileMenu} />
                                    )}
                                </div>
                                <div
                                    className={`flex flex-col lg:hidden ${autoConfig?.height} ${autoConfig?.padding}`}
                                >
                                    <BurgerButton
                                        isMobileMenuOpen={isMenuOpen}
                                        toggleMobileMenu={toggleMobileMenu}
                                    />
                                </div>
                            </>
                        )}
                    </div>
                </div>
                <div ref={mobileNavRef} className={currentMobileMenuConfig}>
                    <NavbarLinks handleLinkClick={handleLinkClick} />
                </div>
            </Container>
        </nav>
    );
}

export default memo(Navbar);
