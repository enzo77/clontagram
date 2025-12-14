import { useEffect, useState } from "react";
import Main from "../Componentes/Main";
import Loading from "../Componentes/Loading";
import Post from "../Componentes/Post";
import Avatar from "../Componentes/Avatar";
import Comentar from "../Componentes/Comentar";
import BotonLike from "../Componentes/BotonLike";
import RecursoNoExiste from "../Componentes/RecursoNoExiste";
import { Link } from "react-router-dom";
import { toggleLike, comentar } from "../Helpers/post-helpers";
import axios from "axios";

export default function PostVista({ mostrarError, match, usuario }) {
    const postId = match.params.id;
    const [post, setpost] = useState(null);
    const [loading, setloading] = useState(true);
    const [postNoExiste, setPostNoExiste] = useState(false);
    const [enviandoLike, setEnviandoLike] = useState(false);

    useEffect(() => {
        async function cargarPosts(params) {
            try {
                const { data: posts } = await axios.get(`/api/posts/${postId}`);
                setpost(posts);
                console.log(posts.comentarios);
                setloading(false);
            } catch (error) {
                if (
                    error.response &&
                    (error.response.status === 404 ||
                        error.response.status === 400)
                ) {
                    setPostNoExiste(true);
                } else {
                    mostrarError("Hubo un problema cargando este post");
                }
                setloading(false);
            }
        }

        cargarPosts();
    }, [postId]);

    async function onSubmitComentario(mensaje) {
        const postActualizado = await comentar(post, mensaje, usuario);
        setpost(postActualizado);
    }
    
    async function onSubmitLike() {

        if (enviandoLike) {
            return;
        }

        try {
            setEnviandoLike(true);
            const postActualizado = await toggleLike(post);
            setpost(postActualizado);
            setEnviandoLike(false);
        } catch (error) {
            setEnviandoLike(false);
            mostrarError("Hubo un problema actualizando el like");
            console.log(error);
        }
        
    }

    if (loading) {
        return (
            <div>
                <Main center>
                    <Loading />
                </Main>
            </div>
        );
    }

    if (postNoExiste) {
        return <RecursoNoExiste mensaje="el post no existe"></RecursoNoExiste>;
    }

    if (post === null) {
        return null;
    }

    return (
        <div>
            <Main center>
                <Posts {...post} onSubmitComentario={onSubmitComentario}  onSubmitLike={onSubmitLike}/>
            </Main>
        </div>
    );
}

function Posts({
    comentarios,
    caption,
    url,
    usuario,
    estaLike,
    onSubmitLike,
    onSubmitComentario,
}) {
    return (
        <div className="Post">
            <div className="Post__image-container">
                <img src={url} alt={caption} />
            </div>
            <div className="Post__side-bar">
                <Avatar usuario={usuario} />
                <div className="Post__comentarios-y-like">
                    <Comentarios
                        usuario={usuario}
                        caption={caption}
                        comentarios={comentarios}
                    />
                    <div className="Post__like">
                        <BotonLike
                            onSubmitLike={onSubmitLike}
                            like={estaLike}
                        ></BotonLike>
                    </div>
                    <Comentar onSubmitComentario={onSubmitComentario} />
                </div>
            </div>
        </div>
    );
}

function Comentarios({ usuario, caption, comentarios }) {
    return (
        <ul className="Post__comentarios">
            <li className="Post__comentario">
                <Link
                    to={`/perfil/${usuario.username}`}
                    className="Post__autor-comentario"
                >
                    <b>{usuario.username}</b>
                </Link>{" "}
                {caption}
            </li>
            {comentarios.map((comentario) => (
                <li className="Post__comentario" key={comentario._id}>
                    <Link
                        to={`/perfil/${comentario.usuario.username}`}
                        className="Post__autor-comentario"
                    >
                        <b>{comentario.usuario.username}</b>
                    </Link>{" "}
                    {comentario.mensaje}
                </li>
            ))}
        </ul>
    );
}
