import classNames from "classnames";
import { memo, useCallback, useEffect, useMemo, useState, type HTMLAttributes } from "react";
import type { AvatarType } from "../core/auth/auth.type";
import { useDevice } from "../hooks/useDevice";
import type { AvatarSizeType } from "../types/index.type";
import Image from "./UI/Image";
import ImageContainer from "./UI/ImageContainer";

export type AvatarProps = {
    avatar?: AvatarType;
    alt?: string;
    size?: AvatarSizeType;
    variant?: "circle" | "square" | "rounded";
    fallback?: string;
    online?: boolean;
    className?: string;
} & HTMLAttributes<HTMLDivElement>;

const baseClasses = "relative perfect-center overflow-hidden bg-gray-200/50 text-gray-600 font-medium";

function Avatar({
    avatar,
    alt = "",
    size,
    variant = "circle",
    fallback,
    online = false,
    className = "",
    ...props
}: AvatarProps) {
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [imageError, setImageError] = useState<boolean>(false);

    const { isMobile2Xs, isMobileXs, isMobileSm, isTablet, isDesktop } = useDevice();

    const sizeConfig: Record<AvatarSizeType, { avatar: string; indicator: string; position: string }> =
        useMemo(
            () => ({
                xs: { avatar: "w-6 h-6", indicator: "w-1.5 h-1.5", position: "top-0 right-0" },
                sm: { avatar: "w-8 h-8", indicator: "w-2 h-2", position: "top-0 right-0" },
                md: { avatar: "w-10 h-10", indicator: "w-2.5 h-2.5", position: "top-0.5 right-0.5" },
                lg: { avatar: "w-12 h-12", indicator: "w-3 h-3", position: "top-0.5 right-0.5" },
                xl: { avatar: "w-16 h-16", indicator: "w-3.5 h-3.5", position: "top-1 right-1" },
                "2xl": { avatar: "w-20 h-20", indicator: "w-4 h-4", position: "top-1 right-1" },
                "4xl": { avatar: "w-40 h-40", indicator: "w-4.5 h-4.5", position: "top-3 right-4.5" },
                "6xl": { avatar: "w-60 h-60", indicator: "w-4.5 h-4.5", position: "top-6 right-7" },
            }),
            []
        );

    const automaticallySizeConfig = useMemo(
        () => ({
            avatar: classNames({
                "w-6 h-6": isMobile2Xs,
                "w-7 h-7": isMobileXs,
                "w-8 h-8": isMobileSm,
                "w-9 h-9": isTablet,
                "w-10 h-10": isDesktop,
            }),
            indicator: classNames({
                "w-1.5 h-1.5": isMobile2Xs,
                "w-[6px] h-[6px]": isMobileXs,
                "w-2 h-2": isMobileSm,
                "w-[9px] h-[9px]": isTablet,
                "w-2.5 h-2.5": isDesktop,
            }),
            position: "top-0 right-0",
        }),
        [isMobile2Xs, isMobileXs, isMobileSm, isTablet, isDesktop]
    );

    const textSizeClass = useMemo(() => `text-${size}`, [size]);

    const variantConfig: Record<"circle" | "square" | "rounded", string> = useMemo(
        () => ({
            circle: "rounded-full",
            square: "rounded-lg",
            rounded: "rounded-md",
        }),
        []
    );

    const processImageSrc = useCallback((url: string) => {
        if (!url) return null;

        if (url.startsWith("data:image/")) return url;

        if (url.startsWith("http") || url.startsWith("/") || url.startsWith("./") || url.startsWith("../"))
            return url;

        const isBase64 = /^[A-Za-z0-9+/]*={0,2}$/.test(url);

        if (isBase64 && url.length > 30) return `data:image/jpeg;base64,${url}`;

        return url;
    }, []);

    useEffect(() => {
        setImageError(false);
        const processedSrc = processImageSrc(avatar?.url ?? "");
        if (processedSrc) setImageSrc(processedSrc);
    }, [avatar?.url]);

    const currentSize = size ? sizeConfig[size] : automaticallySizeConfig;
    const currentVariant = variant ? variantConfig[variant] : variantConfig?.circle;

    const avatarClasses = useMemo(
        () => classNames(baseClasses, currentSize?.avatar, textSizeClass, currentVariant, className),
        [currentSize?.avatar, textSizeClass, currentVariant, className]
    );

    const indicatorClasses = useMemo(
        () =>
            classNames(
                "absolute border border-white rounded-full",
                currentSize.indicator,
                currentSize.position,
                {
                    "bg-green-400": online,
                    "bg-gray-300": !online,
                }
            ),
        [currentSize?.indicator, currentSize?.position, online]
    );

    const getFallbackText = useCallback(() => {
        if (fallback) return fallback.charAt(0).toUpperCase();
        if (alt) return alt.charAt(0).toUpperCase();
        return "?";
    }, [fallback]);

    const handleImageError = useCallback(() => {
        setImageError(true);
    }, []);

    return (
        <div className="relative inline-flex">
            <div className={avatarClasses} {...props}>
                {imageSrc && !imageError && (
                    <ImageContainer className="flex-1">
                        <Image
                            src={imageSrc}
                            alt={alt ? alt : avatar?.alt}
                            className="object-cover rounded-full"
                            onError={handleImageError}
                        />
                    </ImageContainer>
                )}

                {(!imageSrc || imageError) && <span className="select-none">{getFallbackText()}</span>}
            </div>
            {online && <span className={indicatorClasses} aria-label="Online" />}
            {!online && <span className={indicatorClasses} aria-label="Offline" />}
        </div>
    );
}

export default memo(Avatar);
