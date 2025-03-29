import { Table, InputNumber, Button, Card } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { useState } from 'react';

const OrderPage = () => {
  const [cart, setCart] = useState([
    {
      key: '1',
      image: 'https://via.placeholder.com/50',
      name: 'name sản phẩm',
      price: 211,
      oldPrice: 230,
      quantity: 10,
      total: 1212,
    },
    // Bạn có thể thêm các sản phẩm khác tại đây
  ]);

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedKeys) => {
      setSelectedRowKeys(selectedKeys);
    },
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
      render: (price, record) => (
        <>
          <span style={{ textDecoration: 'line-through', color: '#aaa', marginRight: 5 }}>
            {record.oldPrice}
          </span>
          {price}
        </>
      ),
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      render: (quantity) => <InputNumber min={1} defaultValue={quantity} />,
    },
    {
      title: 'Thành tiền',
      dataIndex: 'total',
      render: (total) => <span style={{ color: 'red' }}>{total}</span>,
    },
    {
      title: '',
      dataIndex: 'action',
      render: () => <DeleteOutlined style={{ color: 'red', cursor: 'pointer' }} />,
    },
  ];

  return (
    <div style={{ padding: 20 }}>
      <Table
        rowSelection={rowSelection}
        columns={columns}
        dataSource={cart}
        pagination={false}
      />
      <Card style={{ width: 300, marginTop: 20, float: 'right' }}>
        <p>Tạm tính: 0</p>
        <p>Giảm giá: 0</p>
        <p>Thuế: 0</p>
        <p>Phí giao hàng: 0</p>
        <p style={{ fontSize: 18, fontWeight: 'bold', color: 'red' }}>Tổng tiền: 0213</p>
        <Button type="primary" block style={{ backgroundColor: 'red', borderColor: 'red' }}>
          Mua hàng
        </Button>
      </Card>
    </div>
  );
};

export default OrderPage;
