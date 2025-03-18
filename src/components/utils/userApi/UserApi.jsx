import axios from "axios";
import Cookies from "js-cookie";

const userApi = axios.create({
  baseURL: "https://next-jobquick.onrender.com/api/v1"
});

userApi.interceptors.request.use(
  (config) => {
    const token = Cookies.get("authToken");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const loginApi = (post) => {
  return userApi.post("auth/login", post);
};

export const signupApi = (post) => {
  return userApi.post("auth/signup", post);
};

export const postProfileApi = (post) => {
  return userApi.post("/seeker/post", post);
};

export const patchProfileApi = (id, post) => {
  return userApi.patch(`/seeker/update/${id}`, post);
};

export const getProfileApi = (userId) => {
  return userApi.get(`/seeker/get/${userId}`);
};
