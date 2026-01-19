import { Outlet } from "react-router-dom";

export function AdminLayout() {
    return (
        <>
            <nav>Barra de navegacion de admin</nav>
            <div>
                <aside>BARRA LATERAL DE ADMIN</aside>
                <main>
                    <Outlet />
                </main>
            </div>
        </>
    );
}
