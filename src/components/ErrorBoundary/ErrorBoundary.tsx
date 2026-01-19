import React, { type ReactNode } from "react";

type ErrorBoundaryProps = {
    children: ReactNode;
    fallback?: ReactNode;
};

type ErrorBoundaryState = {
    hasError: boolean;
};

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error) {
        console.log("Error Boundary:", error);
        return { hasError: true };
    }

    componentDidCatch(error: Error, info: React.ErrorInfo) {
        console.error("Error capturado por ErrorBoundary:", error, info);
    }

    render() {
        const { hasError } = this.state;
        const { fallback, children } = this.props;

        if (hasError) {
            // Fallback UI configurable
            if (fallback) {
                return fallback;
            }

            return <p>Ha ocurrido un error en esta sección.</p>;
        }

        return children;
    }
}
