import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { App } from "./App.tsx";

import { AuthProvider } from "./contexts/AuthContext.tsx";
import { ThemeProvider } from "./contexts/ThemeContext.tsx";
import { ToastContainer } from "./contexts/ToastsContext/ToastContainer.tsx";
import { ToastsProvider } from "./contexts/ToastsContext/ToastsContext.tsx";
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
