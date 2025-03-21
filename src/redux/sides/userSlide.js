import { createSlice } from "@reduxjs/toolkit";

const storedUser = JSON.parse(localStorage.getItem("user")) || {}; // Lấy user từ localStorage

const initialState = {
  id: storedUser.id || null,
  email: storedUser.email || "",
  name: storedUser.name || "",
  phone: storedUser.phone || "",
  address: storedUser.address || "",
  avatar: storedUser.avatar || "",
  access_token: storedUser.access_token || null,
  isAdmin: storedUser.isAdmin || false, // 🔹 Tránh undefined
};

export const userSlide = createSlice({
  name: "user",
  initialState,
  reducers: {
    updateUser: (state, action) => {
      const { _id, name, email, access_token, phone, address, avatar, isAdmin } = action.payload;
      state.id = _id || state.id; // 🔹 Giữ giá trị cũ nếu không có _id
      state.name = name || state.name;
      state.email = email || state.email;
      state.phone = phone || state.phone;
      state.address = address || state.address;
      state.avatar = avatar || state.avatar;
      state.access_token = access_token || state.access_token;
      state.isAdmin = isAdmin ?? state.isAdmin; // 🔹 Giữ giá trị hiện tại nếu isAdmin là undefined

      // ✅ Chỉ lưu các dữ liệu quan trọng vào localStorage
      localStorage.setItem(
        "user",
        JSON.stringify({
          id: state.id,
          name: state.name,
          email: state.email,
          phone: state.phone,
          address: state.address,
          avatar: state.avatar,
          access_token: state.access_token,
          isAdmin: state.isAdmin,
        })
      );
    },
    resetUser: (state) => {
      Object.assign(state, initialState); // 🔥 Reset toàn bộ state

      // ❌ Xóa user khỏi localStorage khi logout
      localStorage.removeItem("user");
    },
  },
});

export const { updateUser, resetUser } = userSlide.actions;
export default userSlide.reducer;
