import classNames from "classnames";
import { memo, useMemo, type HTMLAttributes } from "react";

type SkeletonType = "text" | "avatar" | "image" | "card" | "custom";
type SkeletonSize = "sm" | "md" | "lg" | "xl";

type SkeletonProps = {
    variant: SkeletonType;
    size: SkeletonSize;
    width?: string;
    height?: string;
    noAnimation: Boolean;
    className?: string;
} & HTMLAttributes<HTMLDivElement>;

type SkeletonTextProps = {
    lines: number;
    size: SkeletonSize;
    className?: string;
} & HTMLAttributes<HTMLDivElement>;

type SkeletonCardProps = {
    showAvatar: Boolean;
    showText: Boolean;
    showImage: Boolean;
    textLines: number;
    size: SkeletonSize;
    className?: string;
} & HTMLAttributes<HTMLDivElement>;

function Skeleton({
    variant = "text",
    size = "md",
    width,
    height,
    noAnimation = false,
    className = "",
    ...props
}: SkeletonProps) {
    const baseSkeletonClasses = useMemo(
        () => classNames("bg-gray-200 rounded", { "animate-pulse": !noAnimation }, className),
        [noAnimation, className]
    );

    const variantConfig: Record<Exclude<SkeletonType, "custom">, Record<SkeletonSize, string>> = useMemo(
        () => ({
            text: {
                sm: "h-3 w-3/4",
                md: "h-4 w-full",
                lg: "h-5 w-full",
                xl: "h-6 w-full",
            },
            avatar: {
                sm: "h-8 w-8 rounded-full",
                md: "h-10 w-10 rounded-full",
                lg: "h-12 w-12 rounded-full",
                xl: "h-16 w-16 rounded-full",
            },
            image: {
                sm: "h-32 w-full",
                md: "h-48 w-full",
                lg: "h-64 w-full",
                xl: "h-80 w-full",
            },
            card: {
                sm: "h-24 w-full",
                md: "h-32 w-full",
                lg: "h-40 w-full",
                xl: "h-48 w-full",
            },
        }),
        []
    );

    const currentSkeletonClasses = useMemo(
        () =>
            classNames(
                baseSkeletonClasses,
                variant && variant !== "custom" ? variantConfig[variant][size] : variantConfig.text.md
            ),
        [baseSkeletonClasses, variant, size]
    );

    if (variant === "custom") {
        const customStyle: { width?: string; height?: string } = {};
        if (width && width.trim()) customStyle.width = width.trim();
        if (height && height.trim()) customStyle.height = height.trim();

        return <div className={currentSkeletonClasses} style={customStyle} {...props} />;
    }

    return <div className={currentSkeletonClasses} {...props}></div>;
}

export const SkeletonText = memo(
    ({ lines = 1, size = "md", className = "", ...props }: SkeletonTextProps) => {
        const baseSkeletonTextClasses = useMemo(
            () => classNames("flex flex-col gap-2", className),
            [classNames]
        );
        return (
            <div className={baseSkeletonTextClasses} {...props}>
                {Array.from({ length: lines }, (_, index) => (
                    <Skeleton
                        key={index}
                        variant="text"
                        size={size}
                        className={index === lines - 1 ? "w-3/4" : "w-full"}
                        noAnimation={false}
                    />
                ))}
            </div>
        );
    }
);

const baseSkeletonCardAvatarClasses = "flex items-center gap-2 mb-2";

export const SkeletonCard = memo(
    ({
        showAvatar = true,
        showText = true,
        showImage = false,
        textLines = 3,
        size = "md",
        className = "",
        ...props
    }: SkeletonCardProps) => {
        const baseSkeletonCardClasses = useMemo(
            () =>
                classNames(
                    "flex flex-col gap-3 p-2 bg-white rounded rounded-default border border-gray-200",
                    className
                ),
            [className]
        );

        return (
            <div className={baseSkeletonCardClasses} {...props}>
                {showAvatar && (
                    <div className={baseSkeletonCardAvatarClasses}>
                        <Skeleton variant="avatar" size={size} noAnimation={false} />
                        <div className="flex flex-col flex-1 gap-2">
                            <Skeleton variant="text" size="md" noAnimation={false} className="w-1/3" />
                            <Skeleton variant="text" size="sm" noAnimation={false} className="w-1/2" />
                        </div>
                    </div>
                )}

                {showImage && <Skeleton variant="image" size={size} noAnimation={false} />}

                {showText && <SkeletonText lines={textLines} size="md" />}
            </div>
        );
    }
);

export default memo(Skeleton);
