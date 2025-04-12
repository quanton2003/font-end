// services/ProductService.js
import axios from 'axios';
import { axiosJwt } from './UserService';

export const getAllProduct = async (search = '', limit) => {
  let res = {};
  const limitQuery = limit ? `&limit=${limit}` : '';

  if (search.length > 0) {
    res = await axios.get(
      `${process.env.REACT_APP_API_URL}/product/get-all?filter=${search}${limitQuery}`
    );
  } else {
    res = await axios.get(
      `${process.env.REACT_APP_API_URL}/product/get-all?${limitQuery}`
    );
  }
  return res.data;
};

export const getProductType = async (type, page, limit) => {
  if (type) {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/product/get-all`, {
      params: {
        filter: ['type', type],
        page,
        limit
      }
    });
    return res.data;
  }
};

export const getAllProductForAdmin = async (search = '', page = 1, limit = 100) => {
  try {
    const res = await axiosJwt.get( // ✅ Sử dụng axiosJwt để gửi token
      `${process.env.REACT_APP_API_URL}/product/get-all?page=${page}&limit=${limit}&filter=${search}`
    );
    return res.data; // { data, total, page, limit }
  } catch (error) {
    console.error('Lỗi khi fetch sản phẩm (admin):', error);
    return { data: [], total: 0 };
  }
};

export const createProduct = async (data) => {
  const res = await axiosJwt.post(`${process.env.REACT_APP_API_URL}/product/create`, data);
  return res.data;
};

export const getDetailsProduct = async (id) => {
  const res = await axios.get(`${process.env.REACT_APP_API_URL}/product/details-product/${id}`);
  return res.data;
};

export const updateProduct = async (id, data) => { // ✅ Loại bỏ access_token thừa
  try {
    const res = await axiosJwt.put( // ✅ Sử dụng axiosJwt để gửi token
      `${process.env.REACT_APP_API_URL}/product/update-product/${id}`,
      data,
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    return res.data;
  } catch (error) {
    console.error("Lỗi khi cập nhật sản phẩm:", error);
    throw error;
  }
};

export const deleteProduct = async (id) => { // ✅ Loại bỏ token thừa
  try {
    const res = await axiosJwt.delete( // ✅ Sử dụng axiosJwt để gửi token
      `${process.env.REACT_APP_API_URL}/product/delete-product/${id}`
    );
    return res.data;
  } catch (error) {
    console.error("Lỗi khi xóa sản phẩm:", error);
    throw error;
  }
};

export const deleteManyProduct = async (data) => { // ✅ Loại bỏ token thừa
  try {
    const res = await axiosJwt.post( // ✅ Sử dụng axiosJwt để gửi token
      `${process.env.REACT_APP_API_URL}/product/delete-many`,
      data
    );
    return res.data;
  } catch (error) {
    console.error("Lỗi khi xóa nhiều sản phẩm:", error);
    throw error;
  }
};

export const getAllTypeProduct = async () => {
  const res = await axios.get(`${process.env.REACT_APP_API_URL}/product/get-all-type`);
  return res.data;
};