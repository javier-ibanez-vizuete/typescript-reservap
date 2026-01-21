import type { Token, User } from "./auth.type";

export const saveUserInLocalStorage = (user: User) => localStorage.setItem("user", JSON.stringify(user))

export const getUserFromLocalStorage = (): User | false => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : false;
}

export const removeUserFromLocalStorage = () => localStorage.removeItem("user");

export const saveTokenInLocalStorage = (token: Token) => localStorage.setItem("token", token);

export const getTokenFromLocalStorage = (): Token | false => {
    const tokenFromStorage = localStorage.getItem("token");
    return tokenFromStorage || false;
}

export const removeTokenFromLocalStorage = () => localStorage.removeItem("token");