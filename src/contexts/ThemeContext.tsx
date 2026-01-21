import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { getDataFromSessionStorage, saveDataInSessionStorage } from "../helper/storage";

export type Theme = "light" | "dark";

export type ThemeContextValue = {
    theme: Theme;
    onToggleTheme: () => void;
};

export type ThemeContextProps = {
    children: ReactNode;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export const ThemeProvider = ({ children }: ThemeContextProps) => {
    const [theme, setTheme] = useState<Theme>("light");

    const onToggleTheme = useCallback(() => {
        setTheme((prevValue) => {
            const newValue = prevValue === "light" ? "dark" : "light";
            saveDataInSessionStorage("theme", newValue);
            return newValue;
        });
    }, []);

    useEffect(() => {
        const themeFromStorage = getDataFromSessionStorage("theme");
        if (themeFromStorage) setTheme(themeFromStorage as Theme);
    }, []);

    const valueContext = useMemo<ThemeContextValue>(() => ({ theme, onToggleTheme }), [theme, onToggleTheme]);

    return <ThemeContext value={valueContext}>{children}</ThemeContext>;
};

export const useTheme = (): ThemeContextValue => {
    const themeContext = useContext(ThemeContext);

    if (!themeContext) throw new Error("useTheme must be used within a ThemeProvider");

    return themeContext;
};
