// @ts-nocheck

import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useTheme } from "../contexts/ThemeContext";
import { useDevice } from "../hooks/useDevice";
import { render, screen } from "../test/test-utils";
import NavbarLinks from "./NavbarLinks";

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

const defaultUseDeviceMocked = {
    isMobile: true,
    isTablet: false,
    isDesktop: false,
};

const desktopUseDeviceMocked = {
    isMobile: false,
    isTablet: false,
    isDesktop: true,
};

const lightUseThemeMock = {
    theme: "light",
    onToggleTheme: vi.fn(),
};

const darkUseThemeMock = {
    theme: "dark",
    onToggleTheme: vi.fn(),
};

/**
 * Test suite for NavbarLinks Component
 *
 * Strategic Testing Approach:
 * 1. Basic Render
 * 2. Custom Classes
 * 3. User Iteractions
 * 4. Theme ClassName by Theme
 * 5. Accesibility
 */
describe("NavbarLinks Component", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockedUseDevice.mockReturnValue(defaultUseDeviceMocked);
        mockedUseTheme.mockReturnValue(lightUseThemeMock);
    });

    // =====================
    // TESTING BASIC RENDER
    // =====================
    describe("Testing Basic Render", () => {
        it("Should Render propertly", () => {
            render(<NavbarLinks />);
            const list = screen.getByRole("list");
            expect(list).toBeInTheDocument();
            expect(list).not.toBeNull();
        });

        it("Should Render propertly every Link", () => {
            render(<NavbarLinks />);
            const links = screen.getAllByRole("link");

            expect(links.length).toBeGreaterThan(0);

            for (const link of links) {
                expect(link).not.toBeNull();
                expect(link).toBeInTheDocument();
            }
        });
    });

    // =======================
    // TESTING CUSTOM CLASSES
    // =======================
    describe("Testing Custom classes and default classes on 'NavbarLinks'", () => {
        it("Should render 'flex and flex-1' by default", () => {
            render(<NavbarLinks />);
            const list = screen.getByRole("list");
            expect(list.className).toContain("flex");
            expect(list.className).toContain("flex-1");
        });

        it("Should render 'custom-classes' from className prop", () => {
            const { rerender } = render(<NavbarLinks />);
            const list = screen.getByRole("list");
            expect(list.className).not.toContain("custom-classes");

            rerender(<NavbarLinks className="custom-classes" />);
            expect(list.className).toContain("custom-classes");
        });
    });

    // =========================
    // TESTING USER ITERACTIONS
    // =========================
    describe("Testing User iteractions by Clicking", () => {
        it("Should render onClick by Clicking on Links", async () => {
            const handleClickMock = vi.fn();
            const user = userEvent.setup();

            render(<NavbarLinks handleLinkClick={handleClickMock} />);
            const links = screen.getAllByRole("link");
            const link = Array.from(links)[0];

            await user.click(link);

            expect(handleClickMock).toBeCalledTimes(1);
        });

        it("Should Support Multiples Clicks", async () => {
            const handleClickMock = vi.fn();
            const user = userEvent.setup();

            render(<NavbarLinks handleLinkClick={handleClickMock} />);
            const links = screen.getAllByRole("link");

            for (const link of links) {
                await user.click(link);
            }

            expect(handleClickMock).toBeCalledTimes(links.length);
        });

        it("should not Crush when clicking without 'handleClick' prop", async () => {
            const user = userEvent.setup();

            render(<NavbarLinks handleLinkClick={undefined} />);
            const link = Array.from(screen.getAllByRole("link"))[0];

            await user.click(link);

            const list = screen.getByRole("list");
            expect(list).toBeInTheDocument();
        });
    });

    // ===================================
    // TESTING THEME CLASSES BY USETHEME
    // ===================================
    describe("Testing Theme Classes by useTheme", () => {
        it("Should render 'light' classes on 'links' on 'light' theme", () => {
            render(<NavbarLinks />);
            const links = screen.getAllByRole("link");

            for (const link of links) {
                expect(link.className).toContain("light");
                expect(link.className).not.toContain("dark");
            }
        });

        it("Should render 'dark' clases on 'links' on 'dark' theme", () => {
            mockedUseTheme.mockReturnValue(darkUseThemeMock);
            render(<NavbarLinks />);
            const links = screen.getAllByRole("link");

            for (const link of links) {
                expect(link.className).toContain("dark");
                expect(link.className).not.toContain("light");
            }
        });
    });

    // ==========================================
    // TESTING ACCESIBILITY FOR LINKS
    // ==========================================
    describe("Testing Accesibility for 'NavbarLinks'", () => {
        it("Should render 'tabIndex=-1' when 'tabAccess=false'", () => {
            render(<NavbarLinks tabAccess={false} />);
            const links = screen.getAllByRole("link");
            for (const link of links) {
                expect(link).toHaveAttribute("tabIndex", "-1");
            }
        });

        it("Should Render 'tabIndex=0' when 'tabAccess=true'", () => {
            render(<NavbarLinks tabAccess={true} />);
            const links = screen.getAllByRole("link");
            for (const link of links) {
                expect(link).toHaveAttribute("tabIndex", "0");
            }
        });
    });
});
