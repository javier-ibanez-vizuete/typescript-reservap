// @ts-nocheck

import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useDevice } from "../../hooks/useDevice";
import { render, screen } from "../../test/test-utils";
import DropdownItem from "./DropdownItem";

vi.mock("../../hooks/useDevice.tsx", () => ({ useDevice: vi.fn() }));

const mockedUseDevice = vi.mocked(useDevice);

const defaultUseDeviceMocked = {
    isMobile2Xs: true,
    isMobileXs: false,
    isMobileSm: false,
    isMobile: true,
    isTablet: false,
    isDesktop: false,
};

/**
 * Test Suite for DropdownItem Component
 *
 * Strategic testing approach:
 * 1. Basic Render.
 * 2. User Iteration on 'onClick' and 'onClose'
 * 3. Padding variant and Custom Classes Renders.
 * 4. Disabled Props.
 * 5. Accesibility
 */
describe("DropdownItem Component", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockedUseDevice.mockReturnValue(defaultUseDeviceMocked);
    });
    // ===============================
    // TESTING BASIC RENDERS
    // ===============================
    describe("Basic Render", () => {
        it("Should Render with 'null or 'undefined' children", () => {
            const { rerender } = render(<DropdownItem>{null}</DropdownItem>);
            const item = screen.getByRole("menuitem");
            expect(item).toBeInTheDocument();

            rerender(<DropdownItem>{undefined}</DropdownItem>);
            expect(item).toBeInTheDocument();
        });

        it("Should Render a <p> element as children if type of 'children' is string", () => {
            const { container } = render(<DropdownItem>ITEM CHILDREN</DropdownItem>);
            const children = container.querySelector("p");
            expect(children).toBeInTheDocument();
        });
    });

    // ============================
    // TESTING USER ITERATIONS
    // ============================
    describe("Testing user Iterations", () => {
        it("Should call onClick when user 'click'", async () => {
            const mockedOnClick = vi.fn();
            const mockedOnClose = vi.fn();
            const user = userEvent.setup();
            render(
                <DropdownItem onClick={mockedOnClick} onClose={mockedOnClose}>
                    Item
                </DropdownItem>
            );
            const item = screen.getByRole("menuitem");

            await user.click(item);

            expect(mockedOnClick).toBeCalledTimes(1);
            expect(mockedOnClose).toBeCalledTimes(1);
        });
    });

    // =============================================
    // TESTING PADDINGS VARIANTS AND CUSTOM CLASSES
    // =============================================
    describe("Testing Paddings Variants and Custom Classes", () => {
        it("Should Render 'autoConfig?.padding' without padding prop", () => {
            render(<DropdownItem>Item</DropdownItem>);
            const item = screen.getByRole("menuitem");
            expect(item.className).toContain("px-3");
            expect(item.className).toContain("py-1.5");
        });

        it("Should render 'px-4' and 'py-2' classes with 'md' padding prop", () => {
            render(<DropdownItem padding="md">Item</DropdownItem>);
            const item = screen.getByRole("menuitem");
            expect(item.className).toContain("px-4");
            expect(item.className).toContain("py-2");
        });

        it("Should render 'custom-classes' with 'className' prop", () => {
            const { rerender } = render(<DropdownItem>Item</DropdownItem>);
            const item = screen.getByRole("menuitem");
            expect(item.className).not.toContain("custom-classes");

            rerender(<DropdownItem className="custom-classes">Item</DropdownItem>);
            expect(item.className).toContain("custom-classes");
        });
    });

    // =========================
    // TESTING DISABLED RENDER
    // =========================
    describe("Testing disabled Render", () => {
        it("Should render 'opacity-50' and 'cursor-not-allowed' when 'disabled'", () => {
            const { rerender } = render(<DropdownItem>Item</DropdownItem>);
            const item = screen.getByRole("menuitem");
            expect(item.className).not.toContain("opacity-50");
            expect(item.className).not.toContain("cursor-not-allowed");

            rerender(<DropdownItem disabled>Item</DropdownItem>);
            expect(item.className).toContain("opacity-50");
            expect(item.className).toContain("cursor-not-allowed");
        });

        it("Should not access to 'handleClick' if is disabled", async () => {
            const mockedOnClick = vi.fn();
            const mockedOnclose = vi.fn();
            const user = userEvent.setup();

            render(
                <DropdownItem onClick={mockedOnClick} onClose={mockedOnclose} disabled>
                    Item
                </DropdownItem>
            );
            const item = screen.getByRole("menuitem");
            await user.click(item);

            expect(mockedOnClick).not.toBeCalled();
            expect(mockedOnclose).not.toBeCalled();
        });
    });

    // =======================
    // TESTING ACCESIBILITY
    // =======================
    describe("Testing Accesibility Renders", () => {
        it("Should render 'role=menuitem' by default", () => {
            render(<DropdownItem data-testid="item">Item</DropdownItem>);
            const item = screen.getByTestId("item");
            expect(item).toHaveAttribute("role", "menuitem");
        });

        it("Should render 'tabIndex' when is not 'disabled'", () => {
            const { rerender } = render(<DropdownItem>Item</DropdownItem>);
            const item = screen.getByRole("menuitem");
            expect(item).toHaveAttribute("tabIndex", "0");

            rerender(<DropdownItem disabled>Disabled Item</DropdownItem>);
            expect(item).toHaveAttribute("tabIndex", "-1");
        });

        it("Should render 'aria-disabled=true' when is not 'disabled'", () => {
            const { rerender } = render(<DropdownItem>Item</DropdownItem>);
            const item = screen.getByRole("menuitem");
            expect(item).toHaveAttribute("aria-disabled", "false");

            rerender(<DropdownItem disabled>Disabled Item</DropdownItem>);
            expect(item).toHaveAttribute("aria-disabled", "true");
        });
    });
});
