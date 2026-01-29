import classNames from "classnames";
import { memo, useMemo } from "react";
import { useDevice } from "../../hooks/useDevice";
import CTAButton from "./CTAButton";

type CTAContentProps = {
    title: string;
    description: string;
    buttonText: string;
    redirectTo: string;
    className?: string;
};

const baseContentContainerClasses = "flex flex-col justify-between";

function CTAContent({ title, description, buttonText, redirectTo, className }: CTAContentProps) {
    const { isMobile, isTablet, isDesktop } = useDevice();

    const autoContentContainerConfig = useMemo(
        () => ({
            padding: classNames({
                "p-8": isMobile,
                "p-12": isTablet,
                "p-14": isDesktop,
            }),
            gap: classNames({
                "gap-2": isMobile,
                "gap-4": isTablet || isDesktop,
            }),
        }),
        [isMobile, isTablet, isDesktop]
    );

    const currentContentContainerClasses = useMemo(
        () =>
            classNames(
                baseContentContainerClasses,
                autoContentContainerConfig?.padding ?? "p-8",
                autoContentContainerConfig?.gap ?? "gap-2",
                className
            ),
        [autoContentContainerConfig?.padding]
    );

    return (
        <div className={currentContentContainerClasses}>
            <h2>{title}</h2>
            <p>{description}</p>
            <CTAButton buttonText={buttonText} redirectTo={redirectTo} />
        </div>
    );
}

export default memo(CTAContent);
