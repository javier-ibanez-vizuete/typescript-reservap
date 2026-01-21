import classNames from "classnames";
import { memo, useMemo } from "react";
import type { ImageSourceType } from "../../types/index.type";

export type ImageComponentProps = {
    loading?: "lazy" | "eager";
    alt?: string;
    onLoad?: () => void;
    onError?: () => void;
    src?: string;
    imageData?: ImageSourceType;
    className?: string;
};

const baseImageConfig = "w-full";

function Image({
    imageData,
    alt = "Image",
    src,
    onLoad = () => {},
    loading = "lazy",
    onError = () => {},
    className,
}: ImageComponentProps) {
    const currentImageConfig = useMemo(() => classNames(baseImageConfig, className), [className]);

    if (src)
        return (
            <img
                className={currentImageConfig}
                src={src}
                alt={alt}
                onLoad={onLoad}
                onError={onError}
                loading={loading}
            />
        );

    if (imageData?.url)
        return (
            <>
                {imageData.avif480 && (
                    <source srcSet={imageData.avif480} media="(max-width: 480px)" type="image/avif" />
                )}
                {imageData.webp480 && (
                    <source srcSet={imageData.webp480} media="(max-width: 480px)" type="image/webp" />
                )}
                {imageData.png480 && (
                    <source srcSet={imageData.png480} media="(max-width: 480px)" type="image/png" />
                )}

                {imageData.avif800 && (
                    <source srcSet={imageData.avif800} media="(max-width: 800px)" type="image/avif" />
                )}
                {imageData.webp800 && (
                    <source srcSet={imageData.webp800} media="(max-width: 800px)" type="image/webp" />
                )}
                {imageData.png800 && (
                    <source srcSet={imageData.png800} media="(max-width: 800px)" type="image/png" />
                )}

                {imageData.avif1200 && (
                    <source srcSet={imageData.avif1200} media="(max-width: 1200px)" type="image/avif" />
                )}
                {imageData.webp1200 && (
                    <source srcSet={imageData.webp1200} media="(max-width: 1200px)" type="image/webp" />
                )}
                {imageData.png1200 && (
                    <source srcSet={imageData.png1200} media="(max-width: 1200px)" type="image/png" />
                )}

                {imageData.avif1800 && (
                    <source srcSet={imageData.avif} media="(max-width: 1800px)" type="image/avif" />
                )}
                {imageData.webp1800 && (
                    <source srcSet={imageData.webp} media="(max-width: 1800px)" type="image/webp" />
                )}
                {imageData.png1800 && (
                    <source srcSet={imageData.png} media="(max-width: 1800px)" type="image/png" />
                )}

                {imageData.avif && <source srcSet={imageData.avif} type="image/avif" />}
                {imageData.webp && <source srcSet={imageData.webp} type="image/webp" />}
                {imageData.png && <source srcSet={imageData.png} type="image/png" />}

                <img
                    className={currentImageConfig}
                    src={imageData.url}
                    alt={imageData?.alt || alt}
                    onLoad={onLoad}
                    onError={onError}
                    loading={loading}
                />
            </>
        );

    return null;
}

export default memo(Image);
