import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { render, screen } from "../test/test-utils";
import LoadingButton from "./LoadingButton";

/**
 * Test suite for LoadingButton Component
 *
 * Strategic testing approach:
 * 1. Loading state behavior and visual feedback
 * 2. Disabled state preventing interactions
 * 3. Click handler execution when enabled
 * 4. Variant styling application
 * 5. Integration: loading + disabled combination
 */
describe("LoadingButton Component", () => {
    it("should display spinner and loading text when loading is true", () => {
        const { container } = render(
            <LoadingButton loading loadingText="Processing...">
                Submit
            </LoadingButton>
        );

        expect(screen.getByText("Processing...")).toBeInTheDocument();
        expect(screen.queryByText("Submit")).not.toBeInTheDocument();

        const spinner = container.querySelector("svg") || container.querySelector('[class*="spinner"]');
        expect(spinner).toBeInTheDocument();
    });

    it("should prevent onClick execution when disabled or loading", async () => {
        const onClickMock = vi.fn();
        const user = userEvent.setup();

        const { rerender } = render(
            <LoadingButton disabled onClick={onClickMock}>
                Click me
            </LoadingButton>
        );

        const button = screen.getByRole("button");
        await user.click(button);

        expect(onClickMock).not.toHaveBeenCalled();
        expect(button).toBeDisabled();

        rerender(
            <LoadingButton loading onClick={onClickMock}>
                Click me
            </LoadingButton>
        );

        await user.click(button);
        expect(onClickMock).not.toHaveBeenCalled();
        expect(button).toBeDisabled();
    });

    it("should execute onClick handler when enabled and not loading", async () => {
        const onClickMock = vi.fn();
        const user = userEvent.setup();

        render(<LoadingButton onClick={onClickMock}>Submit</LoadingButton>);

        const button = screen.getByRole("button");
        await user.click(button);

        expect(onClickMock).toHaveBeenCalledTimes(1);
        expect(button).not.toBeDisabled();
    });

    it("should apply correct variant styling and attributes", () => {
        const { rerender } = render(
            <LoadingButton variant="primary" type="submit">
                Primary Button
            </LoadingButton>
        );

        let button = screen.getByRole("button");
        expect(button).toHaveAttribute("type", "submit");
        expect(button.className).toContain("bg-primary");

        rerender(
            <LoadingButton variant="danger" type="button">
                Danger Button
            </LoadingButton>
        );

        button = screen.getByRole("button");
        expect(button).toHaveAttribute("type", "button");
        expect(button.className).toContain("bg-error-500");
    });

    it("should handle complete loading cycle with aria-busy attribute", async () => {
        const onClickMock = vi.fn();
        const user = userEvent.setup();

        const { rerender } = render(
            <LoadingButton loading={false} onClick={onClickMock}>
                Save Changes
            </LoadingButton>
        );

        let button = screen.getByRole("button");
        expect(button).toHaveAttribute("aria-busy", "false");
        expect(button).not.toBeDisabled();

        await user.click(button);
        expect(onClickMock).toHaveBeenCalledTimes(1);

        rerender(
            <LoadingButton loading onClick={onClickMock}>
                Save Changes
            </LoadingButton>
        );

        button = screen.getByRole("button");
        expect(button).toHaveAttribute("aria-busy", "true");
        expect(button).toBeDisabled();
        expect(button.className).toContain("opacity-50");
        expect(button.className).toContain("cursor-not-allowed");

        await user.click(button);
        expect(onClickMock).toHaveBeenCalledTimes(1);

        rerender(
            <LoadingButton loading={false} onClick={onClickMock}>
                Save Changes
            </LoadingButton>
        );

        button = screen.getByRole("button");
        expect(button).toHaveAttribute("aria-busy", "false");
        expect(button).not.toBeDisabled();
    });
});
