import { useCallback, useContext, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import { loginApi, logoutApi, registerApi } from "./auth.api";
import {
    removeTokenFromLocalStorage,
    removeUserFromLocalStorage,
    saveTokenInLocalStorage,
    saveUserInLocalStorage,
} from "./auth.service";
import type { Login, Register } from "./auth.type";

export const useAuth = () => {
    const authContext = useContext(AuthContext);
    const navigate = useNavigate();

    if (!authContext) throw new Error("UseAuth debe usarse dentro de AuthProvider");

    const { user, setUser } = authContext;

    const isLoggedIn = useMemo(() => (user ? true : false), [user]);

    const login = useCallback(async (userData: Login) => {
        try {
            const userResponseData = await loginApi(userData);
            if (userResponseData) {
                saveTokenInLocalStorage(userResponseData.token);
                saveUserInLocalStorage(userResponseData.user);
                setUser(userResponseData.user);
            }
            return navigate("/", { replace: true });
        } catch (err) {
            console.error("Error during Login =>", err);
        }
    }, []);

    const register = useCallback(async (newUserData: Register) => {
        try {
            const newUserResponseData = await registerApi(newUserData);
            if (newUserResponseData) {
                saveTokenInLocalStorage(newUserResponseData.token);
                saveUserInLocalStorage(newUserResponseData.user);
                setUser(newUserResponseData.user);
            }
            return newUserResponseData;
        } catch (err) {
            console.error("Error during Register =>", err);
            throw err;
        }
    }, []);

    const logout = useCallback(async () => {
        try {
            const logoutResponse = await logoutApi();
            if (!logoutResponse.logout) console.warn("User is not Logged out from API");
        } catch (err) {
            console.error("Error during Logout =>", err);
        } finally {
            removeTokenFromLocalStorage();
            removeUserFromLocalStorage();
            setUser(false);
            navigate("/");
        }
    }, []);

    return { user, setUser, isLoggedIn, register, login, logout };
};
