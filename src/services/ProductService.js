// import axios from 'axios'
import axios from 'axios';
import { axiosJwt } from './UserService';

// services/ProductService.js
export const getAllProduct = async (search = '', limit) => {
    let res = {};
  
    // Tùy chọn: chuyển đổi limit sang query string nếu có giá trị
    const limitQuery = limit ? `&limit=${limit}` : '';
  
    if (search.length > 0) {
      res = await axios.get(
        `${process.env.REACT_APP_API_URL}/product/get-all?filter=${search}${limitQuery}`
      );
    } else {
      // Nếu không có search, chỉ thêm limitQuery nếu có
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
  
  
  
  
// Trong ProductService.js (hoặc file API của bạn)
// export const getAllProductForAdmin = async (search = '') => {
//   try {
//     const res = await axios.get(
//       `${process.env.REACT_APP_API_URL}/product/get-all?filter=${search}`
//     );
//     // Giả sử API trả về mảng sản phẩm trong res.data
//     return res.data;
//   } catch (error) {
//     console.error('Lỗi khi fetch sản phẩm:', error);
//     return [];
//   }
// };

export const getAllProductForAdmin = async (search = '', page = 1, limit = 100) => {
  try {
    const res = await axios.get(
      `${process.env.REACT_APP_API_URL}/product/get-all?page=${page}&limit=${limit}&filter=${search}`
    );
    return res.data; // { data, total, page, limit }
  } catch (error) {
    console.error('Lỗi khi fetch sản phẩm:', error);
    return { data: [], total: 0 };
  }
};



export const createProduct = async (data) => {
    const res = await axiosJwt.post(`${process.env.REACT_APP_API_URL}/product/create`,data)

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

  export const deleteManyProduct= async (data,token) => {
    const res = await axiosJwt.post(
      `${process.env.REACT_APP_API_URL}/product/delete-many`,data,
      {
        headers: {
            token: `Bearer ${token}`,
        }
    }
    );
  
    return res.data;
  };
  export const getAllTypeProduct = async () => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/product/get-all-type`)

    return res.data;

};
