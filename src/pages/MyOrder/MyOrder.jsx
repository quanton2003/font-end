import { Card, Table, Button, Popconfirm, message } from 'antd';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { convertPrice } from '../../services/utils';
import { getMyOrders, deleteOrder } from '../../services/OrderService';

const OrderManagementPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  console.log('user', user);
  
  const userId = user?.id;

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await getMyOrders(userId);
      setOrders(res.orders);
    } catch (error) {
      console.error(error);
      message.error('Lỗi khi tải đơn hàng');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleDelete = async (orderId) => {
    try {
      const res = await deleteOrder(orderId);
      if (res.status === 'OK') {
        message.success('Xoá đơn hàng thành công');
        fetchOrders();
      } else {
        message.error(res.message || 'Xoá đơn hàng thất bại');
      }
    } catch (error) {
      console.error(error);
      message.error('Xoá đơn hàng thất bại');
    }
  };
  

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
