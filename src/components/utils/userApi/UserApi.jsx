import axios from "axios";

const userApi = axios.create({
  baseURL: "https://next-jobquick.onrender.com/api/v1",
  withCredentials: true, // Ensures cookies/tokens are included in requests
});

export const loginApi = (post) => {
  return userApi.post("auth/login", post);
};

export const signupApi = (post) => {
  return userApi.post("auth/signup", post);
};
