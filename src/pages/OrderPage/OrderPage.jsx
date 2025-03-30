import { Table, Button, Card } from 'antd';
import { DeleteOutlined, PlusOutlined, MinusOutlined } from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import { increaseAmount, decreaseAmount, removeOrderProduct } from '../../redux/sides/OrderSlide';

const OrderPage = () => {
  const dispatch = useDispatch();
  const order = useSelector((state) => state.order);

  // Chuyển đổi order.orderItems thành dataSource cho Table
  const dataSource = order?.orderItems
    ? order.orderItems.map((item, index) => ({
        key: index.toString(),
        ...item,
      }))
    : [];

  const columns = [
    {
      title: 'Sản phẩm',
      dataIndex: 'name',
      render: (text, record) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <img
            src={record.image}
            alt={text}
            style={{ width: 50, marginRight: 10 }}
          />
          {text}
        </div>
      ),
    },
    {
      title: 'Đơn giá',
      dataIndex: 'price',
      render: (price) => <span>{price}</span>,
    },
    {
      title: 'Số lượng',
      dataIndex: 'amount',
      render: (amount, record) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Button
            onClick={() =>
              dispatch(decreaseAmount({ idProduct: record.product }))
            }
            icon={<MinusOutlined />}
          />
          <span style={{ margin: '0 8px' }}>{record.amount}</span>
          <Button
            onClick={() =>
              dispatch(increaseAmount({ idProduct: record.product }))
            }
            icon={<PlusOutlined />}
          />
        </div>
      ),
    },
    {
      title: 'Thành tiền',
      dataIndex: 'total',
      render: (_, record) => {
        const computedTotal = record.price * record.amount;
        return <span style={{ color: 'red' }}>{computedTotal}</span>;
      },
    },
    {
      title: '',
      dataIndex: 'action',
      render: (_, record) => (
        <DeleteOutlined
          style={{ color: 'red', cursor: 'pointer' }}
          onClick={() =>
            dispatch(removeOrderProduct({ idProduct: record.product }))
          }
        />
      ),
    },
  ];

  // Tính tổng số tiền của giỏ hàng
  const totalAmount = dataSource.reduce(
    (acc, item) => acc + item.price * item.amount,
    0
  );

  return (
    <div style={{ padding: 20 }}>
      <Table
        columns={columns}
        dataSource={dataSource}
        pagination={false}
      />
      <Card style={{ width: 300, marginTop: 20, float: 'right' }}>
        <p>Tạm tính: {totalAmount}</p>
        <p>Giảm giá: 0</p>
        <p>Thuế: 0</p>
        <p>Phí giao hàng: 0</p>
        <p style={{ fontSize: 18, fontWeight: 'bold', color: 'red' }}>
          Tổng tiền: {totalAmount}
        </p>
        <Button
          type="primary"
          block
          style={{ backgroundColor: 'red', borderColor: 'red' }}
        >
          Mua hàng
        </Button>
      </Card>
    </div>
  );
};

export default OrderPage;
