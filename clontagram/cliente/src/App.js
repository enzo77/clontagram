import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import axios from "axios";
import {
    setToken,
    deleteToken,
    getToken,
    initAxiosInterceptors,
} from "./Helpers/auth-helpers";

import Loading from "./Componentes/Loading";
import Nav from "./Componentes/Nav";
import Signup from "./Vistas/Signup";
import Login from "./Vistas/Login";
import Upload from "./Vistas/Upload";
import Main from "./Componentes/Main";
import Error from "./Componentes/Error";
import Feed from "./Vistas/Feed";
import Posts from "./Vistas/Posts";

initAxiosInterceptors();

export default function App() {
    const [usuario, setUsuario] = useState(null); //no sabemos si hay un usuario logueado
    const [cargandoUsuario, setCargandoUsuario] = useState(true); //estado de carga
    const [error, setError] = useState(null); //estado de error

    useEffect(() => {
        async function cargarUsuario() {
            if (!getToken()) {
                setCargandoUsuario(false);
                return;
            }

            try {
                const { data: usuario } = await axios.get(
                    "/api/usuarios/whoami"
                );
                setUsuario(usuario);
                setCargandoUsuario(false);
            } catch (error) {
                console.log(error);
            }
        }

        cargarUsuario();
    }, []);

    async function login(email, password) {
        const { data } = await axios.post("/api/usuarios/login", {
            email,
            password,
        });
        setUsuario(data.usuario);
        setToken(data.token);
        console.log(data);
    }

    async function signup(usuario) {
        const { data } = await axios.post("/api/usuarios/signup", usuario);
        setUsuario(data.usuario);
        setToken(data.token);
    }

    function logout() {
        setUsuario(null);
        deleteToken();
    }

    function mostrarError(mensaje) {
        setError(mensaje);
    }

    function esconderError() {
        setError(null);
    }

    if (cargandoUsuario) {
        return (
            <Main>
                <Loading />
            </Main>
        );
    }

    return (
        <Router>
            <Nav usuario={usuario}/>
            <Error mensaje={error} esconderError={esconderError} />
            {usuario ? (
                <LoginRoutes mostrarError={ mostrarError } usuario={usuario} />
                
            ) : (
                <LogoutRoutes
                    login={login}
                    signup={signup}
                    mostrarError={mostrarError}
                />
            )}
        </Router>
    );
}

//Renders está autenticado
function LoginRoutes({mostrarError, usuario }) {
    return (
        <Switch>
             <Route
                path="/upload"
                render={(props) => (
                    <Upload
                        {...props}
                        mostrarError={mostrarError}
                    />
                )}
            />
             <Route
                path="/post/:id"
                render={(props) => (
                    <Posts
                        {...props}
                        mostrarError={mostrarError} usuario={usuario}
                    />
                )}
            />
            <Route
                path="/"
                render={(props) => (
                    <Feed
                        {...props}
                        mostrarError={mostrarError}
                        usuario={usuario}
                    />
                )}
                default
            />
        </Switch>
    );
}

//Renders rutas cuando no está autenticado
function LogoutRoutes({ login, signup, mostrarError }) {
    return (
        <Switch>
            <Route
                path="/login"
                render={(props) => (
                    <Login
                        {...props}
                        login={login}
                        mostrarError={mostrarError}
                    />
                )}
            />
            <Route
                render={(props) => (
                    <Signup
                        {...props}
                        signup={signup}
                        mostrarError={mostrarError}
                    />
                )}
                default
            />
        </Switch>
    );
}
