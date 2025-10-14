import { use, useState, useEffect } from "react";
import Main from "../Componentes/Main";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
import Loading from "../Componentes/Loading";
import { ImagenAvatar } from "../Componentes/Avatar";
import axios from "axios";
import Grid from "../Componentes/Grid";

export default function Explore({ mostrarerror }) {
    const [posts, setPosts] = useState([]);
    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        async function cargarPostsUsuarios(params) {
            try {
                const [posts, usuarios] = await Promise.all([
                    axios.get("/api/posts/explore").then(({ data }) => data),
                    axios.get("/api/usuarios/explore").then(({ data }) => data),
                ]);
                setPosts(posts);
                setUsuarios(usuarios);
                setLoading(false);
            } catch (error) {
                mostrarerror(
                    "hubo un problema cargando explore, refresca la página"
                );
                console.log("error");
            }
        }

        cargarPostsUsuarios();
    }, []);

    if (loading) {
        return (
            <Main center>
                <Loading />
            </Main>
        );
    }

    return (
        <Main center>
            <div className="Explore__section">
                <h2 className="Explore__title">Descubrir usarios</h2>
                <div className="Explore__usuarios-container">
                    {usuarios.map((usuario) => {
                        return (
                            <div className="Explore__usuario" key={usuario._id}>
                                <ImagenAvatar usuario={usuario} />
                                <p>{usuario.username}</p>
                                <Link to={`/perfil/${usuario.username}`}>
                                    {" "}
                                    Ver perfil{" "}
                                </Link>
                            </div>
                        );
                    })}
                </div>
            </div>
            <div className="Explore__section">
                <h2 className="Explore__title">Explorar</h2>
                <Grid posts={posts} />
            </div>
        </Main>
    );
}
