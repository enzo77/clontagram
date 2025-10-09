import { useEffect, useState } from "react";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
import Main from "../Componentes/Main";
import axios from "axios";
import Loading from "../Componentes/Loading";
import Post from "../Componentes/Post";

async function cargarPosts(fechaDeUltimoPost) {
    const query = fechaDeUltimoPost ? `?fecha=${fechaDeUltimoPost}` : "";
    const { data: nuevoPosts } = await axios.get(`/api/posts/feed${query}`);

    return nuevoPosts;
}

const NUMEROS_DE_POSTS_CARGADOS_POR_VEZ = 5;

export default function Feed({ mostrarError, usuario }) {
    const [posts, setPosts] = useState([]);
    const [cargandoPostIniciales, setCargandoPostIniciales] = useState(true);
    const [cargandoMasPosts, setcargandoMasPosts] = useState(false);
    const [todosLosPostsCargados, setTodosLosPostsCargados] = useState(false);

    useEffect(() => {
        async function cargarPostsIniciales() {
            try {
                const nuevoPosts = await cargarPosts();
                setPosts(nuevoPosts);
                console.log(nuevoPosts);
                setCargandoPostIniciales(false);
                revisarSiHayMasPosts(nuevoPosts);
            } catch (error) {
                mostrarError("Hubo un problema cargando los posts");
            }
        }

        cargarPostsIniciales();
    }, []);

    function actualizarPost(postOriginal, postActualizado) {
        setPosts((posts) => {
            const postsActualizados = posts.map((post) => {
                if (post !== postOriginal) {
                    return post;
                }
                return postActualizado;
            });
            return postsActualizados;
        });
    }

    async function cargarMasPosts() {
        if (cargandoMasPosts) {
            return;
        }

        try {
            setcargandoMasPosts(true);
            const fechaDelUltimoPost = posts[posts.length - 1].fecha_creado;
            const nuevoPosts = await cargarPosts(fechaDelUltimoPost);
            setPosts((viejosPosts) => [...viejosPosts, ...nuevoPosts]);
            setcargandoMasPosts(false);
            revisarSiHayMasPosts(nuevoPosts);
        } catch (error) {
            mostrarError("Hubo un problema cargando mas posts");
            setcargandoMasPosts(false);
            console.log(error);
        }
    }

    function revisarSiHayMasPosts(nuevosPosts) {
        if (nuevosPosts.length < NUMEROS_DE_POSTS_CARGADOS_POR_VEZ) {
            setTodosLosPostsCargados(true);
        }
    }

    if (cargandoPostIniciales) {
        return (
            <Main center>
                <Loading />
            </Main>
        );
    }

    if (!cargandoPostIniciales && posts.length === 0) {
        return (
            <Main>
                <NoSiguesANadie />
            </Main>
        );
    }

    return (
        <Main center>
            <div className="Feed">
                {posts.map((post) => (
                    <Post
                        key={post._id}
                        post={post}
                        actualizarPost={actualizarPost}
                        mostrarError={mostrarError}
                        usuario={usuario}
                    />
                ))}
                <CargarMasPosts onClick={cargarMasPosts} todosLosPostsCargados={todosLosPostsCargados}/>
            </div>
        </Main>
    );
}

function NoSiguesANadie() {
    return (
        <div className="NoSiguesANadie">
            <p className="NoSiguesANadie__mensaje">
                No hay posts para mostrar. Sigue a otros usuarios para ver sus
                posts.
            </p>
            <div className="text-center">
                <Link className="NoSiguesANadie__boton" to="/explore">
                    Explorar EnzoGram
                </Link>
            </div>
        </div>
    );
}

function CargarMasPosts({ onClick, todosLosPostsCargados }) {
    if (todosLosPostsCargados) {
        return (
            <div className="Feed__no-hay-mas-posts">
                No hay mas posts para cargar
            </div>
        );
    }

    return (
        <button className="Feed__cargar-mas" onClick={onClick}>
            Ver más
        </button>
    );
}
