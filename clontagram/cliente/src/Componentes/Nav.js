import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCameraRetro } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { faCompass, faUser } from "@fortawesome/free-regular-svg-icons";
export default function Nav({ usuario }) {
    return (
        <nav className="Nav">
            <ul className="Nav__links">
                <li>
                    <Link className="Nav__link" to="/">
                          EnzoGram
                    </Link>
                </li>
                { usuario && <LoginRoutes usuario={usuario} /> }
            </ul>
        </nav>
    );
}

function LoginRoutes({usuario}) {
    console.log(usuario)
    return (
        <>
            <li className="Nav__link-push">
                <Link className="Nav__lin" to="/upload">
                    <FontAwesomeIcon icon={faCameraRetro} />
                </Link>
            </li>
             <li className="Nav__link-margin-left">
                <Link className="Nav__lin" to="/explore">
                    <FontAwesomeIcon icon={faCompass} />
                </Link>
            </li>
               <li className="Nav__link-margin-left">
                <Link className="Nav__lin" to={`/perfil/${usuario.username}`}>
                    <FontAwesomeIcon icon={faUser} />
                </Link>
            </li>
        </>
    );
}
