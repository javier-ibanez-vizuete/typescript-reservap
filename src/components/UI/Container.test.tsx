import { beforeEach, describe, expect, it, vi } from "vitest";
import { useDevice } from "../../hooks/useDevice";
import { render, screen } from "../../test/test-utils";
import { Container } from "./Container";

vi.mock("../../hooks/useDevice.tsx", () => ({ useDevice: vi.fn() }));

const mockedUseDevice = vi.mocked(useDevice);

const defaultDeviceMock = {
    isMobile2Xs: true,
    isMobileXs: false,
    isMobileSm: false,
    isMobile: true,
    isTablet: false,
    isDesktop: false,
};

beforeEach(() => {
    mockedUseDevice.mockReturnValue(defaultDeviceMock);
});

describe("Container Component", () => {
    // ======================================
    // TEST DE RENDERIZADO BASICO
    // ======================================

    describe("Basic Render", () => {
        it("Should Render the component correctly", () => {
            render(<Container>Container</Container>);

            const container = screen.getByText("Container");

            expect(container).toBeInTheDocument();
        });

        it("Should Render with a 'null' children", () => {
            render(<Container data-testid="container">{null}</Container>);

            const container = screen.getByTestId("container");

            expect(container).toBeInTheDocument();
        });

        it("Shoould Render with a 'undefined' children", () => {
            render(<Container data-testid="container">{undefined}</Container>);

            const container = screen.getByTestId("container");

            expect(container).toBeInTheDocument();
        });
    });

    // =================================================
    // TEST DE VARIANTES
    // ================================================
    describe("Direction Variants", () => {
        it("Should apply direction 'row' correctly", () => {
            render(<Container direction="row">Container</Container>);

            const container = screen.getByText("Container");

            expect(container.className).toContain("flex-row");
        });

        it("Should apply direction 'col' correctly", () => {
            render(<Container direction="col">Container</Container>);

            const container = screen.getByText("Container");

            expect(container.className).toContain("flex-col");
        });
    });

    describe("Padding Variants", () => {
        it("Should apply 'xs' padding correctly", () => {
            render(<Container padding="xs">Container</Container>);

            const container = screen.getByText("Container");

            expect(container.className).toContain("px-xs");
        });

        it("Should apply 'sm' padding correctly", () => {
            render(<Container padding="sm">Container</Container>);

            const container = screen.getByText("Container");

            expect(container.className).toContain("px-sm");
        });

        it("Should apply 'md' padding correctly", () => {
            render(<Container padding="md">Container</Container>);

            const container = screen.getByText("Container");

            expect(container.className).toContain("px-md");
        });

        it("should apply 'lg' padding correctly", () => {
            render(<Container padding="lg">Container</Container>);

            const container = screen.getByText("Container");

            expect(container.className).toContain("px-lg");
        });

        it("Should apply 'xl' padding correctly", () => {
            render(<Container padding="xl">Container</Container>);

            const container = screen.getByText("Container");

            expect(container.className).toContain("px-xl");
        });
    });

    describe("Width Variants", () => {
        it("Should apply 'xs' width correctly", () => {
            render(<Container width="xs">Container</Container>);
            const container = screen.getByText("Container");
            expect(container.className).toContain("w-[1080px]");
        });

        it("Should apply 'sm' width correctly", () => {
            render(<Container width="sm">Container</Container>);
            const container = screen.getByText("Container");
            expect(container.className).toContain("w-[1180px]");
        });

        it("Should apply 'default' width correctly", () => {
            render(<Container width="default">Container</Container>);
            const container = screen.getByText("Container");
            expect(container.className).toContain("w-[1280px]");
        });

        it("should apply 'md' width correctly", () => {
            render(<Container width="md">Container</Container>);
            const container = screen.getByText("Container");
            expect(container.className).toContain("w-[1320px]");
        });

        it("Should apply 'lg' width correctly", () => {
            render(<Container width="lg">Container</Container>);
            const container = screen.getByText("Container");
            expect(container.className).toContain("w-[1360px]");
        });

        it("Should apply 'xl' width correctly", () => {
            render(<Container width="xl">Container</Container>);
            const container = screen.getByText("Container");
            expect(container.className).toContain("w-[1400px]");
        });
    });

    // ====================================================
    // TESTING AUTO CONFIG BY USEDEVICE
    // ====================================================

    describe("useDevice auto config", () => {
        it("Should have 'px-xs' on Mobile 2xs", () => {
            mockedUseDevice.mockReturnValue({
                isMobile2Xs: true,
                isMobileXs: false,
                isMobileSm: false,
                isMobile: true,
                isTablet: false,
                isDesktop: false,
            });

            render(<Container>Container</Container>);
            const container = screen.getByText("Container");

            expect(container.className).toContain("px-xs");
        });
        it("Should have 'px-sm' on Mobile xs", () => {
            mockedUseDevice.mockReturnValue({
                isMobile2Xs: false,
                isMobileXs: true,
                isMobileSm: false,
                isMobile: true,
                isTablet: false,
                isDesktop: false,
            });

            render(<Container>Container</Container>);
            const container = screen.getByText("Container");

            expect(container.className).toContain("px-sm");
        });
        it("Should have 'px-md' on Mobile sm", () => {
            mockedUseDevice.mockReturnValue({
                isMobile2Xs: false,
                isMobileXs: false,
                isMobileSm: true,
                isMobile: true,
                isTablet: false,
                isDesktop: false,
            });

            render(<Container>Container</Container>);
            const container = screen.getByText("Container");

            expect(container.className).toContain("px-md");
        });
        it("Should have 'px-lg' on Tablet", () => {
            mockedUseDevice.mockReturnValue({
                isMobile2Xs: false,
                isMobileXs: false,
                isMobileSm: false,
                isMobile: false,
                isTablet: true,
                isDesktop: false,
            });

            render(<Container>Container</Container>);
            const container = screen.getByText("Container");

            expect(container.className).toContain("px-lg");
        });
        it("Should have 'px-xl' on Desktop", () => {
            mockedUseDevice.mockReturnValue({
                isMobile2Xs: false,
                isMobileXs: false,
                isMobileSm: false,
                isMobile: false,
                isTablet: false,
                isDesktop: true,
            });

            render(<Container>Container</Container>);
            const container = screen.getByText("Container");

            expect(container.className).toContain("px-xl");
        });
    });

    // =====================================================
    // TESTING CUSTOM CLASSES
    // =====================================================
    describe("Custom ClassName", () => {
        it("Apply custom Classes by className", () => {
            render(<Container className="custom-classes custom-classes2">Container</Container>);
            const container = screen.getByText("Container");
            expect(container.className).toContain("custom-classes");
            expect(container.className).toContain("custom-classes2");
        });
    });
});
