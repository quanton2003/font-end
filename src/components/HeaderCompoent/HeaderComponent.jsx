import { Badge, Col, Popover } from 'antd';
import React, { useEffect, useState } from 'react';
import { WrapperContentPopup, WrapperHeader, WrapperHeaderAccout, WrapperTextHeader, WrapperTextHeaderSmall } from './style';
import { CaretDownOutlined, ShoppingCartOutlined, UserOutlined } from '@ant-design/icons';
import ButtonInputSearch from '../ButtonInputSearch/ButtonInputSearch';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import * as UserService from '../../services/UserService';
import { resetUser, updateUser } from '../../redux/sides/userSlide';
import Loading from '../LoadingComponent/Loading';
import { searchProduct } from '../../redux/sides/ProductSlide';

const HeaderComponent = ({ isHidenSearch = false, isHidenCart = false }) => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user ?? {});
  const dispatch = useDispatch();
  const [userName, setUserName] = useState('');
  const [userAvatar, setUserAvatar] = useState('');
  const [search,setSearch ]= useState('');
  const [loading, setLoading] = useState(false);
  const order = useSelector((state) => state?.order)
  const handleNavigateLogin = () => {
    navigate('/sign-in');
  };
  const handleLogOut = async () => {
    setLoading(true);
    try {
      await UserService.logOutUser(); // Gọi API logout
      localStorage.removeItem("access_token"); // Xóa token trong localStorage
      dispatch(resetUser()); // Reset Redux state
      navigate("/sign-in"); // Chuyển hướng về trang đăng nhập
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);

    if (user?.access_token) {
      setUserName(user?.name || 'user');
      setUserAvatar(user?.avatar || '');
    } else {
      setUserName('');
      setUserAvatar('');
    }

    setLoading(false);
  }, [user]);

  const content = (
    <div>
      <WrapperContentPopup onClick={handleLogOut}>Đăng Xuất</WrapperContentPopup>
      <WrapperContentPopup onClick={() => navigate('/profile-user')}>Thông tin tài khoản</WrapperContentPopup>
      {user?.isAdmin && <WrapperContentPopup onClick={() => navigate('/system-admin')}>Quản lý hệ thống</WrapperContentPopup>}
    </div>
  );

  const onSearch = (e) => {
    setSearch(e.target.value);
    dispatch(searchProduct(e.target.value));
};

  
  return (
    <div style={{ width: '100%', background: 'rgb(26,148,255)', display: 'flex', justifyContent: 'center' }}>
      <WrapperHeader style={{ justifyContent: isHidenSearch && isHidenCart ? 'space-between' : 'unset' }} gutter={16}>
        <Col span={5}>
          <WrapperTextHeader>QUANLAPTRINH</WrapperTextHeader>
        </Col>

        {!isHidenSearch && (
  <Col span={13}>
<ButtonInputSearch 
  onSearch={onSearch}  // Thêm prop này để truyền hàm onSearch xuống ButtonInputSearch
  size="large" 
  textButton="Tìm kiếm" 
  bordered={false} 
  placeholder="Tìm Kiếm" 
  enterButton 
/>

  </Col>
)}


        <Col span={6} style={{ display: 'flex', gap: '54px', alignItems: 'center' }}>
          <Loading isLoading={loading}>
            <WrapperHeaderAccout>
              {userAvatar ? (
                <img src={userAvatar} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '50%' }} alt="avatar" />
              ) : (
                <UserOutlined style={{ fontSize: '30px' }} />
              )}

              {user?.access_token ? (
                <Popover content={content} trigger="click">
                  <div style={{ cursor: 'pointer' }}>{userName || user?.email || 'Tài khoản'}</div>
                </Popover>
              ) : (
                <div onClick={handleNavigateLogin} style={{ cursor: 'pointer' }}>
                  <WrapperTextHeaderSmall style={{ fontSize: '12px' }}>Đăng Nhập/Đăng Ký</WrapperTextHeaderSmall>
                  <div>
                    <WrapperTextHeaderSmall style={{ fontSize: '12px' }}>Tài Khoản</WrapperTextHeaderSmall>
                    <CaretDownOutlined />
                  </div>
                </div>
              )}
            </WrapperHeaderAccout>
          </Loading>

          {!isHidenCart && (
            <div onClick={()=> navigate('/orders')} style={{ cursor:'pointer'}} >
              <Badge count={order?.orderItems?.length} size="small">
                <ShoppingCartOutlined style={{ fontSize: '30px', color: '#fff' }} />
              </Badge>
              <WrapperTextHeaderSmall>Giỏ hàng</WrapperTextHeaderSmall>
            </div>
          )}
        </Col>
      </WrapperHeader>
    </div>
  );
};

export default HeaderComponent;
