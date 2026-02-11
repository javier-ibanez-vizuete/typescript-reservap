import classNames from "classnames";
import { memo, useMemo, type HTMLAttributes, type ReactNode } from "react";

export type ImageContainerProps = {
    children: ReactNode;
    className?: string;
    size?: string;
    onClick?: () => void;
    title?: string;
} & HTMLAttributes<HTMLPictureElement>;

const baseImageContainerConfig = "flex justify-center items-center overflow-hidden";

function ImageContainer({ children, className = "", size, onClick, title, ...props }: ImageContainerProps) {
    const currentImageContainerConfig = useMemo(
        () => classNames(baseImageContainerConfig, className, size),
        [className, size]
    );

    return (
        <picture title={title} className={currentImageContainerConfig} onClick={onClick} {...props}>
            {children}
        </picture>
    );
}

export default memo(ImageContainer);
