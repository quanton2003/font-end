import { Card, Radio, Button, message, Table } from 'antd';
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { convertPrice } from '../../services/utils';
import { useNavigate } from 'react-router-dom';
import { useMutationHooks } from '../../hooks/useMutationHooks';
import * as OrderService from '../../services/OrderService';

const PaymentPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const order = useSelector((state) => state.order);
  const user = useSelector((state) => state.user);
  const [paymentMethod, setPaymentMethod] = useState('cod');

   console.log(user);
   
  // Tính toán các giá trị đơn hàng
  const shippingFee = 15000;
  const totalProductsAmount = order.orderItems.reduce((acc, item) => {
    const discount = item.discount || 0;
    const effectivePrice = item.price * (1 - discount / 100);
    return acc + effectivePrice * item.amount;
  }, 0);
  const totalAmount = totalProductsAmount + shippingFee;

  // Chuyển đổi order.orderItems thành dataSource có thuộc tính key duy nhất
  const dataSource = order.orderItems.map((item, index) => ({
    key: item.id || index.toString(),
    ...item,
  }));

  // Định nghĩa mutation thêm đơn hàng
  const mutationAddOrder = useMutationHooks((data) => {
    return OrderService.createOrder(data.token, data);
  });

  // Hàm xử lý thanh toán
  const handlePayment = () => {
    const payload = {
      token: user?.access_token,
      paymentMethod,
      itemPrice: totalProductsAmount,
      shippingPrice: shippingFee,
      totalPrice: totalAmount,
      user: user?.id, // Đảm bảo gửi ID người dùng
      shippingAddress: {
        fullName: user?.name,
        address: user?.address,
        city: user?.city,
        phone: user?.phone,
      },
      orderItems: order.orderItems,
    };

    console.log("🚀 Payload gửi lên Backend:", payload.user, payload.shippingAddress.fullName, payload.shippingAddress.address,payload.shippingAddress.city,payload.shippingAddress.phone);

    // Kiểm tra các trường bắt buộc
    if (
      !payload.user ||
      !payload.shippingAddress.fullName ||
      !payload.shippingAddress.address ||
      !payload.shippingAddress.city ||
      !payload.shippingAddress.phone
    ) {
      message.error("Vui lòng kiểm tra lại thông tin giao hàng!");
      return;
    }

    mutationAddOrder.mutate(payload, {
      onSuccess: (data) => {
        message.success("Thanh toán thành công!");
        navigate("/");
      },
      onError: (error) => {
        message.error("Thanh toán thất bại, vui lòng thử lại!");
      },
    });
  };

  // Các cột của bảng hiển thị sản phẩm
  const columns = [
    {
      title: 'Sản phẩm',
      dataIndex: 'name',
      render: (text, record) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <img src={record.image} alt={text} style={{ width: 50, marginRight: 10 }} />
          {text}
        </div>
      ),
    },
    {
      title: 'Đơn giá',
      dataIndex: 'price',
      render: (price, record) => {
        const discount = record.discount || 0;
        const effectivePrice = price * (1 - discount / 100);
        return (
          <div>
            <div style={{ textDecoration: discount > 0 ? 'line-through' : 'none' }}>
              {convertPrice(price)}
            </div>
            {discount > 0 && (
              <div style={{ color: 'green' }}>
                Giảm: {discount}% → {convertPrice(effectivePrice)}
              </div>
            )}
          </div>
        );
      },
    },
    {
      title: 'Số lượng',
      dataIndex: 'amount',
    },
    {
      title: 'Thành tiền',
      dataIndex: 'total',
      render: (_, record) => {
        const discount = record.discount || 0;
        const effectivePrice = record.price * (1 - discount / 100);
        const computedTotal = effectivePrice * record.amount;
        return <span style={{ color: 'red' }}>{convertPrice(computedTotal)}</span>;
      },
    },
  ];

  return (
    <div style={{ padding: 20 }}>
      <Table columns={columns} dataSource={dataSource} pagination={false} />

      <Card title="Phương thức thanh toán" style={{ marginTop: 20 }}>
        <Radio.Group onChange={(e) => setPaymentMethod(e.target.value)} value={paymentMethod}>
          <Radio value="cod">Thanh toán khi nhận hàng (COD)</Radio>
          <Radio value="bank">Chuyển khoản ngân hàng</Radio>
          <Radio value="momo">Ví MoMo</Radio>
        </Radio.Group>
      </Card>

      <Card title="Tóm tắt đơn hàng" style={{ marginTop: 20 }}>
        <p>Người nhận: {user.name}</p>
        <p>Địa chỉ: {user.address}, {user.city}</p>
        <p>Số điện thoại: {user.phone}</p>
        <p>Tạm tính: {convertPrice(totalProductsAmount)}</p>
        <p>Phí giao hàng: {convertPrice(shippingFee)}</p>
        <p style={{ fontSize: 18, fontWeight: 'bold', color: 'red' }}>
          Tổng tiền: {convertPrice(totalAmount)}
        </p>
        <Button type="primary" onClick={handlePayment} style={{ width: '100%', marginTop: 10 }}>
          Xác nhận thanh toán
        </Button>
      </Card>
    </div>
  );
};

export default PaymentPage;
