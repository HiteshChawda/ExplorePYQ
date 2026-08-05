import axios from "axios";

const API = import.meta.env.VITE_API_URL;
export async function register({ username, fullName, email, password }) {
  try {
    const response = await axios.post(
      `${API}/users/register`,
      { username, fullName, email, password },
      {
        withCredentials: true,
      },
    );
    return response.data;
  } catch (error) {
    console.error(error.response?.data || error.message);
    throw error;
  }
}

export async function login({ email, username, password }) {
  try {
    const response = await axios.post(
      `${API}/users/login`,
      {
        email,
        username,
        password,
      },
      {
        withCredentials: true,
      },
    );

    return response.data;
  } catch (error) {
    console.error(error.response?.data || error.message);
    throw error;
  }
}

export async function logout() {
  try {
    const response = await axios.post(
      `${API}/users/logout`,
      {},
      {
        withCredentials: true,
      },
    );

    return response.data;
  } catch (error) {
    console.error(error.response?.data || error.message);
    throw error;
  }
}

export async function getCurrentUser() {
  const response = await axios.get(
    `${API}/users/current-user`,
    {
      withCredentials: true,
    }
  );

  return response.data;
}
