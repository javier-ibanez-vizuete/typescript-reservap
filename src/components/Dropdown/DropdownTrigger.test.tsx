// @ts-nocheck

import { beforeEach, describe, expect, it, vi } from "vitest";
import { useTheme } from "../../contexts/ThemeContext";
import { useDevice } from "../../hooks/useDevice";
import { render, screen } from "../../test/test-utils";
import { DropdownTrigger } from "./DropdownTrigger";

vi.mock("../../hooks/useDevice.tsx", () => ({ useDevice: vi.fn() }));
vi.mock("../../contexts/ThemeContext.tsx", async (originalHook) => {
    const current = await originalHook<typeof import("../../contexts/ThemeContext.tsx")>();

    return {
        ...current,
        useTheme: vi.fn(),
    };
});

const mockedUseDevice = vi.mocked(useDevice);
const mockedUseTheme = vi.mocked(useTheme);

const defaultUseDeviceMock = {
    isMobile2Xs: true,
    isMobileXs: false,
    isMobileSm: false,
    isMobile: true,
    isTablet: false,
    isDesktop: false,
};

const lightUseThemeMock = {
    theme: "light",
    onToggleTheme: vi.fn(),
};

const DarkUseThemeMock = {
    theme: "dark",
    onToggleTheme: vi.fn(),
};

beforeEach(() => {
    vi.clearAllMocks();
    mockedUseDevice.mockReturnValue(defaultUseDeviceMock);
    mockedUseTheme.mockReturnValue(lightUseThemeMock);
});

/**
 * Test suite for DropdwonTrigger Component
 *
 * Strategic testing approach:
 * 1. Basic Render
 * 2. Variants Render
 * 3. Data State from IsOpen
 * 4. Padding and Rounded Variants
 * 5. Disabled Status
 */
describe("DropdownTrigger Component", () => {
    // ============================
    // TESTING BASIC RENDER
    // ============================
    describe("Basic Renders", () => {
        it("Component Should Render Propertly", () => {
            render(<DropdownTrigger>Trigger</DropdownTrigger>);
            const trigger = screen.getByRole("button");
            expect(trigger).toBeInTheDocument();
        });

        it("Component Should work with a 'null' children propertly", () => {
            render(<DropdownTrigger>{null}</DropdownTrigger>);
            const trigger = screen.getByRole("button");
            expect(trigger).toBeInTheDocument();
        });

        it("Component Should work with a 'undefined' children propertly", () => {
            render(<DropdownTrigger>{undefined}</DropdownTrigger>);
            const trigger = screen.getByRole("button");
            expect(trigger).toBeInTheDocument;
        });
    });

    // =============================
    // TESTING VARIANTS RENDERS
    // =============================
    describe("Variants props", () => {
        it("Should render 'autoConfig.variant' variant without variant props", () => {
            render(<DropdownTrigger>Trigger</DropdownTrigger>);
            const trigger = screen.getByRole("button");
            expect(trigger.className).toContain("bg-bg-alt");
            expect(trigger.className).toContain("border-bg-alt/90");
            expect(trigger.className).toContain("lg:focus:ring-bg-alt");
        });

        it("Should render 'autoConfig.variant' if variant prop is 'null' or 'undefined'", () => {
            const { rerender } = render(<DropdownTrigger variant={null}>Trigger</DropdownTrigger>);
            let trigger = screen.getByRole("button");
            expect(trigger.className).toContain("bg-bg-alt");
            expect(trigger.className).toContain("border-bg-alt/90");
            expect(trigger.className).toContain("lg:focus:ring-bg-alt");

            rerender(<DropdownTrigger variant={undefined}>Trigger</DropdownTrigger>);
            expect(trigger.className).toContain("bg-bg-alt");
            expect(trigger.className).toContain("border-bg-alt/90");
            expect(trigger.className).toContain("lg:focus:ring-bg-alt");
        });

        it("Should render 'default' variant if variant prop is invalid string", () => {
            const { rerender } = render(<DropdownTrigger variant="invalid">Trigger</DropdownTrigger>);
            let trigger = screen.getByRole("button");
            expect(trigger.className).toContain("bg-gray-400");

            rerender(<DropdownTrigger variant=" ">Trigger</DropdownTrigger>);
            expect(trigger.className).toContain("bg-bg-alt");

            rerender(<DropdownTrigger variant={null}>Trigger</DropdownTrigger>);
            expect(trigger.className).toContain("bg-bg-alt");
        });
    });

    // =====================================
    // TESTING DATA_STATE AND ACCESIBILITY
    // =====================================
    describe("Accesibility and Data State", () => {
        it("Should has aria-disabled when is 'disabled'", () => {
            render(<DropdownTrigger disabled>Trigger</DropdownTrigger>);
            const trigger = screen.getByRole("button");
            expect(trigger).toHaveAttribute("aria-disabled", "true");
        });

        it("Should has 'aria-disabled=false' when is not 'disabled'", () => {
            render(<DropdownTrigger>Trigger</DropdownTrigger>);
            const trigger = screen.getByRole("button");
            expect(trigger).toHaveAttribute("aria-disabled", "false");
        });

        it("Should has 'data-state=open' when 'isOpen'", () => {
            const { rerender } = render(<DropdownTrigger isOpen>Trigger</DropdownTrigger>);
            const trigger = screen.getByRole("button");
            expect(trigger).toHaveAttribute("data-state", "open");

            rerender(<DropdownTrigger>Trigger</DropdownTrigger>);
            expect(trigger).toHaveAttribute("data-state", "closed");
        });

        it("TabIndex should be -1 when is 'disabled' and 0 when isn't 'enable'", () => {
            const { rerender } = render(<DropdownTrigger disabled>Trigger</DropdownTrigger>);
            const trigger = screen.getByRole("button");
            expect(trigger).toHaveAttribute("tabIndex", "-1");

            rerender(<DropdownTrigger>Trigger</DropdownTrigger>);
            expect(trigger).toHaveAttribute("tabIndex", "0");
        });
    });

    // ==================================================
    // TESTING PADDING, ROUNDED AND CUSTOM CLASSES
    // ==================================================
    describe("Custom Classes, 'padding' and 'rounded' variants", () => {
        it("Should has 'px-2.5 py-1' padding by default on 'MobileDevices'", () => {
            render(<DropdownTrigger>Trigger</DropdownTrigger>);
            const trigger = screen.getByRole("button");
            expect(trigger.className).toContain("px-2.5");
            expect(trigger.className).toContain("py-1");
        });

        it("Should has 'px-3 py-1' with 'sm' padding prop", () => {
            render(<DropdownTrigger padding="sm">Trigger</DropdownTrigger>);
            const trigger = screen.getByRole("button");
            expect(trigger.className).toContain("px-3");
            expect(trigger.className).toContain("py-1");
        });

        it("Should has 'default' values padding when 'padding' prop doesn't exist", () => {
            render(<DropdownTrigger padding="invalid">Trigger</DropdownTrigger>);
            const trigger = screen.getByRole("button");
            expect(trigger.className).toContain("px-3");
            expect(trigger.className).toContain("py-1");
        });

        it("Should has autoPaddingConfig when padding is 'null' 'undefined' or empty string", () => {
            const { rerender } = render(<DropdownTrigger padding=" ">Trigger</DropdownTrigger>);
            const trigger = screen.getByRole("button");
            expect(trigger.className).toContain("px-2.5");
            expect(trigger.className).toContain("py-1");

            rerender(<DropdownTrigger padding={null}>Trigger</DropdownTrigger>);
            expect(trigger.className).toContain("px-2.5");
            expect(trigger.className).toContain("py-1");

            rerender(<DropdownTrigger padding={undefined}>Trigger</DropdownTrigger>);
            expect(trigger.className).toContain("px-2.5");
            expect(trigger.className).toContain("py-1");
        });

        it("Should has 'rounded-xs' by default on 'MobileDevices'", () => {
            render(<DropdownTrigger>Trigger</DropdownTrigger>);
            const trigger = screen.getByRole("button");
            expect(trigger.className).toContain("rounded-xs");
        });

        it("Should has 'rounded-sm' with 'sm' rounded prop", () => {
            render(<DropdownTrigger rounded="sm">Trigger</DropdownTrigger>);
            const trigger = screen.getByRole("button");
            expect(trigger.className).toContain("rounded-sm");
        });

        it("Should has 'default' rounded variant when rounded prop doesn't exist", () => {
            render(<DropdownTrigger rounded="invalid">Trigger</DropdownTrigger>);
            const trigger = screen.getByRole("button");
            expect(trigger.className).toContain("rounded-default");
        });

        it("Should has autoRoundedConfig when rounded is 'null', 'undefined' or empty string", () => {
            const { rerender } = render(<DropdownTrigger rounded=" ">Trigger</DropdownTrigger>);
            const trigger = screen.getByRole("button");
            expect(trigger.className).toContain("rounded-xs");

            rerender(<DropdownTrigger rounded={null}>Trigger</DropdownTrigger>);
            expect(trigger.className).toContain("rounded-xs");

            rerender(<DropdownTrigger>Trigger</DropdownTrigger>);
            expect(trigger.className).toContain("rounded-xs");
        });

        it("should has 'customClasses' from 'className' prop", () => {
            const { rerender } = render(<DropdownTrigger>Trigger</DropdownTrigger>);
            const trigger = screen.getByRole("button");
            expect(trigger.className).not.toContain("customclasses");

            rerender(<DropdownTrigger className="customclasses">Trigger</DropdownTrigger>);
            expect(trigger.className).toContain("customclasses");
        });

        it("Should has 'bg-bg-alt-dark' by 'default' with 'dark theme", () => {
            mockedUseTheme.mockReturnValue(DarkUseThemeMock);
            render(<DropdownTrigger>Trigger</DropdownTrigger>);
            const trigger = screen.getByRole("button");
            expect(trigger.className).toContain("bg-bg-alt-dark");
        });
    });
});
