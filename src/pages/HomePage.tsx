import { useMemo } from "react";
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

function HomePage() {
    const { t, i18n } = useTranslate();

    const CTA_DATA: CtaType[] = useMemo(
        () => [
            {
                id: 1,
                title: t("pages.home_page.cta_data.login.title"),
                description: t("pages.home_page.cta_data.login.description"),
                buttonText: t("pages.home_page.cta_data.login.button_text"),
                imageSrc: "/pictures/CTAImages/image-cta-login.webp",
                imageData: { url: "", alt: "" },
                imageAlt: "Mesa de restaurante con servicio",
                redirectTo: "/login",
                imagePosition: CTAImagePosition.RIGHT,
            },
            {
                id: 2,
                title: t("pages.home_page.cta_data.menu.title"),
                description: t("pages.home_page.cta_data.menu.description"),
                buttonText: t("pages.home_page.cta_data.menu.button_text"),
                imageSrc: "/pictures/CTAImages/image-cta-menu.webp",
                imageData: { url: "", alt: "" },
                imageAlt: "Platos de comida variados",
                redirectTo: "/menu",
                imagePosition: CTAImagePosition.LEFT,
            },
            {
                id: 3,
                title: t("pages.home_page.cta_data.bookings.title"),
                description: t("pages.home_page.cta_data.bookings.description"),
                buttonText: t("pages.home_page.cta_data.bookings.button_text"),
                imageSrc: "/pictures/CTAImages/image-cta-bookings.webp",
                imageData: { url: "", alt: "" },
                imageAlt: "Mesa de restaurante con cartel de reserva",
                redirectTo: "/bookings",
                imagePosition: CTAImagePosition.LEFT,
            },
            {
                id: 4,
                title: t("pages.home_page.cta_data.orders.title"),
                description: t("pages.home_page.cta_data.orders.description"),
                buttonText: t("pages.home_page.cta_data.orders.button_text"),
                imageSrc: "/pictures/CTAImages/image-cta-orders.webp",
                imageData: { url: "", alt: "" },
                imageAlt: "Mesa con comida para llevar",
                redirectTo: "/orders",
                imagePosition: CTAImagePosition.RIGHT,
            },
        ],
        [i18n?.language]
    );

    console.log("Render Home Page");
    return (
        <Container>
            <section className="flex flex-col flex-1 gap-2 lg:gap-3">
                <h1>{t("pages.home_page.title")}</h1>
                <div className="flex flex-col gap-4 lg:gap-5">
                    {CTA_DATA.map((data: CtaType) => {
                        return <CTACard key={data.id} variant="accent" {...data} />;
                    })}
                </div>
            </section>
        </Container>
    );
}

export default HomePage;
