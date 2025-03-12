import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  name: localStorage.getItem('name') || '',
  email: localStorage.getItem('email') || '',
  access_token: localStorage.getItem('token') || '',
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    updateUser: (state, action) => {
      const { name, email, access_token } = action.payload;
      console.log('action', action);
      state.name = name || email;
      state.email = email;
      state.access_token = access_token;

      // Lưu vào localStorage
      localStorage.setItem('name', state.name);
      localStorage.setItem('email', state.email);
      localStorage.setItem('token', state.access_token);
    },
    logout: (state) => {
      state.name = '';
      state.email = '';
      state.access_token = '';
      localStorage.removeItem('name');
      localStorage.removeItem('email');
      localStorage.removeItem('token');
    }
  },
});

// Action creators are generated for each case reducer function
export const { updateUser, logout } = userSlice.actions;
export default userSlice.reducer;
