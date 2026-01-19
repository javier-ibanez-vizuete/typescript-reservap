import type { Login, LogoutResponse, Register, User, UserResponse } from "../../types/auth.type";
import { api } from "../http/axios";

export const registerApi = async (newUserData: Register): Promise<UserResponse> => {
    try {
        const response = await api.post<UserResponse>("/auth/register", newUserData)
        return response.data
    } catch (err) {
        throw err
    }
}

export const loginApi = async (userData: Login): Promise<UserResponse> => {
    try {
        const response = await api.post<UserResponse>("/auth/login", userData);
        return response.data
    } catch (err) {
        throw err
    }
}

export const logoutApi = async (): Promise<LogoutResponse> => {
    try {
        const response = await api.post<LogoutResponse>("/auth/logout");
        return response.data;
    } catch (err) {
        throw err
    }
}

export const patchUserApi = async (userId: User["_id"], newUSerData: User): Promise<User> => {
    try {
        const response = await api.patch<User>(`/users/${userId}`, newUSerData);
        return response.data;
    } catch (err) {
        throw err
    }
}