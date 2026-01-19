import { useCallback } from "react";
import { useLocation } from "react-router-dom";
import { useTranslate } from "../../translations/useTranslate";

export function useErrorBoundary() {
    const location = useLocation();
    const { t } = useTranslate();

    const onErrorRetry = useCallback(() => window.location.reload(), []);

    const onErrorReset = useCallback(() => (window.location.href = "/"), []);

    const getErrorLocationName = useCallback(() => {
        const pathName = location.pathname;
        if (pathName.startsWith("/menu")) return t("error_sentences.on_error_menu_page");
        if (pathName.startsWith("/bookings")) return t("error_sentences.on_error_bookings_page");
        if (pathName.startsWith("/orders")) return t("error_sentences.on_error_orders_page");
        if (pathName.startsWith("/cart")) return t("error_sentences.on_error_cart_page");
        if (pathName.startsWith("/user")) return "error_sentences.on_error_user_page";
        if (pathName.startsWith("/login")) return t("error_sentences.on_error_login_page");
        if (pathName.startsWith("/register")) return t("error_sentences.on_error_register_page");

        if (pathName.startsWith("/dashboard/users"))
            return t("error_sentences.on_error_dashboard_users_page");
        if (pathName.startsWith("/dashboard/bookings"))
            return t("error_sentences.on_error_dashboard_bookings_page");
        if (pathName.startsWith("/dashboard/orders"))
            return t("error_sentences.on_error_dashboard_orders_page");
        if (pathName.startsWith("/dashboard/products"))
            return t("error_sentences.on_error_dashboard_products_page");
        if (pathName.startsWith("/dashboard")) return t("error_sentences.on_error_dashboard_page");
        return t("error_sentences.on_error_home_page");
    }, [location.pathname, t]);

    return { onErrorRetry, onErrorReset, getErrorLocationName };
}
