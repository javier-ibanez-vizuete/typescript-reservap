import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { App } from "./App.tsx";

import { ErrorBoundary } from "./components/ErrorBoundary/ErrorBoundary.tsx";
import { PageError } from "./components/ErrorBoundary/PageError.tsx";
import { AuthProvider } from "./contexts/AuthContext.tsx";
import { ThemeProvider } from "./contexts/ThemeContext.tsx";
import "./index.css";
import "./translations/i18n.ts";

createRoot(document.getElementById("root")!).render(
    <ErrorBoundary fallback={<PageError title={` Algo ha ido FATALISIMO`} />}>
        <StrictMode>
            <BrowserRouter>
                <AuthProvider>
                    <ThemeProvider>
                        <App />
                    </ThemeProvider>
                </AuthProvider>
            </BrowserRouter>
        </StrictMode>
    </ErrorBoundary>
);
