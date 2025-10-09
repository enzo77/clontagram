import { useState } from "react";
import Main from "../Componentes/Main";
import { Link } from "react-router-dom";

export default function Login({ login, mostrarError }) {
    const [emailYPassword, setemailYPassword] = useState({
        email: "",
        password: "",
    });

    function handleInputChange(e) {
        setemailYPassword({
            ...emailYPassword,
            [e.target.name]: e.target.value,
        });
    }

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            await login(emailYPassword.email, emailYPassword.password);

            // const { data } = await Axios.post( "/api/usuarios/login", emailYPassword );
            //  console.log(data);
        } catch (error) {
            console.log(error);
            mostrarError(error.response.data);
        }
    }
    return (
        <Main center>
            <div className="FormContainer">
                <h1 className="Form__titulo">Login</h1>
                <div>
                    <form onSubmit={handleSubmit}>
                        <input
                            type="email"
                            name="email"
                            placeholder="email"
                            className="Form__field"
                            required
                            onChange={handleInputChange}
                            value={emailYPassword.email}
                        />
                        <input
                            type="password"
                            name="password"
                            placeholder="password"
                            className="Form__field"
                            required
                            onChange={handleInputChange}
                            value={emailYPassword.password}
                        />
                        <button className="Form__submit" type="submit">
                            Login
                        </button>
                        <p className="FormContainer__info">
                            NO tienes cuenta?
                            <Link to="/signup">Signup</Link>
                        </p>
                    </form>
                </div>
            </div>
        </Main>
    );
}
