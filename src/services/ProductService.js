import axios from 'axios'
import { axiosJwt } from './UserService';

export const getAllProduct = async () => {
    try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/product/get-all`);
        return res.data;
    } catch (error) {
        console.error("Lỗi khi lấy danh sách sản phẩm:", error);
        return { data: [] }; // Trả về mảng rỗng để tránh lỗi
    }
};


export const createProduct = async (data) => {
    const res = await axios.post(`${process.env.REACT_APP_API_URL}/product/create`,data)

    return res.data;

};
export const getDetailsProduct = async (id) => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/product/details-product/${id}`)

    return res.data;

};

export const updateProduct = async (id, access_token, data) => {
    const res = await axiosJwt.put(
        `${process.env.REACT_APP_API_URL}/product/update-product/${id}`, 
        data,
        {
            headers: {
                token: `Bearer ${access_token}`,
            }
        }
    );
    return res.data;
};
