import axios from "axios";
import { store } from "../redux/store";
import { resetUser, updateUser } from "../redux/sides/userSlide";
import { refreshToken } from "./UserService"; // API gọi refresh token

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
          originalRequest.headers["Authorization"] = `Bearer ${res.access_token}`;
          return axiosJwt(originalRequest);
        }
      } catch (err) {
        console.error("🔴 Refresh token thất bại:", err);
        store.dispatch(resetUser()); // Nếu refresh thất bại → Đăng xuất
      }
    }
    return Promise.reject(error);
  }
);
