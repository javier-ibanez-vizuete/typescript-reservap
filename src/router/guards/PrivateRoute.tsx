import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../core/auth/useAuth";

export function PrivateRoute() {
    const { user } = useAuth();

    if (!user) {
        console.warn("Intentando acceder a rutas privadas de usuario");
        // Añadit un state para redireccionar al menu despues del login
        return <Navigate to={"login"} replace />;
    }

    return <Outlet />;
}
