import { Card, Radio, Button, message, Table } from 'antd';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { convertPrice } from '../../services/utils';
import { useNavigate } from 'react-router-dom';
import { useMutationHooks } from '../../hooks/useMutationHooks';
import * as OrderService from '../../services/OrderService';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import axios from 'axios';  // Để gửi yêu cầu tới backend

const PaymentPage = () => {
  const navigate = useNavigate();
  const order = useSelector((state) => state.order);
  const user = useSelector((state) => state.user);
  const [paymentMethod, setPaymentMethod] = useState('cod');

  const shippingFee = 15000;
  const totalProductsAmount = order.orderItems.reduce((acc, item) => {
    const discount = item.discount || 0;
    const effectivePrice = item.price * (1 - discount / 100);
    return acc + effectivePrice * item.amount;
  }, 0);
  const totalAmount = totalProductsAmount + shippingFee;

  const dataSource = order.orderItems.map((item, index) => ({
    key: item.id || index.toString(),
    ...item,
  }));

  const mutationAddOrder = useMutationHooks((data) => {
    return OrderService.createOrder(data.token, data);
  });

  const handlePayment = () => {
    const payload = {
      token: user?.access_token,
      paymentMethod,
      itemPrice: totalProductsAmount,
      shippingPrice: shippingFee,
      totalPrice: totalAmount,
      user: user?.id,
      shippingAddress: {
        fullName: user?.name,
        address: user?.address,
        city: user?.city,
        phone: user?.phone,
      },
      orderItems: order.orderItems,
    };

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
      onSuccess: () => {
        message.success("Đặt hàng thành công!");
        navigate("/");  // Chuyển hướng người dùng về trang chủ hoặc trang khác
      },
      onError: () => {
        message.error("Thanh toán thất bại, vui lòng thử lại!");
      },
    });
  };

  // Hàm xử lý thanh toán qua VNPAY
  const handleVnPayPayment = async () => {
    try {
      const payload = {
        token: user?.access_token,
        paymentMethod: 'vnpay',
        itemPrice: totalProductsAmount,
        shippingPrice: shippingFee,
        totalPrice: totalAmount,
        user: user?.id,
        shippingAddress: {
          fullName: user?.name,
          address: user?.address,
          city: user?.city,
          phone: user?.phone,
        },
        orderItems: order.orderItems,
      };

      // Gửi yêu cầu đến backend để lấy URL thanh toán VNPAY
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/paymen/create-payment-url`, {
        token: user?.access_token,
        paymentMethod: 'vnpay',
        itemPrice: totalProductsAmount,
        shippingPrice: shippingFee,
        totalPrice: totalAmount,
        user: user?.id,
        shippingAddress: {
          fullName: user?.name,
          address: user?.address,
          city: user?.city,
          phone: user?.phone,
        },
        orderItems: order.orderItems,
      });
      
      // const res = await axiosJwt.get(`${process.env.REACT_APP_API_URL}/user/get-details/${id}`);

      if (response.data && response.data.url) {
        // Chuyển hướng người dùng đến URL VNPAY
        window.location.href = response.data.url;
      } else {
        message.error("Có lỗi xảy ra khi tạo URL thanh toán VNPAY.");
      }
    } catch (err) {
      console.error(err);
      message.error("Có lỗi xảy ra khi thanh toán qua VNPAY.");
    }
  };

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
        return <span style={{ color: 'red' }}>{convertPrice(effectivePrice * record.amount)}</span>;
      },
    },
  ];

  return (
    <div style={{ padding: 20 }}>
      <Table columns={columns} dataSource={dataSource} pagination={false} />

      <Card title="Phương thức thanh toán" style={{ marginTop: 20 }}>
        <Radio.Group onChange={(e) => setPaymentMethod(e.target.value)} value={paymentMethod}>
          <Radio value="cod">Thanh toán khi nhận hàng (COD)</Radio>
          <Radio value="paypal">Thanh toán qua PayPal</Radio>
          <Radio value="vnpay">Thanh toán qua VNPAY</Radio> {/* Thêm tùy chọn VNPAY */}
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

        {paymentMethod === 'paypal' ? (
          <PayPalScriptProvider options={{
            "client-id": "AYAbxk1SwUBExXwTV1c7cZImEZz21I6j6FFpIXkV9GhWPUX17_11pPFgOCZmDnAJqvGx8QKWk-QkC3Ut",
            "components": "buttons",
            "disable-funding": "card"
          }}>
            <PayPalButtons
              style={{ layout: "vertical" }}
              createOrder={(data, actions) => {
                return actions.order.create({
                  purchase_units: [{ amount: { value: (totalAmount / 1000).toFixed(2) } }], // Chuyển sang VND nếu cần
                });
              }}
              onApprove={(data, actions) => {
                return actions.order.capture().then((details) => {
                  message.success(`Thanh toán thành công bởi ${details.payer.name.given_name}`);
                  handlePayment();
                });
              }}
              onError={(err) => {
                console.error("PayPal Error:", err);
                message.error("Có lỗi xảy ra khi thanh toán với PayPal.");
              }}
            />
          </PayPalScriptProvider>
        ) : paymentMethod === 'vnpay' ? (
          <Button type="primary" onClick={handleVnPayPayment} style={{ width: '100%', marginTop: 10 }}>
            Thanh toán qua VNPAY
          </Button>
        ) : (
          <Button type="primary" onClick={handlePayment} style={{ width: '100%', marginTop: 10 }}>
            Xác nhận thanh toán
          </Button>
        )}
      </Card>
    </div>
  );
};

export default PaymentPage;
