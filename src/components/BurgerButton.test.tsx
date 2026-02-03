import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useDevice } from "../hooks/useDevice";
import { render, screen } from "../test/test-utils";
import BurgerButton from "./BurgerButton";

vi.mock("../hooks/useDevice", () => ({
    useDevice: vi.fn(),
}));

const mockedUseDevice = vi.mocked(useDevice);

const defaultUseDeviceMock = {
    isMobile2Xs: true,
    isMobileXs: false,
    isMobileSm: false,
    isMobile: true,
    isTablet: false,
    isDesktop: false,
};
/**
 * Test suite for BurgerButton Component
 *
 * Testing strategy:
 * 1. Basic rendering and accessibility
 * 2. Toggle functionality (open/close states)
 * 3. User interactions (clicks and keyboard)
 * 4. Visual states and CSS classes
 * 5. Animation states based on menu state
 * 6. Theme-dependent styling
 */
describe("BurgerButton Component", () => {
    // ============================================
    // BASIC RENDERING & ACCESSIBILITY
    // ============================================

    beforeEach(() => {
        vi.clearAllMocks();
        mockedUseDevice.mockReturnValue(defaultUseDeviceMock);
    });

    describe("Basic rendering and accessibility", () => {
        it("should render the component correctly", () => {
            render(<BurgerButton isMobileMenuOpen={false} toggleMobileMenu={() => {}} />);

            const checkbox = screen.getByRole("checkbox");
            expect(checkbox).toBeInTheDocument();
        });

        it("should render a checkbox input with id 'burger-checkbox'", () => {
            render(<BurgerButton isMobileMenuOpen={false} toggleMobileMenu={() => {}} />);

            const checkbox = screen.getByRole("checkbox");
            expect(checkbox).toHaveAttribute("id", "burger-checkbox");
        });

        it("should render a label associated with the checkbox", () => {
            const { container } = render(
                <BurgerButton isMobileMenuOpen={false} toggleMobileMenu={() => {}} />
            );

            const label = container.querySelector('label[for="burger-checkbox"]');
            expect(label).toBeInTheDocument();
        });

        it("should render three icon bars (hamburger lines)", () => {
            const { container } = render(
                <BurgerButton isMobileMenuOpen={false} toggleMobileMenu={() => {}} />
            );

            const label = container.querySelector('label[for="burger-checkbox"]');
            const bars = label?.querySelectorAll("div");

            expect(bars?.length).toBe(3);
        });

        it("should hide the checkbox visually with 'hidden' class", () => {
            render(<BurgerButton isMobileMenuOpen={false} toggleMobileMenu={() => {}} />);

            const checkbox = screen.getByRole("checkbox");
            expect(checkbox.className).toContain("hidden");
        });
    });

    // ============================================
    // MENU STATE (OPEN/CLOSED)
    // ============================================

    describe("Menu state management", () => {
        it("should be unchecked when isMobileMenuOpen is false", () => {
            render(<BurgerButton isMobileMenuOpen={false} toggleMobileMenu={() => {}} />);

            const checkbox = screen.getByRole("checkbox");
            expect(checkbox).not.toBeChecked();
        });

        it("should be checked when isMobileMenuOpen is true", () => {
            render(<BurgerButton isMobileMenuOpen={true} toggleMobileMenu={() => {}} />);

            const checkbox = screen.getByRole("checkbox");
            expect(checkbox).toBeChecked();
        });

        it("should update checked state when isMobileMenuOpen prop changes", () => {
            const { rerender } = render(
                <BurgerButton isMobileMenuOpen={false} toggleMobileMenu={() => {}} />
            );

            let checkbox = screen.getByRole("checkbox");
            expect(checkbox).not.toBeChecked();

            rerender(<BurgerButton isMobileMenuOpen={true} toggleMobileMenu={() => {}} />);

            checkbox = screen.getByRole("checkbox");
            expect(checkbox).toBeChecked();
        });
    });

    // ============================================
    // USER INTERACTIONS
    // ============================================

    describe("User interactions", () => {
        it("should call toggleMobileMenu when clicked", async () => {
            const toggleMock = vi.fn();
            const user = userEvent.setup();

            render(<BurgerButton isMobileMenuOpen={false} toggleMobileMenu={toggleMock} />);

            const checkbox = screen.getByRole("checkbox");
            await user.click(checkbox);

            expect(toggleMock).toHaveBeenCalledTimes(1);
        });

        it("should call toggleMobileMenu when label is clicked", async () => {
            const toggleMock = vi.fn();
            const user = userEvent.setup();

            const { container } = render(
                <BurgerButton isMobileMenuOpen={false} toggleMobileMenu={toggleMock} />
            );

            const label = container.querySelector('label[for="burger-checkbox"]');
            if (label) await user.click(label);

            expect(toggleMock).toHaveBeenCalledTimes(1);
        });

        it("should toggle multiple times when clicked repeatedly", async () => {
            const toggleMock = vi.fn();
            const user = userEvent.setup();

            render(<BurgerButton isMobileMenuOpen={false} toggleMobileMenu={toggleMock} />);

            const checkbox = screen.getByRole("checkbox");

            await user.click(checkbox);
            await user.click(checkbox);
            await user.click(checkbox);

            expect(toggleMock).toHaveBeenCalledTimes(3);
        });
    });

    // ============================================
    // VISUAL STATES & CSS CLASSES
    // ============================================

    describe("Visual states and styling", () => {
        it("should apply base classes to the label", () => {
            const { container } = render(
                <BurgerButton isMobileMenuOpen={false} toggleMobileMenu={() => {}} />
            );

            const label = container.querySelector('label[for="burger-checkbox"]');
            expect(label?.className).toContain("relative");
            expect(label?.className).toContain("cursor-pointer");
            expect(label?.className).toContain("active:scale-95");
        });

        it("should apply transition classes to all icon bars", () => {
            const { container } = render(
                <BurgerButton isMobileMenuOpen={false} toggleMobileMenu={() => {}} />
            );

            const label = container.querySelector('label[for="burger-checkbox"]');
            const bars = label?.querySelectorAll("div");

            bars?.forEach((bar) => {
                expect(bar.className).toContain("transition-all");
                expect(bar.className).toContain("duration-500");
                expect(bar.className).toContain("ease-in-out");
            });
        });

        it("should apply rounded corners to all bars", () => {
            const { container } = render(
                <BurgerButton isMobileMenuOpen={false} toggleMobileMenu={() => {}} />
            );

            const label = container.querySelector('label[for="burger-checkbox"]');
            const bars = label?.querySelectorAll("div");

            bars?.forEach((bar) => {
                expect(bar.className).toContain("rounded-sm");
            });
        });
    });

    // ============================================
    // ANIMATION STATES (OPEN VS CLOSED)
    // ============================================

    describe("Animation states based on menu open/closed", () => {
        it("should NOT apply rotation classes when menu is closed", () => {
            const { container } = render(
                <BurgerButton isMobileMenuOpen={false} toggleMobileMenu={() => {}} />
            );

            const label = container.querySelector('label[for="burger-checkbox"]');
            const bars = label?.querySelectorAll("div");
            const firstBar = bars?.[0];
            const thirdBar = bars?.[2];

            expect(firstBar?.className).not.toContain("rotate-410");
            expect(thirdBar?.className).not.toContain("-rotate-410");
        });

        it("should apply rotation to first bar when menu is open", () => {
            const { container } = render(
                <BurgerButton isMobileMenuOpen={true} toggleMobileMenu={() => {}} />
            );

            const label = container.querySelector('label[for="burger-checkbox"]');
            const bars = label?.querySelectorAll("div");
            const firstBar = bars?.[0];
            const thirdBar = bars?.[2];

            expect(firstBar?.className).toContain("rotate-410");
            expect(thirdBar?.className).toContain("-rotate-410");
        });

        it("should hide middle bar when menu is open", () => {
            const { container } = render(
                <BurgerButton isMobileMenuOpen={true} toggleMobileMenu={() => {}} />
            );

            const label = container.querySelector('label[for="burger-checkbox"]');
            const bars = label?.querySelectorAll("div");
            const middleBar = bars?.[1];

            expect(middleBar?.className).toContain("opacity-0");
        });

        it("should show middle bar when menu is closed", () => {
            const { container } = render(
                <BurgerButton isMobileMenuOpen={false} toggleMobileMenu={() => {}} />
            );

            const label = container.querySelector('label[for="burger-checkbox"]');
            const bars = label?.querySelectorAll("div");
            const middleBar = bars?.[1];

            expect(middleBar?.className).toContain("opacity-100");
        });

        it("should apply origin-left to first bar when menu is open", () => {
            const { container } = render(
                <BurgerButton isMobileMenuOpen={true} toggleMobileMenu={() => {}} />
            );

            const label = container.querySelector('label[for="burger-checkbox"]');
            const bars = label?.querySelectorAll("div");
            const firstBar = bars?.[0];
            const thirdBar = bars?.[2];

            expect(firstBar?.className).toContain("origin-left");
            expect(thirdBar?.className).toContain("origin-left");
        });
    });

    // ============================================
    // ANIMATION DELAYS
    // ============================================

    describe("Animation delays", () => {
        it("should apply correct delay classes when menu is closed", () => {
            const { container } = render(
                <BurgerButton isMobileMenuOpen={false} toggleMobileMenu={() => {}} />
            );

            const label = container.querySelector('label[for="burger-checkbox"]');
            const bars = label?.querySelectorAll("div");

            expect(bars?.[0].className).toContain("delay-200");
            expect(bars?.[1].className).toContain("delay-100");
            expect(bars?.[2].className).toContain("delay-0");
        });

        it("should apply correct delay classes when menu is open", () => {
            const { container } = render(
                <BurgerButton isMobileMenuOpen={true} toggleMobileMenu={() => {}} />
            );

            const label = container.querySelector('label[for="burger-checkbox"]');
            const bars = label?.querySelectorAll("div");

            expect(bars?.[0].className).toContain("delay-0");
            expect(bars?.[1].className).toContain("delay-100");
            expect(bars?.[2].className).toContain("delay-200");
        });
    });

    // ============================================
    // DYNAMIC WIDTH STYLING
    // ============================================

    describe("Dynamic width based on menu state", () => {
        it("should apply inline width style to first bar", () => {
            const { container } = render(
                <BurgerButton isMobileMenuOpen={false} toggleMobileMenu={() => {}} />
            );

            const label = container.querySelector('label[for="burger-checkbox"]');
            const bars = label?.querySelectorAll("div");
            const firstBar = bars?.[0] as HTMLElement;

            expect(firstBar.style.width).toBeTruthy();
        });

        it("should apply inline width style to third bar", () => {
            const { container } = render(
                <BurgerButton isMobileMenuOpen={false} toggleMobileMenu={() => {}} />
            );

            const label = container.querySelector('label[for="burger-checkbox"]');
            const bars = label?.querySelectorAll("div");
            const thirdBar = bars?.[2] as HTMLElement;

            expect(thirdBar.style.width).toBeTruthy();
        });

        it("should NOT apply inline width to middle bar", () => {
            const { container } = render(
                <BurgerButton isMobileMenuOpen={false} toggleMobileMenu={() => {}} />
            );

            const label = container.querySelector('label[for="burger-checkbox"]');
            const bars = label?.querySelectorAll("div");
            const middleBar = bars?.[1] as HTMLElement;

            expect(middleBar.style.width).toBe("");
        });

        it("should change width when menu state changes", () => {
            const { container, rerender } = render(
                <BurgerButton isMobileMenuOpen={false} toggleMobileMenu={() => {}} />
            );

            const label = container.querySelector('label[for="burger-checkbox"]');
            const bars = label?.querySelectorAll("div");
            const firstBar = bars?.[0] as HTMLElement;

            const widthClosed = firstBar.style.width;

            rerender(<BurgerButton isMobileMenuOpen={true} toggleMobileMenu={() => {}} />);

            const widthOpen = firstBar.style.width;

            expect(widthClosed).not.toBe(widthOpen);
        });
    });

    // ============================================
    // THEME INTEGRATION
    // ============================================

    describe("Theme-based styling", () => {
        it("should apply theme-dependent background and shadow classes", () => {
            const { container } = render(
                <BurgerButton isMobileMenuOpen={false} toggleMobileMenu={() => {}} />
            );

            const label = container.querySelector('label[for="burger-checkbox"]');
            const bars = label?.querySelectorAll("div");

            bars?.forEach((bar) => {
                // Should have either light or dark theme classes
                const hasThemeClasses =
                    bar.className.includes("bg-text") || bar.className.includes("bg-text-dark");

                expect(hasThemeClasses).toBe(true);
            });
        });
    });

    // ============================================
    // POSITIONING
    // ============================================

    describe("Bar positioning", () => {
        it("should position first bar at the top", () => {
            const { container } = render(
                <BurgerButton isMobileMenuOpen={false} toggleMobileMenu={() => {}} />
            );

            const label = container.querySelector('label[for="burger-checkbox"]');
            const bars = label?.querySelectorAll("div");
            const firstBar = bars?.[0];

            expect(firstBar?.className).toContain("top-0");
        });

        it("should position middle bar at center", () => {
            const { container } = render(
                <BurgerButton isMobileMenuOpen={false} toggleMobileMenu={() => {}} />
            );

            const label = container.querySelector('label[for="burger-checkbox"]');
            const bars = label?.querySelectorAll("div");
            const middleBar = bars?.[1];

            expect(middleBar?.className).toContain("top-1/2");
            expect(middleBar?.className).toContain("-translate-y-1/2");
        });

        it("should position third bar at bottom", () => {
            const { container } = render(
                <BurgerButton isMobileMenuOpen={false} toggleMobileMenu={() => {}} />
            );

            const label = container.querySelector('label[for="burger-checkbox"]');
            const bars = label?.querySelectorAll("div");
            const thirdBar = bars?.[2];

            expect(thirdBar?.className).toContain("top-full");
            expect(thirdBar?.className).toContain("-translate-y-full");
        });
    });

    // ============================================
    // INTEGRATION TESTS
    // ============================================

    describe("Integration scenarios", () => {
        it("should handle complete toggle cycle correctly", async () => {
            const toggleMock = vi.fn();
            const user = userEvent.setup();

            const { rerender } = render(
                <BurgerButton isMobileMenuOpen={false} toggleMobileMenu={toggleMock} />
            );

            const checkbox = screen.getByRole("checkbox");

            // Initial state: closed
            expect(checkbox).not.toBeChecked();

            // User clicks to open
            await user.click(checkbox);
            expect(toggleMock).toHaveBeenCalledTimes(1);

            // Parent updates state to open
            rerender(<BurgerButton isMobileMenuOpen={true} toggleMobileMenu={toggleMock} />);
            expect(checkbox).toBeChecked();

            // User clicks to close
            await user.click(checkbox);
            expect(toggleMock).toHaveBeenCalledTimes(2);

            // Parent updates state to closed
            rerender(<BurgerButton isMobileMenuOpen={false} toggleMobileMenu={toggleMock} />);
            expect(checkbox).not.toBeChecked();
        });

        it("should maintain visual consistency across state changes", () => {
            const { container, rerender } = render(
                <BurgerButton isMobileMenuOpen={false} toggleMobileMenu={() => {}} />
            );

            const label = container.querySelector('label[for="burger-checkbox"]');
            const getBarClasses = () => {
                const bars = label?.querySelectorAll("div");
                return Array.from(bars || []).map((bar) => bar.className);
            };

            const closedClasses = getBarClasses();

            rerender(<BurgerButton isMobileMenuOpen={true} toggleMobileMenu={() => {}} />);

            const openClasses = getBarClasses();

            rerender(<BurgerButton isMobileMenuOpen={false} toggleMobileMenu={() => {}} />);

            const closedAgainClasses = getBarClasses();

            // Classes should be consistent when returning to same state
            expect(closedClasses).not.toEqual(openClasses);
            expect(closedClasses).toEqual(closedAgainClasses);
        });
    });

    // ============================================
    // EDGE CASES
    // ============================================

    describe("Edge cases", () => {
        it("should not crash when toggleMobileMenu is not provided", () => {
            expect(() => {
                render(<BurgerButton isMobileMenuOpen={false} toggleMobileMenu={undefined as any} />);
            }).not.toThrow();
        });

        it("should handle rapid state changes", () => {
            const { rerender } = render(
                <BurgerButton isMobileMenuOpen={false} toggleMobileMenu={() => {}} />
            );

            // Rapidly change state multiple times
            for (let i = 0; i < 10; i++) {
                rerender(<BurgerButton isMobileMenuOpen={i % 2 === 0} toggleMobileMenu={() => {}} />);
            }

            const checkbox = screen.getByRole("checkbox");
            expect(checkbox).toBeInTheDocument();
        });
    });
});
