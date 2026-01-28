import { memo } from "react";
import { useToast } from "../../contexts/ToastsContext";
import { getPositionStyle } from "./getPositionStyle";
import { Toast } from "./Toast";

type ToastContainerProps = {
    className?: string;
};

export const ToastContainer = memo(({ className = "" }: ToastContainerProps) => {
    const { toasts, dismissToast } = useToast();

    if (toasts?.length === 0) return null;

    const position = toasts[0]?.position || "top-center";

    return (
        <div className={`${className} ${getPositionStyle(position)}`}>
            {toasts.map((toast) => (
                <Toast key={toast.id} {...toast} onClose={() => dismissToast(toast.id)} />
            ))}
        </div>
    );
});
