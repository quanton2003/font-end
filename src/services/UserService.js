import axios from "axios";

export const axiosJwt = axios.create()


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

export const getDetailsUser = async (id, token) => {
  console.log("🔍 Gửi request getDetailsUser với token:", token);
  
  try {
    const res = await axiosJwt.get(`${process.env.REACT_APP_API_URL}/user/get-details/${id}`, {
      headers: { token: `Bearer ${token}` },
    });
    return res.data 
  } catch (error) {
    console.error("❌ Lỗi API getDetailsUser:", error.response);
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