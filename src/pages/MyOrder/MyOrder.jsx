import { Card, Table, Button, Popconfirm, message } from 'antd';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { convertPrice } from '../../services/utils';

const OrderManagementPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Hàm tải danh sách đơn hàng từ backend
  const fetchOrders = async () => {
    setLoading(true);
    try {
      // Giả sử endpoint để lấy đơn hàng của người dùng là /api/order/my-orders
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/order/my-orders`, {
        // Nếu cần gửi token, bạn có thể thêm headers ở đây:
        // headers: { Authorization: `Bearer ${user.access_token}` }
      });
      // Giả sử dữ liệu trả về có dạng { orders: [...] }
      setOrders(res.data.orders);
    } catch (error) {
      console.error(error);
      message.error('Lỗi khi tải đơn hàng');
    } finally {
      setLoading(false);
    }
  };

  // Gọi hàm fetchOrders khi component mount
  useEffect(() => {
    fetchOrders();
  }, []);

  // Hàm xóa đơn hàng
  const handleDelete = async (orderId) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/order/${orderId}`);
      message.success('Xóa đơn hàng thành công');
      fetchOrders();
    } catch (error) {
      console.error(error);
      message.error('Xóa đơn hàng thất bại');
    }
  };

  // Định nghĩa các cột của bảng
  const columns = [
    {
      title: 'Mã đơn hàng',
      dataIndex: '_id',
      key: '_id',
    },
    {
      title: 'Người nhận',
      dataIndex: 'shippingAddress',
      key: 'shippingAddress',
      render: (shippingAddress) => shippingAddress?.fullName,
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'totalPrice',
      key: 'totalPrice',
      render: (totalPrice) => convertPrice(totalPrice),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => new Date(date).toLocaleString(),
    },
    {
      title: 'Hành động',
      key: 'actions',
      render: (text, record) => (
        <div>
          <Button type="link" onClick={() => navigate(`/order-details/${record._id}`)}>
            Xem chi tiết
          </Button>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa đơn hàng này?"
            onConfirm={() => handleDelete(record._id)}
          >
            <Button type="link" danger>
              Xóa
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <Card title="Quản lý đơn hàng của tôi" style={{ margin: '20px auto', maxWidth: 1000 }}>
      <Table
        columns={columns}
        dataSource={orders.map((order) => ({ ...order, key: order._id }))}
        loading={loading}
        pagination={{ pageSize: 10 }}
      />
    </Card>
  );
};

export default OrderManagementPage;
