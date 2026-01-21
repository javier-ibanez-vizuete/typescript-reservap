import { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import { AdminLayout } from "./layouts/AdminLayout";
import { UserLayout } from "./layouts/UserLayout";
import HomePage from "./pages/HomePage";
import { AdminRoute } from "./router/guards/AdminRoute";
import { PrivateRoute } from "./router/guards/PrivateRoute";

export function App() {
    useEffect(() => {
        // loginApi({ email: "user@user.com", password: "useruser" });
    });

    return (
        <Routes>
            <Route element={<UserLayout />}>
                <Route index element={<HomePage />} />
                <Route path="menu" element={<h3>PAGINA MENU</h3>} />

                <Route element={<PrivateRoute />}>
                    <Route path="/orders" element={<h3>PAGINA PEDIDOS</h3>} />
                    <Route path="/cart" element={<h3>PAGINA CARRITO</h3>} />
                    <Route path="/bookings" element={<h3>PAGINA RESERVAS</h3>} />
                    <Route path="profile" element={<h1>RUTA PRIVADA USUARIO</h1>} />
                </Route>
            </Route>
            <Route
                path="/admin"
                element={
                    <AdminRoute>
                        <AdminLayout />
                    </AdminRoute>
                }
            >
                <Route path="dashboard" element={<h1>"ESTO SERIA EL DASHBOARD"</h1>} />
            </Route>
            <Route path="/*" element={<h1>PAGINA NO ENCONTRADA</h1>} />
        </Routes>
    );
}
