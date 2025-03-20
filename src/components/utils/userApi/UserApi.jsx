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

export const JobsAPi = (filters) => {
  // Create a copy of the filters to avoid mutating the original
  const filterParams = { ...filters };
  
  // Ensure we only pass non-empty values
  Object.keys(filterParams).forEach(key => {
    if (filterParams[key] === "" || filterParams[key] === null || filterParams[key] === undefined) {
      delete filterParams[key];
    }
  });
  
  // Handle category and subcategory mapping - key conversion
  if (filterParams.category) {
    filterParams.categories = filterParams.category;
    delete filterParams.category;
  }
  
  if (filterParams.subcategory) {
    filterParams.subcategories = filterParams.subcategory;
    delete filterParams.subcategory;
  }
  
  const params = new URLSearchParams(filterParams).toString();
  return userApi.get(`/job/filter?${params}`);
};

export const getCategoriesApi = () => {
  return userApi.get("/categories/get");
};

export const jobdetailsApi = (jobId) => {
  return userApi.get(`/job/${jobId}`);
};