import axios from 'axios';
import { axiosJwt } from './UserService';

// export const createProduct = async (data) => {
//     const res = await axios.post(`${process.env.REACT_APP_API_URL}/product/create`,data)

//     return res.data;

// };

export const createOrder = async (access_token, data) => {
    console.log("Dữ liệu gửi lên:", data); // Debug dữ liệu
    try {
        const res = await axiosJwt.post(
            `${process.env.REACT_APP_API_URL}/order/create`,
            data,
            {
                headers: {
                    token: `Bearer ${access_token}`,
                },
            }
        );
        return res.data;
    } catch (error) {
        console.error("Lỗi từ server:", error.response?.data || error.message);
        throw error;
    }
};
export const getOrderById = async (orderId) => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/order/${orderId}`);
      // Giả sử backend trả về dữ liệu theo dạng: { status: 'OK', order: {...} }
      return res.data;
    } catch (error) {
      console.error("Lỗi khi lấy chi tiết đơn hàng:", error.response?.data || error.message);
      throw error;
    }
  };
