import classNames from "classnames";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm, type RegisterOptions, type SubmitHandler } from "react-hook-form";
import LoadingButton from "../components/LoadingButton";
import Button from "../components/UI/Button";
import { Container } from "../components/UI/Container";
import Image from "../components/UI/Image";
import ImageContainer from "../components/UI/ImageContainer";
import { useTheme } from "../contexts/ThemeContext";
import { useAuth } from "../core/auth/useAuth";
import {
    ICON_CHECK,
    ICON_CLOSED_EYE_BLACK,
    ICON_CLOSED_EYE_WHITE,
    ICON_EYE_BLACK,
    ICON_EYE_WHITE,
    ICON_WARNING,
} from "../data/iconsData";
import { useDevice } from "../hooks/useDevice";
import { useLoading } from "../hooks/useLoading";
import { useTranslate } from "../translations/useTranslate";

export type FormLoginType = {
    email: string;
    password: string;
};

type VisibilityPassword = { password: boolean };

type InputFields = {
    label: string;
    type: "email" | "text" | "password";
    name: "email" | "password";
    placeholder: string;
    validations: RegisterOptions<FormLoginType, keyof FormLoginType>;
};

const FORM_DEFAULT_VALUES = {
    email: "",
    password: "",
};

const INITIAL_PASSWORD_VISIBILITY: VisibilityPassword = { password: false };

const baseContainerClasses = "py-2 lg:py-4";
const baseLoginPageClasses =
    "flex flex-col self-center transition-all duration-500 ease-in-out shadow-md lg:hover:shadow-lg";
const baseInputClasses = "py-3 px-2.5 flex-1 rounded-default";

export default function LoginPage() {
    const [passVisibility, setPassVisibility] = useState<VisibilityPassword>(INITIAL_PASSWORD_VISIBILITY);
    const [errorForm, setErrorForm] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        watch,
        reset,

        formState: { errors, isDirty, isReady },
    } = useForm<FormLoginType>({
        defaultValues: FORM_DEFAULT_VALUES,
        mode: "onChange",
    });
    const { login } = useAuth();

    const { theme } = useTheme();
    const { t } = useTranslate();
    const { isLoading, setIsLoading } = useLoading();
    const { isMobile2Xs, isMobileXs, isMobileSm, isTablet, isDesktop } = useDevice();

    const LOGIN_FORM_FIELDS: InputFields[] = [
        {
            label: t("pages.login_page.label_email"),
            type: "email",
            name: "email",
            placeholder: t("pages.login_page.placeholder_input_email"),
            validations: {
                required: t("pages.login_page.validations_messages.email"),
                minLength: {
                    value: 5,
                    message: t("pages.login_page.validations_messages.min_email"),
                },
                maxLength: {
                    value: 50,
                    message: t("pages.login_page.validations_messages.max_email"),
                },
                pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: t("pages.login_page.validations_messages.invalid_field"),
                },
            },
        },
        {
            label: t("pages.login_page.label_password"),
            type: passVisibility.password ? "text" : "password",
            name: "password",
            placeholder: t("pages.login_page.placeholder_input_password"),
            validations: {
                minLength: {
                    value: 8,
                    message: t("pages.login_page.validations_messages.min_password"),
                },
                maxLength: {
                    value: 30,
                    message: t("pages.login_page.validations_messages.max_password"),
                },
                pattern: {
                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
                    message: t("pages.login_page.validations_messages.invalid_password"),
                },
            },
        },
    ];

    const toggleVisibility = useCallback(
        (inputName: string) => {
            if (inputName === "password")
                setPassVisibility((prevValue) => ({ password: !prevValue.password }));
        },
        [setPassVisibility]
    );

    const onFormSubmit: SubmitHandler<FormLoginType> = useCallback(async (data) => {
        try {
            setIsLoading(true);
            console.table(data);
            await login(data);
        } catch (error) {
            console.warn("Hay un problema con el inicio de sesion", error);
            setErrorForm("Correo Eléctronico o Contraseña Incorrectos");
        } finally {
            reset();
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        if (!watch().email && !watch().password) return;
        setErrorForm(null);
    }, [isDirty, watch]);

    const autoLoginPageContainerConfig = useMemo(
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

    const currentLoginPageClasses = useMemo(
        () =>
            classNames(
                baseLoginPageClasses,
                autoLoginPageContainerConfig?.gap || "gap-2",
                autoLoginPageContainerConfig?.background || "bg-bg-alt",
                autoLoginPageContainerConfig?.width || "min-w-full",
                autoLoginPageContainerConfig?.padding || "py-8 px-4",
                autoLoginPageContainerConfig?.rounded || "rounded-default"
            ),
        [autoLoginPageContainerConfig]
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

    const autoInputContainerConfig = useMemo(
        () =>
            classNames("flex flex-col", {
                "gap-0.5": isMobile2Xs || isMobileXs || isMobileSm,
                "gap-1": isTablet || isDesktop,
            }),
        [isMobile2Xs, isMobileXs, isMobileSm, isTablet, isDesktop]
    );

    const getInputClasses = useCallback(
        (hasValue: boolean, isValidValue: boolean): string => {
            const autoInputConfig = classNames(
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
            return autoInputConfig;
        },
        [theme]
    );

    const currentIconEye = useMemo(() => {
        if (theme === "light") return ICON_EYE_BLACK;
        return ICON_EYE_WHITE;
    }, [theme]);

    const currentIconClosedEye = useMemo(() => {
        if (theme === "light") return ICON_CLOSED_EYE_BLACK;
        return ICON_CLOSED_EYE_WHITE;
    }, [theme]);

    return (
        <Container className={baseContainerClasses}>
            <section className={currentLoginPageClasses}>
                <h1>{t("pages.login_page.title")}</h1>
                <form onSubmit={handleSubmit(onFormSubmit)} className="flex flex-col gap-4">
                    <div className={currentFormContainerClasses}>
                        {LOGIN_FORM_FIELDS.map((field) => {
                            const hasValue = !!watch(field?.name)?.length;
                            const error = errors[field?.name];
                            const isValidValue = !error && hasValue;
                            const isPassword = field?.name === "password";

                            return (
                                <div key={field?.name} className={autoInputContainerConfig}>
                                    <label htmlFor={field?.name}>{field?.label}</label>
                                    <div className="flex items-center gap-2">
                                        <input
                                            id={field?.name}
                                            type={field?.type}
                                            placeholder={field?.placeholder}
                                            className={getInputClasses(hasValue, isValidValue)}
                                            {...register(field?.name, field?.validations)}
                                        />
                                        {hasValue && (
                                            <ImageContainer>
                                                <Image imageData={isValidValue ? ICON_CHECK : ICON_WARNING} />
                                            </ImageContainer>
                                        )}
                                        {isPassword && (
                                            <Button
                                                variant="ghost"
                                                onClick={() => toggleVisibility(field?.name)}
                                            >
                                                {field?.type === "password" && (
                                                    <ImageContainer>
                                                        <Image imageData={currentIconClosedEye} />
                                                    </ImageContainer>
                                                )}
                                                {field?.type === "text" && (
                                                    <ImageContainer>
                                                        <Image imageData={currentIconEye} />
                                                    </ImageContainer>
                                                )}
                                            </Button>
                                        )}
                                    </div>
                                    {errors[field?.name]?.message && <p>{errors[field?.name]?.message}</p>}
                                </div>
                            );
                        })}
                    </div>
                    <LoadingButton
                        variant="primary"
                        loading={isLoading}
                        disabled={isLoading}
                        loadingText="INICIANDO SESION"
                        type="submit"
                    >
                        INICIAR SESION
                    </LoadingButton>
                    {errorForm && <p className="text-error-600 opacity-70 italic">{errorForm}</p>}
                </form>
            </section>
        </Container>
    );
}
