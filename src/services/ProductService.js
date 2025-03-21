// import axios from 'axios'
import { axiosJwt } from './UserService';

export const getAllProduct = async () => {
    try {
        const res = await axiosJwt.get(`${process.env.REACT_APP_API_URL}/product/get-all`);
        return res.data;
    } catch (error) {
        console.error("Lỗi khi lấy danh sách sản phẩm:", error);
        return { data: [] }; // Trả về mảng rỗng để tránh lỗi
    }
};


export const createProduct = async (data) => {
    const res = await axiosJwt.post(`${process.env.REACT_APP_API_URL}/product/create`,data)

    return res.data;

};
export const getDetailsProduct = async (id) => {
    const res = await axiosJwt.get(`${process.env.REACT_APP_API_URL}/product/details-product/${id}`)

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

export const deleteProduct = async (id,token) => {
    const res = await axiosJwt.delete(
      `${process.env.REACT_APP_API_URL}/product/delete-product/${id}`,
      {
        headers: {
            token: `Bearer ${token}`,
        }
    }
    );
  
    return res.data;
  };