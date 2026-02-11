import classNames from "classnames";
import { memo, useMemo, type HTMLAttributes, type ReactNode } from "react";
import { useDevice } from "../../hooks/useDevice";
import type { SizeTypeFull } from "../../types/index.type";

type ProductsColsType = 1 | 2 | 3 | 4 | 5;

type ProductsGridProps = {
    children: ReactNode;
    cols?: ProductsColsType;
    gap?: SizeTypeFull;
    className?: string;
} & HTMLAttributes<HTMLUListElement>;

const baseProductsGridClasses = "grid";
function ProductsGrid({ children, cols, gap, className = "", ...props }: ProductsGridProps) {
    const { isMobile2Xs, isMobileXs, isMobileSm, isMobile, isTablet, isDesktop } = useDevice();

    const variantCols: Record<ProductsColsType, string> = useMemo(
        () => ({
            1: "grid-cols-1",
            2: "grid-cols-1 sm:grid-cols-2",
            3: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3",
            4: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
            5: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5",
        }),
        []
    );

    const variantsGaps: Record<SizeTypeFull, string> = useMemo(
        () => ({
            none: " ",
            default: "gap-2",
            xs: "gap-0.5",
            sm: "gap-1",
            md: "gap-2",
            lg: "gap-4",
            xl: "gap-8",
        }),
        []
    );

    const autoColsConfig = useMemo(
        () =>
            classNames({
                "grid-cols-1": isMobile2Xs || isMobileXs,
                "grid-cols-2": isMobileSm,
                "grid-cols-3": isTablet,
                "grid-cols-4": isDesktop,
            }),
        [isMobile2Xs, isMobileXs, isMobileSm, isTablet, isDesktop]
    );

    const autoGapsConfig = useMemo(
        () =>
            classNames({
                "gap-2": isMobile,
                "gap-3": isTablet,
                "gap-4": isDesktop,
            }),
        [isMobile, isTablet, isDesktop]
    );

    const currentProductsGridClasses = useMemo(
        () =>
            classNames(
                baseProductsGridClasses,
                cols ? variantCols[cols] : autoColsConfig || variantCols[4],
                gap ? variantsGaps[gap] : autoGapsConfig || variantsGaps["default"],
                className
            ),
        [cols, gap, autoGapsConfig, autoColsConfig, className]
    );

    return (
        <ul className={currentProductsGridClasses} {...props}>
            {children}
        </ul>
    );
}

export default memo(ProductsGrid);
