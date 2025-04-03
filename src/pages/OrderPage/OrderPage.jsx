import { Table, Button, Card, Form, message } from 'antd';
import { DeleteOutlined, PlusOutlined, MinusOutlined } from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import { increaseAmount, decreaseAmount, removeOrderProduct } from '../../redux/sides/OrderSlide';
import { convertPrice } from '../../services/utils';
import ButtonComponent from '../../components/ButttonComponent/ButttonComponent';
import ModalComponent from '../../components/ModalComponent/ModalComponent';
import { useState } from 'react';
import InputComponent from '../../components/inputComponent/inputComponent';
import * as UserService from '../../services/UserService';
import { useMutationHooks } from '../../hooks/useMutationHooks';
import { updateUser } from '../../redux/sides/userSlide';
import { useNavigate } from 'react-router-dom';

const OrderPage = () => {
  const dispatch = useDispatch();
  const order = useSelector((state) => state.order);
  const user = useSelector((state) => state.user);
  const [isOpenModalUpdateInfo, setIsOpenModalUpdateInfo] = useState(false);
  const [form] = Form.useForm();
  const  navigate = useNavigate()
  const initialUserDetails = {
    name: user?.name || '',
    phone: user?.phone || '',
    address: user?.address || '',
    city: user?.city || '',
  };

  const [stateUserDetails, setStateUserDetails] = useState(initialUserDetails);

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
      render: (amount, record) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Button
            onClick={() => dispatch(decreaseAmount({ idProduct: record.product }))}
            icon={<MinusOutlined />}
          />
          <span style={{ margin: '0 8px' }}>{record.amount}</span>
          <Button
            onClick={() => dispatch(increaseAmount({ idProduct: record.product }))}
            icon={<PlusOutlined />}
          />
        </div>
      ),
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
    {
      title: '',
      dataIndex: 'action',
      render: (_, record) => (
        <DeleteOutlined
          style={{ color: 'red', cursor: 'pointer' }}
          onClick={() => dispatch(removeOrderProduct({ idProduct: record.product }))}
        />
      ),
    },
  ];

  // Tính tổng tiền của giỏ hàng với phí giao hàng cố định là 15.000 VND
  const shippingFee = 15000;
  const totalProductsAmount = dataSource.reduce((acc, item) => {
    const discount = item.discount || 0;
    const effectivePrice = item.price * (1 - discount / 100);
    return acc + effectivePrice * item.amount;
  }, 0);
  const totalAmount = totalProductsAmount + shippingFee;

  // Kiểm tra thông tin người dùng, nếu thiếu thông tin bắt buộc thì mở modal cập nhật
  const handleAddCard = () => {
    if (!user?.phone || !user?.address || !user?.name || !user?.city) {
      setIsOpenModalUpdateInfo(true);
    } else {
      navigate('/payment')
    }
  };

  const resetUserDetails = () => {
    form.resetFields();
    setStateUserDetails(initialUserDetails);
  };

  const handleCancelUpdate = () => {
    resetUserDetails();
    setIsOpenModalUpdateInfo(false);
  };

  const mutationUpdate = useMutationHooks((data) => {
    const { id, token, ...rests } = data;
    const res = UserService.updateUsersv({ id, token, ...rests });
    return res;
  });

  const handleUpdateInforUser = () => {
    const { name, address, city, phone } = stateUserDetails;
    if (name && address && city && phone) {
      mutationUpdate.mutate(
        { id: user?.id, token: user?.access_token, ...stateUserDetails },
        {
          onSuccess: () => {
            dispatch(
              updateUser({  name, address, city, phone}))
            message.success('Cập nhật thông tin thành công!');
            resetUserDetails();
            setIsOpenModalUpdateInfo(false);
     
          },
          onError: () => {
            message.error('Cập nhật thông tin thất bại!');
          },
        }
      );
    }else {

    }
  };

  const handeleOnchangeDtails = (e) => {
    setStateUserDetails({
      ...stateUserDetails,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div style={{ padding: 20 }}>
      <Table columns={columns} dataSource={dataSource} pagination={false} />
      <Card style={{ width: 300, marginTop: 20, float: 'right' }}>
       <div style={{ display: 'flex' } }>
       <p  >Địa chỉ :</p>
       <p onClick={setIsOpenModalUpdateInfo} style={{ color: 'blue' }}>{ user?.address },{user.city} </p>
      
       </div>
        <p>Tạm tính: {convertPrice(totalProductsAmount)}</p>
        <p>
          Giảm giá:{' '}
          {dataSource.reduce((acc, item) => {
            const discount = item.discount || 0;
            return acc + (item.price - item.price * (1 - discount / 100)) * item.amount;
          }, 0)}
        </p>
        <p>Thuế: 0</p>
        <p>Phí giao hàng: {convertPrice(shippingFee)}</p>
        <p style={{ fontSize: 18, fontWeight: 'bold', color: 'red' }}>
          Tổng tiền: {convertPrice(totalAmount)}
        </p>
        <ButtonComponent
          onClick={handleAddCard}
          size={40}
          styleButton={{
            background: 'rgb(255, 57,69)',
            height: '48px',
            width: '320px',
            borderRadius: '4px',
            border: 'none',
            color: '#fff',
          }}
          textButton={'Thanh toán'}
        />
      </Card>
      <ModalComponent
        title="Cập nhật thông tin giao hàng"
        open={isOpenModalUpdateInfo}
        onCancel={handleCancelUpdate}
        onOk={form.submit}
      >
        <Form
          form={form}
          name="updateUserInfo"
          layout="vertical"
          onFinish={handleUpdateInforUser}
          autoComplete="on"
        >
          <Form.Item
            label="Tên"
            name="name"
            initialValue={user?.name}
            rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}
          >
            <InputComponent onChange={handeleOnchangeDtails} placeholder="Nhập tên của bạn" name="name" />
          </Form.Item>
          <Form.Item
            label="Số điện thoại"
            name="phone"
            initialValue={user?.phone}
            rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
          >
            <InputComponent onChange={handeleOnchangeDtails} placeholder="Nhập số điện thoại" name="phone" />
          </Form.Item>
          <Form.Item
            label="Địa chỉ"
            name="address"
            initialValue={user?.address}
            rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}
          >
            <InputComponent onChange={handeleOnchangeDtails} placeholder="Nhập địa chỉ" name="address" />
          </Form.Item>
          <Form.Item
            label="Thành phố"
            name="city"
            initialValue={user?.city}
            rules={[{ required: true, message: 'Vui lòng nhập thành phố!' }]}
          >
            <InputComponent onChange={handeleOnchangeDtails} placeholder="Nhập thành phố" name="city" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Cập nhật
            </Button>
          </Form.Item>
        </Form>
      </ModalComponent>
    </div>
  );
};

export default OrderPage;
