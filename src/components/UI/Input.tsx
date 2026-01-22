import classNames from "classnames";
import { memo, useMemo } from "react";
import type { UseFormRegister } from "react-hook-form";
import { useTheme } from "../../contexts/ThemeContext";
import { ICON_CHECK, ICON_WARNING } from "../../data/iconsData";
import { useDevice } from "../../hooks/useDevice";
import type { FormType } from "../../pages/RegisterPage";
import Image from "./Image";
import ImageContainer from "./ImageContainer";

type ValidationInputNumber = {
    value: number;
    message: string;
};

type ValidationInputValues = {
    required?: true | string;
    minLength?: number | ValidationInputNumber;
    maxLength?: number | ValidationInputNumber;
    min?: number | ValidationInputNumber;
    max?: number | ValidationInputNumber;
    pattern?: RegExp | { value: RegExp; message: string };
};

type InputType =
    | "text"
    | "password"
    | "email"
    | "search"
    | "url"
    | "tel"
    | "number"
    | "range"
    | "date"
    | "datetime-local"
    | "month"
    | "week"
    | "time"
    | "checkbox"
    | "radio"
    | "file"
    | "image"
    | "color"
    | "button"
    | "submit"
    | "reset"
    | "hidden";

export type InputProps = {
    type?: InputType;
    name: keyof FormType;
    placeholder?: string;
    register: UseFormRegister<FormType>;
    validations?: ValidationInputValues;
    isValid?: boolean;
    hasText?: boolean;
};

const baseInputClasses = "py-3 px-2.5 flex-1 rounded-default";

const Input = ({ type, name, placeholder, register, validations, isValid, hasText }: InputProps) => {
    const { theme } = useTheme();
    const { isMobile2Xs, isMobileXs, isMobileSm, isTablet, isDesktop } = useDevice();

    const autoContainerConfig = useMemo(
        () =>
            classNames("flex flex-col", {
                "gap-0.5": isMobile2Xs || isMobileXs || isMobileSm,
                "gap-1": isTablet || isDesktop,
            }),
        [isMobile2Xs, isMobileXs, isMobileSm, isTablet, isDesktop]
    );

    const autoInputConfig = useMemo(
        () =>
            classNames(
                baseInputClasses,
                {
                    "focus-visible:outline-primary": !hasText,
                    "focus-visible:outline-error-600": hasText && !isValid,
                    "focus-visible:outline-success-600": isValid,
                },
                {
                    "bg-bg placeholder:text-muted": theme === "light",
                    "bg-bg-dark placeholder:text-muted-dark": theme !== "light",
                }
            ),
        [isValid, hasText, theme]
    );

    return (
        <div className={autoContainerConfig}>
            <label htmlFor={name}>{name.charAt(0).toUpperCase() + name.slice(1)}</label>
            <div className="flex gap-2 items-center">
                <input
                    id={name}
                    className={autoInputConfig}
                    type={type}
                    placeholder={placeholder}
                    {...register(name, { ...validations })}
                />
                {hasText && (
                    <ImageContainer>
                        <Image imageData={isValid ? ICON_CHECK : ICON_WARNING} />
                    </ImageContainer>
                )}
            </div>
        </div>
    );
};
export default memo(Input);
