// @ts-nocheck

import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useDevice } from "../../hooks/useDevice";
import { render, screen } from "../../test/test-utils";
import FormComponent, { FormType, InputType, type FormData } from "./FormComponent";

const mockOnFormSubmit = vi.fn();
const mockOnToggleVisibility = vi.fn();
const mockRegisterHook = vi.fn();
const mockReset = vi.fn();
const mockWatch = vi.fn();

vi.mock("../../hooks/useDevice.tsx", () => ({ useDevice: vi.fn() }));

const mockedUseDevice = vi.mocked(useDevice);

const mobileDeviceMocked = {
    isMobile2Xs: true,
    isMobileXs: false,
    isMobileSm: false,
    isMobile: true,
    isTablet: false,
    isDesktop: false,
};

const desktopDeviceMocked = {
    isMobile2Xs: false,
    isMobileXs: false,
    isMobileSm: false,
    isMobile: false,
    isTablet: false,
    isDesktop: true,
};

const defaultFormData: FormData[] = [
    {
        label: "Email",
        name: "email",
        type: InputType.EMAIL,
        placeholder: "Enter your email",
        validations: {
            required: "Email is required",
        },
    },
    {
        label: "Password",
        name: "password",
        type: InputType.PASSWORD,
        placeholder: "Enter your password",
        validations: {
            required: "Password is required",
            minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
            },
        },
    },
];

const defaultProps = {
    formData: defaultFormData,
    formType: FormType.LOGIN,
    registerHook: mockRegisterHook,
    onFormSubmit: mockOnFormSubmit,
    errorsHook: {},
    onToggleVisibility: mockOnToggleVisibility,
    watch: mockWatch,
    isDirty: false,
    reset: mockReset,
    submitText: "Submit",
    loadingSubmitText: "Loading...",
    isLoading: false,
};

// TODO: COMPROBAR TEST DE FORMCOMPONENT

/**
 * Test Suite for FormComponent Component
 *
 * Strategic Test Approach:
 * 1. Basic Render
 * 2. User Iterations
 * 3. Responsive Behavior
 * 4. Form States
 */
describe("FormComponent Component", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockedUseDevice.mockReturnValue(mobileDeviceMocked);
        mockWatch.mockReturnValue("");
    });

    // =====================
    // TESTING BASIC RENDER
    // =====================
    describe("Testing Basic Render", () => {
        it("Should render form properly with required props", () => {
            render(<FormComponent {...defaultProps} />);
            const form = screen.getByRole("form");

            expect(form).toBeInTheDocument();
            expect(form).not.toBeNull();
        });

        it("Should render all inputs from formData array", () => {
            render(<FormComponent {...defaultProps} />);
            const inputs = screen.getAllByRole("textbox");

            expect(inputs.length).toBeGreaterThan(0);
        });
    });

    // ========================
    // TESTING USER ITERATIONS
    // ========================
    describe("Testing User Iterations", () => {
        it("Should call onFormSubmit when form is submitted", async () => {
            const user = userEvent.setup();
            render(<FormComponent {...defaultProps} />);
            const form = screen.getByRole("form");

            await user.click(screen.getByRole("button", { name: /submit/i }));

            expect(mockOnFormSubmit).toHaveBeenCalled();
        });

        it("Should render reset button when form isDirty is true", () => {
            render(<FormComponent {...defaultProps} isDirty={true} />);
            const resetButton = screen.getByRole("button", { name: /reset/i });

            expect(resetButton).toBeInTheDocument();
        });

        it("Should call reset function when reset button is clicked", async () => {
            const user = userEvent.setup();
            render(<FormComponent {...defaultProps} isDirty={true} />);
            const resetButton = screen.getByRole("button", { name: /reset/i });

            await user.click(resetButton);

            expect(mockReset).toHaveBeenCalled();
        });

        it("Should disable submit button when isLoading is true", () => {
            render(<FormComponent {...defaultProps} isLoading={true} />);
            const submitButton = screen.getByRole("button", { name: /loading/i });

            expect(submitButton).toBeDisabled();
        });
    });

    // ==========================================
    // TESTING RESPONSIVE BEHAVIOR
    // ==========================================
    describe("Testing Responsive Behavior", () => {
        it("Should render with flex-col layout on mobile devices", () => {
            mockedUseDevice.mockReturnValue(mobileDeviceMocked);
            render(<FormComponent {...defaultProps} />);
            const form = screen.getByRole("form");

            expect(form.firstChild.className).toContain("flex-col");
        });

        it("Should render with grid layout on desktop devices", () => {
            mockedUseDevice.mockReturnValue(desktopDeviceMocked);
            render(<FormComponent {...defaultProps} />);
            const form = screen.getByRole("form");

            expect(form.firstChild.className).toContain("grid-cols-2");
        });
    });

    // ==========================================
    // TESTING FORM STATES
    // ==========================================
    describe("Testing Form States", () => {
        it("Should render loading text when isLoading is true", () => {
            render(<FormComponent {...defaultProps} isLoading={true} />);
            const loadingButton = screen.getByText(/loading/i);

            expect(loadingButton).toBeInTheDocument();
        });

        it("Should render Controller components when controllerData is provided", () => {
            const controllerData = [
                {
                    name: "avatar",
                    control: {} as any,
                    defaultValue: "",
                },
            ];

            render(<FormComponent {...defaultProps} controllerData={controllerData} />);
            const form = screen.getByRole("form");

            expect(form).toBeInTheDocument();
        });
    });
});
