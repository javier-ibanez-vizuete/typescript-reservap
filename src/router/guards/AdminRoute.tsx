import { type ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../core/auth/useAuth";

type AdminRouteProps = {
    children: ReactNode;
};

export function AdminRoute({ children }: AdminRouteProps) {
    const { user } = useAuth();

    if (!user || user?.role !== "admin") {
        console.warn("Ha intentado acceder sin permiso a zona Admin");
        return <Navigate to={"/"} replace />;
    }

    return children;
}
