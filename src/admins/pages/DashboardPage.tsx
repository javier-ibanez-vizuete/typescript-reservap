import { useCallback } from "react";
import Button from "../../components/UI/Button";
import { useAuth } from "../../core/auth/useAuth";

export default function DashboardPage() {
    const { logout } = useAuth();

    const handleLogout = useCallback(async () => {
        try {
            await logout();
        } catch (error) {
            console.warn("Error cerrando sesion");
        }
    }, [logout]);

    return (
        <section>
            <h1>DASHBOARD PAGE</h1>
            <Button onClick={handleLogout}>CERRAR SESION</Button>
        </section>
    );
}
