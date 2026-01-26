import type { PositionsToasts } from "./ToastsContext";

export const getPositionStyle = (position: PositionsToasts): string => {
    const base = "fixed flex flex-col z-1000 gap-4 p-4";
    const positions: Record<PositionsToasts, string> = {
        "top-full": `${base} top-0 left-0 right-0 items-center`,
        "top-left": `${base} top-0 left-0 items-start`,
        "top-center": `${base} top-0 left-1/2 -translate-x-1/2 items-center`,
        "top-right": `${base} top-0 right-0 items-end`,
        "left-center": `${base} top-1/2 left-0 -translate-y-1/2 items-start`,
        "center-center": `${base} top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 items-center`,
        "right-center": `${base} top-1/2 right-0 -translate-y-1/2 items-end`,
        "bottom-left": `${base} bottom-0 left-0 items-start`,
        "bottom-center": `${base} bottom-0 left-1/2 -translate-x-1/2 items-center`,
        "bottom-right": `${base} bottom-0 right-0 items-end`,
    };
    const selectedPosition = positions[position];
    const defaultPosition = positions["top-right"];

    return position ? selectedPosition : defaultPosition;
};
