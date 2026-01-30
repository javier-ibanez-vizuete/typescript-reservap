import { describe, expect, it, vi } from "vitest";
import { render, screen } from "../../test/test-utils";
import type { ImageSourceType } from "../../types/index.type";
import Image from "./Image";

/**
 * Suite de tests para el componente Image
 *
 * Este archivo testea:
 * - Renderizado con src simple
 * - Renderizado con imageData (responsive images)
 * - Callbacks (onLoad, onError)
 * - Props de accesibilidad (alt)
 * - Lazy loading
 * - Diferentes formatos de imagen (avif, webp, png)
 * - Media queries responsive
 * - Casos extremos
 */
describe("Image Component", () => {
    // ============================================
    // SETUP Y DATOS DE PRUEBA
    // ============================================

    const mockImageUrl = "https://example.com/image.jpg";

    const mockImageData: ImageSourceType = {
        url: "https://example.com/image-fallback.jpg",
        alt: "Test image from imageData",
        avif: "https://example.com/image.avif",
        webp: "https://example.com/image.webp",
        png: "https://example.com/image.png",
        avif480: "https://example.com/image-480.avif",
        webp480: "https://example.com/image-480.webp",
        png480: "https://example.com/image-480.png",
        avif800: "https://example.com/image-800.avif",
        webp800: "https://example.com/image-800.webp",
        png800: "https://example.com/image-800.png",
        avif1200: "https://example.com/image-1200.avif",
        webp1200: "https://example.com/image-1200.webp",
        png1200: "https://example.com/image-1200.png",
        avif1800: "https://example.com/image-1800.avif",
        webp1800: "https://example.com/image-1800.webp",
        png1800: "https://example.com/image-1800.png",
    };

    // ============================================
    // TESTS DE RENDERIZADO CON SRC SIMPLE
    // ============================================

    describe("Renderizado con prop 'src'", () => {
        it("debería renderizar una imagen con src simple", () => {
            render(<Image src={mockImageUrl} />);

            const img = screen.getByRole("img");
            expect(img).toBeInTheDocument();
            expect(img).toHaveAttribute("src", mockImageUrl);
        });

        it("debería aplicar el atributo alt correctamente", () => {
            render(<Image src={mockImageUrl} alt="Imagen de prueba" />);

            const img = screen.getByRole("img");
            expect(img).toHaveAttribute("alt", "Imagen de prueba");
        });

        it("debería usar 'Image' como alt por defecto", () => {
            render(<Image src={mockImageUrl} />);

            const img = screen.getByRole("img");
            expect(img).toHaveAttribute("alt", "Image");
        });

        it("debería aplicar la clase base 'w-full'", () => {
            render(<Image src={mockImageUrl} />);

            const img = screen.getByRole("img");
            expect(img.className).toContain("w-full");
        });

        it("debería aplicar className personalizado", () => {
            render(<Image src={mockImageUrl} className="custom-image-class" />);

            const img = screen.getByRole("img");
            expect(img.className).toContain("w-full");
            expect(img.className).toContain("custom-image-class");
        });

        it("debería tener loading='lazy' por defecto", () => {
            render(<Image src={mockImageUrl} />);

            const img = screen.getByRole("img");
            expect(img).toHaveAttribute("loading", "lazy");
        });

        it("debería soportar loading='eager'", () => {
            render(<Image src={mockImageUrl} loading="eager" />);

            const img = screen.getByRole("img");
            expect(img).toHaveAttribute("loading", "eager");
        });
    });

    // ============================================
    // TESTS DE RENDERIZADO CON IMAGEDATA
    // ============================================

    describe("Renderizado con prop 'imageData'", () => {
        it("debería renderizar imagen con imageData completo", () => {
            render(<Image imageData={mockImageData} />);

            const img = screen.getByRole("img");
            expect(img).toBeInTheDocument();
            expect(img).toHaveAttribute("src", mockImageData.url);
        });

        it("debería usar el alt de imageData si está disponible", () => {
            render(<Image imageData={mockImageData} />);

            const img = screen.getByRole("img");
            expect(img).toHaveAttribute("alt", "Test image from imageData");
        });

        it("debería usar el alt de la prop si imageData.alt no existe", () => {
            const imageDataWithoutAlt = { ...mockImageData, alt: undefined };
            render(<Image imageData={imageDataWithoutAlt} alt="Fallback alt" />);

            const img = screen.getByRole("img");
            expect(img).toHaveAttribute("alt", "Fallback alt");
        });

        it("debería renderizar sources para formato AVIF", () => {
            const { container } = render(<Image imageData={mockImageData} />);

            const avifSources = container.querySelectorAll('source[type="image/avif"]');
            expect(avifSources.length).toBeGreaterThan(0);
        });

        it("debería renderizar sources para formato WebP", () => {
            const { container } = render(<Image imageData={mockImageData} />);

            const webpSources = container.querySelectorAll('source[type="image/webp"]');
            expect(webpSources.length).toBeGreaterThan(0);
        });

        it("debería renderizar sources para formato PNG", () => {
            const { container } = render(<Image imageData={mockImageData} />);

            const pngSources = container.querySelectorAll('source[type="image/png"]');
            expect(pngSources.length).toBeGreaterThan(0);
        });
    });

    // ============================================
    // TESTS DE RESPONSIVE IMAGES (MEDIA QUERIES)
    // ============================================

    describe("Imágenes responsive con media queries", () => {
        it("debería renderizar sources con media query para 480px", () => {
            const { container } = render(<Image imageData={mockImageData} />);

            const source480 = container.querySelector('source[media="(max-width: 480px)"]');
            expect(source480).toBeInTheDocument();
        });

        it("debería renderizar sources con media query para 800px", () => {
            const { container } = render(<Image imageData={mockImageData} />);

            const source800 = container.querySelector('source[media="(max-width: 800px)"]');
            expect(source800).toBeInTheDocument();
        });

        it("debería renderizar sources con media query para 1200px", () => {
            const { container } = render(<Image imageData={mockImageData} />);

            const source1200 = container.querySelector('source[media="(max-width: 1200px)"]');
            expect(source1200).toBeInTheDocument();
        });

        it("debería renderizar sources con media query para 1800px", () => {
            const { container } = render(<Image imageData={mockImageData} />);

            const source1800 = container.querySelector('source[media="(max-width: 1800px)"]');
            expect(source1800).toBeInTheDocument();
        });

        it("debería tener el srcSet correcto para AVIF 480px", () => {
            const { container } = render(<Image imageData={mockImageData} />);

            const source = container.querySelector('source[media="(max-width: 480px)"][type="image/avif"]');
            expect(source).toHaveAttribute("srcSet", mockImageData.avif480);
        });

        it("debería tener el srcSet correcto para WebP 800px", () => {
            const { container } = render(<Image imageData={mockImageData} />);

            const source = container.querySelector('source[media="(max-width: 800px)"][type="image/webp"]');
            expect(source).toHaveAttribute("srcSet", mockImageData.webp800);
        });
    });

    // ============================================
    // TESTS DE IMAGEDATA PARCIAL
    // ============================================

    describe("ImageData con formatos parciales", () => {
        it("debería renderizar solo con url (sin formatos alternativos)", () => {
            const minimalImageData: Pick<ImageSourceType, "url"> = {
                url: "https://example.com/image.jpg",
            };

            render(<Image imageData={minimalImageData} />);

            const img = screen.getByRole("img");
            expect(img).toHaveAttribute("src", minimalImageData.url);
        });

        it("debería renderizar solo con AVIF, sin WebP ni PNG", () => {
            const avifOnlyData: ImageSourceType = {
                url: "https://example.com/image.jpg",
                avif: "https://example.com/image.avif",
            };

            const { container } = render(<Image imageData={avifOnlyData} />);

            const avifSource = container.querySelector('source[type="image/avif"]');
            const webpSource = container.querySelector('source[type="image/webp"]');

            expect(avifSource).toBeInTheDocument();
            expect(webpSource).not.toBeInTheDocument();
        });

        it("debería renderizar solo formatos 480px sin otros tamaños", () => {
            const partial480Data: ImageSourceType = {
                url: "https://example.com/image.jpg",
                avif480: "https://example.com/image-480.avif",
                webp480: "https://example.com/image-480.webp",
            };

            const { container } = render(<Image imageData={partial480Data} />);

            const sources480 = container.querySelectorAll('source[media="(max-width: 480px)"]');
            const sources800 = container.querySelectorAll('source[media="(max-width: 800px)"]');

            expect(sources480.length).toBe(2); // avif480 y webp480
            expect(sources800.length).toBe(0);
        });

        it("NO debería renderizar sources si los campos están vacíos", () => {
            const emptyFormatsData: ImageSourceType = {
                url: "https://example.com/image.jpg",
                avif: undefined,
                webp: undefined,
                png: undefined,
            };

            const { container } = render(<Image imageData={emptyFormatsData} />);

            const sources = container.querySelectorAll("source");
            expect(sources.length).toBe(0);
        });
    });

    // ============================================
    // TESTS DE CALLBACKS
    // ============================================

    describe("Callbacks onLoad y onError", () => {
        it("debería llamar a onLoad cuando la imagen se carga (src)", async () => {
            const onLoadMock = vi.fn();

            render(<Image src={mockImageUrl} onLoad={onLoadMock} />);

            const img = screen.getByRole("img");

            img.dispatchEvent(new Event("load"));

            expect(onLoadMock).toHaveBeenCalledTimes(1);
        });

        it("debería llamar a onLoad cuando la imagen se carga (imageData)", async () => {
            const onLoadMock = vi.fn();

            render(<Image imageData={mockImageData} onLoad={onLoadMock} />);

            const img = screen.getByRole("img");

            img.dispatchEvent(new Event("load"));

            expect(onLoadMock).toHaveBeenCalledTimes(1);
        });

        it("debería llamar a onError cuando falla la carga (src)", async () => {
            const onErrorMock = vi.fn();

            render(<Image src={mockImageUrl} onError={onErrorMock} />);

            const img = screen.getByRole("img");

            // Simula un error de carga
            img.dispatchEvent(new Event("error"));

            expect(onErrorMock).toHaveBeenCalledTimes(1);
        });

        it("debería llamar a onError cuando falla la carga (imageData)", async () => {
            const onErrorMock = vi.fn();

            render(<Image imageData={mockImageData} onError={onErrorMock} />);

            const img = screen.getByRole("img");

            img.dispatchEvent(new Event("error"));

            expect(onErrorMock).toHaveBeenCalledTimes(1);
        });

        it("NO debería lanzar error si onLoad no está definido", () => {
            render(<Image src={mockImageUrl} />);

            const img = screen.getByRole("img");

            expect(() => {
                img.dispatchEvent(new Event("load"));
            }).not.toThrow();
        });

        it("NO debería lanzar error si onError no está definido", () => {
            render(<Image src={mockImageUrl} />);

            const img = screen.getByRole("img");

            expect(() => {
                img.dispatchEvent(new Event("error"));
            }).not.toThrow();
        });
    });

    // ============================================
    // TESTS DE PRIORIDAD ENTRE SRC E IMAGEDATA
    // ============================================

    describe("Prioridad entre src e imageData", () => {
        it("debería priorizar 'src' sobre 'imageData' cuando ambos están presentes", () => {
            render(<Image src={mockImageUrl} imageData={mockImageData} />);

            const img = screen.getByRole("img");

            // Debería usar src, no imageData.url
            expect(img).toHaveAttribute("src", mockImageUrl);
        });

        it("NO debería renderizar sources cuando 'src' está presente", () => {
            const { container } = render(<Image src={mockImageUrl} imageData={mockImageData} />);

            const sources = container.querySelectorAll("source");
            expect(sources.length).toBe(0);
        });
    });

    // ============================================
    // TESTS DE CASOS EXTREMOS Y NULL
    // ============================================

    describe("Casos extremos", () => {
        it("debería retornar null si no hay src ni imageData", () => {
            const { container } = render(<Image />);

            expect(container.firstChild).toBeNull();
        });

        it("debería retornar null si imageData no tiene url", () => {
            const emptyImageData: Pick<ImageSourceType, "avif"> = {
                avif: "https://example.com/image.avif",
                // url está ausente
            };
            //@ts-ignore Ignore the typescript warning during testing
            const { container } = render(<Image imageData={emptyImageData} />);

            expect(container.firstChild).toBeNull();
        });

        it("deberia retornar 'null' cuando src es string vacio", () => {
            const { container } = render(<Image src="" />);

            expect(container.firstChild).toBeNull();
        });

        it("debería sustituir alt cuando 'alt' es string vacio", () => {
            render(<Image src={mockImageUrl} alt="" />);

            const img = screen.getByRole("img");
            expect(img).not.toHaveAttribute("alt", "");
            expect(img).toHaveAttribute("alt", "Image");
        });

        it("debería manejar className como undefined", () => {
            render(<Image src={mockImageUrl} className={undefined} />);

            const img = screen.getByRole("img");
            expect(img.className).toBe("w-full");
        });
    });

    // ============================================
    // TESTS DE ACCESIBILIDAD
    // ============================================

    describe("Accesibilidad", () => {
        it("debería tener el rol 'img'", () => {
            render(<Image src={mockImageUrl} />);

            const img = screen.getByRole("img");
            expect(img).toBeInTheDocument();
        });

        it("debería tener un alt text descriptivo", () => {
            render(<Image src={mockImageUrl} alt="Foto de un gato naranja" />);

            const img = screen.getByRole("img", { name: /foto de un gato naranja/i });
            expect(img).toBeInTheDocument();
        });
    });

    // ============================================
    // TESTS DE INTEGRACIÓN
    // ============================================

    describe("Casos de integración", () => {
        it("debería funcionar con todas las props combinadas (src)", () => {
            const onLoadMock = vi.fn();
            const onErrorMock = vi.fn();

            render(
                <Image
                    src={mockImageUrl}
                    alt="Imagen completa"
                    loading="eager"
                    onLoad={onLoadMock}
                    onError={onErrorMock}
                    className="rounded-lg shadow-md"
                />
            );

            const img = screen.getByRole("img");

            expect(img).toHaveAttribute("src", mockImageUrl);
            expect(img).toHaveAttribute("alt", "Imagen completa");
            expect(img).toHaveAttribute("loading", "eager");
            expect(img.className).toContain("w-full");
            expect(img.className).toContain("rounded-lg");
            expect(img.className).toContain("shadow-md");

            img.dispatchEvent(new Event("load"));
            expect(onLoadMock).toHaveBeenCalledTimes(1);
            img.dispatchEvent(new Event("error"));
            expect(onErrorMock).toHaveBeenCalledTimes(1);
        });

        it("debería funcionar con imageData completo y todas las props", () => {
            const onLoadMock = vi.fn();
            const onErrorMock = vi.fn();

            const { container } = render(
                <Image
                    imageData={mockImageData}
                    loading="lazy"
                    onLoad={onLoadMock}
                    onError={onErrorMock}
                    className="object-cover"
                />
            );

            const img = screen.getByRole("img");

            expect(img).toHaveAttribute("src", mockImageData.url);
            expect(img).toHaveAttribute("loading", "lazy");
            expect(img.className).toContain("object-cover");

            // Verifica que se renderizaron sources
            const sources = container.querySelectorAll("source");
            expect(sources.length).toBeGreaterThan(0);
        });
    });

    // ============================================
    // TESTS DE MEMOIZACIÓN
    // ============================================

    describe("Memoización del componente", () => {
        it("NO debería re-renderizar si las props no cambian", () => {
            const { rerender } = render(<Image src={mockImageUrl} />);

            const firstImg = screen.getByRole("img");

            // Re-renderiza con las mismas props
            rerender(<Image src={mockImageUrl} />);

            const secondImg = screen.getByRole("img");

            // Debería ser el mismo elemento (gracias a memo)
            expect(firstImg).toBe(secondImg);
        });

        it("debería re-renderizar si className cambia", () => {
            const { rerender } = render(<Image src={mockImageUrl} className="class-1" />);

            const firstImg = screen.getByRole("img");
            expect(firstImg.className).toContain("class-1");

            rerender(<Image src={mockImageUrl} className="class-2" />);

            const secondImg = screen.getByRole("img");
            expect(secondImg.className).toContain("class-2");
            expect(secondImg.className).not.toContain("class-1");
        });
    });
});
