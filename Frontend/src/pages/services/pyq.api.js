import axios from "axios";

const API = `${import.meta.env.VITE_API_URL}/pyqs`;

export async function getPyqs() {

    const response = await axios.get(API, {
        withCredentials: true,
    });

    return response.data;
}

export async function uploadPyq(formData) {

    const response = await axios.post(API, formData, {
        withCredentials: true,
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });

    return response.data;
}

export async function deletePyq(id) {

    const response = await axios.delete(`${API}/${id}`, {
        withCredentials: true,
    });

    return response.data;
}