import { useCallback, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import type { Login, Register } from "../../types/auth.type";
import { loginApi, logoutApi, registerApi } from "./auth.api";
import {
    removeTokenFromLocalStorage,
    removeUserFromLocalStorage,
    saveTokenInLocalStorage,
    saveUserInLocalStorage,
} from "./auth.service";

export const useAuth = () => {
    const authContext = useContext(AuthContext);
    const navigate = useNavigate();

    if (!authContext) throw new Error("UseAuth debe usarse dentro de AuthProvider");

    const { user, setUser } = authContext;

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
            return navigate("/", { state: { fromRegister: true }, replace: true });
        } catch (err) {
            console.error("Error during Register =>", err);
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

    return { user, setUser, register, login, logout };
};
