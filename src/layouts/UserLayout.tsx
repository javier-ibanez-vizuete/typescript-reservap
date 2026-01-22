import classNames from "classnames";
import { useMemo } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useTheme } from "../contexts/ThemeContext";

export function UserLayout() {
    const { theme } = useTheme();

    const currentMainCongif = useMemo(
        () =>
            classNames("flex-1", {
                "bg-bg text-text": theme === "light",
                "bg-bg-dark text-text-dark": theme !== "light",
            }),
        [theme]
    );

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
