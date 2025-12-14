import { useState } from "react";
import Main from "../Componentes/Main";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload } from "@fortawesome/free-solid-svg-icons";
import Loading from "../Componentes/Loading";
import axios from "axios";

export default function Upload({ history, mostrarError }) {
    const [imagenUrl, setimagenUrl] = useState("");
    const [subiendoImagen, setSubiendoImagen] = useState(false);
    const [enviandoPost, setEnviandoPost] = useState(false);
    const [caption, setCaption] = useState("");

    async function handleImagenSeleccionada(evento) {
        try {
            setSubiendoImagen(true);
            const file = evento.target.files[0];
            const config = {
                headers: {
                    "Content-Type": file.type,
                },
            };
            const { data } = await axios.post(
                "/api/posts/upload",
                file,
                config
            );
            setimagenUrl(data.url);
            setSubiendoImagen(false);
        } catch (error) {
            setSubiendoImagen(false);
            mostrarError(error.response.data);
            console.log(error);
        }
    }

    async function handleSubmit(evento) {
        evento.preventDefault();
       
        if (enviandoPost) {
            return;
        }

        if (subiendoImagen) {
            mostrarError("Debes seleccionar una imagen");
            return;
        }

        if (!imagenUrl) {
            mostrarError("Debes seleccionar una imagen");
            return;
        }

        try {
            setEnviandoPost(true);
            const body = {
                caption,
                url: imagenUrl,
            };
            await axios.post("/api/posts", body);
            setEnviandoPost(false);
            history.push("/");
        } catch (error) {
            mostrarError(error.response.data);
        }

    }

    return (
        <Main center={true}>
            <div className="Upload">
                <form onSubmit={handleSubmit} className="Upload__form">
                    <div className="Upload__image-section">
                        <SeccionSubirImagen
                            imagenUrl={imagenUrl}
                            subiendoImagen={subiendoImagen}
                            handleImagenSeleccionada={handleImagenSeleccionada}
                        ></SeccionSubirImagen>
                    </div>
                    <textarea
                        name="caption"
                        className="Upload__caption"
                        required
                        maxLength="180"
                        placeholder="Escribe un pie de fto..."
                        value={caption}
                        onChange={(e) => setCaption(e.target.value)}
                    ></textarea>
                    <button className="Upload__submit" type="submit">
                        Post
                    </button>
                </form>
            </div>
        </Main>
    );
}

function SeccionSubirImagen({
    subiendoImagen,
    imagenUrl,
    handleImagenSeleccionada,
}) {
    if (subiendoImagen) {
        return <Loading />;
    } else if (imagenUrl) {
        return <img src={imagenUrl} alt="Preview" />;
    } else {
        return (
            <label className="Upload__image-label">
                <FontAwesomeIcon icon={faUpload} />
                <span>Publica una foto</span>
                <input
                    type="file"
                    className="hidden"
                    name="imagen"
                    onChange={handleImagenSeleccionada}
                />
            </label>
        );
    }
}
