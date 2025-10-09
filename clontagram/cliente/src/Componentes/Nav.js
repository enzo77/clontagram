import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCameraRetro } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

export default function Nav({ usuario }) {
    return (
        <nav className="Nav">
            <ul className="Nav__links">
                <li>
                    <Link className="Nav__link" to="/">
                          EnzoGram
                    </Link>
                </li>
                { usuario && <LoginRoutes /> }
            </ul>
        </nav>
    );
}

function LoginRoutes() {
    return (
        <>
            <li className="Nav__link-push">
                <Link className="Nav__lin" to="/upload">
                    <FontAwesomeIcon icon={faCameraRetro} />
                </Link>
            </li>
        </>
    );
}
