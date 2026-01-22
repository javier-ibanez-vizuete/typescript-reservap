import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../core/auth/useAuth";

export function GuestRoute() {
    const { isLoggedIn } = useAuth();

    if (isLoggedIn) {
        console.warn("Intentando acceder a Rutas de Solo invitados");
        return <Navigate to={"/"} replace />;
    }

    return <Outlet />;
}
