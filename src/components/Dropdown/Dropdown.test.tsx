import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { render, screen, waitFor } from "../../test/test-utils";
import { Dropdown } from "./Dropdown";

/**
 * Test suite for Dropdown Component
 *
 * Strategic testing approach:
 * 1. Click trigger toggle functionality
 * 2. Hover trigger behavior
 * 3. Outside click closes dropdown
 * 4. Escape key closes dropdown
 * 5. Disabled state prevents interaction
 */
describe("Dropdown Component", () => {
    it("should toggle dropdown open/closed on click trigger", async () => {
        const user = userEvent.setup();

        render(
            <Dropdown trigger="click">
                <Dropdown.Trigger data-testid="trigger">
                    <button>buttonTriger</button>
                </Dropdown.Trigger>
                <Dropdown.Menu data-testid="menu">
                    <div>Menu Content</div>
                </Dropdown.Menu>
            </Dropdown>
        );

        const triggerButton = screen.getByTestId("trigger");
        const dropdown = screen.getByRole("menu");
        const menu = screen.queryByTestId("menu");

        expect(dropdown).toHaveAttribute("aria-expanded", "false");
        expect(menu).not.toBeInTheDocument();

        await user.click(triggerButton);

        expect(dropdown).toHaveAttribute("aria-expanded", "true");
        await waitFor(() => {
            expect(screen.getByText("Menu Content")).toBeVisible();
        });

        await user.click(triggerButton);

        expect(dropdown).toHaveAttribute("aria-expanded", "false");

        expect(screen.queryByText("Menu Content")).not.toBeInTheDocument();
    });

    it("should open on hover and close on mouse leave when trigger is hover", async () => {
        const user = userEvent.setup();

        render(
            <Dropdown trigger="hover">
                <Dropdown.Trigger>
                    <button>Hover Menu</button>
                </Dropdown.Trigger>
                <Dropdown.Menu>
                    <div>Hover Content</div>
                </Dropdown.Menu>
            </Dropdown>
        );

        const dropdown = screen.getByRole("menu");

        expect(dropdown).toHaveAttribute("aria-expanded", "false");

        await user.hover(dropdown);

        await waitFor(() => {
            expect(dropdown).toHaveAttribute("aria-expanded", "true");
        });

        await user.unhover(dropdown);

        await waitFor(() => {
            expect(dropdown).toHaveAttribute("aria-expanded", "false");
        });
    });

    it("should close dropdown when clicking outside", async () => {
        const user = userEvent.setup();

        render(
            <div>
                <Dropdown trigger="click">
                    <Dropdown.Trigger data-testid="trigger">
                        <button>Menu</button>
                    </Dropdown.Trigger>
                    <Dropdown.Menu>
                        <div>Content</div>
                    </Dropdown.Menu>
                </Dropdown>
                <button data-testid="outside-button">Outside Button</button>
            </div>
        );

        const dropdown = screen.getByRole("menu");
        const triggerButton = screen.getByTestId("trigger");
        const outsideButton = screen.getByTestId("outside-button");

        await user.click(triggerButton);
        expect(dropdown).toHaveAttribute("aria-expanded", "true");

        await user.click(outsideButton);

        await waitFor(() => {
            expect(dropdown).toHaveAttribute("aria-expanded", "false");
        });
    });

    it("should close dropdown when pressing Escape key", async () => {
        const user = userEvent.setup();

        render(
            <Dropdown trigger="click">
                <Dropdown.Trigger data-testid="trigger">
                    <button>Menu</button>
                </Dropdown.Trigger>
                <Dropdown.Menu>
                    <div>Content</div>
                </Dropdown.Menu>
            </Dropdown>
        );

        const triggerButton = screen.getByTestId("trigger");
        const dropdown = screen.getByRole("menu");

        await user.click(triggerButton);
        expect(dropdown).toHaveAttribute("aria-expanded", "true");

        await user.keyboard("{Escape}");

        await waitFor(() => {
            expect(dropdown).toHaveAttribute("aria-expanded", "false");
        });
    });

    it("should not open dropdown when disabled", async () => {
        const user = userEvent.setup();

        render(
            <Dropdown trigger="click" disabled>
                <Dropdown.Trigger data-testid="trigger">
                    <button>Disabled Menu</button>
                </Dropdown.Trigger>
                <Dropdown.Menu>
                    <div>Content</div>
                </Dropdown.Menu>
            </Dropdown>
        );

        const triggerButton = screen.getByTestId("trigger");
        const dropdown = screen.getByRole("menu");

        expect(dropdown.className).toContain("opacity-50");
        expect(dropdown.className).toContain("cursor-not-allowed");

        await user.click(triggerButton);

        expect(dropdown).toHaveAttribute("aria-expanded", "false");
        expect(screen.queryByText("Content")).not.toBeInTheDocument();
    });
});
