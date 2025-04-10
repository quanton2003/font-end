import React, { useEffect, useState } from 'react';
import { Descriptions, Card, List, Divider, message } from 'antd';
import { useParams } from 'react-router-dom';
import { getOrderDetailById } from '../../services/orderServiceAdmin';

const AdminOrderDetail = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const fetchOrderDetail = async () => {
      try {
        const data = await getOrderDetailById(id);
        setOrder(data);
      } catch (error) {
        message.error('Không thể tải chi tiết đơn hàng');
      }
    };
    fetchOrderDetail();
  }, [id]);

  if (!order) return <div>Đang tải chi tiết đơn hàng...</div>;

  return (
    <div>
      <h2>Chi tiết đơn hàng #{order._id}</h2>
      <Descriptions bordered column={1}>
        <Descriptions.Item label="Người nhận">{order.shippingAddress.fullName}</Descriptions.Item>
        <Descriptions.Item label="Địa chỉ">
          {order.shippingAddress.address}, {order.shippingAddress.city}
        </Descriptions.Item>
        <Descriptions.Item label="SĐT">{order.shippingAddress.phone}</Descriptions.Item>
        <Descriptions.Item label="Phương thức thanh toán">{order.paymentMethod}</Descriptions.Item>
        <Descriptions.Item label="Tiền hàng">{order.itemPrice.toLocaleString()}₫</Descriptions.Item>
        <Descriptions.Item label="Phí vận chuyển">{order.shippingPrice.toLocaleString()}₫</Descriptions.Item>
        <Descriptions.Item label="Tổng tiền">{order.totalPrice.toLocaleString()}₫</Descriptions.Item>
        <Descriptions.Item label="Ngày tạo">{new Date(order.createdAt).toLocaleString()}</Descriptions.Item>
      </Descriptions>

      <Divider />
      <Card title="Danh sách sản phẩm">
        <List
          dataSource={order.orderItems}
          renderItem={(item, index) => (
            <List.Item key={item._id}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <strong>{index + 1}. {item.name}</strong>
                <span>SL: {item.amount} – Giá: {item.price.toLocaleString()}₫</span>
              </div>
            </List.Item>
          )}
        />
      </Card>
    </div>
  );
};

export default AdminOrderDetail;
