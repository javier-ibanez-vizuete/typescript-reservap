import { Link } from "react-router-dom";
import { Container } from "../components/UI/Container";

function HomePage() {
    return (
        <Container>
            <h1>PAGINA PRINCIPALLLLLL</h1>
            <Link to={"/admin/dashboard"}>IR A ZONA ADMIN</Link>
        </Container>
    );
}

export default HomePage;
