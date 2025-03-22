import axios from "axios";
import { store } from "../redux/store";
import { resetUser, updateUser } from "../redux/sides/userSlide";


export const axiosJwt = axios.create({
  withCredentials: true, // ✅ Quan trọng để gửi cookie refresh token
});

// ✅ Thêm interceptor để tự động refresh token khi hết hạn
axiosJwt.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // 🔥 Nếu lỗi 401 (Unauthorized) & chưa retry thì gọi refresh token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const res = await refreshToken(); // 🔄 Gọi API refresh token
        if (res?.access_token) {
          // ✅ Cập nhật token vào Redux và LocalStorage
          const user = JSON.parse(localStorage.getItem("user")) || {};
          user.access_token = res.access_token;
          localStorage.setItem("user", JSON.stringify(user));
          store.dispatch(updateUser(user));

          // ✅ Gắn token mới vào request cũ & gửi lại
          axiosJwt.defaults.headers.common["Authorization"] = `Bearer ${res.access_token}`;
          originalRequest.headers["Authorization"] = `Bearer ${res.access_token}`;

          return axiosJwt(originalRequest);
        }
      } catch (err) {
        console.error("🔴 Refresh token thất bại:", err);
        store.dispatch(resetUser()); // ❌ Xóa thông tin người dùng khi thất bại
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



export const getAllUser = async (access_token) => {
  try {
    const res = await axiosJwt.get(
      `${process.env.REACT_APP_API_URL}/user/getAll`,
      {
        headers: {
            token: `Bearer ${access_token}`,
        }
    }
    );
    return res.data;
} catch (error) {
    console.error("Lỗi khi lấy danh sách sản phẩm:", error);
    return { data: [] }; // Trả về mảng rỗng để tránh lỗi
}





};

export const deleteUser = async (id, access_token) => {
  const res = await axiosJwt.delete(
    `${process.env.REACT_APP_API_URL}/user/delete-user/${id}`,
    {
      headers: {
        token: `Bearer ${access_token}`,
      },
    }
  );
  return res.data;
};



export const refreshToken = async () => {
  try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/user/refresh-token`, {}, {
          withCredentials: true  // ✅ Quan trọng để gửi cookies refresh token
      });
      console.log("✅ Token refreshed:", res.data.access_token); // Debug xem có lấy được token không
      return res.data;
  } catch (error) {
      console.error('❌ Lỗi refresh token:', error);
      throw error;
  }
};




export const logOutUser = async () => {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/user/log-out`)

      return res.data;

};

export const updateUsersv = async (data) => {
  const res = await axiosJwt.put(
    `${process.env.REACT_APP_API_URL}/user/update-user/${data.id}`,
    data,
    {
      headers: { "Content-Type": "application/json" },
    }
  );

  return res.data;
};

export const deleteManyUser= async (data,token) => {
  const res = await axiosJwt.post(
    `${process.env.REACT_APP_API_URL}/user/delete-many`,data,
    {
      headers: {
          token: `Bearer ${token}`,
      }
  }
  );

  return res.data;
};