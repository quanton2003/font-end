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
  isAdmin: false
};

export const userSlide = createSlice({
  name: "user",
  initialState,
  reducers: {
    updateUser: (state, action) => {
      const { name, email, access_token, phone, address, avatar, _id, isAdmin } = action.payload;
      state.id = _id;
      state.name = name;
      state.email = email;
      state.phone = phone;
      state.address = address;
      state.avatar = avatar;
      state.access_token = access_token;
      state.isAdmin = isAdmin; 

      // ✅ Lưu user vào localStorage để giữ trạng thái sau F5
      localStorage.setItem("user", JSON.stringify(state));
    },
    resetUser: (state) => {
      state.id = null;
      state.name = "";
      state.email = "";
      state.access_token = null;
      state.phone = "";
      state.address = "";
      state.avatar = "";
      state.isAdmin = false;

      // ❌ Xóa user khỏi localStorage khi logout
      localStorage.removeItem("user");
    },
  },
});

export const { updateUser, resetUser } = userSlide.actions;
export default userSlide.reducer;
