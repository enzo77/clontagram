import axios from "axios";

export async function toggleLike(post) {
    const url = `/api/posts/${post._id}/likes`;

    let postConLikeActualizado;

    if (post.estaLike) {
        await axios.delete(url, {});
        postConLikeActualizado = {
            ...post,
            estaLike: false,
            numLikes: post.numLikes - 1,
        };
    } else {
        await axios.post(url, {});
        postConLikeActualizado = {
            ...post,
            estaLike: true,
            numLikes: post.numLikes + 1,
        };
    }

    return postConLikeActualizado;
}

export async function comentar(post, mensaje, usuario) {
    const { data: nuevoComentario } = await axios.post(
        `/api/posts/${post._id}/comentarios`,
        { mensaje }
    );
    console.log(post);
    nuevoComentario.usuario = usuario; 

    const postConComentarioActualizado = {
        ...post,
        numComentarios: post.numComentarios + 1,
        comentarios: [...post.comentarios, nuevoComentario],
    };

    return postConComentarioActualizado;
}
