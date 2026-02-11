import { memo } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslate } from "../translations/useTranslate";
import Button from "./UI/Button";
import { Container } from "./UI/Container";

type NoContentPageProps = {
    title: string;
    content: string;
    buttonText: string;
    onClick: () => void;
};

function NoContentPage({
    title = "Upps...",
    content = "Something went wrong!",
    buttonText = "Retry",
    onClick,
}: NoContentPageProps) {
    const navigate = useNavigate();
    const { t } = useTranslate();

    const handleClickNavigate = () => {
        navigate("/");
    };

    return (
        <Container>
            <section className="flex flex-col gap-2 md:gap-4">
                <h1>{title}</h1>
                <p className="self-center opacity-60 italic">{content}</p>
                <div className="flex flex-col md:items-center md:flex-row md:justify-center gap-2">
                    <Button variant="primary" onClick={onClick}>
                        {buttonText}
                    </Button>
                    <Button variant="danger" role="link" onClick={handleClickNavigate}>
                        {t("pages.no_content_page.home_button")}
                    </Button>
                </div>
            </section>
        </Container>
    );
}

export default memo(NoContentPage);
