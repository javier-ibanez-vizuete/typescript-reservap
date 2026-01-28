import classNames from "classnames";
import { useCallback, useMemo, useState } from "react";
import { useForm, type Path, type SubmitHandler } from "react-hook-form";
import FormComponent, {
    FormType,
    InputType,
    PasswordName,
    type ControllerData,
    type FormData,
} from "../components/formComponents/FormComponent";
import { Container } from "../components/UI/Container";
import { Theme, useTheme } from "../contexts/ThemeContext";
import { useAuth } from "../core/auth/useAuth";
import { useDevice } from "../hooks/useDevice";
import { useLoading } from "../hooks/useLoading";
import { useTranslate } from "../translations/useTranslate";

type FormFields = {
    name: string;
    email: string;
    address: string;
    phoneNumber: string;
    password: string;
    password2: string;
    avatar: { url: string; alt: string };
};

const DEFAULT_AVATAR = {
    url: "/pictures/avatars/avatar-default.png",
    alt: "Ghost of Tuprima",
};

const FORM_DEFAULT_VALUES: FormFields = {
    name: "",
    email: "",
    address: "",
    phoneNumber: "",
    password: "",
    password2: "",
    avatar: DEFAULT_AVATAR,
};

const INITIAL_PASS_VISIBILITY = {
    password: false,
    password2: false,
};

const baseContainerClasses = "py-4 lg:py-6";
const baseRegisterPageConfig =
    "flex flex-col self-center transition-all duration-500 ease-in-out shadow-md lg:hover:shadow-lg";

export function RegisterPage() {
    const [passVisibility, setPassVisibility] = useState(INITIAL_PASS_VISIBILITY);

    const {
        register,
        handleSubmit,
        control,
        watch,
        reset,
        formState: { errors, isDirty },
    } = useForm<FormFields>({
        mode: "onChange",
        defaultValues: FORM_DEFAULT_VALUES,
    });
    const authService = useAuth();

    const { t } = useTranslate();
    const { isLoading, setIsLoading } = useLoading();
    const { isMobile2Xs, isMobileXs, isMobileSm, isTablet, isDesktop } = useDevice();
    const { theme } = useTheme();

    const FORM_DATA: FormData<FormFields>[] = [
        {
            label: t("pages.register_page.label_name"),
            type: InputType.TEXT,
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
            type: InputType.EMAIL,
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
            type: InputType.TEXT,
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
            type: InputType.TEXT,
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
                    message: "El número telefono debe comenzar por 6, 7, 8 o 9",
                },
            },
        },
        {
            label: t("pages.register_page.label_password"),
            type: passVisibility.password ? InputType.TEXT : InputType.PASSWORD,
            name: PasswordName.PASSWORD,
            placeholder: t("pages.register_page.placeholder_input_password"),
            validations: {
                required: t("pages.register_page.validations_messages.password"),
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
            type: passVisibility.password2 ? InputType.TEXT : InputType.PASSWORD,
            name: PasswordName.PASSWORD2,
            placeholder: t("pages.register_page.placeholder_input_password"),
            validations: {
                validate: (value: unknown) => {
                    const passwordValue = watch(PasswordName.PASSWORD);
                    if ((value as string).length && passwordValue !== value) {
                        return t("pages.register_page.validations_messages.repassword");
                    }
                    return true;
                },
            },
        },
    ];

    const CONTROLLER_DATA: ControllerData<FormFields>[] = [
        {
            name: "avatar" as Path<FormFields>,
            defaultValue: DEFAULT_AVATAR,
            control,
        },
    ];

    const onFormSubmit: SubmitHandler<FormFields> = useCallback(async (data) => {
        try {
            setIsLoading(true);
            const { password2, ...rest } = data;
            const dataToRegister = { ...rest };
            await authService.register(dataToRegister);
            reset();
        } catch (error) {
            console.error("Error during Register", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const onToggleVisibility = useCallback((inputName: string) => {
        if (inputName === PasswordName.PASSWORD) {
            setPassVisibility((prev) => ({ ...prev, password: !prev.password }));
        }
        if (inputName === PasswordName.PASSWORD2) {
            setPassVisibility((prev) => ({ ...prev, password2: !prev.password2 }));
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
                "min-w-tablet max-w-[600px]": isTablet,
                "min-w-desktop max-w-[840px]": isDesktop,
            }),
            background: classNames({
                "bg-bg-alt": theme === Theme.LIGHT,
                "bg-bg-alt-dark": theme !== Theme.LIGHT,
            }),
            rounded: classNames({
                "rounded-default": isMobile2Xs || isMobileXs,
                "rounded-md": isMobileSm || isTablet || isDesktop,
            }),
            shadow: classNames({
                "shadow-text/40": theme === Theme.LIGHT,
                "shadow-text-dark/40": theme !== Theme.LIGHT,
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

    console.log("Render Register Page");

    return (
        <Container className={baseContainerClasses}>
            <section className={currentRegisterPageClasses}>
                <h1>{t("pages.register_page.title")}</h1>
                <FormComponent
                    formType={FormType.REGISTER}
                    formData={FORM_DATA}
                    controllerData={CONTROLLER_DATA}
                    registerHook={register}
                    onFormSubmit={handleSubmit(onFormSubmit)}
                    errorsHook={errors}
                    onToggleVisibility={onToggleVisibility}
                    watch={watch}
                    isDirty={isDirty}
                    reset={reset}
                    submitText={t("pages.register_page.register_button")}
                    loadingSubmitText={t("pages.register_page.register_button_loading")}
                    isLoading={isLoading}
                />
            </section>
        </Container>
    );
}
