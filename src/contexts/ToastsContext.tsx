import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
    type ReactNode,
} from "react";

type ToastTimersRef = {
    auto: number | null;
    remove: number | null;
};

export type TypeOfToasts = "success" | "error" | "info";

export type PositionsToasts =
    | "top-full"
    | "top-left"
    | "top-center"
    | "top-right"
    | "left-center"
    | "center-center"
    | "right-center"
    | "bottom-left"
    | "bottom-center"
    | "bottom-right";

export type ToastType = {
    id: string;
    message?: string;
    type?: TypeOfToasts;
    duration?: number;
    position?: PositionsToasts;
    closing?: boolean;
};

type ToastsContextValue = {
    toasts: ToastType[];
    showToast: (
        message: string,
        type?: TypeOfToasts,
        duration?: number,
        position?: PositionsToasts
    ) => string;
    dismissToast: (id: string) => void;
    removeToast: (id: string) => void;
};

type ToastsProviderProps = {
    children: ReactNode;
    defaultDuration?: number;
    animationDuration?: number;
    defaultPosition?: PositionsToasts;
};

const ToastsContext = createContext<ToastsContextValue | null>(null);

export const ToastsProvider = ({
    children,
    defaultDuration = 2000,
    animationDuration = 400,
    defaultPosition = "top-center",
}: ToastsProviderProps) => {
    const [toasts, setToasts] = useState<ToastType[]>([]);
    const timersRef = useRef<Record<string, ToastTimersRef>>({});

    const removeToast = useCallback((id: string) => {
        const timers = timersRef.current[id];
        if (timers.auto) clearTimeout(timers.auto);
        if (timers.remove) clearTimeout(timers.remove);
        delete timersRef.current[id];
        setToasts((prevValue) => prevValue.filter((toast) => toast.id !== id));
    }, []);

    const startRemove = useCallback(
        (id: string) => {
            setToasts((prevValue) =>
                prevValue.map((toast) => (toast.id === id ? { ...toast, closing: true } : toast))
            );

            const timers = timersRef.current[id];
            if (timers.auto) {
                clearTimeout(timers.auto);
                timers.auto = null;
            }

            timersRef.current[id] = {
                ...(timersRef.current[id] || {}),
                remove: setTimeout(() => removeToast(id), animationDuration),
            };
        },
        [animationDuration, removeToast]
    );

    const showToast = useCallback(
        (
            message: string,
            type: TypeOfToasts = "info",
            duration: number = defaultDuration,
            position: PositionsToasts = defaultPosition
        ): string => {
            const id = Date.now().toString();
            const toast = { id, message, type, duration, position, closing: false };

            setToasts((prevValue) => [...prevValue, toast]);

            timersRef.current[id] = {
                auto: setTimeout(() => startRemove(id), duration),
                remove: null,
            };

            return id;
        },
        [defaultDuration, defaultPosition, startRemove]
    );

    const dismissToast = useCallback((id: string) => startRemove(id), [startRemove]);

    useEffect(
        () => () =>
            Object.values(timersRef.current).forEach((timer) => {
                if (timer.auto) clearTimeout(timer.auto);
                if (timer.remove) clearTimeout(timer.remove);
            }),
        []
    );

    const valueContext = useMemo(
        () => ({ toasts, showToast, dismissToast, removeToast }),
        [toasts, showToast, dismissToast, removeToast]
    );

    return <ToastsContext value={valueContext}>{children}</ToastsContext>;
};

export const useToast = () => {
    const contextToasts = useContext(ToastsContext);
    if (!contextToasts) throw new Error("useToast must be used within a ToastsProvider");
    return contextToasts;
};
