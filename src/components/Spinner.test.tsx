// @ts-nocheck

import { describe, expect, it } from "vitest";
import { render, screen } from "../test/test-utils";
import Spinner from "./Spinner";
/**
 * Test Suite for Spinner Component
 *
 * Strategic Test Approach:
 * 1. Basic Render
 * 2. Variants Props
 * 3. Custom Classes
 * 4. Accesibility
 */
describe("Testing Spinner Component", () => {
    // ======================
    // TESTING BASIC RENDERS
    // ======================
    describe("Testing Basic Renders", () => {
        it("Should Render Propertly without Props", () => {
            render(<Spinner />);
            const spinner = screen.getByRole("status");
            expect(spinner).toBeInTheDocument();
            expect(spinner).not.toBeNull();
        });

        it("Should render 'Disabled' prop", () => {
            render(<Spinner aria-disabled />);
            const spinner = screen.getByRole("status");
            expect(spinner).toHaveAttribute("aria-disabled", "true");
        });
    });

    // =========================
    // TESTING VARIANTS PROPS
    // =========================
    describe("Testing Variants Props", () => {
        it("Should render 'w-6 h-6' and 'text-primary' by default", () => {
            render(<Spinner />);
            const spinner = screen.getByRole("status");
            expect(spinner.classList).toContain("w-6");
            expect(spinner.classList).toContain("h-6");
            expect(spinner.classList).toContain("text-primary");
        });

        it("Should render 'w-2 h-2', 'text-secondary' and 'custom-classes' by using 'xs' size prop, 'secondary' color prop and 'className' prop", () => {
            const { rerender } = render(<Spinner />);
            const spinner = screen.getByRole("status");
            expect(spinner.classList).not.toContain("w-2");
            expect(spinner.classList).not.toContain("h-2");
            expect(spinner.classList).not.toContain("text-secondary");
            expect(spinner.classList).not.toContain("custom-classes");

            rerender(<Spinner size="xs" color="secondary" className="custom-classes" />);
            expect(spinner.classList).toContain("w-2");
            expect(spinner.classList).toContain("h-2");
            expect(spinner.classList).toContain("text-secondary");
            expect(spinner.classList).toContain("custom-classes");
        });
    });

    // =======================
    // TESTING ACCESIBILITY
    // =======================
    describe("Testing Accesibility", () => {
        it("Should has role 'status' by default", () => {
            render(<Spinner data-testid="spinner-id" />);
            const spinner = screen.getByTestId("spinner-id");
            expect(spinner).toHaveAttribute("role", "status");
        });

        it("should has aria-label 'Loading' by default", () => {
            render(<Spinner data-testid="spinner-id" />);
            const spinner = screen.getByTestId("spinner-id");
            expect(spinner).toHaveAttribute("aria-label", "Loading");
        });
    });
});
