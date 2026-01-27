import classNames from "classnames";
import { useMemo } from "react";
import { useTheme } from "../../contexts/ThemeContext";

import type { TypeOfToasts } from "../../contexts/ToastsContext";
import { useDevice } from "../../hooks/useDevice";

type ToastProps = {
    message?: string;
    type?: TypeOfToasts;
    onClose?: () => void;
    closing?: boolean;
};

export const Toast = ({ message, type = "info", onClose, closing = false }: ToastProps) => {
    const { theme } = useTheme();
    const { isMobile2Xs, isMobileXs, isMobileSm, isTablet, isDesktop } = useDevice();

    const toastConfig = useMemo(
        () => ({
            bg: classNames({
                "text-color": theme === "light",
                "text-color-dark": theme !== "light",
            }),
            widthSize: classNames({
                "w-[90vw]": isMobile2Xs,
                "w-[80vw]": isMobileXs,
                "w-[75vw]": isMobileSm,
                "w-[450px]": isTablet || isDesktop,
            }),
        }),
        [isMobile2Xs, isMobileXs, isMobileSm, isTablet, isDesktop, theme]
    );

    const OPTIONS = {
        success: `border border-green-500 bg-gradient-to-br from-[#5cd17d] to-[#36b37e] ${toastConfig.bg}`,
        error: `border border-red-600 bg-gradient-to-br from-[#f66b6b] to-[#d83a3a] ${toastConfig.bg}`,
        info: `border border-gray-400 bg-gradient-to-br from-[#4cb0e8] to-[#1a73e8] ${toastConfig.bg}`,
    };

    const toastType = OPTIONS[type] || OPTIONS.info;

    // clases para animar entrada/salida
    const baseClasses = `flex shrink p-4 ${toastConfig.widthSize} transform transition-all duration-500 ease-in-out rounded-sm shadow-lg`;
    const openState = "opacity-100 translate-y-0";
    const closingState = "opacity-0 -translate-y-4 pointer-events-none";

    return (
        <div
            role="status"
            aria-live="polite"
            className={`${baseClasses} ${toastType} ${
                closing ? closingState : openState
            } motion-reduce:transition-none`}
        >
            <div className={`flex flex-1 justify-between items-center`}>
                <span className="flex-1">{message}</span>
                <button
                    onClick={onClose}
                    className="ml-2 font-bold self-start"
                    aria-label="Cerrar notificación"
                >
                    ✕
                </button>
            </div>
        </div>
    );
};
