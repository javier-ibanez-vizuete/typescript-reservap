

// Some utilities are currently unused; they belong to my personal storage toolkit for general project use.

import type { DataType, KeyType } from "../types/helper.type";

export const getDataFromStorage = (key: KeyType): DataType => {
    const data = localStorage.getItem(key);

    if (!data) return null;

    try {
        const parsed = JSON.parse(data);
        if (
            (typeof parsed === "object" && parsed !== null) ||
            (typeof parsed === "boolean" && parsed !== null)
        ) {
            return parsed;
        }
        return data;
    } catch (error) {
        return data;
    }
};

export const saveDataInStorage = (key: KeyType, data: DataType) => {
    if (typeof data === "string") {
        localStorage.setItem(key, data);
    }
    if (typeof data !== "string") {
        localStorage.setItem(key, JSON.stringify(data));
    }
};

export const deleteLocalStorage = () => {
    localStorage.clear();
    window.location.reload();
};

export const removeFromStorage = (key: KeyType) => {
    const data = localStorage.getItem(key);

    if (!data) return null;

    if (data) localStorage.removeItem(key);
};

export const getDataFromSessionStorage = (key: KeyType): unknown | null => {
    const data = sessionStorage.getItem(key);

    if (!data) return null;

    try {
        const parsed = JSON.parse(data);
        if (
            (typeof parsed === "object" && parsed !== null) ||
            (typeof parsed === "boolean" && parsed !== null)
        ) {
            return parsed;
        }
        return data;
    } catch (error) {
        return data;
    }
};

export const saveDataInSessionStorage = (key: KeyType, data: DataType) => {
    if (typeof data === "string") {
        sessionStorage.setItem(key, data);
    }
    if (typeof data !== "string") {
        sessionStorage.setItem(key, JSON.stringify(data));
    }
};

export const removeFromSessionStorage = (key: KeyType) => {
    const data = sessionStorage.getItem(key);

    if (!data) return null;

    if (data) sessionStorage.removeItem(key);
};

export const deletSessionStorage = () => {
    sessionStorage.clear();
    window.location.reload();
};
