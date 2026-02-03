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
    it("Should render the image propertly", () => {
        render(<Avatar {...defaultProps} />);
        const img = screen.getByRole("img");
        expect(img).toHaveAttribute("src", defaultProps.avatar.url);
        expect(img).toHaveAttribute("alt", defaultProps.alt);
    });

    it("Should proccess string Base64 without prefix adding the heading of data:image", () => {
        const rawBase64 = "A".repeat(101);
        const avatarData = { url: rawBase64, alt: "Base64 user" };

        render(<Avatar avatar={avatarData} />);

        const img = screen.getByRole("img");
        expect(img).toHaveAttribute("src", `data:image/jpeg;base64,${rawBase64}`);
    });

    // 2. Pruebas de Lógica de Fallback
    it("Should show the First fallback letter when there's an error with the image", () => {
        render(<Avatar {...defaultProps} fallback="Zack" />);

        const img = screen.getByRole("img");
        fireEvent.error(img);

        expect(screen.getByText("Z")).toBeInTheDocument();
        expect(img).not.toBeInTheDocument();
    });

    it("Should use the first letter of 'Alt' under an image error", () => {
        render(<Avatar avatar={{ url: "error-url", alt: "" }} alt="Martín" />);

        fireEvent.error(screen.getByRole("img"));

        expect(screen.getByText("M")).toBeInTheDocument();
    });

    it("Should Show '?' as last chance under an error", () => {
        render(<Avatar avatar={undefined} alt="" fallback="" />);
        expect(screen.getByText("?")).toBeInTheDocument();
    });

    // 3. Pruebas de Variantes y Estilos
    it("Should apply the properly variant", () => {
        const { container } = render(<Avatar variant="square" />);
        // Buscamos el contenedor interno que tiene las clases de variante
        const avatarContainer = container.querySelector(".relative.perfect-center");
        expect(avatarContainer).toHaveClass("rounded-lg");
    });

    it("Should apply the properly 'size'", () => {
        const { container } = render(<Avatar size="xl" />);
        const avatarContainer = container.querySelector(".relative.perfect-center");
        expect(avatarContainer).toHaveClass("w-16 h-16");
    });

    // 4. Pruebas de Responsividad (Mocking useDevice)
    it("Should apply sizes automaticaly using the 'useDevice' hook.", () => {
        (useDevice as any).mockReturnValue({
            isMobile2Xs: true, // Simula pantalla muy pequeña
        });

        const { container } = render(<Avatar />);
        const avatarContainer = container.querySelector(".relative.perfect-center");

        // Según tu configuración: isMobile2Xs -> w-6 h-6
        expect(avatarContainer).toHaveClass("w-6 h-6");
    });

    // 5. Indicador Online/Offline
    it("Should show the green indicator when online is 'true'", () => {
        render(<Avatar online={true} />);
        const indicator = screen.getByLabelText("Online");
        expect(indicator).toHaveClass("bg-green-400");
    });

    it("Should show the gray indicator when online is 'false'", () => {
        render(<Avatar online={false} />);
        const indicator = screen.getByLabelText("Offline");
        expect(indicator).toHaveClass("bg-gray-300");
    });
});
