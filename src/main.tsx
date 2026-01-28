import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { App } from "./App.tsx";

import { ToastContainer } from "./components/Toasts/ToastContainer.tsx";
import { AuthProvider } from "./contexts/AuthContext.tsx";
import { ThemeProvider } from "./contexts/ThemeContext.tsx";
import { ToastsProvider } from "./contexts/ToastsContext.tsx";
import "./index.css";
import "./translations/i18n.ts";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <BrowserRouter>
            <ToastsProvider>
                <AuthProvider>
                    <ThemeProvider>
                        <App />
                        <ToastContainer />
                    </ThemeProvider>
                </AuthProvider>
            </ToastsProvider>
        </BrowserRouter>
    </StrictMode>
);
