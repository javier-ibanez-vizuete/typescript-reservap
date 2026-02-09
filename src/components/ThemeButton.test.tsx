// @ts-nocheck

import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useTheme } from "../contexts/ThemeContext";
import { useDevice } from "../hooks/useDevice";
import { render, screen } from "../test/test-utils";
import { ThemeButton } from "./ThemeButton";

const mockOnToggleTheme = vi.fn();

vi.mock("../contexts/ThemeContext.tsx", async () => {
    const currentTheme = await vi.importActual("../contexts/ThemeContext.tsx");
    return {
        ...currentTheme,
        useTheme: vi.fn(),
    };
});
vi.mock("../hooks/useDevice.tsx", () => ({ useDevice: vi.fn() }));

const mockedUseTheme = vi.mocked(useTheme);
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

const lightThemeMocked = {
    theme: "light",
    onToggleTheme: mockOnToggleTheme,
};

const darkThemeMocked = {
    theme: "dark",
    onToggleTheme: mockOnToggleTheme,
};

/**
 * Test Suite for ThemeButton Component
 *
 * Strategic Test Approach:
 * 1. Basic Render
 * 2. User Iterations
 * 3. Variants props and Custom classes
 * 4. Accesibility
 */
describe("Theme Button Component", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockedUseTheme.mockReturnValue(lightThemeMocked);
        mockedUseDevice.mockReturnValue(mobileDeviceMocked);
    });

    // =====================
    // TESTING BASIC RENDER
    // =====================
    describe("Testing Basic Render", () => {
        it("Should render propertly without props", () => {
            const user = userEvent.setup();
            render(<ThemeButton />);
            const container = screen.getByRole("button");

            expect(container).toBeInTheDocument();
            expect(container).not.toBeNull();
            expect(container).not.toBeUndefined();
        });
    });

    // ========================
    // TESTING USER ITERATIONS
    // ========================
    describe("Testing User Iterations", () => {
        it("Should render 'Currently light theme. Click to toggle' on title attribute with 'light' theme", () => {
            mockedUseTheme.mockReturnValue(lightThemeMocked);
            const user = userEvent.setup();
            render(<ThemeButton />);
            const button = screen.getByRole("none");
            expect(button).toHaveAttribute("title", "Currently light theme. Click to toggle.");
        });

        it("Should render 'Currently dark theme. Click to toggle' on title attribute with 'dark' theme", () => {
            mockedUseTheme.mockReturnValue(darkThemeMocked);
            const user = userEvent.setup();
            render(<ThemeButton />);
            const button = screen.getByRole("none");
            expect(button).toHaveAttribute("title", "Currently dark theme. Click to toggle.");
        });

        it("Should call onToggleTheme when user make click", async () => {
            const user = userEvent.setup();
            render(<ThemeButton />);
            const themeButton = screen.getByRole("button");

            await user.click(themeButton);
            expect(mockOnToggleTheme).toBeCalled();
        });

        it("Should suppport function handleClick to be called multiples times withou crush", async () => {
            const user = userEvent.setup();
            render(<ThemeButton />);
            const themeButton = screen.getByRole("button");

            for (let i = 0; i < 8; i++) {
                await user.click(themeButton);
            }
            expect(mockOnToggleTheme).toBeCalledTimes(8);
        });

        it("Should call onToggleTheme when user press Enter Key while component is Focused", async () => {
            const user = userEvent.setup();
            render(<ThemeButton />);
            const themeButton = screen.getByRole("button");
            await user.tab();
            await user.keyboard("{Enter}");
            expect(mockOnToggleTheme).toBeCalled();
        });

        it("Should call onToggleTheme when user press Spacebar Key while component is Focused", async () => {
            const user = userEvent.setup();
            render(<ThemeButton />);
            const themeButton = screen.getByRole("button");
            await user.tab();
            await user.keyboard("{ }");
            expect(mockOnToggleTheme).toBeCalled();
        });
    });

    // ==========================================
    // TESTING VARIANTS PROPS AND CUSTOM CLASSES
    // ==========================================
    describe("Testing Variants Props and Custom Classes", () => {
        it("Should render by default 'relative and perfect-center' classes", () => {
            render(<ThemeButton />);
            const button = screen.getByRole("button");

            expect(button.className).toContain("relative");
            expect(button.className).toContain("perfect-center");
        });

        it("Should render 'mx-6 my-3' with 'lg' margin prop", () => {
            render(<ThemeButton margin="lg" />);
            const button = screen.getByRole("button");

            expect(button.className).toContain("mx-6");
            expect(button.className).toContain("my-3");
        });

        it("Should render 'custom-classes' while adding to 'className' prop", () => {
            render(<ThemeButton className="custom-classes" />);
            const button = screen.getByRole("button");
            expect(button.className).toContain("custom-classes");
        });

        it("Should render 'w-10 and h-10' by default on a desktop device", () => {
            mockedUseDevice.mockReturnValue(desktopDeviceMocked);
            render(<ThemeButton />);
            const button = screen.getByRole("button");
            expect(button.className).toContain("w-10");
            expect(button.className).toContain("h-10");
        });

        it("Should render 'mx-3 and my-1.5' by default on a desktop device", () => {
            mockedUseDevice.mockReturnValue(desktopDeviceMocked);
            render(<ThemeButton />);
            const button = screen.getByRole("button");
            expect(button.className).toContain("mx-3");
            expect(button.className).toContain("my-1.5");
        });
    });

    // ==============================
    // TESTING ACCESIBILITY RENDERS
    // ==============================
    describe("Testing Accesbility", () => {
        it("Should render role 'button' by default", () => {
            render(<ThemeButton />);
            const button = screen.getByTestId("theme-button");
            expect(button).toHaveAttribute("role", "button");
        });

        it("Should render 'tabIndex=0' by default", () => {
            render(<ThemeButton />);
            const button = screen.getByTestId("theme-button");
            expect(button).toHaveAttribute("tabIndex", "0");
        });
    });
});
