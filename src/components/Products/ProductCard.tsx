import classNames from "classnames";
import { memo, useMemo, type HTMLAttributes } from "react";
import { Theme, useTheme } from "../../contexts/ThemeContext";
import type { Product } from "../../core/products/products.type";
import { useDevice } from "../../hooks/useDevice";
import { useTranslate } from "../../translations/useTranslate";
import Image from "../UI/Image";
import ImageContainer from "../UI/ImageContainer";

type ProductCardProps = Product & HTMLAttributes<HTMLElement>;

const baseProductCardClasses =
    "flex flex-col shadow-md lg:hover:shadow-xl lg:hover:scale-105 transition-all duration-500 ease-in-out overflow-hidden";
const baseImageContainerClasses = "flex-4";
const baseContentCardContainerClasses = "flex-2 flex flex-col justify-between";
const baseTextContainerClasses = "flex flex-col gap-2 sm:gap-0";
const baseH4Classes = "text-xl sm:text-md md:text-lg";
const baseParagraphClasses = "italic text-xs";
const baseSmallContainerClasses = "flex items-center gap-1";
const baseSmallTextClasses = "px-1.5 py-1 shadow-sm rounded-xs text-2xs";

function ProductCard({
    name,
    description,
    categories,
    price,
    image,
    id,
    className,
    ...props
}: ProductCardProps) {
    const { createdAt, deliveryPrice, updatedAt, ...rest } = props;
    const { isMobile2Xs, isMobileXs, isMobileSm, isMobile, isTablet, isDesktop } = useDevice();
    const { theme } = useTheme();
    const { t } = useTranslate();

    const autoProductCardConfig = useMemo(
        () => ({
            background: classNames({
                "bg-bg-alt border-bg-alt/90 lg:hover:bg-bg-alt/90": theme === Theme.LIGHT,
                "bg-bg-alt-dark border-bg-alt-dark/90 lg:hover:bg-bg-alt-dark/90": theme !== Theme.LIGHT,
            }),
            rounded: classNames({
                "rounded-default": isMobile,
                "rounded-md": isTablet || isDesktop,
            }),
            shadow: classNames({
                "shadow-text/10": theme === Theme.LIGHT,
                "shadow-text-dark/10": theme !== Theme.LIGHT,
            }),
        }),
        [theme, isMobile2Xs, isMobileXs, isMobileSm, isTablet, isDesktop]
    );

    const autoProductCardContentConfig = useMemo(
        () => ({
            padding: classNames({
                "p-2.5": isMobile2Xs || isMobileXs,
                "p-2": isMobileSm,
                "p-3": isTablet || isDesktop,
            }),
        }),
        [isMobile2Xs, isMobileXs, isMobileSm, isTablet, isDesktop]
    );

    const currentProductCardClasses = useMemo(
        () =>
            classNames(
                baseProductCardClasses,
                autoProductCardConfig?.background || "bg-bg-alt border-bg-alt/90 lg:hover:bg-bg-alt/90",
                autoProductCardConfig?.rounded || "rounded-default",
                autoProductCardConfig?.shadow || "shadow-text/10"
            ),
        [autoProductCardConfig]
    );

    const currentProductCardContentClasses = useMemo(
        () => classNames(baseContentCardContainerClasses, autoProductCardContentConfig?.padding || "p-2"),
        [autoProductCardContentConfig]
    );

    const currentParagraphClasses = useMemo(
        () =>
            classNames(baseParagraphClasses, {
                "text-text-muted": theme === Theme.LIGHT,
                "text-text-muted-dark": theme !== Theme.LIGHT,
            }),
        [theme]
    );

    const currentSmallTextClasses = useMemo(
        () =>
            classNames(baseSmallTextClasses, {
                "bg-gray-200 shadow-text/10": theme === Theme.LIGHT,
                "bg-gray-800 shadow-text-dark/10": theme !== Theme.LIGHT,
            }),
        [theme]
    );

    return (
        <article className={currentProductCardClasses} {...rest}>
            <ImageContainer className={baseImageContainerClasses}>
                <Image imageData={image} className="h-full object-cover" />
            </ImageContainer>
            <div className={currentProductCardContentClasses}>
                <div className={baseTextContainerClasses}>
                    <h4 className={baseH4Classes}>{t(name) ?? "Name Unavailable"}</h4>
                    <p className={currentParagraphClasses}>{t(description) ?? "Description Unavailable"}</p>
                </div>
                <div className={baseSmallContainerClasses}>
                    {categories.length > 0 &&
                        categories.map((category, index) => (
                            <small key={index} className={currentSmallTextClasses}>
                                {category}
                            </small>
                        ))}
                </div>
            </div>
        </article>
    );
}

export default memo(ProductCard);

// TODO: AGREGAR VISTA AMPLIADA DE COMPONENTE /MENU/PLATO
