import classNames from "classnames";
import { memo, useMemo } from "react";
import type { RegisterOptions, UseFormRegister } from "react-hook-form";
import { useTheme } from "../../contexts/ThemeContext";
import {
    ICON_CHECK,
    ICON_CLOSED_EYE_BLACK,
    ICON_CLOSED_EYE_WHITE,
    ICON_EYE_BLACK,
    ICON_EYE_WHITE,
    ICON_WARNING,
} from "../../data/iconsData";
import { useDevice } from "../../hooks/useDevice";
import type { FormType } from "../../pages/RegisterPage";
import Button from "./Button";
import Image from "./Image";
import ImageContainer from "./ImageContainer";

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
    label?: string;
    type?: InputType;
    name: keyof FormType;
    placeholder?: string;
    register: UseFormRegister<FormType>;
    validations?: RegisterOptions<FormType, keyof FormType>;
    isValid?: boolean;
    hasText?: boolean;
    toggleVisibility: (inputName: "password" | "repassword") => void;
    passwordMatch: boolean;
};

const baseInputClasses = "py-3 px-2.5 flex-1 rounded-default";

const Input = ({
    label,
    type,
    name,
    placeholder,
    register,
    validations,
    isValid,
    hasText,
    toggleVisibility,
    passwordMatch,
}: InputProps) => {
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

    const currentIconEye = useMemo(() => {
        if (theme === "light") return ICON_EYE_BLACK;
        return ICON_EYE_WHITE;
    }, [theme]);

    const currentIconClosedEye = useMemo(() => {
        if (theme === "light") return ICON_CLOSED_EYE_BLACK;
        return ICON_CLOSED_EYE_WHITE;
    }, [theme]);

    const isPassword = name === "password" || name === "repassword";

    return (
        <div className={autoContainerConfig}>
            <label htmlFor={name}>{label}</label>
            <div className="flex gap-2 items-center">
                <input
                    id={name}
                    className={autoInputConfig}
                    type={type}
                    placeholder={placeholder}
                    {...register(name, { ...validations })}
                />
                {hasText && name !== "repassword" && (
                    <ImageContainer>
                        <Image imageData={isValid ? ICON_CHECK : ICON_WARNING} />
                    </ImageContainer>
                )}
                {hasText && name === "repassword" && (
                    <ImageContainer>
                        <Image imageData={passwordMatch && isValid ? ICON_CHECK : ICON_WARNING} />
                    </ImageContainer>
                )}
                {isPassword && (
                    <Button variant="ghost" onClick={() => toggleVisibility(name)}>
                        {type === "password" && (
                            <ImageContainer>
                                <Image imageData={currentIconClosedEye} />
                            </ImageContainer>
                        )}
                        {type === "text" && (
                            <ImageContainer>
                                <Image imageData={currentIconEye} />
                            </ImageContainer>
                        )}
                    </Button>
                )}
            </div>
        </div>
    );
};
export default memo(Input);
