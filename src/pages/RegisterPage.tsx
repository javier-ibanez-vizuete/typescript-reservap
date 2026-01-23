import classNames from "classnames";
import { useCallback, useMemo, useState } from "react";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import AvatarSelector from "../components/AvatarSelector";
import LoadingButton from "../components/LoadingButton";
import { Container } from "../components/UI/Container";
import type { InputProps } from "../components/UI/Input";
import Input from "../components/UI/Input";
import { useTheme } from "../contexts/ThemeContext";
import type { AvatarType } from "../core/auth/auth.type";
import { useAuth } from "../core/auth/useAuth";
import { useDevice } from "../hooks/useDevice";
import { useLoading } from "../hooks/useLoading";
import { useTranslate } from "../translations/useTranslate";

export type FormType = {
    name: string;
    email: string;
    address: string;
    password: string;
    repassword: string;
    phoneNumber: number | string;
    avatar: AvatarType;
};

type VisibilityPassword = { password: Boolean; repassword: boolean };

type RegisterFormField = Omit<
    InputProps,
    "register" | "isValid" | "hasText" | "toggleVisibility" | "passwordMatch"
>;

const DEFAULT_AVATAR = {
    url: "/pictures/avatars/avatar-default.png",
    alt: "Ghost of Tuprima",
};

const FORM_DEFAULT_VALUES: FormType = {
    name: "",
    email: "",
    address: "",
    phoneNumber: "",
    password: "",
    repassword: "",
    avatar: DEFAULT_AVATAR,
};

const INITIAL_PASSWORD_VISIBILITY: VisibilityPassword = { password: false, repassword: false };

const baseContainerClasses = "py-2 lg:py-4";
const baseRegisterPageConfig =
    "flex flex-col self-center transition-all duration-500 ease-in-out shadow-md lg:hover:shadow-lg";
const baseErrorMessageClasses = "text-text-muted italic text-2xs";

export default function RegisterPage() {
    const [passwordVisibility, setPasswordVisibility] =
        useState<VisibilityPassword>(INITIAL_PASSWORD_VISIBILITY);
    const {
        register,
        handleSubmit,
        reset,
        watch,
        control,
        formState: { errors },
    } = useForm<FormType>({ mode: "onChange", defaultValues: FORM_DEFAULT_VALUES });
    const authService = useAuth();

    const { t } = useTranslate();
    const { isMobile2Xs, isMobileXs, isMobileSm, isTablet, isDesktop } = useDevice();
    const { theme } = useTheme();
    const { isLoading, setIsLoading } = useLoading();
    const navigate = useNavigate();

    const REGISTER_FORM_FIELDS: RegisterFormField[] = [
        {
            label: t("pages.register_page.label_name"),
            type: "text",
            name: "name",
            placeholder: t("pages.register_page.placeholder_input_name"),
            validations: {
                required: t("pages.register_page.validations_messages.name"),
                minLength: {
                    value: 4,
                    message: t("pages.register_page.validations_messages.min_name"),
                },
                maxLength: {
                    value: 30,
                    message: t("pages.register_page.validations_messages.max_name"),
                },
                pattern: {
                    value: /^[ \p{L}]+$/u,
                    message: t("pages.register_page.validations_messages.invalid_field"),
                },
            },
        },
        {
            label: t("pages.register_page.label_email"),
            type: "email",
            name: "email",
            placeholder: t("pages.register_page.placeholder_input_email"),
            validations: {
                required: t("pages.register_page.validations_messages.email"),
                minLength: {
                    value: 5,
                    message: t("pages.register_page.validations_messages.min_email"),
                },
                maxLength: {
                    value: 50,
                    message: t("pages.register_page.validations_messages.max_email"),
                },
                pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: t("pages.register_page.validations_messages.invalid_field"),
                },
            },
        },
        {
            label: t("pages.register_page.label_address"),
            type: "text",
            name: "address",
            placeholder: t("pages.register_page.placeholder_input_address"),
            validations: {
                required: t("pages.register_page.validations_messages.address"),
                minLength: {
                    value: 8,
                    message: t("pages.register_page.validations_messages.min_address"),
                },
                maxLength: {
                    value: 50,
                    message: t("pages.register_page.validations_messages.max_address"),
                },
            },
        },
        {
            label: t("pages.register_page.label_phone"),
            type: "text",
            name: "phoneNumber",
            placeholder: t("pages.register_page.placeholder_input_phone"),
            validations: {
                required: t("pages.register_page.validations_messages.phone"),
                minLength: {
                    value: 9,
                    message: t("pages.register_page.validations_messages.min_phone"),
                },
                maxLength: {
                    value: 9,
                    message: t("pages.register_page.validations_messages.max_phone"),
                },
                pattern: {
                    value: /^[6789]\d{8}$/,
                    message: "El numero telefono debe comenzar por 6********",
                },
            },
        },
        {
            label: t("pages.register_page.label_password"),
            type: passwordVisibility.password ? "text" : "password",
            name: "password",
            placeholder: t("pages.register_page.placeholder_input_password"),
            validations: {
                minLength: {
                    value: 8,
                    message: t("pages.register_page.validations_messages.min_password"),
                },
                maxLength: {
                    value: 30,
                    message: t("pages.register_page.validations_messages.max_password"),
                },
                pattern: {
                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
                    message: t("pages.register_page.validations_messages.invalid_password"),
                },
            },
        },
        {
            label: t("pages.register_page.label_repassword"),
            type: passwordVisibility.repassword ? "text" : "password",
            name: "repassword",
            placeholder: t("pages.register_page.placeholder_input_password"),
            validations: {
                validate: (value: unknown) => {
                    if ((value as string).length && watch("password") !== value)
                        return t("pages.register_page.validations_messages.repassword");
                    return true;
                },
            },
        },
    ];

    const toggleVisibility = useCallback(
        (inputName: "password" | "repassword") => {
            if (inputName === "password")
                setPasswordVisibility((prevValue) => ({ ...prevValue, password: !prevValue.password }));
            if (inputName === "repassword")
                setPasswordVisibility((prevValue) => ({ ...prevValue, repassword: !prevValue.repassword }));
        },
        [setPasswordVisibility]
    );

    const passWordMatch = useMemo(() => watch().password === watch().repassword, [watch]);

    const onFormSubmit: SubmitHandler<FormType> = useCallback(async (data) => {
        try {
            setIsLoading(true);
            const { repassword, ...rest } = data;
            const dataToRegister = { ...rest };

            const registerRequest = await authService.register(dataToRegister);
            if (registerRequest) {
                console.log("USUARIO REGISTRADO =>", registerRequest);
                navigate("/", { state: { fromRegister: true }, replace: true });
            }
            reset();
        } catch (error) {
            // IMPLEMENTAR TOASTS
            console.warn("Ha habido un problema Registrando al usuario");
        } finally {
            setIsLoading(false);
        }
    }, []);

    const autoRegisterPageContainerConfig = useMemo(
        () => ({
            gap: classNames({
                "gap-2": isMobile2Xs || isMobileXs || isMobileSm || isTablet,
                "gap-4": isDesktop,
            }),
            padding: classNames({
                "py-4 px-2": isMobile2Xs || isMobileXs,
                "py-8 px-4": isMobileSm,
                "py-12 px-6": isTablet,
                "py-16 px-8": isDesktop,
            }),
            width: classNames({
                "min-w-full": isMobile2Xs || isMobileXs || isMobileSm,
                "min-w-tablet": isTablet,
                "min-w-desktop": isDesktop,
            }),
            background: classNames({
                "bg-bg-alt": theme === "light",
                "bg-bg-alt-dark": theme !== "light",
            }),
            rounded: classNames({
                "rounded-default": isMobile2Xs || isMobileXs,
                "rounded-md": isMobileSm || isTablet || isDesktop,
            }),
            shadow: classNames({
                "shadow-text/40": theme === "light",
                "shadow-text-dark/40": theme !== "light",
            }),
        }),
        [isMobile2Xs, isMobileXs, isMobileSm, isTablet, isDesktop, theme]
    );

    const currentRegisterPageClasses = useMemo(
        () =>
            classNames(
                baseRegisterPageConfig,
                autoRegisterPageContainerConfig?.gap || "gap-2",
                autoRegisterPageContainerConfig?.background || "bg-bg-alt",
                autoRegisterPageContainerConfig?.width || "min-w-full",
                autoRegisterPageContainerConfig?.padding || "py-8 px-4",
                autoRegisterPageContainerConfig?.rounded || "rounded-default"
            ),
        [autoRegisterPageContainerConfig]
    );

    const currentFormContainerClasses = useMemo(
        () =>
            classNames(
                {
                    "flex flex-col": isMobile2Xs || isMobileXs || isMobileSm,
                    "grid grid-cols-2": isTablet || isDesktop,
                },
                {
                    "gap-4": isMobile2Xs || isMobileXs || isMobileSm,
                    "gap-y-3 gap-x-5": isTablet || isDesktop,
                }
            ),
        [isMobile2Xs, isMobileXs, isMobileSm, isTablet, isDesktop]
    );

    return (
        <Container className={baseContainerClasses}>
            <section className={currentRegisterPageClasses}>
                <h1>{t("pages.register_page.title")}</h1>
                <form onSubmit={handleSubmit(onFormSubmit)} className="flex flex-col gap-4">
                    <div className={currentFormContainerClasses}>
                        {REGISTER_FORM_FIELDS.map((field: RegisterFormField) => {
                            const inputValue = watch(field.name);
                            const hasText = !!(inputValue as string)?.length;
                            const fieldName = field.name;
                            const error = errors[fieldName];
                            const isValid = !error && !!inputValue;

                            return (
                                <div key={field.name} className="flex flex-col gap-0.5">
                                    <Input
                                        label={field.label}
                                        type={field.type}
                                        name={field.name}
                                        placeholder={field.placeholder}
                                        register={register}
                                        validations={field.validations}
                                        isValid={isValid}
                                        hasText={hasText}
                                        toggleVisibility={toggleVisibility}
                                        passwordMatch={passWordMatch}
                                    />
                                    {error?.message && (
                                        <p className={baseErrorMessageClasses}>{error.message}</p>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                    <div className="perfect-center self-center">
                        <Controller
                            name="avatar"
                            defaultValue={DEFAULT_AVATAR}
                            control={control}
                            rules={{ required: "Selecciona un avatar" }}
                            render={({ field }) => <AvatarSelector field={field} />}
                        />
                    </div>
                    <LoadingButton
                        type="submit"
                        loading={isLoading}
                        disabled={isLoading}
                        variant="primary"
                        loadingText={t("pages.register_page.register_button_loading")}
                    >
                        {t("pages.register_page.register_button")}
                    </LoadingButton>
                </form>
            </section>
        </Container>
    );
}
