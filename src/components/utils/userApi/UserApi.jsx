import axios from "axios";

const userApi = axios.create({
  baseURL: "https://next-jobquick.onrender.com/api/v1"
});

export const loginApi = (post) => {
  return userApi.post("auth/login", post);
};

export const signupApi = (post) => {
  return userApi.post("auth/signup", post);
};
