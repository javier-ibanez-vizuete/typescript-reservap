// @ts-nocheck

import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useTheme } from "../contexts/ThemeContext";
import { useAuth } from "../core/auth/useAuth";
import { useDevice } from "../hooks/useDevice";
import { render, screen, waitFor, within } from "../test/test-utils";
import Navbar from "./Navbar";

vi.mock("../hooks/useDevice.tsx", () => ({ useDevice: vi.fn() }));

vi.mock("../contexts/ThemeContext.tsx", async (originalHook) => {
    const currentHook = await originalHook<typeof import("../contexts/ThemeContext.tsx")>();

    return {
        ...currentHook,
        useTheme: vi.fn(),
    };
});

vi.mock("../core/auth/useAuth.tsx");

const mockedUseDevice = vi.mocked(useDevice);
const mockedUseTheme = vi.mocked(useTheme);
const mockedUseAuth = vi.mocked(useAuth);

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

const defaultLoggedValues = { isLoggedIn: false };
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
 * 7. Click on Link Close Mobile Menu
 * 8. Accesibility
 */
describe("Navbar Component", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockedUseDevice.mockReturnValue(mobileUseDevice);
        mockedUseTheme.mockReturnValue(lightUseTheme);
        mockedUseAuth.mockReturnValue(defaultLoggedValues);
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

    // ================================
    // TESTING LOGO RENDER BY THEME
    // ================================
    describe("Testing Logos Render by theme", () => {
        it("Should Render 'Logo ReservApp Black' with 'light' theme", () => {
            const { container } = render(<Navbar />);
            const img = container.querySelector("img");
            expect(img).toHaveAttribute("alt", "Logo ReservApp Black");
        });

        it("Should Render 'Logo ReservApp White' with 'dark' theme", () => {
            mockedUseTheme.mockReturnValue(darkUseTheme);
            const { container } = render(<Navbar />);
            const img = container.querySelector("img");
            expect(img).toHaveAttribute("alt", "Logo ReservApp White");
        });
    });

    // ===============================
    // TESTING NAVBARLINKS WITH USER
    // ===============================

    describe("Testing NavbarLinks Render by User", () => {
        it("Should Render 'NavbarLinks' with 'isLoggedIn=true' on 'desktop'", () => {
            mockedUseDevice.mockReturnValue(desktopUseDevice);
            mockedUseAuth.mockReturnValue({ isLoggedIn: true });

            render(<Navbar />);
            const links = screen.getByTestId("desktop-navbar-links");
            expect(links).toBeVisible();
        });

        it("Should NOT render 'NavbarLinks with 'isLoggedIn=True' on 'Mobile or Tablet'", () => {
            mockedUseAuth.mockReturnValue({ isLoggedIn: true });

            render(<Navbar />);
            const links = screen.getByTestId("desktop-navbar-links");
            expect(links.className.split(" ")).toContain("hidden");
        });

        it("Should Render 'NavbarLinks' with Mobile Device and 'mobileMenuOpen=true'", async () => {
            mockedUseAuth.mockReturnValue({ isLoggedIn: true });

            const user = userEvent.setup();
            const { container } = render(<Navbar />);
            const links = screen.getByTestId("mobile-navbar-links");
            const burger = container.querySelector("input[id='burger-checkbox']");
            await user.click(burger);
            expect(links.style.height).not.toContain("0px");
        });

        it("Should Not Render 'NavbarLinks' with Mobile Device and 'mobileMenuOpen=false", async () => {
            mockedUseAuth.mockReturnValue({ isLoggedIn: true });
            const user = userEvent.setup();

            const { container, rerender } = render(<Navbar />);
            const links = screen.getByTestId("mobile-navbar-links");
            const button = container.querySelector("input[id='burger-checkbox']");
            expect(links.style.height).toContain("0px");

            await user.click(button);
            expect(links.style.height).not.toContain("0px");
        });
    });

    // =========================================
    // TESTING LOGIN AND REGISTER BUTTON RENDER
    // =========================================
    describe("Testing Rendering of Login and Register Button without User", () => {
        it("Should not render buttons container with 'user'", () => {
            mockedUseAuth.mockReturnValue({ isLoggedIn: true });
            render(<Navbar />);
            const container = screen.queryByTestId("loging-navbar-buttons-container");

            expect(container).not.toBeInTheDocument();
            expect(container).toBeNull();
        });

        it("Should render buttons container without 'user'", () => {
            render(<Navbar />);
            const container = screen.getByTestId("loging-navbar-buttons-container");
            const buttons = container.getElementsByTagName("button");

            expect(container).toBeInTheDocument();
            expect(container).not.toBeNull();
        });
    });

    // ==============================
    // TESTING BURGER BUTTON RENDERS
    // ==============================
    describe("Testing Renders of Burger Button on Mobile and Tablet", () => {
        it("Should NOT Render 'burberButton' without User", () => {
            const { container } = render(<Navbar />);
            const burgerButton = container.querySelector("input[id='burger-checkbox']");

            expect(burgerButton).toBeNull();
            expect(burgerButton).not.toBeInTheDocument();
        });

        it("Should Render 'burgerButton' with User", () => {
            mockedUseAuth.mockReturnValue({ isLoggedIn: true });

            const { container } = render(<Navbar />);
            const burgerButton = container.querySelector("input[id='burger-checkbox']");

            expect(burgerButton).not.toBeNull();
            expect(burgerButton).toBeInTheDocument();
        });

        it("Should NOT Render on 'burgerbutton' Desktop even if 'isLoggIn=true'", () => {
            mockedUseDevice.mockReturnValue(desktopUseDevice);
            mockedUseAuth.mockReturnValue({ isLoggedIn: true });

            render(<Navbar />);
            const burgerContainer = screen.getByTestId("mobile-burger-button-container");
            expect(burgerContainer).toHaveClass("lg:hidden");
        });
    });

    // ================================
    // TESTING LINKS CLOSE MOBILE MENU
    // ================================
    describe("Testing Closing of Mobile Menu by clicking Links", () => {
        it("Clicks on Links Should Close Mobile Menu", async () => {
            mockedUseAuth.mockReturnValue({ isLoggedIn: true });
            const user = userEvent.setup();

            const { container } = render(<Navbar />);
            const burgerButton = container.querySelector("input[id='burger-checkbox']");
            const mobileMenu = screen.getByTestId("mobile-navbar-links");
            const links = screen.getAllByRole("link", { name: /menu/i });
            const link = links[links.length - 1];

            expect(burgerButton).toBeInTheDocument();
            expect(burgerButton).not.toBeChecked();
            expect(mobileMenu.style.height).toContain("0px");
            expect(link).toBeInTheDocument();

            await user.click(burgerButton);

            expect(mobileMenu.style.height).not.toContain("0px");

            await user.click(link);

            expect(mobileMenu.style.height).toContain("0px");
        });
    });

    // ===============================
    // TESTING ACCESIBILITY OF NAVBAR
    // ===============================
    describe("Testing Accesibility on Navbar", () => {
        it("Should not accesible when mobileMenu is closed", async () => {
            const user = userEvent.setup();
            mockedUseDevice.mockReturnValue(mobileUseDevice);
            mockedUseAuth.mockReturnValue({ isLoggedIn: true });

            const { container } = render(<Navbar />);
            const burgerButton = container.querySelector("input[id='burger-checkbox']");
            const mobileMenu = screen.getByTestId("mobile-navbar-links");

            expect(mobileMenu).toHaveAttribute("aria-hidden", "true");

            await user.click(burgerButton);

            expect(mobileMenu).toHaveAttribute("aria-hidden", "false");

            const link = within(mobileMenu).getByRole("link", { name: /menu/i });
            await user.click(link);

            await waitFor(() => {
                expect(mobileMenu).toHaveAttribute("aria-hidden", "true");
            });
        });
    });
});
