// components/AdminOrder/AdminOrder.jsx
import React, { useEffect, useState } from 'react';
import { getAllOrders, getOrderById } from '../../services/orderServiceAdmin';
import { Table, message, Button, Popconfirm, Space } from 'antd';
import { DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import * as OrderService from '../../services/OrderService';
const AdminOrder = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await getAllOrders();
      const data = Array.isArray(res) ? res : res?.data || [];
      setOrders(data);
    } catch (error) {
      console.error(error);
      message.error('Không thể tải danh sách đơn hàng');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleDelete = async (orderId) => {
    try {
      const res = await OrderService.deleteOrder(orderId);
      if (res.status === 'OK') {
        message.success('Đã xoá đơn hàng');
        fetchOrders(); // Tải lại danh sách đơn hàng
      } else {
        message.error(res.message || 'Xoá đơn hàng thất bại');
      }
    } catch (error) {
      console.error(error);
      message.error('Lỗi khi xoá đơn hàng');
    }
  };
  

  const navigate = useNavigate();

  const handleViewDetails = async (orderId) => {
    try {
      const order = await OrderService.getOrderById(orderId);
      if (order) {
        navigate(`/orderDetails/${orderId}`);
      }
    } catch (error) {
      message.error('Đơn hàng không tồn tại hoặc đã bị xóa.');
      console.error(error);
    }
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: '_id',
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'totalPrice',
      render: (text) => `${text.toLocaleString()} ₫`,
    },
    {
      title: 'Thành phố',
      dataIndex: ['shippingAddress', 'city'],
    },
    {
      title: 'Ngày đặt',
      dataIndex: 'createdAt',
      render: (text) => new Date(text).toLocaleDateString(),
    },
    {
      title: 'Hành động',
      render: (_, record) => (
        <Space>
          <Button
            icon={<EyeOutlined />}
            type="primary"
            onClick={() => handleViewDetails(record._id)}
          >
            Xem
          </Button>
          <Popconfirm
            title="Bạn có chắc muốn xoá đơn hàng này?"
            onConfirm={() => handleDelete(record._id)}
            okText="Xoá"
            cancelText="Huỷ"
          >
            <Button icon={<DeleteOutlined />} danger>
              Xoá
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Table
      loading={loading}
      columns={columns}
      dataSource={orders}
      rowKey="_id"
      pagination={{ pageSize: 6 }}
    />
  );
};

export default AdminOrder;
