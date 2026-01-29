import classNames from "classnames";
import { memo, useMemo } from "react";
import { Theme, useTheme } from "../../contexts/ThemeContext";
import { useDevice } from "../../hooks/useDevice";
import type { ImageSourceType } from "../../types/index.type";
import CTAContent from "./CTAContent";
import CTAImage from "./CTAImage";

export enum CTAImagePosition {
    LEFT = "left",
    RIGHT = "right",
}

type Variant = "default" | "background" | "accent";

type CTACardProps = {
    id?: number;
    variant?: Variant;
    title: string;
    description: string;
    buttonText: string;
    imageSrc: string;
    imageData?: ImageSourceType;
    imageAlt?: string;
    imagePosition: CTAImagePosition;
    redirectTo: string; // Hacer un enum con las posiciones
};

const baseCardContainerClasses =
    "shadow-md overflow-hidden transition-shadow duration-500 lg:hover:shadow-xl";
const baseGridClasses = "grid grid-cols-1 md:grid-cols-2";

function CTACard({
    variant = "default",
    title,
    description,
    buttonText,
    imageSrc,
    imageAlt,
    imagePosition,
    redirectTo,
}: CTACardProps) {
    const { isMobile, isTablet, isDesktop } = useDevice();
    const { theme } = useTheme();

    const isImageLeft = imagePosition === CTAImagePosition.LEFT;

    const variantBackgroundConfig = useMemo(
        () => ({
            default: "bg-white border-white/90",
            background: classNames("border", {
                "bg-bg border-bg/90": theme === Theme.LIGHT,
                "bg-bg-dark border-bg-dark/90": theme !== Theme.LIGHT,
            }),
            accent: classNames("border", {
                "bg-bg-alt border-bg-alt/90": theme === Theme.LIGHT,
                "bg-bg-alt-dark border-bg-alt-dark/90": theme !== Theme.LIGHT,
            }),
        }),
        [theme]
    );

    const autoRoundedConfig = useMemo(
        () =>
            classNames({
                "rounded-default": isMobile,
                "rounded-md": isTablet || isDesktop,
            }),
        [isMobile, isTablet, isDesktop]
    );

    const currentCardContainerClasses = useMemo(
        () =>
            classNames(
                baseCardContainerClasses,
                variantBackgroundConfig[variant] || variantBackgroundConfig.accent,
                autoRoundedConfig || "rounded-lg"
            ),
        [variant, autoRoundedConfig, variantBackgroundConfig]
    );

    const currentImageClasses = useMemo(
        () =>
            classNames({
                "md:-order-2": isImageLeft,
                "md:order-1": !isImageLeft,
            }),
        [isImageLeft]
    );

    return (
        <article className={currentCardContainerClasses}>
            <div className={baseGridClasses}>
                <CTAImage src={imageSrc} alt={imageAlt} className={currentImageClasses} />
                <CTAContent
                    title={title}
                    description={description}
                    buttonText={buttonText}
                    redirectTo={redirectTo}
                />
            </div>
        </article>
    );
}

export default memo(CTACard);
