import classNames from "classnames";
import { memo, useMemo } from "react";
import { useDevice } from "../../hooks/useDevice";
import type { ImageSourceType } from "../../types/index.type";
import Image from "../UI/Image";
import ImageContainer from "../UI/ImageContainer";

type CTAImageProps = {
    src: string;
    imageData?: ImageSourceType;
    alt?: string;
    className?: string;
};

const baseCTAImageClasses = "relative flex flex-col overflow-hidden";
const baseImageContainerClasses = "flex-1";
const baseImageClasses = "object-cover h-full";
const baseBackgroundDivClasses = "absolute inset-0 bg-gradient-to-b from-black/60 to-transparent md:hidden";

function CTAImage({ src, imageData, alt, className }: CTAImageProps) {
    const { isMobile } = useDevice();

    const currentCTAImageClasses = useMemo(
        () =>
            classNames(
                baseCTAImageClasses,
                {
                    "h-50": isMobile,
                    "h-auto": !isMobile,
                },
                className
            ),
        [className, isMobile]
    );

    if (imageData)
        return (
            <div className={currentCTAImageClasses}>
                <ImageContainer className={baseImageContainerClasses}>
                    <Image imageData={imageData} className={baseImageClasses} />
                </ImageContainer>
                <div className={baseBackgroundDivClasses} />
            </div>
        );
    return (
        <div className={currentCTAImageClasses}>
            <ImageContainer className={baseImageContainerClasses}>
                <Image src={src} alt={alt} className={baseImageClasses} />
            </ImageContainer>
            <div className={baseBackgroundDivClasses} />
        </div>
    );
}

export default memo(CTAImage);
