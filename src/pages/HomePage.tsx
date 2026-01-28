import CTACard, { CTAImagePosition } from "../components/CTACard/CTACard";
import { Container } from "../components/UI/Container";
import { useTranslate } from "../translations/useTranslate";
import type { ImageSourceType } from "../types/index.type";

type CtaType = {
    id: number;
    title: string;
    description: string;
    buttonText: string;
    imageSrc: string;
    imageData?: ImageSourceType;
    imageAlt: string;
    redirectTo: string;
    imagePosition: CTAImagePosition;
};

export const CTA_DATA: CtaType[] = [
    {
        id: 1,
        title: "",
        description: "",
        buttonText: "",
        imageSrc: "/pictures/CTAImages/image-cta-login.webp",
        imageData: { url: "", alt: "" },
        imageAlt: "Mesa de restaurante con servicio",
        redirectTo: "/login",
        imagePosition: CTAImagePosition.RIGHT,
    },
    {
        id: 2,
        title: "",
        description: "",
        buttonText: "",
        imageSrc: "/pictures/CTAImages/image-cta-menu.webp",
        imageData: { url: "", alt: "" },
        imageAlt: "Platos de comida variados",
        redirectTo: "/menu",
        imagePosition: CTAImagePosition.LEFT,
    },
    {
        id: 3,
        title: "",
        description: "",
        buttonText: "",
        imageSrc: "/pictures/CTAImages/image-cta-bookings.webp",
        imageData: { url: "", alt: "" },
        imageAlt: "Mesa de restaurante con cartel de reserva",
        redirectTo: "/bookings",
        imagePosition: CTAImagePosition.LEFT,
    },
    {
        id: 4,
        title: "",
        description: "",
        buttonText: "",
        imageSrc: "/pictures/CTAImages/image-cta-orders.webp",
        imageData: { url: "", alt: "" },
        imageAlt: "Mesa con comida para llevar",
        redirectTo: "/orders",
        imagePosition: CTAImagePosition.RIGHT,
    },
];

function HomePage() {
    const { t } = useTranslate();

    console.log("Render Home Page");
    return (
        <Container>
            <section className="flex flex-col flex-1">
                <h1>{t("pages.home_page.title")}</h1>
                <div>
                    {CTA_DATA.map((data: CtaType) => {
                        return <CTACard key={data.id} variant="accent" {...data} />;
                    })}
                </div>
            </section>
        </Container>
    );
}

export default HomePage;
