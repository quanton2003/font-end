// services/orderService.js
import axios from 'axios';


export const getAllOrders = async () => {
  const res = await axios.get('/api//order/orderAdmin');
  return res.data.orders; // ✅ chỉ trả về mảng orders
};

