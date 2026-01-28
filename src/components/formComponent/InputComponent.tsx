import classNames from "classnames";
import { memo, useCallback, useMemo } from "react";

import type { FieldErrors, FieldValues, Path, UseFormRegister } from "react-hook-form";
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
import Button from "../UI/Button";
import Image from "../UI/Image";
import ImageContainer from "../UI/ImageContainer";
import { InputType, PasswordName } from "./FormComponent";

const baseInputClasses = "py-3 px-2.5 flex-1 rounded-default";
const baseErrorTextClasses = "text-sm mt-1";

type InputValidations = {
    required?: string;
    minLength?: {
        value: number;
        message: string;
    };
    maxLength?: {
        value: number;
        message: string;
    };
    pattern?: {
        value: RegExp;
        message: string;
    };
    validate?: (value: unknown) => string | boolean;
};

type InputComponentProps<T extends FieldValues = FieldValues> = {
    label: string;
    type: InputType;
    name: Path<T>;
    placeholder: string;
    registerHook: UseFormRegister<T>;
    validations?: InputValidations;
    error?: FieldErrors<T>[Path<T>];
    hasValue: boolean;
    isValidValue: boolean;
    isPassword: boolean;
    passwordMatch: boolean;
    onToggleVisibility: (inputName: string) => void;
};

function InputComponent<T extends FieldValues = FieldValues>({
    label,
    type,
    name,
    placeholder,
    registerHook,
    validations,
    error,
    hasValue,
    isValidValue,
    isPassword,
    passwordMatch,
    onToggleVisibility,
}: InputComponentProps<T>) {
    const { isMobile2Xs, isMobileXs, isMobileSm, isTablet, isDesktop } = useDevice();
    const { theme } = useTheme();

    const errorMessage = error?.message ? String(error.message) : undefined;

    const handleToggleVisibility = useCallback(() => {
        onToggleVisibility(name);
    }, [name, onToggleVisibility]);

    const getInputClasses = useCallback(
        (hasValue: boolean, isValidValue: boolean): string => {
            return classNames(
                baseInputClasses,
                {
                    "focus-visible:outline-primary": !hasValue,
                    "focus-visible:outline-error-600": hasValue && !isValidValue,
                    "focus-visible:outline-success-600": isValidValue,
                },
                {
                    "bg-bg placeholder:text-muted": theme === "light",
                    "bg-bg-dark placeholder:text-muted-dark": theme !== "light",
                }
            );
        },
        [theme]
    );

    const autoContainerConfig = useMemo(
        () =>
            classNames("flex flex-col", {
                "gap-0.5": isMobile2Xs || isMobileXs || isMobileSm,
                "gap-1": isTablet || isDesktop,
            }),
        [isMobile2Xs, isMobileXs, isMobileSm, isTablet, isDesktop]
    );

    const currentIconEye = useMemo(() => {
        return theme === "light" ? ICON_EYE_BLACK : ICON_EYE_WHITE;
    }, [theme]);

    const currentIconClosedEye = useMemo(() => {
        return theme === "light" ? ICON_CLOSED_EYE_BLACK : ICON_CLOSED_EYE_WHITE;
    }, [theme]);

    const currentErrorTextConfig = useMemo(
        () =>
            classNames(baseErrorTextClasses, {
                "text-text-muted": theme === "light",
                "text-text-muted-dark": theme !== "light",
            }),
        [theme]
    );

    const showCheckIcon = useMemo(() => {
        if (name === PasswordName.PASSWORD2) {
            return isValidValue && passwordMatch;
        }
        return isValidValue;
    }, [name, isValidValue, passwordMatch]);

    return (
        <div className={autoContainerConfig}>
            <label htmlFor={name}>{label}</label>
            <div className="flex gap-2 items-center">
                <div className="relative flex items-center flex-1">
                    <input
                        id={name}
                        type={type}
                        placeholder={placeholder}
                        className={getInputClasses(hasValue, isValidValue)}
                        {...registerHook(name, validations)}
                    />
                    {isPassword && (
                        <Button onClick={handleToggleVisibility} className="absolute right-2">
                            {type === InputType.PASSWORD && (
                                <ImageContainer>
                                    <Image imageData={currentIconClosedEye} />
                                </ImageContainer>
                            )}
                            {type === InputType.TEXT && (
                                <ImageContainer>
                                    <Image imageData={currentIconEye} />
                                </ImageContainer>
                            )}
                        </Button>
                    )}
                </div>
                {hasValue && !isPassword && (
                    <ImageContainer>
                        <Image imageData={showCheckIcon ? ICON_CHECK : ICON_WARNING} />
                    </ImageContainer>
                )}
                {hasValue && isPassword && (
                    <ImageContainer>
                        <Image imageData={showCheckIcon ? ICON_CHECK : ICON_WARNING} />
                    </ImageContainer>
                )}
            </div>
            {errorMessage && (
                <p role="alert" className={currentErrorTextConfig}>
                    {errorMessage}
                </p>
            )}
        </div>
    );
}

export default memo(InputComponent) as typeof InputComponent;
