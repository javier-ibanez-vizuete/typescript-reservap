import { describe, expect, it } from "vitest";
import { act, render, screen } from "../../test/test-utils";
import ImageContainer from "./ImageContainer";

describe("ImageContainer Component", () => {
    // ================================
    // TESTING BASIC RENDER
    // ================================
    describe("Testing basic render", () => {
        it("Should Render the component correctly", () => {
            render(<ImageContainer data-testid="container">Image</ImageContainer>);
            const container = screen.getByTestId("container");
            expect(container).toBeInTheDocument();
        });

        it("Should Render correctly with 'null' children", () => {
            render(<ImageContainer data-testid="container">{null}</ImageContainer>);
            const container = screen.getByTestId("container");
            expect(container).toBeInTheDocument();
        });

        it("Should Render correctly with 'undefined' children", () => {
            render(<ImageContainer data-testid="container">{undefined}</ImageContainer>);
            const container = screen.getByTestId("container");
            expect(container).toBeInTheDocument();
        });
    });

    // ===================================
    // TESTING CUSTOM CLASSNAMES
    // ===================================
    describe("Testing custom classNames", () => {
        it("Should show the Custom Classname", () => {
            render(
                <ImageContainer className="custom-classname" data-testid="container">
                    Image
                </ImageContainer>
            );
            const container = screen.getByTestId("container");
            expect(container.className).toContain("custom-classname");

            act(() => {
                container.classList.add("Pedro");
            });

            expect(container.className).toContain("Pedro");
        });
    });

    // =====================================
    // TESTING SIZES PROPERTIES
    // =====================================
    describe("Testing size properties", () => {
        it("Testing 'w-4' size property", () => {
            render(<ImageContainer size="w-10">Image</ImageContainer>);
            const container = screen.getByText("Image");
            expect(container.className).toContain("w-10");
        });
    });

    // ======================================
    // TESTING TITLE PROPERTY
    // ======================================
    describe("Testing 'title' properties", () => {
        it("accept 'string' to 'title' prop", () => {
            render(<ImageContainer title="Esto es una imagen">Image</ImageContainer>);
            const container = screen.getByText("Image");
            expect(container).toHaveAttribute("title", "Esto es una imagen");
        });
    });
});
