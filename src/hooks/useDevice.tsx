import { useMemo } from "react";
import { useWindowWidth } from "./useWindowWidth";

export const useDevice = () => {
    const width = useWindowWidth();

    const deviceBreakPoints = useMemo(
        () => ({
            isMobile2Xs: width < 375,
            isMobileXs: width >= 375 && width < 425,
            isMobileSm: width >= 425 && width < 768,
            isMobile: width < 768,
            isTablet: width >= 768 && width < 1024,
            isDesktop: width >= 1024,
        }),
        [width]
    );

    return deviceBreakPoints;
};

type DeviceBreakpoints = ReturnType<typeof useDevice>;

export type MobileSizeDevice = keyof DeviceBreakpoints;
