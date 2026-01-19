import { Outlet } from "react-router-dom";

export function UserLayout() {
    return (
        <>
            <nav>NAVBAR PROVISIONAL</nav>
            <Outlet />
            <footer>FOOTER PROVISIONAL</footer>
        </>
    );
}
