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



const userId = Cookies.get("userId");
export const StatData = () =>{
  return Api.get(`job/dashboard/${userId}`);
}

export const LineCart = () => {
  return Api.get(`applicant/graph/:jobId`)
}

export const getJobsApi = (hosterId,limit,page) =>{
  return Api.get(`/job/dashboard/${hosterId}?limit=${limit}&page=${page}`);
}

export const viewappicantAPI = (jobId,limit,page,status) => {
  if(status === undefined || status === null){
    return Api.get(`/applicant/get?jobId=${jobId}&limit=${limit}&page=${page}`);
  }
  else{
    return Api.get(`/applicant/get?jobId=${jobId}&limit=${limit}&page=${page}&shortListed=${status}`);
  }
}

export const appicantAPI = (applicantId) => {
  return Api.get(`/applicant/details/${applicantId}`)
}

export const shortlistedApi = (applicantId, payload) => {
  return Api.patch(`/applicant/shortlisted/${applicantId}`, payload);
};

export const HosterDataTable = () => {  
  return Api.get(`job/table/${userId}`); 
}

export const deletehosterApi = (userId) => {
  return Api.delete(`auth/delete/hoster/${userId}`)
 }