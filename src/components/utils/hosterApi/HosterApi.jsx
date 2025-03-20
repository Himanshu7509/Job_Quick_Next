import axios from "axios";
import Cookies from "js-cookie";


const Api = axios.create({
  baseURL: "https://next-jobquick.onrender.com/api/v1",
});

Api.interceptors.request.use(
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

export const postHosterProfileApi = (post) => {
    return Api.post("/hoster/post", post);
  };
  
  export const patchHosterProfileApi = (id, post) => {
    return Api.patch(`/hoster/update/${id}`, post);
  };
  
  export const getHosterProfileApi = (userId) => {
    return Api.get(`/hoster/get/${userId}`);
  };

export const postJob = (post) => {
  return Api.post("/job/post", post);
};

export const getCategory = () => {
  return Api.get("/categories/get");
};
