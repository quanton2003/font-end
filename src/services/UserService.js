import axios from "axios";
import { store } from "../redux/store";
import { resetUser } from "../redux/sides/userSlide";

export const axiosJwt = axios.create()
axiosJwt.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        // Gọi API để refresh token
        const res = await refreshToken();
        if (res?.access_token) {
          // Cập nhật token mới vào Redux
          const user = JSON.parse(localStorage.getItem("user")) || {};
          user.access_token = res.access_token;
          localStorage.setItem("user", JSON.stringify(user));
          store.dispatch(updateUser(user));

          // Gán token mới vào headers và gọi lại request bị lỗi
          originalRequest.headers["token"] = `Bearer ${res.access_token}`;
          return axiosJwt(originalRequest);
        }
      } catch (err) {
        console.error("Refresh token failed:", err);
        store.dispatch(resetUser()); // Logout nếu refresh thất bại
      }
    }
    return Promise.reject(error);
  }
);

export const loginUser = async (data) => {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/user/sign-in`, data)
      return res.data 
};


export const signupUser  = async (data) => {
  const res = await axios.post(`${process.env.REACT_APP_API_URL}/user/sign-up`, data)
  return res.data 
};

// export const getDetailsUser  = async (id,access_token) => {
//   const res = await axios.get(`${process.env.REACT_APP_API_URL}/user/get-details/${id}`, {
//     headers:{
//       token: `Bearer ${access_token}`,
//     }
//   })
//   return res.data 
// };

export const getDetailsUser = async (id) => {
  try {
    const res = await axiosJwt.get(`${process.env.REACT_APP_API_URL}/user/get-details/${id}`);
    return res.data;
  } catch (error) {
    console.error("❌ Lỗi API getDetailsUser:", error);
  }
};



export const refreshToken = async () => {
  try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/user/refresh-token`, {}, {
          withCredentials: true  // ✅ Bắt buộc để gửi cookie lên server
      });
      return res.data;
  } catch (error) {
      console.error('Lỗi refresh token:', error);
      throw error;
  }
};



export const logOutUser = async () => {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/user/log-out`)

      return res.data;

};

export const updateUser = async (data) => {
  const res = await axiosJwt.put(
    `${process.env.REACT_APP_API_URL}/user/update-user/${data.id}`,
    data,
    {
      headers: { "Content-Type": "application/json" },
    }
  );

  return res.data;
};


