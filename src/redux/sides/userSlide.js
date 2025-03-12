import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  value: '',
  email: '',
  access_token:'',
}

export const userSlide = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    updateUser:(state,action)=>{
     const {name,email,access_token} = action.payload
     console.log('action',action)
     state.name = name||email;
     state.email= email;
     state.access_token = access_token
    },
  },
})

// Action creators are generated for each case reducer function
export const { updateUser } = userSlide.actions

export default userSlide.reducer