import classNames from "classnames";
import { useMemo } from "react";
import { Navigate, Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import { Theme, useTheme } from "../contexts/ThemeContext";
import { useAuth } from "../core/auth/useAuth";

export function UserLayout() {
    const { theme } = useTheme();
    const { user } = useAuth();

    const currentMainCongif = useMemo(
        () =>
            classNames("flex-1", {
                "bg-bg text-text": theme === Theme.LIGHT,
                "bg-bg-dark text-text-dark": theme !== Theme.LIGHT,
            }),
        [theme]
    );

    if (user && user.role === "admin") return <Navigate to={"/admin/dashboard"} replace />;
    return (
        <>
            <Navbar />
            <main className={currentMainCongif}>
                <Outlet />
            </main>
            <footer>FOOTER PROVISIONAL</footer>
        </>
    );
}
