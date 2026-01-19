import { memo } from "react";
import { useErrorBoundary } from "./useErrorBoundary";

type PageErrorProps = {
    title?: string;
    message?: string;
    retryText?: string;
};

export const PageError = memo(({ title, message, retryText }: PageErrorProps) => {
    const { onErrorRetry, onErrorReset } = useErrorBoundary();
    return (
        <section>
            <h2>{title || "Ha surgido un Problemilla"}</h2>
            {message && <p>{message}</p>}
            <button onClick={onErrorRetry}>{retryText || "Reintentar"}</button>
            <button onClick={onErrorReset}>Volver al inicio</button>
        </section>
    );
});
