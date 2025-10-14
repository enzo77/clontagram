import { Link } from "react-router-dom/cjs/react-router-dom.min";

export default function Grid({ posts }) {
    const columnas = posts.reduce((columnas, post) => {
        const ultimaFila = columnas[columnas.length - 1];

        if (ultimaFila && ultimaFila.length < 3) {
            ultimaFila.push(post);
        } else { 
            columnas.push([post]);
        }
        return columnas;
    }, []);

    return (
        <div>
            {columnas.map((columna, index) => {
                return (
                    <div key={index} className="Grid__row">
                        {columna.map((post) => {
                            return (
                                <GridFoto key={post._id} url={post.url} {...post}></GridFoto>
                            );
                        })}
                    </div>
                );
            })}
        </div>
    );
}

function GridFoto({ _id, url, caption }) {
    return (
        <Link to={`/post/${_id}`} className="Grid__post">
            <img src={url} alt={caption} className="Grid__post-img" />
        </Link>
    );
}
