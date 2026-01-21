import { createContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { getUserFromLocalStorage } from "../core/auth/auth.service";
import type { User } from "../core/auth/auth.type";

type AuthContextValue = {
    user: User | null | false;
    setUser: (user: User | null | false) => void;
};

type AuthContextProps = {
    children: ReactNode;
};

export const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider = ({ children }: AuthContextProps) => {
    const [user, setUser] = useState<User | null | false>(null);

    useEffect(() => {
        const userFromStorage = getUserFromLocalStorage();
        setUser(userFromStorage || false);
    }, []);

    const valueContext = useMemo(() => ({ user, setUser }), [user]);

    return <AuthContext value={valueContext}>{children}</AuthContext>;
};

// export const useAuth = () => {
//     const authContext = useContext(AuthContext);

//     if (!authContext) throw new Error("UseAuth debe usarse dentro de AuthProvider");
//     return authContext;
// };
