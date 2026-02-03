import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { render, screen } from "../../test/test-utils";
import Button from "./Button";

/**
 * Suite de tests para el componente Button
 *
 * Este archivo testea:
 * - Renderizado básico
 * - Variantes visuales
 * - Tamaños de padding
 * - Estados (disabled)
 * - Interacciones del usuario
 * - Accesibilidad
 */
describe("Button Component", () => {
    // ============================================
    // TESTS DE RENDERIZADO BÁSICO
    // ============================================

    describe("Renderizado básico", () => {
        it("debería renderizar el componente correctamente", () => {
            render(<Button onClick={() => {}}>Botón de prueba</Button>);

            const button = screen.getByRole("button", { name: /botón de prueba/i });
            expect(button).toBeInTheDocument();
        });

        it("debería renderizar el contenido children correctamente", () => {
            render(
                <Button onClick={() => {}}>
                    <span>Contenido complejo</span>
                </Button>
            );

            expect(screen.getByText("Contenido complejo")).toBeInTheDocument();
        });

        it("debería tener el tipo 'button' por defecto", () => {
            render(<Button onClick={() => {}}>Click</Button>);

            const button = screen.getByRole("button");
            expect(button).toHaveAttribute("type", "button");
        });
    });

    // ============================================
    // TESTS DE VARIANTES
    // ============================================

    describe("Variantes visuales", () => {
        it("debería aplicar la variante 'default' cuando no se especifica", () => {
            render(<Button onClick={() => {}}>Default</Button>);

            const button = screen.getByRole("button");
            // Verifica que tenga las clases de la variante default
            expect(button.className).toContain("bg-gray-400");
        });

        it("debería aplicar la variante 'primary' correctamente", () => {
            render(
                <Button variant="primary" onClick={() => {}}>
                    Primary
                </Button>
            );

            const button = screen.getByRole("button");
            expect(button.className).toContain("bg-primary");
        });

        it("debería aplicar la variante 'secondary' correctamente", () => {
            render(
                <Button variant="secondary" onClick={() => {}}>
                    Secondary
                </Button>
            );

            const button = screen.getByRole("button");
            expect(button.className).toContain("bg-secondary");
        });

        it("debería aplicar la variante 'outline' correctamente", () => {
            render(
                <Button variant="outline" onClick={() => {}}>
                    Outline
                </Button>
            );

            const button = screen.getByRole("button");
            expect(button.className).toContain("bg-transparent");
        });

        it("debería aplicar la variante 'ghost' correctamente", () => {
            render(
                <Button variant="ghost" onClick={() => {}}>
                    Ghost
                </Button>
            );

            const button = screen.getByRole("button");
            expect(button.className).toContain("border-transparent");
        });

        it("debería aplicar la variante 'danger' correctamente", () => {
            render(
                <Button variant="danger" onClick={() => {}}>
                    Danger
                </Button>
            );

            const button = screen.getByRole("button");
            expect(button.className).toContain("bg-error-600");
        });

        it("debería aplicar la variante 'none' sin clases adicionales", () => {
            render(
                <Button variant="none" onClick={() => {}}>
                    None
                </Button>
            );

            const button = screen.getByRole("button");

            expect(button.className).not.toContain("bg-");
        });
    });

    // ============================================
    // TESTS DE PADDING
    // ============================================

    describe("Tamaños de padding", () => {
        it("debería aplicar padding 'xs' correctamente", () => {
            render(
                <Button padding="xs" onClick={() => {}}>
                    XS
                </Button>
            );

            const button = screen.getByRole("button");
            expect(button.className).toContain("px-2");
            expect(button.className).toContain("py-1");
        });

        it("debería aplicar padding 'sm' correctamente", () => {
            render(
                <Button padding="sm" onClick={() => {}}>
                    SM
                </Button>
            );

            const button = screen.getByRole("button");
            expect(button.className).toContain("px-3");
            expect(button.className).toContain("py-1.5");
        });

        it("debería aplicar padding 'md' correctamente", () => {
            render(
                <Button padding="md" onClick={() => {}}>
                    MD
                </Button>
            );

            const button = screen.getByRole("button");
            expect(button.className).toContain("px-4");
            expect(button.className).toContain("py-2");
        });

        it("debería aplicar padding 'lg' correctamente", () => {
            render(
                <Button padding="lg" onClick={() => {}}>
                    LG
                </Button>
            );

            const button = screen.getByRole("button");
            expect(button.className).toContain("px-6");
            expect(button.className).toContain("py-3");
        });

        it("debería aplicar padding 'xl' correctamente", () => {
            render(
                <Button padding="xl" onClick={() => {}}>
                    XL
                </Button>
            );

            const button = screen.getByRole("button");
            expect(button.className).toContain("px-8");
            expect(button.className).toContain("py-4");
        });

        it("debería aplicar padding '2xs' correctamente", () => {
            render(
                <Button padding="2xs" onClick={() => {}}>
                    2XS
                </Button>
            );

            const button = screen.getByRole("button");
            expect(button.className).toContain("px-1");
            expect(button.className).toContain("py-0.5");
        });
    });

    // ============================================
    // TESTS DE INTERACCIONES
    // ============================================

    describe("Interacciones del usuario", () => {
        it("debería llamar a onClick cuando se hace click", async () => {
            const handleClick = vi.fn();
            const user = userEvent.setup();

            render(<Button onClick={handleClick}>Click me</Button>);

            const button = screen.getByRole("button");
            await user.click(button);

            expect(handleClick).toHaveBeenCalledTimes(1);
        });

        it("debería pasar el evento al handler onClick", async () => {
            const handleClick = vi.fn();
            const user = userEvent.setup();

            render(<Button onClick={handleClick}>Click me</Button>);

            const button = screen.getByRole("button");
            await user.click(button);

            expect(handleClick).toHaveBeenCalledWith(expect.any(Object));
        });

        it("debería permitir múltiples clicks", async () => {
            const handleClick = vi.fn();
            const user = userEvent.setup();

            render(<Button onClick={handleClick}>Click me</Button>);

            const button = screen.getByRole("button");
            await user.click(button);
            await user.click(button);
            await user.click(button);

            expect(handleClick).toHaveBeenCalledTimes(3);
        });

        it("debería funcionar sin prop onClick", async () => {
            const user = userEvent.setup();

            render(<Button>No onClick</Button>);

            const button = screen.getByRole("button");
            await user.click(button);

            expect(button).toBeInTheDocument();
        });
    });

    // ============================================
    // TESTS DE ESTADO DISABLED
    // ============================================

    describe("Estado disabled", () => {
        it("debería renderizar el botón deshabilitado cuando disabled=true", () => {
            render(
                <Button disabled onClick={() => {}}>
                    Disabled
                </Button>
            );

            const button = screen.getByRole("button");
            expect(button).toBeDisabled();
        });

        it("NO debería llamar a onClick cuando está deshabilitado", async () => {
            const handleClick = vi.fn();
            const user = userEvent.setup();

            render(
                <Button disabled onClick={handleClick}>
                    Disabled
                </Button>
            );

            const button = screen.getByRole("button");
            await user.click(button);

            expect(handleClick).not.toHaveBeenCalled();
        });

        it("debería aplicar clases de estilo disabled", () => {
            render(
                <Button disabled onClick={() => {}}>
                    Disabled
                </Button>
            );

            const button = screen.getByRole("button");
            expect(button.className).toContain("opacity-50");
            expect(button.className).toContain("cursor-not-allowed");
        });

        it("debería funcionar normalmente cuando disabled=false", async () => {
            const handleClick = vi.fn();
            const user = userEvent.setup();

            render(
                <Button disabled={false} onClick={handleClick}>
                    Enabled
                </Button>
            );

            const button = screen.getByRole("button");
            await user.click(button);

            expect(handleClick).toHaveBeenCalledTimes(1);
            expect(button).not.toBeDisabled();
        });
    });

    // ============================================
    // TESTS DE CLASES PERSONALIZADAS
    // ============================================

    describe("Clases personalizadas", () => {
        it("debería aplicar className personalizado", () => {
            render(
                <Button className="custom-class" onClick={() => {}}>
                    Custom
                </Button>
            );

            const button = screen.getByRole("button");
            expect(button.className).toContain("custom-class");
        });

        it("debería mantener las clases base cuando se añade className", () => {
            render(
                <Button className="custom-class" onClick={() => {}}>
                    Custom
                </Button>
            );

            const button = screen.getByRole("button");

            expect(button.className).toContain("cursor-pointer");
            expect(button.className).toContain("transition-all");
            expect(button.className).toContain("custom-class");
        });

        it("debería combinar className con variante", () => {
            render(
                <Button className="my-custom-class" variant="primary" onClick={() => {}}>
                    Combined
                </Button>
            );

            const button = screen.getByRole("button");
            expect(button.className).toContain("my-custom-class");
            expect(button.className).toContain("bg-primary");
        });
    });

    // ============================================
    // TESTS DE PROPS ADICIONALES
    // ============================================

    describe("Props HTML adicionales", () => {
        it("debería pasar props HTML nativas al botón", () => {
            render(
                <Button onClick={() => {}} data-testid="my-button" aria-label="Custom label">
                    Props test
                </Button>
            );

            const button = screen.getByTestId("my-button");
            expect(button).toHaveAttribute("aria-label", "Custom label");
        });

        it("debería soportar la prop 'id'", () => {
            render(
                <Button id="unique-button" onClick={() => {}}>
                    ID test
                </Button>
            );

            const button = screen.getByRole("button");
            expect(button).toHaveAttribute("id", "unique-button");
        });

        it("debería soportar la prop 'title'", () => {
            render(
                <Button title="Tooltip text" onClick={() => {}}>
                    Title test
                </Button>
            );

            const button = screen.getByRole("button");
            expect(button).toHaveAttribute("title", "Tooltip text");
        });
    });

    // ============================================
    // TESTS DE ACCESIBILIDAD
    // ============================================

    describe("Accesibilidad", () => {
        it("debería tener el rol 'button'", () => {
            render(<Button onClick={() => {}}>Accessible</Button>);

            const button = screen.getByRole("button");
            expect(button).toBeInTheDocument();
        });

        it("debería ser accesible por teclado cuando no está disabled", async () => {
            render(<Button disabled={false}>Keyboard</Button>);

            const button = screen.getByRole("button");
            button.focus();

            expect(button).toHaveFocus();
        });

        it("debería tener clases de focus para accesibilidad", () => {
            render(<Button onClick={() => {}}>Focus</Button>);

            const button = screen.getByRole("button");
            expect(button.className).toContain("focus:outline-none");
            expect(button.className).toContain("focus:ring-2");
        });
    });

    // ============================================
    // TESTS DE INTEGRACIÓN (Combinaciones)
    // ============================================

    describe("Casos de integración", () => {
        it("debería funcionar con variante primary, padding lg y disabled", () => {
            render(
                <Button variant="primary" padding="lg" disabled onClick={() => {}}>
                    Combined
                </Button>
            );

            const button = screen.getByRole("button");
            expect(button).toBeDisabled();
            expect(button.className).toContain("bg-primary");
            expect(button.className).toContain("px-6");
            expect(button.className).toContain("opacity-50");
        });

        it("debería funcionar con todas las props combinadas", async () => {
            const handleClick = vi.fn();
            const user = userEvent.setup();

            render(
                <Button
                    variant="danger"
                    padding="md"
                    className="extra-class"
                    onClick={handleClick}
                    data-testid="full-props-button"
                    aria-label="Full props button"
                >
                    Full Props
                </Button>
            );

            const button = screen.getByTestId("full-props-button");

            expect(button).toBeInTheDocument();
            expect(button).toHaveAttribute("aria-label", "Full props button");
            expect(button.className).toContain("bg-error-600");
            expect(button.className).toContain("px-4");
            expect(button.className).toContain("extra-class");

            // Verifica interacción
            await user.click(button);
            await user.click(button);
            expect(handleClick).toHaveBeenCalledTimes(2);
        });
    });

    // ============================================
    // TESTS DE EDGE CASES (Casos extremos)
    // ============================================

    describe("Casos extremos", () => {
        it("debería manejar children como null", () => {
            render(<Button onClick={() => {}}>{null}</Button>);

            const button = screen.getByRole("button");
            expect(button).toBeInTheDocument();
        });

        it("debería manejar children como undefined", () => {
            render(<Button onClick={() => {}}>{undefined}</Button>);

            const button = screen.getByRole("button");
            expect(button).toBeInTheDocument();
        });

        it("debería manejar múltiples children", () => {
            render(
                <Button onClick={() => {}}>
                    <span>Parte 1</span>
                    <span>Parte 2</span>
                </Button>
            );

            expect(screen.getByText("Parte 1")).toBeInTheDocument();
            expect(screen.getByText("Parte 2")).toBeInTheDocument();
        });

        it("debería funcionar sin crash cuando se cambia de disabled a enabled", () => {
            const { rerender } = render(
                <Button disabled onClick={() => {}}>
                    Toggle
                </Button>
            );

            let button = screen.getByRole("button");
            expect(button).toBeDisabled();

            rerender(
                <Button disabled={false} onClick={() => {}}>
                    Toggle
                </Button>
            );

            button = screen.getByRole("button");
            expect(button).not.toBeDisabled();
        });
    });
});
