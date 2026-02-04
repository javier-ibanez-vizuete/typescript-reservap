// @ts-nocheck

import { beforeEach, describe, expect, it, vi } from "vitest";
import { useTheme } from "../contexts/ThemeContext";
import { useDevice } from "../hooks/useDevice";
import { render, screen } from "../test/test-utils";
import Navbar from "./Navbar";

vi.mock("../hooks/useDevice.tsx", () => ({ useDevice: vi.fn() }));

vi.mock("../contexts/ThemeContext.tsx", async (originalHook) => {
    const currentHook = await originalHook<typeof import("../contexts/ThemeContext.tsx")>();

    return {
        ...currentHook,
        useTheme: vi.fn(),
    };
});

const mockedUseDevice = vi.mocked(useDevice);
const mockedUseTheme = vi.mocked(useTheme);

const mobileUseDevice = {
    isMobile2Xs: true,
    isMobileXs: false,
    isMobileSm: false,
    isMobile: true,
    isTablet: false,
    isDesktop: false,
};

const desktopUseDevice = {
    isMobile2Xs: false,
    isMobileXs: false,
    isMobileSm: false,
    isMobile: false,
    isTablet: false,
    isDesktop: true,
};

const lightUseTheme = {
    theme: "light",
    onToggleTheme: vi.fn(),
};

const darkUseTheme = {
    theme: "dark",
    onToggleTheme: vi.fn(),
};

/**
 * Test Suite of Navbar Component
 *
 * Strategic Testing Approach:
 * 1. Basic Render by User
 * 2. Custom Classes from Theme (Light/Dark)
 * 3. Logo Render from Theme (Light/Dark)
 * 4. NavbarLinks Render with User
 * 5. Login/Register buttons Render without User
 * 6. Burger Button Render only on mobile/tablet
 * 8. Click on Burger Button Open Mobile Menu
 * 9. Click on Link Close Mobile Menu
 * 10. Change pathname close Mobile Menu
 * 11. Accesibility
 */
describe("Navbar Component", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockedUseDevice.mockReturnValue(mobileUseDevice);
        mockedUseTheme.mockReturnValue(lightUseTheme);
    });

    // ========================
    // TESTING BASIC RENDERS
    // ========================
    describe("Basic Render", () => {
        it("Should render nav propertly", () => {
            render(<Navbar />);
            const navbar = screen.getByRole("navigation");
            expect(navbar).toBeInTheDocument();
        });
    });

    // ================================
    // TESTING CLASSES FROM (useTheme)
    // ================================
    describe("Testing classes from useTheme", () => {
        it("Should render 'bg-bg-alt' with 'light' theme", () => {
            render(<Navbar />);
            const nav = screen.getByRole("navigation");
            expect(nav.className).toContain("bg-bg-alt");
        });

        it("Should render 'bg-bg-alt-dark' with 'dark' theme", () => {
            mockedUseTheme.mockReturnValue(darkUseTheme);
            render(<Navbar />);
            const nav = screen.getByRole("navigation");
            expect(nav.className).toContain("bg-bg-alt-dark");
        });
    });
});
