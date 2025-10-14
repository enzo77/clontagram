import { useEffect, useState } from "react";
import Main from "../Componentes/Main";
import Loading from "../Componentes/Loading";
import Grid from "../Componentes/Grid";
import RecursoNoExiste from "../Componentes/RecursoNoExiste";
import stringToColor from "string-to-color";
import axios from "axios";

export default function Perfil({ mostrarError, usuario, match }) {
    const username = match.params.username;
    const [usuarioDueñoPerfil, setusuarioDueñoPerfil] = useState(null);
    const [cargandoPerfil, setCargandoPerfil] = useState(true);
    const [posts, setPosts] = useState([]);
    const [perfilNoExiste, setPerfilNoExtiste] = useState(false);
    const [subiendoImagen, setSubiendoImagen] = useState(false);
    useEffect(() => {
        async function cargarPostsYUsuarios(params) {
            try {
                setCargandoPerfil(true);
                const { data: usuario } = await axios.get(
                    `/api/usuarios/${username}`
                );
                const { data: posts } = await axios.get(
                    `/api/posts/usuario/${usuario._id}`
                );

                setusuarioDueñoPerfil(usuario);
                setPosts(posts);
                setCargandoPerfil(false);
            } catch (error) {
                if (
                    error.responde &&
                    (error.response.status === 404 ||
                        error.response.status === 400)
                ) {
                } else {
                    mostrarError("HUbo un problema cargando el perfil");
                }
                setCargandoPerfil(false);
            }
        }

        cargarPostsYUsuarios();
    }, [username]);

    function esElPerfilDeLaPersona() {
        return usuario._id === usuarioDueñoPerfil._id;
    }

    async function handleImangenSeleccionada(evento) {
        try {
            setSubiendoImagen(true);
            const file = evento.target.file[0];
            const config = {
                heders: {
                    "Content-Type": file.type,
                },
            };
            const { data } = await axios.post(
                "api/usuarios/upload",
                file,
                config
            );
            setusuarioDueñoPerfil({ ...usuarioDueñoPerfil, imagen: data.url });
            setSubiendoImagen(false)
        } catch (error) {
            mostrarError(error.responde.data)
        }
    }

    if (cargandoPerfil) {
        return (
            <Main center>
                <Loading />
            </Main>
        );
    }

    if (perfilNoExiste) {
        return (
            <RecursoNoExiste mensaje="El perfil no existe."></RecursoNoExiste>
        );
    }

    if (usuario == null) {
        return null;
    }

    return (
        <Main center>
            <div className="Perfil">
                <ImagenAvatar
                    esElPerfilDeLaPersona={esElPerfilDeLaPersona}
                    usuarioDueñoPerfil={usuarioDueñoPerfil}
                    handleImangenSeleccionada={() => 1}
                    subiendoImagen={subiendoImagen}
                ></ImagenAvatar>
            </div>
        </Main>
    );
}

function ImagenAvatar({
    esElPerfilDeLaPersona,
    usuarioDueñoPerfil,
    handleImangenSeleccionada,
    subiendoImagen,
}) {
    let contenido;

    if (subiendoImagen) {
        contenido = <Loading />;
    } else if (esElPerfilDeLaPersona) {
        contenido = (
            <label
                className="Perfil__img-placeholder Perfil__img-placeholder--ponter"
                style={{
                    backgroundImage: usuarioDueñoPerfil.imagen
                        ? `url(${usuarioDueñoPerfil.imagen})`
                        : null,
                    backgroundColor: stringToColor(usuarioDueñoPerfil.username),
                }}
            >
                <input
                    type="file"
                    onChange={handleImangenSeleccionada}
                    className="hidden"
                    name="imagen"
                ></input>
            </label>
        );
    } else {
        contenido = (
            <div
                className="Perfil__img-placeholder"
                style={{
                    backgroundImage: usuarioDueñoPerfil.imagen
                        ? `url(${usuarioDueñoPerfil.imagen})`
                        : null,
                    backgroundColor: stringToColor(usuarioDueñoPerfil.username),
                }}
            />
        );
    }
    return <div className="Perfil__img-container">{contenido}</div>;
}
