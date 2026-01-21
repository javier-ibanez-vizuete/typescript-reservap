import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

export function UserLayout() {
    return (
        <>
            <Navbar />
            <Outlet />
            <footer>FOOTER PROVISIONAL</footer>
        </>
    );
}
