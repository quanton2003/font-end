import React, { useEffect, useState } from 'react';
import { Card, Table, message, Spin, Descriptions, Tag } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import { convertPrice } from '../../services/utils';
import { getOrderById } from '../../services/OrderService';

const OrderDetails = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
 console.log('OrderDetails', orderId);
 console.log('useParams:', useParams());

  const fetchOrderDetail = async () => {
    setLoading(true);
    try {
      const data = await getOrderById(orderId);
      if (data.status === 'OK') {
        setOrder(data.order);
      } else {
        message.error('Không tìm thấy đơn hàng');
        navigate('/orders');
      }
    } catch (error) {
      console.error(error);
      message.error('Lỗi khi tải chi tiết đơn hàng');
      // navigate('/orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderDetail();
  }, [orderId]);

  // Các cột của bảng hiển thị sản phẩm trong đơn hàng
  const columns = [
    {
      title: 'Sản phẩm',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <img
            src={record.image}
            alt={text}
            style={{ width: 50, height: 50, marginRight: 10, objectFit: 'cover' }}
          />
          {text}
        </div>
      ),
    },
    {
      title: 'Giá',
      dataIndex: 'price',
      key: 'price',
      render: (price) => convertPrice(price),
    },
    {
      title: 'Số lượng',
      dataIndex: 'amount',
      key: 'amount',
    },
    {
      title: 'Tổng',
      key: 'total',
      render: (_, record) => (
        <span style={{ color: 'red' }}>
          {convertPrice(record.price * record.amount)}
        </span>
      ),
    },
  ];

  if (loading) {
    return (
      <div style={{ textAlign: 'center', marginTop: 50 }}>
        <Spin tip="Đang tải chi tiết đơn hàng..." />
      </div>
    );
  }

  if (!order) {
    return null;
  }

  const {
    _id,
    user,
    shippingAddress,
    paymentMethod,
    itemPrice,
    shippingPrice,
    totalPrice,
    status,
    createdAt,
    orderItems,
  } = order;

  return (
    <Card title="Chi tiết đơn hàng" style={{ maxWidth: 1000, margin: '20px auto' }}>
      <Descriptions bordered column={1} size="middle">
        <Descriptions.Item label="Mã đơn hàng">{_id}</Descriptions.Item>
        <Descriptions.Item label="Người đặt hàng">
          {user?.name} {user?.email && `(Email: ${user.email})`}
        </Descriptions.Item>
        <Descriptions.Item label="Trạng thái">
          <Tag color={status === 'Pending' ? 'orange' : 'green'}>{status}</Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Ngày tạo">
          {new Date(createdAt).toLocaleString()}
        </Descriptions.Item>
        <Descriptions.Item label="Phương thức thanh toán">
          {paymentMethod}
        </Descriptions.Item>
        <Descriptions.Item label="Địa chỉ nhận hàng">
          {shippingAddress?.fullName}, {shippingAddress?.phone}
          <br />
          {shippingAddress?.address}, {shippingAddress?.city}
        </Descriptions.Item>
      </Descriptions>

      <Table
        columns={columns}
        dataSource={orderItems.map((item) => ({ ...item, key: item._id || item.name }))}
        pagination={false}
        style={{ marginTop: 20 }}
      />

      <Card style={{ marginTop: 20 }}>
        <p>
          <strong>Tạm tính:</strong> {convertPrice(itemPrice)}
        </p>
        <p>
          <strong>Phí giao hàng:</strong> {convertPrice(shippingPrice)}
        </p>
        <p style={{ fontSize: 16, fontWeight: 'bold', color: 'red' }}>
          Tổng tiền: {convertPrice(totalPrice)}
        </p>
      </Card>
    </Card>
  );
};

export default OrderDetails;
