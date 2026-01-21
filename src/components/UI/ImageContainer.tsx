import classNames from "classnames";
import { memo, useMemo, type ReactNode } from "react";

export type ImageContainerProps = {
    children: ReactNode;
    className?: string;
    size?: string;
    onClick?: () => void;
    title?: string;
};

const baseImageContainerConfig = "flex justify-center items-center";

function ImageContainer({ children, className = "", size, onClick, title }: ImageContainerProps) {
    const currentImageContainerConfig = useMemo(
        () => classNames(baseImageContainerConfig, className, size),
        [className, size]
    );

    return (
        <picture title={title} className={currentImageContainerConfig} onClick={onClick}>
            {children}
        </picture>
    );
}

export default memo(ImageContainer);
