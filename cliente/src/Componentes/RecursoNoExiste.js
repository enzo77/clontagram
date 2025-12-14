import Main from "./Main";
import { Link } from "react-router-dom/cjs/react-router-dom.min";

export default function RecursoNoExiste({ mensaje }) {
    return (
        <Main center>
            <div>
                <h2 className="RecursoNoExiste_mensaje">{mensaje}</h2>
                <p className="RecursoNoExiste__link-container">
                    Ir al <Link to="/"><b>Home</b></Link>
                </p>
            </div>
        </Main>
    );
}
