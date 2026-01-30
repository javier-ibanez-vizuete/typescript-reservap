import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useDevice } from "../hooks/useDevice";
import Avatar from "./Avatar";

// Mock del hook de dispositivo
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

// Mock de los componentes UI internos para simplificar el DOM
// Si prefieres integrarlos, puedes omitir estos mocks
vi.mock("./UI/Image", () => ({
    default: ({ src, alt, onError, ...props }: any) => (
        <img src={src} alt={alt} onError={onError} {...props} data-testid="avatar-img" />
    ),
}));

describe("Avatar Component", () => {
    const defaultProps = {
        alt: "John Doe",
        avatar: { url: "https://example.com/photo.jpg", alt: "User Photo" },
    };

    beforeEach(() => {
        vi.clearAllMocks();
        mockedUseDevice.mockReturnValue(defaultUseDeviceMock);
    });

    // 1. Pruebas de Renderizado e Imágenes
    it("debe renderizar la imagen correctamente cuando se proporciona una URL válida", () => {
        render(<Avatar {...defaultProps} />);
        const img = screen.getByRole("img");
        expect(img).toHaveAttribute("src", defaultProps.avatar.url);
        expect(img).toHaveAttribute("alt", defaultProps.alt);
    });

    it("debe procesar strings Base64 sin prefijo agregando el encabezado de data:image", () => {
        const rawBase64 = "A".repeat(101);
        const avatarData = { url: rawBase64, alt: "Base64 user" };

        render(<Avatar avatar={avatarData} />);

        const img = screen.getByRole("img");
        expect(img).toHaveAttribute("src", `data:image/jpeg;base64,${rawBase64}`);
    });

    // 2. Pruebas de Lógica de Fallback
    it("debe mostrar la inicial del fallback cuando la imagen falla al cargar", () => {
        render(<Avatar {...defaultProps} fallback="Zack" />);

        const img = screen.getByRole("img");
        fireEvent.error(img);

        expect(screen.getByText("Z")).toBeInTheDocument();
        expect(img).not.toBeInTheDocument();
    });

    it("debe usar la inicial del 'alt' si no hay 'fallback' prop y la imagen falla", () => {
        render(<Avatar avatar={{ url: "error-url", alt: "" }} alt="Martín" />);

        fireEvent.error(screen.getByRole("img"));

        expect(screen.getByText("M")).toBeInTheDocument();
    });

    it("debe mostrar '?' como último recurso de fallback", () => {
        render(<Avatar avatar={undefined} alt="" fallback="" />);
        expect(screen.getByText("?")).toBeInTheDocument();
    });

    // 3. Pruebas de Variantes y Estilos
    it("debe aplicar la clase de variante correcta (square)", () => {
        const { container } = render(<Avatar variant="square" />);
        // Buscamos el contenedor interno que tiene las clases de variante
        const avatarContainer = container.querySelector(".relative.perfect-center");
        expect(avatarContainer).toHaveClass("rounded-lg");
    });

    it("debe aplicar el tamaño específico cuando se pasa la prop 'size'", () => {
        const { container } = render(<Avatar size="xl" />);
        const avatarContainer = container.querySelector(".relative.perfect-center");
        expect(avatarContainer).toHaveClass("w-16 h-16");
    });

    // 4. Pruebas de Responsividad (Mocking useDevice)
    it("debe aplicar tamaños automáticos basados en el hook useDevice cuando no hay prop size", () => {
        (useDevice as any).mockReturnValue({
            isMobile2Xs: true, // Simula pantalla muy pequeña
        });

        const { container } = render(<Avatar />);
        const avatarContainer = container.querySelector(".relative.perfect-center");

        // Según tu configuración: isMobile2Xs -> w-6 h-6
        expect(avatarContainer).toHaveClass("w-6 h-6");
    });

    // 5. Indicador Online/Offline
    it("debe mostrar el indicador verde cuando online es true", () => {
        render(<Avatar online={true} />);
        const indicator = screen.getByLabelText("Online");
        expect(indicator).toHaveClass("bg-green-400");
    });

    it("debe mostrar el indicador gris cuando online es false", () => {
        render(<Avatar online={false} />);
        const indicator = screen.getByLabelText("Offline");
        expect(indicator).toHaveClass("bg-gray-300");
    });
});
