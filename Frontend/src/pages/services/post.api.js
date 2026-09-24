import axios from "axios";

const API = `${import.meta.env.VITE_API_URL}/posts`;

export async function getPosts() {

    const response = await axios.get(API, {
        withCredentials: true,
    });

    return response.data;
}

export async function createPost(formData) {

    const response = await axios.post(API, formData, {
        withCredentials: true,
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });

    return response.data;
}

export async function likePost(postId) {

    const response = await axios.patch(
        `${API}/${postId}/like`,
        {},
        {
            withCredentials: true,
        }
    );

    return response.data;
}

export async function dislikePost(postId) {

    const response = await axios.patch(
        `${API}/${postId}/dislike`,
        {},
        {
            withCredentials: true,
        }
    );

    return response.data;
}

export async function deletePost(postId) {

    const response = await axios.delete(`${API}/${postId}`, {
        withCredentials: true,
    });

    return response.data;
}