import classNames from "classnames";
import { ArrowRight } from "lucide-react";
import { memo, useMemo } from "react";
import { Link } from "react-router-dom";
import { Theme, useTheme } from "../../contexts/ThemeContext";
import { useDevice } from "../../hooks/useDevice";

type CTAButtonProps = {
    buttonText: string;
    redirectTo: string;
};

const baseCTAButtonClasses =
    "inline-flex items-center font-semibold shadow-sm lg:hover:shadow-md transition-all duration-500 ease-in-out active:scale-95";

function CTAButton({ buttonText, redirectTo }: CTAButtonProps) {
    const { isMobile, isTablet, isDesktop } = useDevice();
    const { theme } = useTheme();

    const autoCTAButtonConfig = useMemo(
        () => ({
            padding: classNames({
                "px-3 py-1.5 text-xs": isMobile,
                "px-4 py-2 text-base": isTablet || isDesktop,
            }),
            gap: classNames({
                "gap-1": isMobile,
                "gap-2 lg:hover:gap-3": isTablet || isDesktop,
            }),
            background: classNames({
                "bg-primary": theme === Theme.LIGHT,
                "bg-primary-dark": theme !== Theme.LIGHT,
            }),
            rounded: classNames({
                "rounded-default": isMobile || isTablet,
                "rounded-md": isDesktop,
            }),
        }),
        [isMobile, isTablet, isDesktop, theme, Theme]
    );

    const currentCTAButtonClasses = useMemo(
        () =>
            classNames(
                baseCTAButtonClasses,
                autoCTAButtonConfig?.padding ?? "px-3 py-1.5 text-xs",
                autoCTAButtonConfig?.gap ?? "gap-1",
                autoCTAButtonConfig?.rounded ?? "rounded-default",
                autoCTAButtonConfig?.background ?? "bg-primary"
            ),
        [autoCTAButtonConfig]
    );

    const autoIconSizeConfig = useMemo(
        () =>
            classNames({
                12: isMobile,
                14: isTablet,
                16: isDesktop,
            }),
        [isMobile, isTablet, isDesktop]
    );

    return (
        <div>
            <Link to={redirectTo} className={currentCTAButtonClasses}>
                {buttonText}
                <ArrowRight size={autoIconSizeConfig} />
            </Link>
        </div>
    );
}

export default memo(CTAButton);
