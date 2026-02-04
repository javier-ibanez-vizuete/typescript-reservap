// @ts-nocheck

import { beforeEach, describe, expect, it, vi } from "vitest";
import { useTheme } from "../../contexts/ThemeContext";
import { useDevice } from "../../hooks/useDevice";
import { render, screen } from "../../test/test-utils";
import DropdownMenu from "./DropdownMenu";

vi.mock("../../hooks/useDevice.tsx", () => ({ useDevice: vi.fn() }));
vi.mock("../../contexts/ThemeContext.tsx", async (originalHook) => {
    const currentHook = await originalHook<typeof import("../../contexts/ThemeContext.tsx")>();

    return {
        ...currentHook,
        useTheme: vi.fn(),
    };
});

const mockedUseDevice = vi.mocked(useDevice);
const mockedUseTheme = vi.mocked(useTheme);

const defaultUseDeviceMocked = {
    isMobile2Xs: true,
    isMobileXs: false,
    isMobileSm: false,
    isMobile: true,
    isTablet: false,
    isDesktop: false,
};

const lightUseTheme = {
    theme: "light",
    onToggleTheme: vi.fn(),
};
const darktUseTheme = {
    theme: "dark",
    onToggleTheme: vi.fn(),
};

/**
 * Test suite for DropdownMenu Component
 *
 * Strategic testing approach:
 * 1. Basic Render
 * 2. Variant Render
 * 3. Custom Classes, padding and rounded
 * 4. Accesibility
 */
describe("DropdownMenu Component", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockedUseDevice.mockReturnValue(defaultUseDeviceMocked);
        mockedUseTheme.mockReturnValue(lightUseTheme);
    });

    // ===============================
    // TESTING BASIC RENDERS
    // ===============================
    describe("Basic Renders", () => {
        it("Should not render when 'isOpen={false}'", () => {
            render(<DropdownMenu>Menu</DropdownMenu>);
            const menu = screen.queryByRole("menu");
            expect(menu).toBeNull();
        });

        it("Should render Correctly Without Children: 'null' or 'undefined'", () => {
            const { rerender } = render(<DropdownMenu isOpen>{null}</DropdownMenu>);
            const menu = screen.getByRole("menu", { hidden: true });
            expect(menu).toBeInTheDocument();

            rerender(<DropdownMenu isOpen>{undefined}</DropdownMenu>);
            expect(menu).toBeInTheDocument();
        });
    });

    // ======================================
    // TESTING VARIANTS PROPS
    // ======================================
    describe("Variants Renders Classes", () => {
        it("Should render 'autoConfig?.color by default when there's not 'variant' prop for 'light' theme", () => {
            render(<DropdownMenu isOpen>Menu</DropdownMenu>);
            const menu = screen.getByRole("menu", { hidden: true });
            expect(menu.className).toContain("bg-bg");
            expect(menu.className).toContain("border-bg/90");
        });

        it("Should render 'autoConfig?.color by default when there's not 'variant' prop for 'dark' theme", () => {
            mockedUseTheme.mockReturnValue(darktUseTheme);
            render(<DropdownMenu isOpen>Menu</DropdownMenu>);
            const menu = screen.getByRole("menu", { hidden: true });
            expect(menu.className).toContain("bg-bg-dark");
            expect(menu.className).toContain("border-bg-dark/90");
        });

        it("Should render 'default' variants if 'variant' prop is not valid", () => {
            render(
                <DropdownMenu variant="invalid" isOpen>
                    Menu
                </DropdownMenu>
            );
            const menu = screen.getByRole("menu", { hidden: true });
            expect(menu.className).toContain("bg-bg");
            expect(menu.className).toContain("border-gray-300");
        });

        it("Should render 'primary' variant if 'variant' prop is 'primary'", () => {
            render(
                <DropdownMenu variant="primary" isOpen>
                    Menu
                </DropdownMenu>
            );
            const menu = screen.getByRole("menu", { hidden: true });
            expect(menu.className).toContain("bg-primary");
        });
    });

    // ==========================================================
    // TESTING CUSTOM CLASSES, PADDING AND ROUNDED VARIANTS
    // ==========================================================
    describe("Testing Custom Classes, padding, rounded and gap variants", () => {
        it("Should render 'autoConfig' if theren't padding or rounded props", () => {
            render(<DropdownMenu isOpen>Menu</DropdownMenu>);
            const menu = screen.getByRole("menu", { hidden: true });
            expect(menu.className).toContain("px-2");
            expect(menu.className).toContain("rounded-sm");
        });

        it("Should Render 'p-2' and 'rounded-sm' when using 'padding=xs' and 'rounded=sm'", () => {
            render(
                <DropdownMenu padding="xs" rounded="sm" isOpen>
                    Menu
                </DropdownMenu>
            );
            const menu = screen.getByRole("menu", { hidden: true });
            expect(menu.className).toContain("p-2");
            expect(menu.className).toContain("rounded-sm");
        });

        it("should render 'custom-classes' when using className prop", () => {
            const { rerender } = render(<DropdownMenu isOpen>Menu</DropdownMenu>);
            const menu = screen.getByRole("menu", { hidden: true });
            expect(menu.className).not.toContain("custom-classes");

            rerender(
                <DropdownMenu className="custom-classes" isOpen>
                    Menu
                </DropdownMenu>
            );
            expect(menu.className).toContain("custom-classes");
        });
    });

    // =====================================
    // TESTING ACCESIBILITY
    // =====================================
    describe("Testing Accesibility", () => {
        it("Should render 'role' menu when 'isOpen=true'", () => {
            render(<DropdownMenu isOpen>Menu</DropdownMenu>);
            const menu = screen.getByRole("menu", { hidden: true });
            expect(menu).toBeInTheDocument();
        });

        it("Should render 'data-state=open' when 'isOpen=true'", () => {
            render(<DropdownMenu isOpen>Menu</DropdownMenu>);
            const menu = screen.getByRole("menu", { hidden: true });
            expect(menu).toHaveAttribute("data-state", "open");
        });
    });
});
