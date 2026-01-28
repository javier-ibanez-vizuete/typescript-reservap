import classNames from "classnames";
import { useCallback, useMemo, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import FormComponent, {
    FormType,
    InputType,
    PasswordName,
    type FormData,
} from "../components/formComponents/FormComponent";
import { Container } from "../components/UI/Container";
import { Theme, useTheme } from "../contexts/ThemeContext";
import { useDevice } from "../hooks/useDevice";
import { useLoading } from "../hooks/useLoading";
import { useTranslate } from "../translations/useTranslate";

type FormFields = {
    email: string;
    password: string;
};

const FORM_DEFAULT_VALUES: FormFields = {
    email: "",
    password: "",
};

type PassVisibility = {
    password: boolean;
};

const INITIAL_PASS_VISIBILITY = { password: false };

const baseContainerClasses = "py-4 lg:py-6";
const baseRegisterPageConfig =
    "flex flex-col self-center transition-all duration-500 ease-in-out shadow-md lg:hover:shadow-lg";

export function LoginPage() {
    const [passVisibility, setPassVisibility] = useState<PassVisibility>(INITIAL_PASS_VISIBILITY);

    const {
        register,
        watch,
        handleSubmit,
        reset,
        formState: { errors, isDirty },
    } = useForm<FormFields>({ mode: "onChange", defaultValues: FORM_DEFAULT_VALUES });

    const { isMobile2Xs, isMobileXs, isMobileSm, isTablet, isDesktop } = useDevice();
    const { isLoading, setIsLoading } = useLoading();
    const { t } = useTranslate();
    const { theme } = useTheme();

    const FORM_DATA: FormData<FormFields>[] = [
        {
            label: t("pages.login_page.label_email"),
            type: InputType.EMAIL,
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
            type: passVisibility.password ? InputType.TEXT : InputType.PASSWORD,
            name: PasswordName.PASSWORD,
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

    const onFormSubmit: SubmitHandler<FormFields> = useCallback((data) => {
        try {
            setIsLoading(true);
            console.log("Sending data", data);
        } catch (error) {
            console.warn("Error during Login");
        } finally {
            setIsLoading(false);
        }
    }, []);

    const onToggleVisibility = useCallback(
        (inputName: string) => {
            if (inputName === PasswordName.PASSWORD) {
                setPassVisibility((prevValue) => ({ password: !prevValue.password }));
            }
        },
        [setPassVisibility]
    );

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

    return (
        <Container className={baseContainerClasses}>
            <section className={currentRegisterPageClasses}>
                <h1>{t("pages.login_page.title")}</h1>
                <FormComponent
                    formType={FormType.LOGIN}
                    formData={FORM_DATA}
                    registerHook={register}
                    onFormSubmit={handleSubmit(onFormSubmit)}
                    errorsHook={errors}
                    watch={watch}
                    isDirty={isDirty}
                    reset={reset}
                    onToggleVisibility={onToggleVisibility}
                    submitText={t("pages.login_page.login_button")}
                    loadingSubmitText={t("pages.login_page.login_button_loading")}
                    isLoading={isLoading}
                />
            </section>
        </Container>
    );
}
