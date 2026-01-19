import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../core/auth/useAuth";

export function PrivateRoute() {
    const { user } = useAuth();

    if (!user) {
        console.warn("Intentando acceder a rutas privadas de usuario");
        return <Navigate to={"/"} replace />;
    }

    return <Outlet />;
}
