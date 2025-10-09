import { useState } from "react";
import Main from "../Componentes/Main";
import imagenSignup from "../imagenes/signup.png";

import { Link } from "react-router-dom";

export default function Signup({ signup, mostrarError }) {
    const [usuario, setUsuario] = useState({
        email: "hola@gmail.it",
        nombre: "enzo",
        username: "ngksanokdev",
        bio: "spy bio",
        password: "",
    });

    function handleInputChange(e) {
        setUsuario({ ...usuario, [e.target.name]: e.target.value });
        console.log(usuario);
    }

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            await signup(usuario);
        } catch (error) {
            mostrarError(error.response.data);
            console.log(error);
        }
    }

    return (
        <Main center={true}>
            <div className="Signup">
                <img src={imagenSignup} alt="" className="Signup__img" />
                <div className="FormContainer">
                    <h1 className="Form__titulo"> EnzoGramd j</h1>
                    <p className="FormContainer__info">
                        Registrate para ver fotos y videos de tus amigos.
                    </p>
                    <form onSubmit={handleSubmit}>
                        <input
                            type="email"
                            name="email"
                            placeholder="email"
                            className="Form__field"
                            required
                            onChange={handleInputChange}
                            value={usuario.email}
                        />
                        <input
                            type="text"
                            name="nombre"
                            placeholder="nombre y apellido"
                            className="Form__field"
                            required
                            minLength="3"
                            maxLength="30"
                            onChange={handleInputChange}
                            value={usuario.nombre}
                        />
                        <input
                            type="text"
                            name="username"
                            placeholder="username"
                            className="Form__field"
                            required
                            minLength="3"
                            maxLength="30"
                            onChange={handleInputChange}
                            value={usuario.username}
                        />
                        <input
                            type="text"
                            name="bio"
                            placeholder="Cuentanos de ti"
                            className="Form__field"
                            required
                            maxLength="130"
                            onChange={handleInputChange}
                            value={usuario.bio}
                        />
                        <input
                            type="password"
                            name="password"
                            placeholder="password"
                            className="Form__field"
                            required
                            onChange={handleInputChange}
                            value={usuario.password}
                        />
                        <button className="Form__submit" type="submit">
                            Entrar
                        </button>
                        <p className="FormContainer__info">
                            Ya tienes cuenta?
                            <Link to="/login">Login</Link>
                        </p>
                    </form>
                </div>
            </div>
        </Main>
    );
}
