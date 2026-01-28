import { memo, useMemo } from "react";

import classNames from "classnames";
import {
    Controller,
    type Control,
    type FieldErrors,
    type FieldValues,
    type Path,
    type PathValue,
    type UseFormRegister,
    type UseFormWatch,
} from "react-hook-form";
import { useDevice } from "../../hooks/useDevice";
import AvatarSelector from "../AvatarSelector";
import LoadingButton from "../LoadingButton";
import InputComponent from "./InputComponent";

export enum PasswordName {
    PASSWORD = "password",
    PASSWORD2 = "password2",
}

export enum FormType {
    LOGIN = "login",
    REGISTER = "register",
}

export enum InputType {
    TEXT = "text",
    PASSWORD = "password",
    EMAIL = "email",
    SEARCH = "search",
    URL = "url",
    TEL = "tel",
    NUMBER = "number",
    RANGE = "range",
    DATE = "date",
    DATETIME_LOCAL = "datetime-local",
    MONTH = "month",
    WEEK = "week",
    TIME = "time",
    CHECKBOX = "checkbox",
    RADIO = "radio",
    FILE = "file",
    IMAGE = "image",
    COLOR = "color",
    BUTTON = "button",
    SUBMIT = "submit",
    RESET = "reset",
    HIDDEN = "hidden",
}

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

export type FormData<T extends FieldValues = FieldValues> = {
    label: string;
    name: Path<T>;
    type: InputType;
    placeholder: string;
    validations?: InputValidations;
};

export type ControllerData<T extends FieldValues = FieldValues> = {
    name: Path<T>;
    defaultValue?: PathValue<T, Path<T>>;
    control: Control<T>;
    rules?: InputValidations;
};

type FormComponentProps<T extends FieldValues> = {
    formType: FormType;
    formData: FormData<T>[];
    controllerData?: ControllerData<T>[];
    registerHook: UseFormRegister<T>;
    onFormSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
    errorsHook: FieldErrors<T>;
    onToggleVisibility: (inputName: string) => void;
    watch: UseFormWatch<T>;
    submitText: string;
    loadingSubmitText: string;
    isLoading: boolean;
};

function FormComponent<T extends FieldValues>({
    formData,
    controllerData = [],
    registerHook,
    onFormSubmit,
    errorsHook,
    onToggleVisibility,
    watch,
    submitText,
    loadingSubmitText,
    isLoading,
}: FormComponentProps<T>) {
    const { isMobile2Xs, isMobileXs, isMobileSm, isTablet, isDesktop } = useDevice();

    const password = watch(PasswordName.PASSWORD as Path<T>);
    const password2 = watch(PasswordName.PASSWORD2 as Path<T>);
    const passwordMatch = password === password2;

    const autoFormContainerConfig = useMemo(
        () => ({
            display: classNames({
                "flex flex-col": isMobile2Xs || isMobileXs || isMobileSm,
                "grid grid-cols-2": isTablet || isDesktop,
            }),
            gap: classNames({
                "gap-2": isMobile2Xs || isMobileXs || isMobileSm,
                "gap-y-3 gap-x-5": isTablet || isDesktop,
            }),
        }),
        [isMobile2Xs, isMobileXs, isMobileSm, isTablet, isDesktop]
    );

    const currentFormContainerClasses = useMemo(
        () =>
            classNames(
                autoFormContainerConfig?.display ?? "flex flex-col",
                autoFormContainerConfig?.gap ?? "gap-4"
            ),
        [autoFormContainerConfig?.display, autoFormContainerConfig?.gap]
    );

    return (
        <form onSubmit={onFormSubmit} className={`flex flex-col ${autoFormContainerConfig?.gap ?? "gap-4"}`}>
            <div className={currentFormContainerClasses}>
                {formData.map((inputData) => {
                    const fieldValue = watch(inputData.name);
                    const hasValue = !!fieldValue;
                    const error = errorsHook[inputData.name];
                    const isValidValue = !error && hasValue;
                    const isPassword =
                        inputData.name === PasswordName.PASSWORD || inputData.name === PasswordName.PASSWORD2;

                    return (
                        <InputComponent<T>
                            key={inputData.name}
                            registerHook={registerHook}
                            onToggleVisibility={onToggleVisibility}
                            {...inputData}
                            hasValue={hasValue}
                            error={error}
                            isValidValue={isValidValue}
                            isPassword={isPassword}
                            passwordMatch={passwordMatch}
                        />
                    );
                })}
            </div>

            {controllerData.length > 0 &&
                controllerData.map((data) => (
                    <Controller
                        key={data.name}
                        name={data.name}
                        control={data.control}
                        defaultValue={data.defaultValue}
                        rules={data.rules}
                        render={({ field }) => <AvatarSelector field={field} />}
                    />
                ))}

            <LoadingButton
                type="submit"
                loading={isLoading}
                disabled={isLoading}
                variant="primary"
                loadingText={loadingSubmitText}
            >
                {submitText}
            </LoadingButton>
        </form>
    );
}

export default memo(FormComponent) as typeof FormComponent;
